// Site Content Configuration - Editable by Admin
// Este arquivo armazena os textos que aparecem na Home e Footer

export const siteContent = {
  home: {
    hero: {
      title: 'Apostolado',
      subtitle: 'Seja Santo',
      quote: '"Os que não querem ser vencidos pela verdade, serão vencidos pelo erro."',
      description: 'Cursos, formação e conteúdos para aprofundar sua fé e conhecimento da doutrina católica.',
      primaryButton: 'Explorar Cursos',
      secondaryButton: 'Ver Calendário'
    },
    coursesSection: {
      title: 'Cursos em Destaque',
      subtitle: 'Conteúdos de formação católica de qualidade'
    },
    postsSection: {
      title: 'Últimas Postagens',
      subtitle: 'Reflexões e ensinamentos para sua vida espiritual'
    },
    cta: {
      title: 'Faça Parte da Nossa Comunidade',
      description: 'Cadastre-se gratuitamente e tenha acesso a conteúdos exclusivos de formação católica.',
      button: 'Criar Conta Grátis'
    }
  },
  footer: {
    description: 'Apostolado Seja Santo - Formação católica de qualidade para aprofundar sua fé.',
    about: {
      title: 'Sobre',
      items: [
        { label: 'Quem Somos', link: '/about' },
        { label: 'Missão', link: '/mission' },
        { label: 'Contato', link: '/contact' }
      ]
    },
    resources: {
      title: 'Recursos',
      items: [
        { label: 'Cursos', link: '/courses' },
        { label: 'Postagens', link: '/posts' },
        { label: 'Calendário', link: '/calendar' }
      ]
    },
    social: {
      title: 'Redes Sociais',
      links: {
        facebook: '#',
        instagram: '#',
        youtube: '#',
        twitter: '#'
      }
    },
    copyright: '© 2025 Apostolado Seja Santo. Todos os direitos reservados.'
  },
  courses: {
    pageTitle: 'Cursos',
    pageQuote: '"Os que não querem ser vencidos pela verdade, serão vencidos pelo erro."',
    pageDescription: 'Explore nossos cursos de formação católica e aprofunde seu conhecimento da fé.'
  },
  posts: {
    pageTitle: 'Artigos e Notícias',
    pageDescription: 'Acompanhe as últimas publicações, reflexões e notícias do apostolado.'
  }
};

// Helper function para admins atualizarem conteúdo
export const updateSiteContent = (section, key, value) => {
  const keys = key.split('.');
  let current = siteContent[section];
  
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
};

// Helper function para obter conteúdo
export const getSiteContent = (section, key) => {
  const keys = key ? key.split('.') : [];
  let current = siteContent[section];
  
  for (const k of keys) {
    if (current) {
      current = current[k];
    }
  }
  
  return current;
};
