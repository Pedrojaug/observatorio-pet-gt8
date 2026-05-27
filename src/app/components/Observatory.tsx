import { useState } from "react";
import { Calendar, Tag, ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
}

// Mock data
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Vacinação contra a gripe: tire suas dúvidas",
    excerpt: "Entenda a importância da vacinação anual contra a gripe, quem deve se vacinar e os principais mitos sobre a vacina.",
    date: "2026-03-18",
    category: "Prevenção",
    tags: ["Vacinação", "Gripe", "Imunização"],
    readTime: "5 min",
    featured: true,
  },
  {
    id: "2",
    title: "Hipertensão: como controlar a pressão arterial",
    excerpt: "Dicas práticas de alimentação, exercícios e hábitos para manter a pressão sob controle e prevenir complicações.",
    date: "2026-03-15",
    category: "Doenças Crônicas",
    tags: ["Hipertensão", "Coração", "Prevenção"],
    readTime: "7 min",
  },
  {
    id: "3",
    title: "Fake news sobre saúde: aprenda a identificar",
    excerpt: "Como reconhecer informações falsas sobre saúde nas redes sociais e onde buscar fontes confiáveis.",
    date: "2026-03-12",
    category: "Desinformação",
    tags: ["Fake News", "Checagem", "Redes Sociais"],
    readTime: "6 min",
    featured: true,
  },
  {
    id: "4",
    title: "Diabetes tipo 2: prevenção e cuidados essenciais",
    excerpt: "Conheça os fatores de risco, sintomas e medidas preventivas para evitar o desenvolvimento do diabetes tipo 2.",
    date: "2026-03-10",
    category: "Doenças Crônicas",
    tags: ["Diabetes", "Alimentação", "Exercícios"],
    readTime: "8 min",
  },
  {
    id: "5",
    title: "Saúde mental: quando procurar ajuda profissional",
    excerpt: "Sinais de que é hora de buscar apoio psicológico e como acessar atendimento pelo SUS.",
    date: "2026-03-08",
    category: "Saúde Mental",
    tags: ["Psicologia", "Bem-estar", "SUS"],
    readTime: "6 min",
  },
  {
    id: "6",
    title: "Pré-natal: a importância do acompanhamento",
    excerpt: "Por que o pré-natal é fundamental para a saúde da mãe e do bebê e quais exames são necessários.",
    date: "2026-03-05",
    category: "Saúde da Mulher",
    tags: ["Gestação", "Pré-natal", "Maternidade"],
    readTime: "7 min",
  },
];

const categories = ["Todas", "Prevenção", "Doenças Crônicas", "Desinformação", "Saúde Mental", "Saúde da Mulher"];

export function Observatory() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [articles] = useState<Article[]>(mockArticles);

  const filteredArticles = selectedCategory === "Todas" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticles = articles.filter(article => article.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <h1 
              className="mb-4 text-3xl sm:text-4xl lg:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Observatório de Saúde
            </h1>
            <p className="text-lg text-white/90">
              Artigos verificados, notícias e orientações sobre saúde pública. 
              Informação confiável para cuidar melhor de você.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredArticles.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-card to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Em Destaque
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {featuredArticles.map((article) => (
                <article
                  key={article.id}
                  className="group p-6 rounded-xl border border-primary/20 bg-card hover:border-primary/40 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="default">{article.category}</Badge>
                    <span className="text-sm text-muted-foreground">{article.readTime}</span>
                  </div>
                  
                  <h3 
                    className="mb-3 text-xl group-hover:text-primary transition-colors"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                    
                    <span className="text-sm text-primary group-hover:gap-2 flex items-center gap-1 transition-all">
                      Ler artigo
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 border-b border-border bg-background sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredArticles.length} {filteredArticles.length === 1 ? "artigo" : "artigos"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{article.category}</Badge>
                  <span className="text-sm text-muted-foreground">{article.readTime}</span>
                </div>
                
                <h3 
                  className="mb-3 group-hover:text-primary transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                  {article.excerpt}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Tag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Nenhum artigo encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente selecionar outra categoria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="mb-4 text-2xl sm:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Fique por dentro das novidades
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nosso observatório é atualizado regularmente com novos artigos, 
            orientações e informações verificadas sobre saúde pública.
          </p>
          <p className="text-sm text-muted-foreground">
            Volte sempre para conferir as últimas publicações
          </p>
        </div>
      </section>
    </div>
  );
}