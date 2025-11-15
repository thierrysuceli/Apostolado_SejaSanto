import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const location = useLocation();
  const { currentUser, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'Sobre Nós', path: '/about' },
    { id: 'liturgia', label: 'Liturgia', path: '/liturgia' },
    { id: 'biblia', label: 'Bíblia', path: '/biblia' },
    { id: 'cursos', label: 'Cursos', path: '/courses' },
    { id: 'postagens', label: 'Postagens', path: '/posts' },
    { id: 'calendario', label: 'Calendário', path: '/calendar' },
    { id: 'central', label: 'Central', path: '/central' },
  ];

  // Adicionar Histórico apenas para usuários logados
  if (currentUser) {
    menuItems.push({ id: 'historico', label: 'Histórico', path: '/historico' });
  }

  if (isAdmin()) {
    menuItems.push({ id: 'admin', label: 'Admin Panel', path: '/admin' });
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const renderMenuLinks = (onClick) => (
    menuItems.map(item => (
      <Link
        key={item.id}
        to={item.path}
        onClick={onClick}
        className={`flex items-center px-4 py-3 rounded-lg font-semibold transition-colors text-sm ${
          isActive(item.path)
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
            : 'text-secondary-700 dark:text-gray-300 hover:bg-beige-100 dark:hover:bg-gray-800'
        }`}
      >
        {item.label}
      </Link>
    ))
  );

  return (
    <>
      {/* Desktop Header Bar with Hamburger */}
      <header className="hidden md:block sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-beige-300 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="h-16 px-4 flex items-center justify-between">
          <button
            onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
            className="p-2 rounded-lg hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-secondary-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-beige-200 dark:bg-gray-800 hover:bg-beige-300 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-secondary-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {currentUser && (
              <Link
                to="/profile"
                className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center"
              >
                <span className="text-white font-bold text-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-beige-300 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-secondary-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link 
              to="/"
              className="flex items-center"
            >
              <img 
                src="/Apostolado_PNG.png"
                alt="Apostolado Seja Santo" 
                className="w-10 h-10"
              />
              <div className="ml-3 hidden sm:block">
                <div className="text-secondary-700 dark:text-gray-200 font-bold text-base leading-tight transition-colors duration-300">Apostolado</div>
                <div className="text-primary-700 dark:text-primary-500 font-bold text-sm leading-tight transition-colors duration-300">Seja Santo</div>
              </div>
            </Link>

            {/* Mobile Theme Toggle & Avatar/Login */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-beige-200 dark:bg-gray-800 hover:bg-beige-300 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-secondary-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {currentUser ? (
                <Link
                  to="/profile"
                  className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center"
                >
                  <span className="text-white font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 z-50 shadow-xl transform transition-transform duration-300 border-r border-beige-300 dark:border-gray-800">
            <div className="p-6">
              {/* Mobile Logo */}
              <Link 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center mb-8"
              >
                <img 
                  src="/Apostolado_PNG.png"
                  alt="Apostolado Seja Santo" 
                  className="w-10 h-10"
                />
                <div className="ml-3">
                  <div className="text-secondary-700 dark:text-gray-200 font-bold text-base leading-tight transition-colors duration-300">Apostolado</div>
                  <div className="text-primary-700 dark:text-primary-500 font-bold text-sm leading-tight transition-colors duration-300">Seja Santo</div>
                </div>
              </Link>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {renderMenuLinks(() => setMobileMenuOpen(false))}
              </nav>

              {/* Mobile User Actions */}
              {currentUser && (
                <div className="mt-8 pt-8 border-t border-beige-300 dark:border-gray-700">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-secondary-700 dark:text-gray-300 hover:bg-beige-100 dark:hover:bg-gray-800 rounded-lg font-semibold transition-colors mb-2"
                  >
                    Meu Perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-beige-100 dark:hover:bg-gray-800 rounded-lg font-semibold transition-colors"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex md:flex-col w-64 lg:w-72 bg-white dark:bg-gray-900 border-r border-beige-200 dark:border-gray-800 shadow-xl fixed top-16 left-0 bottom-0 z-40 transition-transform duration-300 ${
        desktopSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-6 pt-10 pb-8 border-b border-beige-200 dark:border-gray-800">
          <Link to="/" className="flex items-center">
            <img 
              src="/Apostolado_PNG.png"
              alt="Apostolado Seja Santo" 
              className="w-12 h-12"
            />
            <div className="ml-3">
              <div className="text-secondary-700 dark:text-gray-200 font-bold text-lg leading-tight">Apostolado</div>
              <div className="text-primary-700 dark:text-primary-500 font-bold leading-tight">Seja Santo</div>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {renderMenuLinks()}
        </div>

        <div className="px-4 py-6 border-t border-beige-200 dark:border-gray-800 space-y-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-beige-200 dark:bg-gray-800 hover:bg-beige-300 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-sm font-semibold text-secondary-700 dark:text-gray-300">Alternar tema</span>
            {isDark ? (
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-secondary-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {currentUser ? (
            <div className="rounded-xl bg-beige-100 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary-700 dark:text-gray-200">{currentUser.name}</p>
                  <p className="text-xs text-secondary-500 dark:text-gray-400">{currentUser.email}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Link
                  to="/profile"
                  className="block w-full text-center px-4 py-2 rounded-lg bg-white dark:bg-gray-900 text-sm font-semibold text-secondary-700 dark:text-gray-200 border border-beige-200 dark:border-gray-700 hover:bg-beige-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Meu Perfil
                </Link>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 rounded-lg bg-red-100/80 text-red-600 dark:bg-red-900/20 dark:text-red-300 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="block w-full text-center px-4 py-3 rounded-lg bg-primary-600 text-white font-bold shadow-md hover:bg-primary-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Header;
