/**
 * Aplicar FIX de FK via código
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixForeignKeys() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  CORRIGINDO FOREIGN KEYS PARA public.users');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    // 1. user_bible_progress
    console.log('1️⃣ Corrigindo user_bible_progress...');
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE user_bible_progress DROP CONSTRAINT IF EXISTS user_bible_progress_user_id_fkey'
    });
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE user_bible_progress ADD CONSTRAINT user_bible_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE'
    });
    console.log('   ✅ user_bible_progress OK\n');
    
    // 2. user_course_progress
    console.log('2️⃣ Corrigindo user_course_progress...');
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE user_course_progress DROP CONSTRAINT IF EXISTS user_course_progress_user_id_fkey'
    });
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE user_course_progress ADD CONSTRAINT user_course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE'
    });
    console.log('   ✅ user_course_progress OK\n');
    
    // 3. user_post_progress
    console.log('3️⃣ Corrigindo user_post_progress...');
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE user_post_progress DROP CONSTRAINT IF EXISTS user_post_progress_user_id_fkey'
    });
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE user_post_progress ADD CONSTRAINT user_post_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE'
    });
    console.log('   ✅ user_post_progress OK\n');
    
    // 4. comments
    console.log('4️⃣ Corrigindo comments...');
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey'
    });
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE'
    });
    console.log('   ✅ comments OK\n');
    
    // 5. bible_verse_comments
    console.log('5️⃣ Corrigindo bible_verse_comments...');
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE bible_verse_comments DROP CONSTRAINT IF EXISTS bible_verse_comments_user_id_fkey'
    });
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE bible_verse_comments ADD CONSTRAINT bible_verse_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE'
    });
    console.log('   ✅ bible_verse_comments OK\n');
    
    // 6. posts (author_id)
    console.log('6️⃣ Corrigindo posts...');
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey'
    });
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE posts ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL'
    });
    console.log('   ✅ posts OK\n');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ TODAS AS FOREIGN KEYS CORRIGIDAS!');
    console.log('═══════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

fixForeignKeys();
