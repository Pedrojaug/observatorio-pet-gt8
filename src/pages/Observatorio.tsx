import React, { useEffect, useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  BookOpen, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router';
import { supabase } from '../lib/supabase';

interface Artigo {
  id: number;
  title: string;
  summary: string;
  data: string;
  categoria?: string; // Legado
  tipo_conteudo?: string; // Novo padrão
  gt_origem?: string; // Qual GT produziu
  territorio?: string; // Local da ação
}

const contentTypes = [
  { id: '', label: 'Todos os Materiais' },
  { id: 'Relato de Experiência', label: 'Relatos de Experiência' },
  { id: 'Educação em Saúde', label: 'Educação em Saúde' },
  { id: 'Pesquisa e Evidência', label: 'Pesquisa e Evidência' },
  { id: 'Integração Inter-GT', label: 'Integração Inter-GT' }
];

export default function Observatorio() {
  const [conteudos, setConteudos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para os filtros
  const [busca, setBusca] = useState('');
  const [filtroGT, setFiltroGT] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    async function fetchArtigos() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('data', { ascending: false });

        if (error) {
          console.error('Erro ao buscar artigos:', error);
        } else if (data) {
          setConteudos(data);
        }
      } catch (err) {
        console.error('Erro inesperado:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArtigos();
  }, []);

  // Lógica de filtragem local
  const conteudosFiltrados = useMemo(() => {
    return conteudos.filter((item) => {
      const matchBusca = 
        item.title.toLowerCase().includes(busca.toLowerCase()) || 
        item.summary.toLowerCase().includes(busca.toLowerCase()) ||
        (item.territorio && item.territorio.toLowerCase().includes(busca.toLowerCase()));
      
      const matchGT = filtroGT === '' || item.gt_origem === filtroGT;
      
      const tipo = item.tipo_conteudo || item.categoria;
      const matchTipo = filtroTipo === '' || tipo === filtroTipo;

      return matchBusca && matchGT && matchTipo;
    });
  }, [conteudos, busca, filtroGT, filtroTipo]);

  // Formatter for date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Sem data';
    // Format YYYY-MM-DD to DD/MM/YYYY
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 text-slate-800 selection:bg-primary/20 pb-16">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Hero Header */}
      <header className="relative bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Glowing backdrop orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> PET-Saúde / SUS Digital • GT 08 UFPB
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.2]">
            Portal de Informação e Educação em Saúde Digital
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Explore relatos de experiência real das USFs de João Pessoa e Cabedelo, infográficos e materiais de disseminação científica de todos os 12 Grupos de Trabalho.
          </p>
          
          {/* Search Bar with Focus Glow */}
          <div className="max-w-xl mx-auto relative shadow-md shadow-primary/5 hover:shadow-primary/10 focus-within:shadow-primary/15 transition-shadow rounded-2xl bg-white border border-slate-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/15 overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Pesquisar por tema, USF ou palavra-chave..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none focus:outline-none bg-white text-base sm:text-lg text-slate-700"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Filters and Search Bar Section */}
        <div className="flex flex-col gap-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          
          {/* Category Pill Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filtrar por Categoria</label>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFiltroTipo(type.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-full border transition-all duration-300 ${filtroTipo === type.id ? 'bg-primary text-white border-primary shadow-md shadow-primary/15' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {busca || filtroGT || filtroTipo ? 'Publicações Filtradas' : 'Últimas Publicações'}
            </h2>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
                <Filter className="w-4 h-4" /> GT de Origem
              </span>
              
              {/* GT Select Dropdown */}
              <select 
                value={filtroGT}
                onChange={(e) => setFiltroGT(e.target.value)}
                className="w-full sm:w-44 h-10 px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold cursor-pointer"
              >
                <option value="">Todos os GTs</option>
                {[...Array(12)].map((_, i) => {
                  const gtName = `GT ${String(i + 1).padStart(2, '0')}`;
                  return <option key={gtName} value={gtName}>{gtName}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Articles Feed */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 animate-pulse shadow-sm">
                <div className="h-6 w-24 bg-slate-200 rounded-full" />
                <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
                <div className="h-24 bg-slate-200 rounded-md" />
                <div className="h-8 w-28 bg-slate-200 rounded-md mt-6" />
              </div>
            ))}
          </div>
        ) : conteudosFiltrados.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Nenhuma publicação encontrada</h3>
            <p className="text-slate-500 text-sm">
              Não encontramos materiais no Observatório correspondentes aos filtros selecionados.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => {setBusca(''); setFiltroGT(''); setFiltroTipo('');}} 
                className="text-primary hover:text-secondary font-bold text-sm underline"
              >
                Limpar todos os filtros
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {conteudosFiltrados.map((item) => {
              const category = item.tipo_conteudo || item.categoria || 'Artigo';
              let badgeColor = 'bg-primary/10 text-primary border-primary/20';
              if (category === 'Relato de Experiência') {
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
              } else if (category === 'Educação em Saúde') {
                badgeColor = 'bg-blue-50 text-blue-700 border-blue-100';
              } else if (category === 'Pesquisa e Evidência') {
                badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-100';
              } else if (category === 'Integração Inter-GT') {
                badgeColor = 'bg-amber-50 text-amber-700 border-amber-100';
              }

              return (
                <article 
                  key={item.id} 
                  className="group bg-white hover:bg-slate-50/20 border border-slate-200/80 hover:border-primary/20 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {item.gt_origem || 'Diversos'}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor}`}>
                        {category}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    
                    {/* Summary */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {item.summary}
                    </p>
                  </div>
                  
                  {/* Footer metadata */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(item.data)}
                    </span>
                    {item.territorio && (
                      <span className="hidden sm:flex items-center gap-1 max-w-[150px] truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{item.territorio}</span>
                      </span>
                    )}
                    <Link 
                      to={`/observatorio/${item.id}`} 
                      className="text-primary hover:text-secondary font-bold flex items-center gap-0.5 transition-colors"
                    >
                      Acessar <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}