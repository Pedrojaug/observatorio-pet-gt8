import { useState } from "react";
import { Search, MapPin, Clock, Phone, Navigation } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HealthUnit {
  id: string;
  name: string;
  type: "UBS" | "USF";
  address: string;
  district: string;
  phone: string;
  hours: string;
  services: string[];
  distance?: string;
}

// Mock data
const mockUnits: HealthUnit[] = [
  {
    id: "1",
    name: "UBS Jardim das Flores",
    type: "UBS",
    address: "Rua das Acácias, 245 - Jardim das Flores",
    district: "Zona Norte",
    phone: "(11) 3456-7890",
    hours: "Segunda a Sexta: 7h - 19h",
    services: ["Clínico Geral", "Pediatria", "Enfermagem", "Vacinação"],
    distance: "1.2 km",
  },
  {
    id: "2",
    name: "USF Vila Esperança",
    type: "USF",
    address: "Av. Principal, 1089 - Vila Esperança",
    district: "Zona Leste",
    phone: "(11) 3456-7891",
    hours: "Segunda a Sexta: 7h - 17h",
    services: ["Clínico Geral", "Ginecologia", "Odontologia", "Psicologia"],
    distance: "2.5 km",
  },
  {
    id: "3",
    name: "UBS Centro de Saúde",
    type: "UBS",
    address: "Rua Central, 567 - Centro",
    district: "Centro",
    phone: "(11) 3456-7892",
    hours: "Segunda a Sexta: 8h - 18h",
    services: ["Clínico Geral", "Enfermagem", "Farmácia", "Vacinação"],
    distance: "3.8 km",
  },
  {
    id: "4",
    name: "USF Parque Verde",
    type: "USF",
    address: "Rua dos Ipês, 890 - Parque Verde",
    district: "Zona Sul",
    phone: "(11) 3456-7893",
    hours: "Segunda a Sexta: 7h - 19h | Sábado: 8h - 12h",
    services: ["Clínico Geral", "Pediatria", "Nutrição", "Fisioterapia"],
    distance: "4.2 km",
  },
];

export function Locator() {
  const [searchTerm, setSearchTerm] = useState("");
  const [units] = useState<HealthUnit[]>(mockUnits);

  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Onde devo ir?
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Encontre a Unidade Básica de Saúde (UBS) ou Unidade de Saúde da Família (USF) 
              mais próxima de você.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nome, bairro ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-base bg-white text-foreground border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredUnits.length} {filteredUnits.length === 1 ? "unidade encontrada" : "unidades encontradas"}
            </p>
          </div>

          <div className="grid gap-6">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 style={{ fontFamily: 'var(--font-heading)' }}>
                            {unit.name}
                          </h3>
                          <Badge variant={unit.type === "UBS" ? "default" : "secondary"}>
                            {unit.type}
                          </Badge>
                        </div>
                        {unit.distance && (
                          <p className="text-sm text-muted-foreground">
                            {unit.distance} de distância
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 ml-13">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-foreground">{unit.address}</p>
                          <p className="text-muted-foreground">{unit.district}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a 
                          href={`tel:${unit.phone.replace(/\D/g, '')}`}
                          className="text-primary hover:underline"
                        >
                          {unit.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-muted-foreground">{unit.hours}</p>
                      </div>

                      {/* Services */}
                      <div className="pt-3">
                        <p className="text-sm mb-2">Serviços disponíveis:</p>
                        <div className="flex flex-wrap gap-2">
                          {unit.services.map((service) => (
                            <Badge key={service} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      className="w-full lg:w-auto"
                      onClick={() => {
                        const query = encodeURIComponent(`${unit.name}, ${unit.address}`);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Como chegar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUnits.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Nenhuma unidade encontrada
              </h3>
              <p className="text-muted-foreground">
                Tente buscar por outro nome, bairro ou endereço
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 sm:py-16 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="mb-6 text-2xl sm:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Quando procurar uma UBS ou USF?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              As Unidades Básicas de Saúde (UBS) e Unidades de Saúde da Família (USF) são 
              a porta de entrada do Sistema Único de Saúde (SUS). Elas oferecem atendimento 
              gratuito em:
            </p>
            <ul className="text-muted-foreground space-y-2 ml-6">
              <li>Consultas médicas e de enfermagem</li>
              <li>Vacinação</li>
              <li>Pré-natal e acompanhamento de gestantes</li>
              <li>Prevenção e tratamento de doenças crônicas</li>
              <li>Curativos e pequenos procedimentos</li>
              <li>Encaminhamento para especialistas quando necessário</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Importante:</strong> Em casos de emergência, procure diretamente um 
              pronto-socorro ou ligue para o SAMU (192).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}