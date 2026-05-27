import { Link } from "react-router";
import { Search, MapPin, BookOpen, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import logoFull from "../../imports/Logo_de_Fundo_Azul_1.svg";

export function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <img 
                src={logoFull} 
                alt="SUS Conectar" 
                className="w-full max-w-md h-auto drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))' }}
              />
            </div>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed">
              Conectando você aos serviços de saúde pública com tecnologia e informação confiável. 
              Combatendo a desinformação e facilitando o acesso ao SUS.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto min-w-48 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/localizador" className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Onde devo ir?
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-48 bg-white text-primary hover:bg-white/90 border-white">
                <Link to="/observatorio" className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Ver Observatório
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="mb-4 text-3xl sm:text-4xl text-primary"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Como podemos ajudar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tecnologia e informação trabalhando juntas para facilitar o acesso à saúde pública
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Link 
              to="/localizador" 
              className="group p-8 rounded-2xl bg-background border-2 border-border hover:border-secondary hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary/30 transition-colors">
                <MapPin className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="mb-3 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                Localizador de Unidades
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Encontre a UBS ou USF mais próxima de você e saiba como chegar.
              </p>
            </Link>

            {/* Feature 2 */}
            <Link 
              to="/observatorio" 
              className="group p-8 rounded-2xl bg-background border-2 border-border hover:border-secondary hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary/30 transition-colors">
                <BookOpen className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="mb-3 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                Observatório Digital
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Artigos e notícias verificadas sobre saúde pública e bem-estar.
              </p>
            </Link>

            {/* Feature 3 */}
            <Link 
              to="/sobre" 
              className="group p-8 rounded-2xl bg-background border-2 border-border hover:border-secondary hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary/30 transition-colors">
                <ShieldCheck className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="mb-3 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                Combate à Desinformação
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Informações checadas e baseadas em evidências científicas.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-secondary/10 to-accent/10">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="mb-6 text-3xl sm:text-4xl text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Precisa de atendimento agora?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Use nosso localizador para encontrar a unidade de saúde mais próxima e 
            os serviços disponíveis.
          </p>
          <Button asChild size="lg" className="min-w-56">
            <Link to="/localizador" className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Unidade de Saúde
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}