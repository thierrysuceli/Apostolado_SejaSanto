import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
      const offset = 80; // Altura do header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

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
      {/* Mobile: Botão colapsável */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <span className="font-semibold text-amber-500">Índice do Artigo</span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-amber-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-amber-500" />
          )}
        </button>
        
        {isOpen && (
          <nav className="mt-2 p-4 bg-gray-900 border border-gray-800 rounded-lg">
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
                >
                  <button
                    onClick={() => handleClick(heading.id)}
                    className={`text-left w-full py-1 text-sm transition-colors ${
                      activeId === heading.id
                        ? 'text-amber-500 font-semibold'
                        : 'text-gray-400 hover:text-amber-400'
                    }`}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop: Sidebar fixo */}
      <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <nav className="sticky top-20 p-4 bg-gray-900 border border-gray-800 rounded-lg max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h3 className="font-semibold text-amber-500 mb-4 text-lg">Índice</h3>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
              >
                <button
                  onClick={() => handleClick(heading.id)}
                  className={`text-left w-full py-1.5 text-sm transition-colors rounded px-2 ${
                    activeId === heading.id
                      ? 'text-amber-500 font-semibold bg-amber-500/10'
                      : 'text-gray-400 hover:text-amber-400 hover:bg-gray-800'
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
