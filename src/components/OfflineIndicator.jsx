import { useState, useEffect } from 'react';
import { WifiOff, Wifi, Download, Check } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);
  const [bibleDownloaded, setBibleDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar se Bíblia já está em cache
    checkBibleCache();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkBibleCache = async () => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('bible-content');
        const keys = await cache.keys();
        // Verificar se tem pelo menos 50 capítulos em cache (sinal de download)
        setBibleDownloaded(keys.length > 50);
      } catch (err) {
        console.error('Erro ao verificar cache da Bíblia:', err);
      }
    }
  };

  const downloadBible = async () => {
    if (!isOnline) {
      alert('Conecte-se à internet para baixar a Bíblia');
      return;
    }

    setDownloading(true);

    try {
      // Buscar todos os livros da Bíblia
      const response = await fetch('/api/public-data?type=bible-books');
      const { books } = await response.json();

      let totalChapters = 0;
      let downloadedChapters = 0;

      // Contar total de capítulos
      books.forEach(book => {
        totalChapters += book.chapters;
      });

      console.log(`[PWA] Baixando ${totalChapters} capítulos da Bíblia...`);

      // Baixar cada capítulo
      for (const book of books) {
        for (let chapter = 1; chapter <= book.chapters; chapter++) {
          try {
            await fetch(`/api/public-data?type=bible-chapter&book=${book.abbrev}&chapter=${chapter}`);
            downloadedChapters++;
            
            // Log de progresso a cada 10 capítulos
            if (downloadedChapters % 10 === 0) {
              console.log(`[PWA] Progresso: ${downloadedChapters}/${totalChapters} capítulos`);
            }
          } catch (err) {
            console.error(`Erro ao baixar ${book.name} ${chapter}:`, err);
          }
        }
      }

      console.log(`[PWA] ✅ Bíblia completa baixada! ${downloadedChapters}/${totalChapters} capítulos`);
      setBibleDownloaded(true);
      alert(`Bíblia baixada com sucesso! ${downloadedChapters} capítulos disponíveis offline.`);
    } catch (err) {
      console.error('Erro ao baixar Bíblia:', err);
      alert('Erro ao baixar a Bíblia. Tente novamente.');
    } finally {
      setDownloading(false);
    }
  };

  // Sempre mostrar se: está offline OU tem botão de download OU Bíblia baixada
  const shouldShow = !isOnline || (isOnline && !bibleDownloaded) || bibleDownloaded;

  if (!shouldShow && !showIndicator) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Indicador de conexão - só mostra quando muda status */}
      {showIndicator && (
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-5 h-5" />
              <span className="text-sm font-medium">Conectado</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5" />
              <span className="text-sm font-medium">Offline</span>
            </>
          )}
        </div>
      )}

      {/* Botão de download da Bíblia */}
      {isOnline && !bibleDownloaded && (
        <button
          onClick={downloadBible}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Baixar Bíblia completa para uso offline"
        >
          {downloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Baixando...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span className="text-sm font-medium">Baixar Bíblia</span>
            </>
          )}
        </button>
      )}

      {/* Indicador de Bíblia baixada */}
      {bibleDownloaded && (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg">
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">Bíblia offline ✓</span>
        </div>
      )}
    </div>
  );
}
