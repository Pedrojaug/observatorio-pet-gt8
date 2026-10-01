import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Sparkles, BookOpen, Share2, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, useScroll, useSpring } from 'motion/react';
import { toast } from 'sonner';
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
  content?: string;
  image_url?: string;
}

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado para a área de transferência!');
  };

  const handleWhatsAppShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Veja esta publicação no Observatório PET-Saúde GT 08:\n*${post?.title}*\n\n`);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
  };

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Sem data';
    try {
      const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
          <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center space-y-6">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
          <BookOpen className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Publicação não encontrada</h2>
        <Link to="/observatorio" className="text-primary hover:text-secondary flex items-center gap-2 font-bold px-6 py-3 rounded-full bg-primary/10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para o Observatório
        </Link>
      </div>
    );
  }

  const category = post.tipo_conteudo || post.categoria || 'Artigo';

  return (
    <div className="relative min-h-screen bg-slate-50/50 text-slate-800 selection:bg-primary/20 pb-20">
      
      {/* Barra de Progresso de Leitura */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40 fixed" />

      {/* Hero Header */}
      <header className="relative bg-white border-b border-slate-200 pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Glowing backdrop orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          
          {/* Back Button Floating */}
          <Link 
            to="/observatorio" 
            className="absolute -top-12 left-0 sm:-left-4 text-slate-500 hover:text-primary hover:bg-primary/10 flex items-center gap-2 font-bold transition-all px-4 py-2 rounded-full text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="flex justify-center flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-extrabold text-[10px] tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> {post.gt_origem || 'Diversos'}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] tracking-wider uppercase shadow-sm">
              {category}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-5xl mx-auto">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500 font-medium pt-4">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              Publicado em {formatDate(post.data)}
            </span>
            {post.territorio && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {post.territorio}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-3xl mx-auto mt-8 px-4 sm:px-6">
        {/* Foto de Capa (se houver) */}
        {post.image_url && (
          <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden mb-8 shadow-md border border-slate-200 bg-slate-100">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
          <div className="prose prose-slate prose-lg md:prose-xl max-w-none">
            {/* Resumo destacado */}
            <p className="text-xl md:text-2xl leading-relaxed font-medium text-slate-800 border-l-4 border-primary pl-6 py-2 bg-slate-50/50 italic mb-10">
              {post.summary}
            </p>
            
            {/* Conteúdo completo */}
            {post.content ? (
              <div 
                className="prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} 
              />
            ) : (
              <div className="text-center py-12 text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-100">
                O autor não disponibilizou o conteúdo completo desta publicação.
              </div>
            )}
          </div>

          {/* Botões de Compartilhamento */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-slate-800 mb-1">Gostou da publicação?</h3>
              <p className="text-sm text-slate-500">Compartilhe e ajude a combater a desinformação em saúde.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={handleWhatsAppShare}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-[#25D366]/30 hover:-translate-y-0.5 active:scale-95"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </button>
              <button 
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all border border-slate-200 active:scale-95"
              >
                <Share2 className="w-5 h-5" /> Copiar
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}