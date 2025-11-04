import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-beige-100 dark:bg-gray-900 border-t border-beige-200 dark:border-gray-800 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/Apostolado_PNG.png"
                alt="Apostolado Seja Santo" 
                className="w-12 h-12"
              />
              <div className="ml-3">
                <div className="text-secondary-700 dark:text-gray-200 font-bold text-lg leading-tight">Apostolado</div>
                <div className="text-primary-700 dark:text-primary-500 font-bold leading-tight">Seja Santo</div>
              </div>
            </div>
            <p className="text-secondary-600 dark:text-gray-400 text-sm leading-relaxed">
              "Os que não querem ser vencidos pela verdade, serão vencidos pelo erro."
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-secondary-700 dark:text-gray-200 font-bold mb-4 text-sm uppercase tracking-wider">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-secondary-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-500 text-sm transition-colors font-medium">Sobre Nós</a></li>
              <li><a href="#" className="text-secondary-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-500 text-sm transition-colors font-medium">Contato</a></li>
              <li><a href="#" className="text-secondary-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-500 text-sm transition-colors font-medium">Termos de Uso</a></li>
              <li><a href="#" className="text-secondary-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-500 text-sm transition-colors font-medium">Política de Privacidade</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-secondary-700 dark:text-gray-200 font-bold mb-4 text-sm uppercase tracking-wider">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/apostoladosejasanto/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-beige-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 transition-all duration-300 group"
                aria-label="Instagram Apostolado Seja Santo"
              >
                <svg className="w-5 h-5 text-secondary-600 dark:text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-beige-300 dark:border-gray-800 text-center">
          <p className="text-secondary-600 dark:text-gray-400 text-sm font-medium">
            © 2025 Apostolado Seja Santo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
