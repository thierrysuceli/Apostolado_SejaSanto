// =====================================================
// SCRIPT DE CORREÇÃO - Comentários com HTML Escapado
// =====================================================

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local
dotenv.config({ path: join(__dirname, '.env.local') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Função simples para decodificar HTML entities
function decodeHTML(html) {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&');
}

async function fixEscapedComments() {
  console.log('🔧 Corrigindo comentários com HTML escapado...\n');
  
  try {
    // Buscar todos os comentários
    const { data: comments, error } = await supabase
      .from('comments')
      .select('id, content');
    
    if (error) throw error;
    
    if (!comments || comments.length === 0) {
      console.log('✅ Nenhum comentário encontrado no banco.');
      return;
    }
    
    console.log(`📝 Encontrados ${comments.length} comentários.\n`);
    
    let fixed = 0;
    let skipped = 0;
    
    for (const comment of comments) {
      // Verificar se tem HTML escapado (contém &lt; ou &gt;)
      if (comment.content.includes('&lt;') || comment.content.includes('&gt;')) {
        // Decodificar HTML entities
        const unescapedContent = decodeHTML(comment.content);
        
        console.log(`🔄 Corrigindo comentário ID ${comment.id}`);
        console.log(`   ANTES: ${comment.content.substring(0, 60)}...`);
        console.log(`   DEPOIS: ${unescapedContent.substring(0, 60)}...\n`);
        
        // Atualizar no banco
        const { error: updateError } = await supabase
          .from('comments')
          .update({ content: unescapedContent })
          .eq('id', comment.id);
        
        if (updateError) {
          console.error(`❌ Erro ao atualizar comentário ${comment.id}:`, updateError);
        } else {
          fixed++;
        }
      } else {
        skipped++;
      }
    }
    
    console.log('\n✅ Correção concluída!');
    console.log(`   ✔️  ${fixed} comentários corrigidos`);
    console.log(`   ⏭️  ${skipped} comentários já estavam corretos`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

fixEscapedComments();
