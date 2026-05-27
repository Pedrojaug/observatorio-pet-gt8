import { ShieldCheck, Users, Target } from "lucide-react";
import logoIcon from "../../imports/Avatar_PET_Saude.png";

export function About() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src={logoIcon} 
              alt="SUS Conectar" 
              className="h-20 w-auto"
            />
          </div>
          <h1 
            className="mb-6 text-4xl sm:text-5xl text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Sobre o SUS Conectar
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Um portal de tecnologia e saúde, comprometido com a verdade 
            e o bem-estar da população.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Nossa Missão</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Observatório Digital de Saúde nasceu da necessidade de oferecer informações 
              confiáveis e acessíveis sobre saúde pública no Brasil. Em um cenário marcado 
              pela desinformação, nosso compromisso é ser uma fonte segura de conhecimento, 
              orientando cidadãos na busca por cuidados de saúde de qualidade.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Trabalhamos para democratizar o acesso à informação verificada, combatendo 
              fake news e promovendo a educação em saúde. Acreditamos que cidadãos bem 
              informados fazem escolhas melhores para seu bem-estar e o de suas comunidades.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-3xl sm:text-4xl text-center mb-12"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Nossos Valores
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Credibilidade
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Todas as informações são baseadas em evidências científicas e fontes 
                verificadas por especialistas.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Acessibilidade
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Linguagem clara e design intuitivo para que todos possam acessar e 
                compreender as informações.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Transparência
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Clareza sobre nossas fontes, métodos e compromisso com a 
                verdade acima de qualquer interesse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-3xl sm:text-4xl mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            O que fazemos
          </h2>
          
          <div className="space-y-8">
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Combate à Desinformação
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Verificamos informações que circulam sobre saúde e desmistificamos fake news, 
                sempre com base em evidências científicas e fontes confiáveis.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/50">
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Orientação ao Cidadão
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Facilitamos o acesso aos serviços de saúde através do nosso localizador de 
                unidades (UBS/USF) e fornecemos informações sobre atendimento e direitos.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/50">
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Educação em Saúde
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Publicamos conteúdo educativo sobre prevenção, tratamento e cuidados com 
                a saúde, sempre de forma acessível e humanizada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="mb-4 text-2xl sm:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Tem alguma dúvida sobre saúde?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore nosso observatório com artigos verificados ou use o localizador 
            para encontrar atendimento próximo a você.
          </p>
        </div>
      </section>
    </div>
  );
}