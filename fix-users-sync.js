import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aywgkvyabjcnnmiwihim.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5d2drdnlhYmpjbm5taXdpaGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjAzMzE0MywiZXhwIjoyMDc3NjA5MTQzfQ.rv-mwA6PPVoBsP32-HEKS2FPCspffoElZts0-Iv3dc8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixUsersSync() {
  console.log('🔍 Verificando sincronização de usuários...\n');

  // 1. Verificar se usuário específico existe em auth.users
  const { data: authUser, error: authError } = await supabase.auth.admin.getUserById('51f07a81-41b5-457e-b65f-0a18f8e9e0b9');
  
  if (authError) {
    console.error('❌ Erro ao buscar usuário em auth.users:', authError.message);
  } else {
    console.log('✅ Usuário encontrado em auth.users:');
    console.log(`   ID: ${authUser.user.id}`);
    console.log(`   Email: ${authUser.user.email}`);
    console.log(`   Created: ${authUser.user.created_at}\n`);
  }

  // 2. Verificar se existe em users
  const { data: appUser, error: appError } = await supabase
    .from('users')
    .select('*')
    .eq('id', '51f07a81-41b5-457e-b65f-0a18f8e9e0b9')
    .single();
  
  if (appError) {
    console.log('⚠️  Usuário NÃO encontrado em users table:', appError.message);
  } else {
    console.log('✅ Usuário encontrado em users table:');
    console.log(`   ID: ${appUser.id}`);
    console.log(`   Email: ${appUser.email}`);
    console.log(`   Name: ${appUser.name}\n`);
  }

  // 3. Sincronizar TODOS os usuários faltantes
  console.log('🔄 Sincronizando todos os usuários de auth.users → users...\n');

  const sql = `
    INSERT INTO users (id, email, name, avatar_url, created_at, is_active)
    SELECT 
      au.id,
      au.email,
      COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1)) as name,
      au.raw_user_meta_data->>'avatar_url' as avatar_url,
      au.created_at,
      TRUE as is_active
    FROM auth.users au
    WHERE NOT EXISTS (
      SELECT 1 FROM users u WHERE u.id = au.id
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id, email, name;
  `;

  const { data: synced, error: syncError } = await supabase.rpc('execute_sql', { query: sql });
  
  if (syncError) {
    console.error('❌ Erro ao sincronizar:', syncError.message);
    
    // Tentar abordagem alternativa: INSERT direto
    console.log('\n🔄 Tentando sincronizar usuário específico diretamente...\n');
    
    if (authUser && authUser.user) {
      const { data: inserted, error: insertError } = await supabase
        .from('users')
        .upsert({
          id: authUser.user.id,
          email: authUser.user.email,
          name: authUser.user.user_metadata?.name || authUser.user.email.split('@')[0],
          avatar_url: authUser.user.user_metadata?.avatar_url || null,
          created_at: authUser.user.created_at,
          is_active: true
        }, {
          onConflict: 'id'
        })
        .select();
      
      if (insertError) {
        console.error('❌ Erro ao inserir usuário:', insertError.message);
      } else {
        console.log('✅ Usuário sincronizado com sucesso!');
        console.log(inserted);
      }
    }
  } else {
    console.log('✅ Usuários sincronizados:', synced);
  }

  // 4. Verificar novamente
  const { data: verifyUser, error: verifyError } = await supabase
    .from('users')
    .select('*')
    .eq('id', '51f07a81-41b5-457e-b65f-0a18f8e9e0b9')
    .single();
  
  console.log('\n✅ Verificação final:');
  if (verifyError) {
    console.log('❌ Usuário AINDA não existe em users:', verifyError.message);
  } else {
    console.log('✅ Usuário sincronizado com sucesso!');
    console.log(verifyUser);
  }
}

fixUsersSync()
  .then(() => {
    console.log('\n🎉 Script concluído!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Erro fatal:', err);
    process.exit(1);
  });
