import { 
  ShieldCheck, 
  Users, 
  Target, 
  Sparkles, 
  Activity, 
  MapPin, 
  MessageSquare, 
  GraduationCap, 
  BookOpen, 
  ArrowRight
} from "lucide-react";
import { Link } from "react-router";
import logoIcon from "../../imports/Avatar_PET_Saude.png";
import { Button } from "./ui/button";

export function About() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-slate-50/50 text-slate-800 selection:bg-primary/20 overflow-x-hidden pb-16">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:py-24 text-center">
        {/* Glowing backdrop orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Avatar Icon */}
          <div className="inline-flex items-center justify-center p-3.5 bg-white border border-slate-200 shadow-md rounded-[2rem] hover:rotate-6 transition-transform duration-300">
            <img 
              src={logoIcon} 
              alt="SUS Conectar" 
              className="h-20 w-auto"
            />
          </div>

          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Institucional
            </span>
          </div>

          {/* Title */}
          <h1 
            className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900"
          >
            Sobre o{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              SUS Conectar
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Um portal de tecnologia, saúde e educação comprometido com a verdade, a facilitação de acessos e o bem-estar da população de João Pessoa e Cabedelo.
          </p>
        </div>
      </section>

      {/* Mission & Context Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-sm space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" /> Nossa Missão
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base sm:text-lg">
              <p>
                O **SUS Conectar** nasceu no âmbito do projeto **PET-Saúde/SUS Digital da Universidade Federal da Paraíba (UFPB)**. Nosso propósito central é aproximar o cidadão das ferramentas tecnológicas e informações de saúde que facilitam o dia a dia.
              </p>
              <p>
                Acreditamos que o acesso simplificado a informações sobre unidades físicas de atendimento (UBS/USF) e a desmistificação de notícias falsas são fundamentais para promover uma saúde preventiva de qualidade. Orientamos o usuário de forma transparente, humanizada e baseada em evidências científicas sólidas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Nossos Pilares de Atuação
            </h2>
            <p className="text-lg text-slate-600">
              Guiamos nossas atividades por princípios éticos, científicos e sociais rígidos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            
            {/* Value 1 */}
            <div className="group text-center bg-slate-50/50 hover:bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Credibilidade Científica
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Todas as publicações e informações de saúde são baseadas em evidências científicas e revisadas por especialistas e pesquisadores da UFPB.
              </p>
            </div>

            {/* Value 2 */}
            <div className="group text-center bg-slate-50/50 hover:bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Acessibilidade Digital
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Desenvolvemos interfaces intuitivas e utilizamos linguagem clara para que qualquer pessoa consiga navegar e obter ajuda sem barreiras tecnológicas.
              </p>
            </div>

            {/* Value 3 */}
            <div className="group text-center bg-slate-50/50 hover:bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Transparência Pública
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Nossos dados de unidades e serviços vêm direto do Cadastro Nacional de Estabelecimentos de Saúde (CNES), com atualização pública e isenta de interesses.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* What We Do / Functions Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Frentes de Trabalho
            </h2>
            <p className="text-lg text-slate-600">
              Entenda como estruturamos nossas ações diárias no portal.
            </p>
          </div>
          
          <div className="space-y-8">
            
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-primary/20 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Combate à Desinformação em Saúde</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Realizamos o monitoramento de fake news relacionadas a tratamentos médicos, campanhas de vacinação e saúde coletiva. Desmistificamos boatos publicando notas checadas com linguagem de fácil compreensão.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-primary/20 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Facilitação de Acesso e Geolocalização</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Criamos o Localizador de Unidades para organizar o fluxo de pacientes de João Pessoa e Cabedelo. O sistema orienta o usuário de acordo com o nível do problema e o seu bairro de residência, indicando rotas via satélite.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-primary/20 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Educação e Disseminação Científica</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  O portal serve como repositório aberto para artigos, infográficos e relatos de experiência produzidos pelas equipes acadêmicas, promovendo a formação contínua em saúde digital para alunos e profissionais.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* GT Structure Section */}
      <section className="py-20 bg-slate-100/50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary uppercase">
                Estrutura do Projeto
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Os 12 Grupos de Trabalho do PET-Saúde UFPB
              </h2>
              <p className="text-slate-600 leading-relaxed">
                O programa PET-Saúde/SUS Digital na UFPB envolve diversos grupos temáticos que cobrem áreas que vão desde inteligência de dados, prontuário eletrônico, vigilância epidemiológica, até telessaúde.
              </p>
              <p className="text-slate-600 leading-relaxed font-bold">
                O GT 08 é especificamente focado em "Educação e Comunicação em Saúde Digital", sendo responsável pela concepção, design, desenvolvimento e alimentação deste portal.
              </p>
              <div className="pt-2">
                <Button asChild className="rounded-full bg-secondary hover:bg-secondary/95">
                  <Link to="/observatorio" className="flex items-center gap-2 text-white">
                    Ver materiais produzidos pelos GTs <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Grid list of GTs */}
            <div className="lg:col-span-6 grid grid-cols-3 gap-3">
              {[...Array(12)].map((_, i) => {
                const gtNum = String(i + 1).padStart(2, '0');
                const isGt08 = gtNum === '08';
                return (
                  <div 
                    key={i} 
                    className={`p-4 rounded-2xl text-center border transition-all ${isGt08 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105 z-10' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}
                  >
                    <span className="block text-xs font-bold opacity-80">GT</span>
                    <span className="block text-xl font-black leading-none mt-1">{gtNum}</span>
                    {isGt08 && <span className="block text-[8px] font-bold mt-1 uppercase tracking-wide">Comunicação</span>}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          >
            Quer ver os conteúdos científicos produzidos?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            Nosso Observatório reúne artigos, relatos de experiências e materiais educativos criados especificamente para aprimorar a saúde pública digital.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-sm">
              <Link to="/observatorio" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Acessar o Observatório
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white text-white hover:bg-white hover:text-secondary bg-transparent font-bold text-sm">
              <Link to="/localizador" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Buscar Atendimento
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
    </div>
  );
}