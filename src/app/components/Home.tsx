import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Search, 
  MapPin, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  Globe, 
  Clock, 
  ArrowUpRight
} from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "../../lib/supabase";
import logoFull from "../../imports/Logo_de_Fundo_Azul_1.svg";

interface Artigo {
  id: number;
  title: string;
  summary: string;
  data: string;
  tipo_conteudo?: string;
  categoria?: string;
  gt_origem?: string;
  territorio?: string;
}

const fallbackPosts: Artigo[] = [
  {
    id: 1,
    title: "Mapeamento das Unidades de Saúde da Família em Cabedelo e João Pessoa",
    summary: "Como o GT 08 desenvolveu um mapa interativo para orientar os cidadãos na busca por atendimentos e serviços especializados do SUS.",
    data: "01/06/2026",
    tipo_conteudo: "Relato de Experiência",
    gt_origem: "GT 08",
    territorio: "Cabedelo e João Pessoa"
  },
  {
    id: 2,
    title: "O papel do PET-Saúde SUS Digital na capacitação em Saúde Digital",
    summary: "Uma análise reflexiva da inserção de tecnologias digitais no cotidiano de trabalho das equipes da estratégia de Saúde da Família.",
    data: "28/05/2026",
    tipo_conteudo: "Educação em Saúde",
    gt_origem: "GT 08",
    territorio: "UFPB"
  },
  {
    id: 3,
    title: "Combate à desinformação: Guia prático de saúde baseada em evidências",
    summary: "Guia interativo focado em orientar a população a reconhecer notícias falsas sobre saúde e tratamentos médicos.",
    data: "15/05/2026",
    tipo_conteudo: "Pesquisa e Evidência",
    gt_origem: "GT 08",
    territorio: "João Pessoa"
  }
];

const faqs = [
  {
    question: "O que é o PET-Saúde / SUS Digital?",
    answer: "O PET-Saúde/SUS Digital é uma iniciativa conjunta do Ministério da Saúde e da UFPB voltada ao fortalecimento da transformação digital na atenção básica do SUS. O projeto integra estudantes, professores e profissionais de saúde na criação e consolidação de ferramentas digitais e materiais educativos."
  },
  {
    question: "Qual o papel do GT 08 no projeto?",
    answer: "O Grupo de Trabalho 08 atua como o núcleo de comunicação e disseminação digital do projeto. Desenvolvemos estratégias de educação em saúde e ferramentas computacionais (como o Localizador de Unidades e este Portal Observatório) para facilitar o acesso de cidadãos e profissionais a informações confiáveis."
  },
  {
    question: "Como o Observatório garante a veracidade das informações?",
    answer: "Todos os artigos, relatos de experiências e materiais educativos produzidos pelos 12 Grupos de Trabalho passam por rigorosa validação acadêmica e técnica por pesquisadores da UFPB e profissionais da rede de saúde, garantindo embasamento científico e aplicação prática segura."
  },
  {
    question: "Como funciona a busca por unidades no localizador?",
    answer: "O localizador centraliza informações sobre UBS e USF em João Pessoa e Cabedelo. Ele exibe horários de funcionamento, contatos diretos e permite traçar rotas rápidas no Google Maps. A intenção é poupar tempo do cidadão e orientá-lo ao destino correto de atendimento."
  }
];

