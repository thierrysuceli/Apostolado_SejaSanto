// API para gerar sitemap.xml dinâmico
import { supabaseAdmin } from '../lib-api/supabase.js';

export default async function handler(req, res) {
  try {
    const baseUrl = 'https://www.apostoladosejasanto.com.br';
    
    // Páginas estáticas
    const staticPages = [
      { url: '', priority: 1.0, changefreq: 'daily' },
      { url: '/artigos', priority: 0.9, changefreq: 'daily' },
      { url: '/noticias', priority: 0.9, changefreq: 'daily' },
      { url: '/cursos', priority: 0.8, changefreq: 'weekly' },
      { url: '/eventos', priority: 0.8, changefreq: 'daily' },
      { url: '/biblia', priority: 0.7, changefreq: 'monthly' },
      { url: '/liturgia', priority: 0.7, changefreq: 'daily' },
      { url: '/termos-de-uso', priority: 0.3, changefreq: 'yearly' },
      { url: '/politica-de-privacidade', priority: 0.3, changefreq: 'yearly' }
    ];

    // Buscar artigos publicados
    const { data: articles } = await supabaseAdmin
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Buscar notícias publicadas
    const { data: news } = await supabaseAdmin
      .from('news')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Buscar cursos ativos
    const { data: courses } = await supabaseAdmin
      .from('courses')
      .select('slug, updated_at, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Buscar eventos futuros e recentes
    const { data: events } = await supabaseAdmin
      .from('events')
      .select('slug, updated_at, start_date')
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: true });

    // Gerar XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Adicionar páginas estáticas
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Adicionar artigos
    if (articles && articles.length > 0) {
      articles.forEach(article => {
        const lastmod = article.updated_at || article.published_at;
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/artigos/${article.slug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += '  </url>\n';
      });
    }

    // Adicionar notícias
    if (news && news.length > 0) {
      news.forEach(newsItem => {
        const lastmod = newsItem.updated_at || newsItem.published_at;
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/noticias/${newsItem.slug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += '  </url>\n';
      });
    }

    // Adicionar cursos
    if (courses && courses.length > 0) {
      courses.forEach(course => {
        const lastmod = course.updated_at || course.created_at;
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/cursos/${course.slug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += '  </url>\n';
      });
    }

    // Adicionar eventos
    if (events && events.length > 0) {
      events.forEach(event => {
        const lastmod = event.updated_at || event.start_date;
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/eventos/${event.slug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += '  </url>\n';
      });
    }

    xml += '</urlset>';

    // Retornar XML com headers corretos
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // Cache de 1 hora
    return res.status(200).send(xml);

  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    return res.status(500).json({ error: 'Erro ao gerar sitemap' });
  }
}
