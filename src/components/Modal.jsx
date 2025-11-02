import React from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full ${sizeClasses[size]} border border-beige-200 dark:border-gray-800 transition-colors`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-beige-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-secondary-800 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-secondary-500 dark:text-gray-400 hover:text-secondary-800 dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
