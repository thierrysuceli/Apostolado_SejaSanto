import { Helmet } from 'react-helmet-async';

/**
 * Componente SEO para gerenciar meta tags dinâmicas
 * Melhora indexação e compartilhamento em redes sociais
 */
const SEO = ({
  title = 'Apostolado Seja Santo',
  description = 'Plataforma de formação católica e evangelização. Artigos, notícias, cursos, eventos e estudo da Bíblia.',
  image = 'https://www.apostoladosejasanto.com.br/Apostolado_PNG.png',
  url = 'https://www.apostoladosejasanto.com.br',
  type = 'website',
  article = null, // { publishedTime, modifiedTime, author, section, tags }
}) => {
  const fullTitle = title === 'Apostolado Seja Santo' ? title : `${title} | Apostolado Seja Santo`;
  const canonicalUrl = url.startsWith('http') ? url : `https://www.apostoladosejasanto.com.br${url}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Apostolado Seja Santo" />
      <meta property="og:locale" content="pt_BR" />

      {/* Article specific tags */}
      {article && type === 'article' && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Portuguese" />
      <meta name="author" content="Apostolado Seja Santo" />
      <meta name="keywords" content="católico, formação católica, bíblia, liturgia, evangelização, fé, igreja, cristo, maria" />
    </Helmet>
  );
};

export default SEO;
