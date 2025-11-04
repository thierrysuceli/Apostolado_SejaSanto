import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ImageUploader = ({ currentImageUrl, onImageUploaded, onImageUpload, folder = 'images' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImageUrl || '');
  
  // Suporta ambos os nomes de prop
  const handleUpload = onImageUploaded || onImageUpload;

  const handleFileSelect = async (event) => {
    try {
      setError('');
      setUploading(true);

      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 5MB');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('apostolado-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('apostolado-assets')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      if (handleUpload) {
        handleUpload(publicUrl);
      }

    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    if (handleUpload) {
      handleUpload('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <label
          htmlFor="image-upload"
          className={`
            flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            ${uploading
              ? 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-not-allowed'
              : 'border-primary-300 dark:border-primary-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
            }
          `}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              <span className="text-secondary-600 dark:text-gray-300">Enviando...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-secondary-700 dark:text-gray-200 font-medium">
                {preview ? 'Trocar Imagem' : 'Escolher Imagem'}
              </span>
            </>
          )}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500">
          ⚠️ {error}
        </p>
      )}

      {/* Info */}
      <p className="text-xs text-secondary-500 dark:text-gray-400">
        Formatos aceitos: JPG, PNG, GIF, WEBP (máx. 5MB)
      </p>
    </div>
  );
};

export default ImageUploader;
