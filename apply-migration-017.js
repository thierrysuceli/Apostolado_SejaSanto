import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'https://yxqhsdvkzhgcnpvxnwxg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cWhzZHZremhnY25wdnhud3hnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDg2MTYyMCwiZXhwIjoyMDQwNDM3NjIwfQ.FqLBvJaG9OplqhqGWl6-XFseLnPPF4Qq8K0YbnlgBwo'
);

async function applyMigration() {
  console.log('\n🚀 Aplicando Migration 017: welcome_message\n');

  const sql = readFileSync('./migrations/017_add_welcome_message.sql', 'utf-8');

  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('❌ Erro:', error);
  } else {
    console.log('✅ Migration aplicada com sucesso!');
  }
}

applyMigration().catch(console.error);
