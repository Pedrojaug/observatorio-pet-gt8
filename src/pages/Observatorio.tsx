import React, { useEffect, useState, useMemo } from 'react';
import { ArrowRight, Search, Filter } from 'lucide-react';
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
          .from('posts') // Nome da sua tabela no Supabase
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
        item.summary.toLowerCase().includes(busca.toLowerCase());
      
      const matchGT = filtroGT === '' || item.gt_origem === filtroGT;
      
      const tipo = item.tipo_conteudo || item.categoria;
      const matchTipo = filtroTipo === '' || tipo === filtroTipo;

      return matchBusca && matchGT && matchTipo;
    });
  }, [conteudos, busca, filtroGT, filtroTipo]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="bg-white border-b py-16 px-6 sm:px-12 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-4">
          PET-Saúde/SUS Digital • GT 08 UFPB
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">
          Portal de Informação e Educação em Saúde Digital
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Acesse relatos de experiência das USFs de João Pessoa e Cabedelo, evidências científicas e materiais 
          educativos integrados de todos os Grupos de Trabalho do projeto.
        </p>
        
        {/* Barra de Pesquisa */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Pesquisar por tema de saúde, território, ferramentas..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-lg transition-shadow"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-semibold">Últimas Publicações</h2>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-5 h-5 text-gray-500 hidden sm:block" />
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
            >
              <option value="">Todos os Materiais</option>
              <option value="Relato de Experiência">Relatos de Experiência</option>
              <option value="Educação em Saúde">Educação em Saúde</option>
              <option value="Pesquisa e Evidência">Pesquisa e Evidência</option>
              <option value="Integração Inter-GT">Integração Inter-GT</option>
            </select>

            <select 
              value={filtroGT}
              onChange={(e) => setFiltroGT(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
            >
              <option value="">Todos os GTs</option>
              <option value="GT 01">GT 01</option>
              <option value="GT 02">GT 02</option>
              <option value="GT 03">GT 03</option>
              <option value="GT 04">GT 04</option>
              <option value="GT 05">GT 05</option>
              <option value="GT 06">GT 06</option>
              <option value="GT 07">GT 07</option>
              <option value="GT 08">GT 08</option>
              <option value="GT 09">GT 09</option>
              <option value="GT 10">GT 10</option>
              <option value="GT 11">GT 11</option>
              <option value="GT 12">GT 12</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Carregando publicações...</p>
          </div>
        ) : conteudosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum material encontrado com esses filtros.</p>
            <button onClick={() => {setBusca(''); setFiltroGT(''); setFiltroTipo('');}} className="mt-4 text-blue-600 hover:underline">
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {conteudosFiltrados.map((item) => (
              <article key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                    {item.gt_origem || 'Diversos'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                    {item.tipo_conteudo || item.categoria || 'Artigo'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 leading-snug">{item.title}</h3>
                <p className="text-gray-600 mb-6 flex-1">{item.summary}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{item.territorio ? `${item.territorio} • ` : ''}{item.data}</span>
                  <Link to={`/observatorio/${item.id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                    Acessar <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}