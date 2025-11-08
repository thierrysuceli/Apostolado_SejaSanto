import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local' });

const { Pool } = pg;

// Extrair credenciais do VITE_SUPABASE_URL
const url = new URL(process.env.VITE_SUPABASE_URL);
const host = url.hostname.replace('.supabase.co', '.supabase.com');

const pool = new Pool({
  user: 'postgres.asbwxvlalghgtsyxifcp',
  host: 'aws-0-us-east-1.pooler.supabase.com',
  database: 'postgres',
  password: process.env.DB_PASSWORD || 'AposTese2020!', 
  port: 6543,
  ssl: { rejectUnauthorized: false }
});

async function checkFKDefinition() {
  try {
    console.log('\n🔍 Verificando definição da FK user_bible_progress_user_id_fkey\n');
    
    const query = `
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'user_bible_progress';
    `;
    
    const result = await pool.query(query);
    
    console.log('📊 Foreign Keys encontradas:');
    result.rows.forEach(row => {
      console.log('\nConstraint:', row.constraint_name);
      console.log('  Tabela origem:', row.table_name);
      console.log('  Coluna origem:', row.column_name);
      console.log('  Schema destino:', row.foreign_table_schema);
      console.log('  Tabela destino:', row.foreign_table_name);
      console.log('  Coluna destino:', row.foreign_column_name);
    });
    
    await pool.end();
  } catch (err) {
    console.error('❌ Erro:', err.message);
    await pool.end();
  }
}

checkFKDefinition();
