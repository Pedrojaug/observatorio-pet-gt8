import React, { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Unlink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Faz upload do arquivo para o bucket post-images no Supabase Storage
  const uploadImageFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `inline/${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[220px] max-w-none text-slate-800',
      },
      // Suporte para colar imagens diretamente (Ctrl+V ou Print Screen)
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              event.preventDefault();
              setIsUploading(true);
              toast.promise(
                (async () => {
                  try {
                    const publicUrl = await uploadImageFile(file);
                    editor?.chain().focus().setImage({ src: publicUrl }).run();
                  } finally {
                    setIsUploading(false);
                  }
                })(),
                {
                  loading: 'Enviando imagem colada...',
                  success: 'Imagem inserida no texto com sucesso!',
                  error: (err) => `Erro ao enviar imagem: ${err.message}`
                }
              );
              return true;
            }
          }
        }
        return false;
      },
      // Suporte para arrastar e soltar imagens dentro do texto
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            setIsUploading(true);
            toast.promise(
              (async () => {
                try {
                  const publicUrl = await uploadImageFile(file);
                  editor?.chain().focus().setImage({ src: publicUrl }).run();
                } finally {
                  setIsUploading(false);
                }
              })(),
              {
                loading: 'Enviando imagem arrastada...',
                success: 'Imagem inserida!',
                error: (err) => `Erro ao enviar imagem: ${err.message}`
              }
            );
            return true;
          }
        }
        return false;
      }
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Digite a URL do link (ex: https://...):', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem é muito pesada (limite de 10MB).');
      return;
    }

    setIsUploading(true);
    toast.promise(
      (async () => {
        try {
          const publicUrl = await uploadImageFile(file);
          editor.chain().focus().setImage({ src: publicUrl }).run();
          if (fileInputRef.current) fileInputRef.current.value = '';
        } finally {
          setIsUploading(false);
        }
      })(),
      {
        loading: 'Enviando imagem para o Observatório...',
        success: 'Imagem inserida no texto com sucesso!',
        error: (err) => `Falha no upload: ${err.message}`
      }
    );
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden flex flex-col bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all shadow-sm">
      {/* Input de arquivo invisível */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 border-b border-slate-200 bg-slate-50/80">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-700'}`}
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}
          title="Lista com marcadores"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}
          title="Inserir Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className="p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-700 disabled:opacity-40"
          title="Remover Link"
        >
          <Unlink className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        {/* Botão Amigável de Foto */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200/80 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs"
          title="Inserir Foto do Computador ou Celular"
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span>{isUploading ? 'Enviando foto...' : 'Adicionar Foto'}</span>
        </button>
      </div>
      
      {/* Editor Area */}
      <div 
        className="p-5 flex-grow bg-white cursor-text min-h-[220px]" 
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
