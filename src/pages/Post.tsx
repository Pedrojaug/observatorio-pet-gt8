import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DOMPurify from 'dompurify';

function renderContent(content: string): string {
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);
  const html = hasHtml ? content : content.replace(/\n/g, '<br>');
  return DOMPurify.sanitize(html);
}

interface PostData {
  id: number;
  title: string;
  summary: string;
  data: string;
  categoria?: string;
  tipo_conteudo?: string;
  gt_origem?: string;
  territorio?: string;
  content?: string; // Crie essa coluna no Supabase para abrigar o texto completo!
}

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) setPost(data);
      } catch (err) {
        console.error('Erro ao buscar o post:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-500">Carregando publicação...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Publicação não encontrada</h2>
        <Link to="/observatorio" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para o Observatório
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-6">
      <main className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
        <Link to="/observatorio" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-8 font-medium transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6 inline-block">{post.tipo_conteudo || post.categoria || 'Artigo'}</span>
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-10 border-b pb-6">
          <span>{post.territorio ? `${post.territorio} • ` : ''}Publicado em {post.data}</span>
        </div>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          {/* Exibe o resumo destacado */}
          <p className="text-xl leading-relaxed mb-6 font-medium text-gray-800">{post.summary}</p>
          
          {/* Exibe o conteúdo completo caso você tenha a coluna content */}
          {post.content && (
            <div dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} />
          )}
        </div>
      </main>
    </div>
  );
}