export function Home() {
  const [recentPosts, setRecentPosts] = useState<Artigo[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("data", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Erro ao buscar posts:", error);
          setRecentPosts(fallbackPosts);
        } else if (data && data.length > 0) {
          // Format date if needed
          const formatted = data.map((item: any) => ({
            ...item,
            data: item.data ? new Date(item.data).toLocaleDateString('pt-BR') : 'Sem data'
          }));
          setRecentPosts(formatted);
        } else {
          setRecentPosts(fallbackPosts);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
        setRecentPosts(fallbackPosts);
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchRecentPosts();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 text-slate-800 selection:bg-primary/20 overflow-x-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Title & Description */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left z-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wider uppercase animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <Sparkles className="w-3 h-3" />
                PET-Saúde / SUS Digital UFPB • GT 08
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900">
                Fortalecendo o SUS através da{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                  Saúde Digital
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Conectando você às Unidades de Saúde de João Pessoa e Cabedelo. Combata a desinformação com evidências científicas e explore relatos práticos das USFs.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto h-13 px-8 rounded-full bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 text-base font-bold"
                >
                  <Link to="/localizador" className="flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Onde devo ir?
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-13 px-8 rounded-full border border-slate-300 hover:border-primary/50 text-slate-700 hover:text-primary bg-white/80 hover:bg-primary/5 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 text-base font-semibold"
                >
                  <Link to="/observatorio" className="flex items-center justify-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Acessar Observatório
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Glassmorphic Interactive Dashboard Mockup */}
            <div className="lg:col-span-5 relative w-full max-w-lg mx-auto lg:max-w-none">
              
              {/* Decorative Glowing Orbs behind the Mockup */}
              <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

              {/* Interactive Panel Container */}
              <div className="relative bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20 group">
                
                {/* Header widget */}
                <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-200/60">
                  <div className="flex gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 group-hover:bg-red-400 transition-colors" />
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 group-hover:bg-yellow-400 transition-colors" />
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 group-hover:bg-green-400 transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors uppercase tracking-widest">
                    SUS CONECTAR HUB
                  </span>
                </div>

                {/* Main Logo Container */}
                <div className="mb-6 flex justify-center bg-gradient-to-br from-secondary/5 to-primary/5 p-4 rounded-2xl border border-slate-100">
                  <img 
                    src={logoFull} 
                    alt="SUS Conectar" 
                    className="w-full max-w-[200px] h-auto drop-shadow-md"
                  />
                </div>

                {/* Sub-card 1: Interactive Unit Selector Mock */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow mb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">USF Jardim das Flores</h4>
                        <p className="text-[11px] text-slate-500">Cabedelo, PB • 1.2 km de distância</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Aberto • 07h-19h
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>Vacinação ativa hoje</span>
                    <Link to="/localizador" className="text-primary hover:underline font-bold flex items-center gap-0.5">
                      Ver mapa <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Sub-card 2: Project Info Bubble */}
                <div className="bg-secondary text-white rounded-2xl p-4 shadow-lg flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-foreground/70">
                      GT 08 Ações Ativas
                    </span>
                    <p className="text-xs font-semibold leading-relaxed mt-0.5">
                      Combate às Fake News com boletins semanais validados pela coordenação do PET-Saúde.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            <div className="text-center p-4">
              <span className="block text-4xl sm:text-5xl font-black text-secondary tracking-tight">12</span>
              <span className="block mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Grupos de Trabalho</span>
            </div>
            
            <div className="text-center p-4">
              <span className="block text-4xl sm:text-5xl font-black text-secondary tracking-tight">2</span>
              <span className="block mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Municípios Polo</span>
            </div>
            
            <div className="text-center p-4">
              <span className="block text-4xl sm:text-5xl font-black text-secondary tracking-tight">100%</span>
              <span className="block mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Informação Verificada</span>
            </div>
            
            <div className="text-center p-4">
              <span className="block text-4xl sm:text-5xl font-black text-secondary tracking-tight">Acesso</span>
              <span className="block mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Público & Gratuito</span>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Como podemos ajudar você?
            </h2>
            <p className="text-lg text-slate-600">
              O SUS Conectar integra informação, orientação espacial e embasamento científico para facilitar sua relação com o ecossistema de saúde.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <Link 
              to="/localizador" 
              className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  Localizador de Unidades
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Encontre a USF ou UBS mais próxima de você em João Pessoa e Cabedelo. Saiba horários, contatos e rotas rápidas no Google Maps.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                Buscar Unidades <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Feature 2 */}
            <Link 
              to="/observatorio" 
              className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  Observatório Científico
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Relatos de experiência do cotidiano do SUS, artigos sobre inovações tecnológicas e pesquisas sobre saúde digital organizadas por Grupos de Trabalho.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                Acessar publicações <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Feature 3 */}
            <Link 
              to="/sobre" 
              className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  Combate à Desinformação
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Materiais educativos informativos checados e baseados em evidências, com o intuito de dirimir dúvidas e desmentir boatos que afetam a saúde pública.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                Sobre o projeto <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Latest Posts Feed */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
            <div>
              <div className="inline-flex items-center gap-1 text-primary text-xs font-extrabold uppercase tracking-widest mb-3">
                <Activity className="w-4 h-4" /> Observatório
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Últimas Publicações do PET-Saúde
              </h2>
            </div>
            <Button asChild variant="outline" className="w-full sm:w-auto h-11 px-5 rounded-full text-slate-700 hover:text-primary">
              <Link to="/observatorio" className="flex items-center gap-2 font-bold text-sm">
                Ver todos os materiais <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Feed Cards */}
          {loadingPosts ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 animate-pulse">
                  <div className="h-6 w-24 bg-slate-200 rounded-full" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
                  <div className="h-20 bg-slate-200 rounded-md" />
                  <div className="h-8 w-28 bg-slate-200 rounded-md mt-6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article 
                  key={post.id} 
                  className="group bg-slate-50/50 hover:bg-white border border-slate-200/80 hover:border-primary/20 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[10px] font-extrabold bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {post.gt_origem || "GT 08"}
                      </span>
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {post.tipo_conteudo || post.categoria || "Material"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    {/* Summary */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.data}
                    </span>
                    <Link 
                      to={`/observatorio/${post.id}`} 
                      className="text-primary hover:text-secondary font-bold flex items-center gap-1 transition-colors"
                    >
                      Ler Completo <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Dúvidas Frequentes
            </h2>
            <p className="text-lg text-slate-600">
              Tudo o que você precisa saber sobre o portal SUS Conectar e a atuação do PET-Saúde/SUS Digital.
            </p>
          </div>

          {/* Accordion container */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 hover:text-primary transition-colors focus:outline-none"
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <span className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : 'text-slate-500'}`}>
                      <ChevronRight className="w-4 h-4 transform rotate-90" />
                    </span>
                  </button>

                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-6 text-slate-600 text-sm leading-relaxed bg-slate-50/40">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer Banner CTA */}
      <section className="py-20 relative bg-secondary text-white overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-[#0b1f41]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mx-auto shadow-inner">
            <MapPin className="w-8 h-8 text-accent animate-bounce" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Precisa localizar uma Unidade de Saúde agora?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Utilize nosso localizador integrado para saber o endereço correto, contatos e traçar a rota mais rápida até a UBS ou USF desejada.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="h-13 px-8 rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-base shadow-xl shadow-accent/20 transition-all duration-300 transform hover:-translate-y-0.5">
              <Link to="/localizador" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Unidade de Saúde
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}