// =====================================================
// COMPONENTE: Modal de Boas-Vindas
// =====================================================

import { useEffect, useState } from 'react';

export default function WelcomeModal({ message, onClose, autoShow = false }) {
  const [show, setShow] = useState(autoShow);

  useEffect(() => {
    if (autoShow) setShow(true);
  }, [autoShow]);

  if (!show || !message) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-amber-500/30">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-500">
            🎉 Bem-vindo(a)!
          </h2>
          <button
            onClick={() => {
              setShow(false);
              onClose?.();
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-6">
          <button
            onClick={() => {
              setShow(false);
              onClose?.();
            }}
            className="w-full bg-amber-500 text-black px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
          >
            Entendi!
          </button>
        </div>
      </div>
    </div>
  );
}
