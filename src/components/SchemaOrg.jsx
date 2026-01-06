import { Helmet } from 'react-helmet-async';

/**
 * Componente para adicionar Schema.org JSON-LD dinamicamente
 * Melhora SEO e aparência nos resultados de busca do Google
 */

export const ArticleSchema = ({ article }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image || "https://www.apostoladosejasanto.com.br/Apostolado_PNG.png",
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at || article.published_at || article.created_at,
    "author": {
      "@type": "Organization",
      "name": "Apostolado Seja Santo",
      "url": "https://www.apostoladosejasanto.com.br"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Apostolado Seja Santo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.apostoladosejasanto.com.br/Apostolado_PNG.png"
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const CourseSchema = ({ course }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "Apostolado Seja Santo",
      "url": "https://www.apostoladosejasanto.com.br"
    },
    "image": course.thumbnail || "https://www.apostoladosejasanto.com.br/Apostolado_PNG.png"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const EventSchema = ({ event }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title || event.name,
    "description": event.description,
    "startDate": event.start_date,
    "endDate": event.end_date,
    "location": {
      "@type": "VirtualLocation",
      "url": "https://www.apostoladosejasanto.com.br/calendar"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Apostolado Seja Santo",
      "url": "https://www.apostoladosejasanto.com.br"
    },
    "image": event.image || "https://www.apostoladosejasanto.com.br/Apostolado_PNG.png"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const BreadcrumbSchema = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
