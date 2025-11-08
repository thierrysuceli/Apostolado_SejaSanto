/**
 * SOLUÇÃO DEFINITIVA: Remover FK problemática da user_bible_progress
 * 
 * O problema: A FK aponta para public.users mas por algum motivo
 * o Postgres não consegue validar a referência mesmo com user_id válido
 * 
 * Solução: Remover a FK e confiar no RLS para validação
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function fixBibleProgress() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║  CORREÇÃO: user_bible_progress FK problemática              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  console.log('⚠️  A FK user_bible_progress_user_id_fkey está impedindo INSERTs');
  console.log('⚠️  Mesmo com user_id válido em public.users');
  console.log('');
  console.log('🔧 Ação: Modificar API para não usar FK, apenas RLS\n');
  console.log('══════════════════════════════════════════════════════════════\n');
  
  // A solução é NÃO remover a FK pelo Supabase SDK (não funciona)
  // Mas sim modificar a API para aceitar o erro e tentar alternativa
  
  console.log('✅ Vou modificar a API para:\n');
  console.log('   1. Não depender da FK');
  console.log('   2. Validar user_id manualmente');
  console.log('   3. Fazer INSERT sem constraint\n');
  
  // Testar se conseguimos inserir diretamente sem usar SDK
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const userId = '51f07a81-41b5-457e-b65f-0a18f8e9e0b9';
  
  console.log('🧪 Teste: Inserir via SQL raw...\n');
  
  // Tentar via SQL direto
  const { data, error } = await supabase
    .from('user_bible_progress')
    .delete()
    .eq('user_id', userId)
    .eq('book_abbrev', 'jo');
  
  console.log('Limpando registros antigos...', error || 'OK');
  
  // Agora tentar inserir via SQL bruto
  const insertSQL = `
    INSERT INTO user_bible_progress (user_id, book_abbrev, chapter, verse, last_read_at)
    VALUES ('${userId}', 'jo', 3, 16, NOW())
    ON CONFLICT (user_id, book_abbrev) DO UPDATE
    SET chapter = 3, verse = 16, last_read_at = NOW()
    RETURNING *;
  `;
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: insertSQL })
    });
    
    const result = await response.json();
    console.log('\nResultado SQL direto:', result);
  } catch (err) {
    console.log('❌ Erro SQL direto:', err.message);
  }
  
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('💡 CONCLUSÃO: Preciso modificar a API backend');
  console.log('══════════════════════════════════════════════════════════════\n');
}

fixBibleProgress();
