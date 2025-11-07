import React, { useMemo, useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../lib/supabaseClient';
import ImageResize from 'quill-image-resize-module-react';

// Register the Image Resize module
Quill.register('modules/imageResize', ImageResize);

const RichTextEditor = ({ value, onChange, placeholder = 'Escreva aqui...', readOnly = false, minHeight = '200px', isAdmin = false }) => {
  const quillRef = useRef(null);

  // Image handler function
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      try {
        // Show loading state
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertText(range.index, 'Uploading image...');

        // Upload to Supabase
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `content-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('apostolado-assets')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('apostolado-assets')
          .getPublicUrl(filePath);

        // Remove loading text and insert image
        editor.deleteText(range.index, 'Uploading image...'.length);
        editor.insertEmbed(range.index, 'image', publicUrl);
        editor.setSelection(range.index + 1);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Erro ao fazer upload da imagem');
      }
    };
  };

  const modules = useMemo(() => {
    if (readOnly) {
      return { toolbar: false };
    }
    
    // Toolbar completa para Admin
    if (isAdmin) {
      return {
        toolbar: {
          container: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
          ],
          handlers: {
            image: imageHandler
          }
        },
        imageResize: {
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        clipboard: {
          matchVisual: false
        }
      };
    }
    
    // Toolbar simplificada para usuários comuns
    return {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['blockquote'],
          ['link'],
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
      },
      clipboard: {
        matchVisual: false
      }
    };
  }, [readOnly, isAdmin]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  const editorStyle = `
    .rich-text-editor .quill {
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      display: block !important;
      position: relative;
    }
    
    .dark .rich-text-editor .quill {
      background: #1f2937;
    }

    .rich-text-editor .ql-toolbar {
      background: #f0e8df;
      border: 1px solid #d4c2ad;
      border-bottom: 1px solid #d4c2ad;
      border-radius: 0.5rem 0.5rem 0 0;
      padding: 12px;
      display: block !important;
    }

    .dark .rich-text-editor .ql-toolbar {
      background: #374151;
      border-color: #4b5563;
    }

    .rich-text-editor .ql-container {
      border: 1px solid #d4c2ad;
      border-top: none;
      border-radius: 0 0 0.5rem 0.5rem;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      min-height: ${minHeight};
      display: block !important;
      position: relative;
      box-sizing: border-box;
    }

    .dark .rich-text-editor .ql-container {
      border-color: #4b5563;
    }

    .rich-text-editor .ql-editor {
      min-height: ${minHeight};
      max-height: 500px;
      overflow-y: auto;
      color: #5a4230;
      padding: 16px;
      box-sizing: border-box;
    }

    .dark .rich-text-editor .ql-editor {
      color: #d1d5db;
    }

    .rich-text-editor .ql-editor.ql-blank::before {
      color: #9c7d5f;
      font-style: normal;
      font-size: 16px;
    }

    .dark .rich-text-editor .ql-editor.ql-blank::before {
      color: #9ca3af;
    }

    .rich-text-editor .ql-toolbar button {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .rich-text-editor .ql-toolbar button:hover {
      background: #e3d5c5;
    }

    .dark .rich-text-editor .ql-toolbar button:hover {
      background: #4b5563;
    }

    .rich-text-editor .ql-toolbar button.ql-active {
      background: #e6a400;
      color: white;
    }

    .rich-text-editor .ql-toolbar .ql-stroke {
      stroke: #4a3627;
    }

    .dark .rich-text-editor .ql-toolbar .ql-stroke {
      stroke: #d1d5db;
    }

    .rich-text-editor .ql-toolbar .ql-fill {
      fill: #4a3627;
    }

    .dark .rich-text-editor .ql-toolbar .ql-fill {
      fill: #d1d5db;
    }

    .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
      stroke: white;
    }

    .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
      fill: white;
    }

    .rich-text-editor .ql-toolbar .ql-picker-label {
      color: #4a3627;
      border-radius: 4px;
    }

    .dark .rich-text-editor .ql-toolbar .ql-picker-label {
      color: #d1d5db;
    }

    .rich-text-editor .ql-toolbar .ql-picker-options {
      background: white;
      border: 1px solid #d4c2ad;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .dark .rich-text-editor .ql-toolbar .ql-picker-options {
      background: #1f2937;
      border-color: #4b5563;
    }

    .rich-text-editor .ql-toolbar .ql-picker-item {
      color: #4a3627;
    }

    .dark .rich-text-editor .ql-toolbar .ql-picker-item {
      color: #d1d5db;
    }

    .rich-text-editor .ql-toolbar .ql-picker-item:hover {
      background: #f0e8df;
    }

    .dark .rich-text-editor .ql-toolbar .ql-picker-item:hover {
      background: #374151;
    }

    .rich-text-editor .ql-editor h1 {
      font-size: 2.5em;
      font-weight: bold;
      margin: 0.67em 0;
      color: #4a3627;
    }

    .dark .rich-text-editor .ql-editor h1 {
      color: #e5e7eb;
    }

    .rich-text-editor .ql-editor h2 {
      font-size: 2em;
      font-weight: bold;
      margin: 0.75em 0;
      color: #4a3627;
    }

    .dark .rich-text-editor .ql-editor h2 {
      color: #e5e7eb;
    }

    .rich-text-editor .ql-editor h3 {
      font-size: 1.5em;
      font-weight: bold;
      margin: 0.83em 0;
      color: #5a4230;
    }

    .dark .rich-text-editor .ql-editor h3 {
      color: #d1d5db;
    }

    .rich-text-editor .ql-editor blockquote {
      border-left: 4px solid #e6a400;
      padding-left: 16px;
      margin: 16px 0;
      color: #6b4f3a;
      font-style: italic;
    }

    .dark .rich-text-editor .ql-editor blockquote {
      border-left-color: #fdb913;
      color: #9ca3af;
    }

    .rich-text-editor .ql-editor code {
      background: #f0e8df;
      padding: 2px 6px;
      border-radius: 4px;
      color: #6b4f3a;
    }

    .dark .rich-text-editor .ql-editor code {
      background: #374151;
      color: #d1d5db;
    }

    .rich-text-editor .ql-editor pre {
      background: #f0e8df;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
    }

    .dark .rich-text-editor .ql-editor pre {
      background: #374151;
    }

    .rich-text-editor .ql-editor a {
      color: #cc9200;
      text-decoration: underline;
    }

    .dark .rich-text-editor .ql-editor a {
      color: #fdb913;
    }

    .rich-text-editor .ql-editor img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 16px 0;
      cursor: move;
    }

    .rich-text-editor .ql-editor img:hover {
      box-shadow: 0 0 0 3px rgba(230, 164, 0, 0.3);
    }

    /* Image resize handles */
    .rich-text-editor .ql-editor .image-resizer {
      position: absolute;
      border: 2px solid #e6a400;
      box-sizing: border-box;
    }

    .rich-text-editor .ql-editor .image-resizer-handle {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #e6a400;
      border: 1px solid white;
      box-sizing: border-box;
      border-radius: 50%;
    }

    .rich-text-editor .ql-editor .image-resizer-handle-nw {
      top: -6px;
      left: -6px;
      cursor: nw-resize;
    }

    .rich-text-editor .ql-editor .image-resizer-handle-ne {
      top: -6px;
      right: -6px;
      cursor: ne-resize;
    }

    .rich-text-editor .ql-editor .image-resizer-handle-sw {
      bottom: -6px;
      left: -6px;
      cursor: sw-resize;
    }

    .rich-text-editor .ql-editor .image-resizer-handle-se {
      bottom: -6px;
      right: -6px;
      cursor: se-resize;
    }

    .rich-text-editor .ql-editor .image-resizer-display-size {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: #e6a400;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
    }

    .rich-text-editor .ql-editor video {
      max-width: 100%;
      border-radius: 8px;
      margin: 16px 0;
    }

    .rich-text-editor.read-only .ql-container {
      border: none;
      min-height: auto;
    }

    .rich-text-editor.read-only .ql-editor {
      padding: 0;
      min-height: auto;
    }
    
    .rich-text-editor.read-only .ql-toolbar {
      display: none !important;
    }

    @media (max-width: 768px) {
      .rich-text-editor .ql-toolbar {
        padding: 8px;
      }

      .rich-text-editor .ql-toolbar button {
        width: 28px;
        height: 28px;
      }

      .rich-text-editor .ql-editor {
        font-size: 14px;
        padding: 12px;
      }
    }
  `;

  return (
    <div className={`rich-text-editor ${readOnly ? 'read-only' : ''}`}>
      <style>{editorStyle}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ display: 'block', position: 'relative' }}
      />
    </div>
  );
};

export default RichTextEditor;
