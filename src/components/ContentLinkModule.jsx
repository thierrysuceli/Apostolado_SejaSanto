// =====================================================
// CONTENT LINK MODULE - Sistema de Referência de Conteúdo
// Permite criar links digitando / + tipo + / + nome
// Ex: /Cursos/Formação Básica ou /Posts/Artigo Importante
// =====================================================

import Quill from 'quill';

const Inline = Quill.import('blots/inline');

// Custom Blot para o link de conteúdo
class ContentLink extends Inline {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('data-content-type', value.type);
    node.setAttribute('data-content-id', value.id);
    node.setAttribute('data-content-name', value.name);
    node.setAttribute('href', value.url);
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
    node.className = 'content-link inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors cursor-pointer';
    
    // Adicionar ícone baseado no tipo
    const icon = document.createElement('span');
    icon.className = 'text-xs';
    switch(value.type) {
      case 'course':
        icon.textContent = '📚';
        break;
      case 'post':
        icon.textContent = '📄';
        break;
      case 'event':
        icon.textContent = '📅';
        break;
      case 'group':
        icon.textContent = '👥';
        break;
      default:
        icon.textContent = '🔗';
    }
    
    node.insertBefore(icon, node.firstChild);
    return node;
  }

  static formats(node) {
    return {
      type: node.getAttribute('data-content-type'),
      id: node.getAttribute('data-content-id'),
      name: node.getAttribute('data-content-name'),
      url: node.getAttribute('href')
    };
  }

  static value(node) {
    return {
      type: node.getAttribute('data-content-type'),
      id: node.getAttribute('data-content-id'),
      name: node.getAttribute('data-content-name'),
      url: node.getAttribute('href')
    };
  }
}

ContentLink.blotName = 'contentLink';
ContentLink.tagName = 'a';
ContentLink.className = 'content-link';

export default ContentLink;
