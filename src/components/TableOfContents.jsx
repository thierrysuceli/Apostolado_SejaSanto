import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Extrair headings do HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedHeadings = Array.from(headingElements).map((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent;
      const id = `heading-${index}`;
      
      // Adicionar ID ao heading no conteúdo real
      return { id, text, level };
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    // Adicionar IDs aos headings no DOM real
    const allHeadings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
    allHeadings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });

    // IntersectionObserver para destacar heading ativo
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 1.0
      }
    );

    allHeadings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      allHeadings.forEach((heading) => {
        observer.unobserve(heading);
      });
    };
  }, [content]);

  const handleClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Altura do header + margem extra
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Fechar no mobile após clicar
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile: Botão fixo flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors"
        aria-label="Abrir índice"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile: Menu lateral deslizante */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <aside className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-amber-500 text-lg">Índice</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Fechar índice"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            
            {/* Conteúdo com scroll próprio */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {headings.map((heading) => (
                  <li
                    key={heading.id}
                    style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
                  >
                    <button
                      onClick={() => handleClick(heading.id)}
                      className={`text-left w-full py-2 px-3 text-sm transition-colors rounded ${
                        activeId === heading.id
                          ? 'text-amber-500 font-semibold bg-amber-500/10'
                          : 'text-gray-700 dark:text-gray-300 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </>
      )}

      {/* Desktop: Sidebar fixo ao lado do conteúdo */}
      <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0">
        <nav className="sticky top-20 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h3 className="font-semibold text-amber-500 mb-4 text-lg">Índice</h3>
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
              >
                <button
                  onClick={() => handleClick(heading.id)}
                  className={`text-left w-full py-2 px-3 text-sm transition-colors rounded ${
                    activeId === heading.id
                      ? 'text-amber-500 font-semibold bg-amber-500/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
