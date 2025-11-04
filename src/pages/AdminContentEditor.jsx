import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { siteContent, updateSiteContent } from '../data/siteContent';
import RichTextEditor from '../components/RichTextEditor';

function AdminContentEditor() {
  const { isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [editedContent, setEditedContent] = useState({ ...siteContent });
  const [hasChanges, setHasChanges] = useState(false);

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-primary-700 dark:text-primary-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-3xl font-bold text-secondary-800 dark:text-gray-100 mb-4">Acesso Negado</h2>
          <p className="text-secondary-600 dark:text-gray-300 mb-6">Você não possui permissões de administrador.</p>
          <Link
            to="/"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (section, key, value) => {
    const keys = key.split('.');
    let current = editedContent[section];
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setEditedContent({ ...editedContent });
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Update global siteContent
    Object.keys(editedContent).forEach(section => {
      Object.keys(editedContent[section]).forEach(key => {
        const value = editedContent[section][key];
        if (typeof value === 'object' && !Array.isArray(value)) {
          Object.keys(value).forEach(subKey => {
            updateSiteContent(section, `${key}.${subKey}`, value[subKey]);
          });
        } else {
          updateSiteContent(section, key, value);
        }
      });
    });
    
    setHasChanges(false);
    alert('Conteúdo atualizado com sucesso!');
  };

  const handleReset = () => {
    if (confirm('Deseja descartar todas as alterações?')) {
      setEditedContent({ ...siteContent });
      setHasChanges(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-secondary-800 dark:text-gray-100 mb-2">
                Editor de Conteúdo do Site
              </h1>
              <p className="text-secondary-600 dark:text-gray-300">
                Edite os textos que aparecem na Home, Footer e outras páginas
              </p>
            </div>
            <Link
              to="/admin"
              className="text-primary-700 dark:text-primary-500 hover:underline"
            >
              ← Voltar ao Admin
            </Link>
          </div>

          {hasChanges && (
            <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 rounded-lg p-4 flex items-center justify-between">
              <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                Você tem alterações não salvas
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  💾 Salvar Tudo
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  ↺ Descartar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {['home', 'footer', 'courses', 'posts'].map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeSection === section
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-300 hover:bg-beige-100 dark:hover:bg-gray-700 border border-beige-300 dark:border-gray-700'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-beige-300 dark:border-gray-700 p-8 transition-colors duration-300">
          {/* HOME SECTION */}
          {activeSection === 'home' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <h2 className="text-2xl font-bold text-secondary-800 dark:text-gray-100 mb-4">
                  Seção Hero (Topo da Home)
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={editedContent.home.hero.title}
                      onChange={(e) => handleInputChange('home', 'hero.title', e.target.value)}
                      className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                      Subtítulo (Dourado)
                    </label>
                    <input
                      type="text"
                      value={editedContent.home.hero.subtitle}
                      onChange={(e) => handleInputChange('home', 'hero.subtitle', e.target.value)}
                      className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                      Citação/Frase
                    </label>
                    <input
                      type="text"
                      value={editedContent.home.hero.quote}
                      onChange={(e) => handleInputChange('home', 'hero.quote', e.target.value)}
                      className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={editedContent.home.hero.description}
                      onChange={(e) => handleInputChange('home', 'hero.description', e.target.value)}
                      rows={3}
                      className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="border-t border-beige-300 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-secondary-800 dark:text-gray-100 mb-4">
                  Call to Action (Rodapé da Home)
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={editedContent.home.cta.title}
                      onChange={(e) => handleInputChange('home', 'cta.title', e.target.value)}
                      className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={editedContent.home.cta.description}
                      onChange={(e) => handleInputChange('home', 'cta.description', e.target.value)}
                      rows={2}
                      className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER SECTION */}
          {activeSection === 'footer' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-secondary-800 dark:text-gray-100 mb-4">
                Conteúdo do Rodapé
              </h2>
              
              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                  Descrição do Apostolado
                </label>
                <textarea
                  value={editedContent.footer.description}
                  onChange={(e) => handleInputChange('footer', 'description', e.target.value)}
                  rows={2}
                  className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                  Copyright
                </label>
                <input
                  type="text"
                  value={editedContent.footer.copyright}
                  onChange={(e) => handleInputChange('footer', 'copyright', e.target.value)}
                  className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                />
              </div>
            </div>
          )}

          {/* COURSES SECTION */}
          {activeSection === 'courses' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-secondary-800 dark:text-gray-100 mb-4">
                Página de Cursos
              </h2>
              
              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                  Título da Página
                </label>
                <input
                  type="text"
                  value={editedContent.courses.pageTitle}
                  onChange={(e) => handleInputChange('courses', 'pageTitle', e.target.value)}
                  className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                  Citação/Frase
                </label>
                <input
                  type="text"
                  value={editedContent.courses.pageQuote}
                  onChange={(e) => handleInputChange('courses', 'pageQuote', e.target.value)}
                  className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                  Descrição
                </label>
                <textarea
                  value={editedContent.courses.pageDescription}
                  onChange={(e) => handleInputChange('courses', 'pageDescription', e.target.value)}
                  rows={2}
                  className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                />
              </div>
            </div>
          )}

          {/* POSTS SECTION */}
          {activeSection === 'posts' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-secondary-800 dark:text-gray-100 mb-4">
                Página de Postagens
              </h2>
              
              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                  Título da Página
                </label>
                <input
                  type="text"
                  value={editedContent.posts.pageTitle}
                  onChange={(e) => handleInputChange('posts', 'pageTitle', e.target.value)}
                  className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                  Descrição
                </label>
                <textarea
                  value={editedContent.posts.pageDescription}
                  onChange={(e) => handleInputChange('posts', 'pageDescription', e.target.value)}
                  rows={2}
                  className="w-full bg-beige-50 dark:bg-gray-900 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-600 transition-colors duration-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button Fixed at Bottom */}
        {hasChanges && (
          <div className="fixed bottom-8 right-8 flex gap-2 shadow-2xl">
            <button
              onClick={handleSaveChanges}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
            >
              💾 Salvar Alterações
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold text-lg"
            >
              ↺ Descartar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminContentEditor;
