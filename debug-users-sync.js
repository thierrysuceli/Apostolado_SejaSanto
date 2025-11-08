import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugUserTables() {
  console.log('\n🔍 DEBUG: Comparando auth.users vs public.users\n');
  
  // Auth users
  const { data: authData } = await supabase.auth.admin.listUsers();
  console.log('auth.users:');
  console.log(`Total: ${authData.users.length}`);
  authData.users.forEach(u => {
    console.log(`  - ${u.id} | ${u.email}`);
  });
  
  // Public users
  const { data: publicUsers } = await supabase
    .from('users')
    .select('*');
  
  console.log('\npublic.users:');
  console.log(`Total: ${publicUsers ? publicUsers.length : 0}`);
  if (publicUsers) {
    publicUsers.forEach(u => {
      console.log(`  - ${u.id} | ${u.email}`);
    });
  }
  
  // Ver se tem algum em common
  if (authData.users.length > 0 && publicUsers && publicUsers.length > 0) {
    const authIds = authData.users.map(u => u.id);
    const publicIds = publicUsers.map(u => u.id);
    
    const commonIds = authIds.filter(id => publicIds.includes(id));
    console.log(`\n🔗 IDs em comum: ${commonIds.length}`);
    commonIds.forEach(id => console.log(`  - ${id}`));
    
    const onlyInAuth = authIds.filter(id => !publicIds.includes(id));
    const onlyInPublic = publicIds.filter(id => !authIds.includes(id));
    
    console.log(`\n❌ Apenas em auth.users: ${onlyInAuth.length}`);
    onlyInAuth.forEach(id => {
      const user = authData.users.find(u => u.id === id);
      console.log(`  - ${id} | ${user.email}`);
    });
    
    console.log(`\n❌ Apenas em public.users: ${onlyInPublic.length}`);
    onlyInPublic.forEach(id => {
      const user = publicUsers.find(u => u.id === id);
      console.log(`  - ${id} | ${user.email}`);
    });
  }
}

debugUserTables();
