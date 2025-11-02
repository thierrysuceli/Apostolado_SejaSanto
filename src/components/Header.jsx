import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onNavigate, currentPage }) => {
  const { currentUser, isAdmin } = useAuth();
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
      <header className="sticky top-0 z-50 bg-white border-b border-beige-300 shadow-sm">
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
                      : 'text-secondary-700 hover:bg-beige-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Auth Button Desktop */}
            <div className="hidden md:block">
              {currentUser ? (
                <button
                  onClick={() => handleNavigate('perfil')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-beige-200 hover:bg-beige-300 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-secondary-700">{currentUser.name}</span>
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

            {/* Mobile Avatar/Login */}
            <div className="md:hidden">
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
      <div className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-beige-300">
            <div className="flex items-center">
              <img 
                src="/Apostolado_PNG.png"
                alt="Logo" 
                className="w-10 h-10"
              />
              <div className="ml-3">
                <div className="text-secondary-700 font-bold text-base leading-tight">Apostolado</div>
                <div className="text-primary-700 font-bold text-sm leading-tight">Seja Santo</div>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-beige-100 transition-colors"
            >
              <svg className="w-6 h-6 text-secondary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      : 'text-secondary-700 hover:bg-beige-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile User Section */}
            {currentUser && (
              <div className="mt-6 pt-6 border-t border-beige-300">
                <button
                  onClick={() => handleNavigate('perfil')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-beige-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-secondary-700 font-bold">{currentUser.name}</div>
                    <div className="text-secondary-500 text-sm">{currentUser.email}</div>
                  </div>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Footer */}
          {!currentUser && (
            <div className="p-4 border-t border-beige-300">
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
