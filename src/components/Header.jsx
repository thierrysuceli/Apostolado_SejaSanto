import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onNavigate, currentPage }) => {
  const { currentUser, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'cursos', label: 'Cursos' },
    { id: 'postagens', label: 'Postagens' },
    { id: 'calendario', label: 'Calendário' },
  ];

  if (isAdmin()) {
    menuItems.push({ id: 'admin', label: 'Admin Panel' });
  }

  const handleNavigate = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-beige-300 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-beige-100 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-secondary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => handleNavigate('home')}
            >
              <img 
                src="/Apostolado_PNG.png"
                alt="Apostolado Seja Santo" 
                className="w-10 h-10"
              />
              <div className="ml-3 hidden sm:block">
                <div className="text-secondary-700 font-bold text-base leading-tight">Apostolado</div>
                <div className="text-primary-700 font-bold text-sm leading-tight">Seja Santo</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-700 dark:text-gray-300 hover:bg-beige-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Theme Toggle & Auth Button Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Theme Toggle Button */}
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
                <button
                  onClick={() => handleNavigate('perfil')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-beige-200 dark:bg-gray-800 hover:bg-beige-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-secondary-700 dark:text-gray-300">{currentUser.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigate('login')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-md"
                >
                  Login
                </button>
              )}
            </div>

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
                <button
                  onClick={() => handleNavigate('perfil')}
                  className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center"
                >
                  <span className="text-white font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigate('login')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-secondary-900/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-all duration-300 ease-out md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-beige-300 dark:border-gray-800">
            <div className="flex items-center">
              <img 
                src="/Apostolado_PNG.png"
                alt="Logo" 
                className="w-10 h-10"
              />
              <div className="ml-3">
                <div className="text-secondary-700 dark:text-gray-200 font-bold text-base leading-tight">Apostolado</div>
                <div className="text-primary-700 dark:text-primary-500 font-bold text-sm leading-tight">Seja Santo</div>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6 text-secondary-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    currentPage === item.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-secondary-700 dark:text-gray-300 hover:bg-beige-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile User Section */}
            {currentUser && (
              <div className="mt-6 pt-6 border-t border-beige-300 dark:border-gray-800">
                <button
                  onClick={() => handleNavigate('perfil')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-secondary-700 dark:text-gray-200 font-bold">{currentUser.name}</div>
                    <div className="text-secondary-500 dark:text-gray-400 text-sm">{currentUser.email}</div>
                  </div>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Footer */}
          {!currentUser && (
            <div className="p-4 border-t border-beige-300 dark:border-gray-800">
              <button
                onClick={() => handleNavigate('login')}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-md"
              >
                Login / Registro
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
