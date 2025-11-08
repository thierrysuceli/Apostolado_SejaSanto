-- =====================================================
-- RECREATE user_bible_progress - APONTANDO PARA public.users
-- =====================================================

-- 1. DROPAR tabela completamente
DROP TABLE IF EXISTS public.user_bible_progress CASCADE;

-- 2. RECRIAR apontando para public.users
CREATE TABLE public.user_bible_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  book_abbrev VARCHAR(20) NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER DEFAULT 1,
  last_read_at TIMESTAMP DEFAULT NOW(),
  
  -- FK correta apontando para public.users
  CONSTRAINT user_bible_progress_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES public.users(id) 
    ON DELETE CASCADE,
  
  -- UNIQUE constraint
  CONSTRAINT user_bible_progress_user_id_book_abbrev_key 
    UNIQUE (user_id, book_abbrev)
);

-- 3. Criar índices
CREATE INDEX idx_user_bible_progress_user 
  ON public.user_bible_progress USING btree (user_id);

CREATE INDEX idx_user_bible_progress_last_read 
  ON public.user_bible_progress USING btree (last_read_at DESC);

-- 4. DESABILITAR RLS (sistema usa autenticação customizada)
ALTER TABLE public.user_bible_progress DISABLE ROW LEVEL SECURITY;

-- 5. Comentário
COMMENT ON TABLE public.user_bible_progress IS 
  'Progresso de leitura da Bíblia (último livro/capítulo/versículo lido por usuário)';
