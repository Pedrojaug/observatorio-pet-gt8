import { useState, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  ArrowLeft, 
  ShieldAlert, 
  HeartPulse, 
  ChevronRight, 
  Activity, 
  PhoneCall, 
  HelpCircle,
  Stethoscope
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import healthUnits from "./unidades_selecionadas.json";

interface HealthUnit {
  cnes: string;
  nome: string;
  tipo: string; // "USF" | "UPA"
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  telefone: string;
  municipio: string;
  municipio_codigo: string;
  latitude: string;
  longitude: string;
}

export function Locator() {
  // Navigation steps: 'triage' | 'location' | 'results'
  const [step, setStep] = useState<'triage' | 'location' | 'results'>('triage');
  const [severity, setSeverity] = useState<'light' | 'moderate' | 'grave' | null>(null);
  
  // Location selectors
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('João Pessoa');
  const [selectedBairro, setSelectedBairro] = useState<string>('');
  const [selectedBairroSearch, setSelectedBairroSearch] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Local state for manual filter search on results screen
  const [resultSearchTerm, setResultSearchTerm] = useState("");
  // Local state to filter UPAs by municipality on UPA screen
  const [upaFilterMunicipio, setUpaFilterMunicipio] = useState<string>("Todos");

  // Phone sanitizer helper
  const getSanitizedPhone = (phone: string) => {
    if (!phone || phone.toLowerCase().includes("sem telefone") || phone.trim() === "") {
      return null;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 8 || digits.length === 9) {
      return `83${digits}`; // Add PB local code if missing
    }
    return digits;
  };

  // Get unique sorted neighborhoods based on selected municipality
  const availableBairros = useMemo(() => {
    const bairrosSet = new Set<string>();
    healthUnits.forEach((unit) => {
      if (unit.municipio === selectedMunicipio && unit.bairro && unit.tipo === 'USF') {
        bairrosSet.add(unit.bairro.trim().toUpperCase());
      }
    });
    return Array.from(bairrosSet).sort();
  }, [selectedMunicipio]);

  // Filter neighborhoods based on search input
  const filteredBairros = useMemo(() => {
    if (!selectedBairroSearch) return availableBairros;
    return availableBairros.filter(b => 
      b.toLowerCase().includes(selectedBairroSearch.toLowerCase())
    );
  }, [availableBairros, selectedBairroSearch]);

  // Handle going back in the wizard flow
  const handleBack = () => {
    if (step === 'results') {
      if (severity === 'light') {
        setStep('location');
      } else {
        setStep('triage');
        setSeverity(null);
      }
    } else if (step === 'location') {
      setStep('triage');
      setSeverity(null);
    }
  };

  // Handle severity selection
  const selectSeverity = (level: 'light' | 'moderate' | 'grave') => {
    setSeverity(level);
    if (level === 'light') {
      setStep('location');
      setSelectedBairro('');
      setSelectedBairroSearch('');
    } else {
      setStep('results');
    }
  };

  // Filter units to display based on selections
  const displayUnits = useMemo(() => {
    if (severity === 'light') {
      // Find USFs in selected neighborhood and municipality
      return (healthUnits as HealthUnit[]).filter(unit => 
        unit.tipo === 'USF' &&
        unit.municipio === selectedMunicipio &&
        unit.bairro.trim().toUpperCase() === selectedBairro.toUpperCase() &&
        (resultSearchTerm === "" || unit.nome.toLowerCase().includes(resultSearchTerm.toLowerCase()))
      );
    } else if (severity === 'moderate') {
      // Show UPAs / Emergency Units
      return (healthUnits as HealthUnit[]).filter(unit => 
        unit.tipo === 'UPA' &&
        (upaFilterMunicipio === "Todos" || unit.municipio === upaFilterMunicipio) &&
        (resultSearchTerm === "" || unit.nome.toLowerCase().includes(resultSearchTerm.toLowerCase()))
      );
    }
    return [];
  }, [severity, selectedMunicipio, selectedBairro, resultSearchTerm, upaFilterMunicipio]);

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-slate-50/50 text-slate-800 selection:bg-primary/20 pb-16">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Stepper Header */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary to-[#0b1f41] text-white border-b border-slate-200/10 py-10 sm:py-14 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Localizador Inteligente de Saúde
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              O SUS organiza o atendimento conforme a gravidade do seu caso e onde você reside. Siga as etapas abaixo para saber onde deve ir.
            </p>

            {/* Stepper Indicators */}
            <div className="flex items-center gap-2 mt-8 text-xs font-bold text-slate-400">
              <span className={`px-2.5 py-1 rounded-full ${step === 'triage' ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}>1. Triagem</span>
              <ChevronRight className="w-4 h-4 text-white/30" />
              <span className={`px-2.5 py-1 rounded-full ${step === 'location' ? 'bg-primary text-white' : severity === 'light' ? 'bg-white/5 text-slate-400' : 'bg-white/5 text-slate-500'}`}>2. Endereço</span>
              <ChevronRight className="w-4 h-4 text-white/30" />
              <span className={`px-2.5 py-1 rounded-full ${step === 'results' ? 'bg-primary text-white' : 'bg-white/5 text-slate-500'}`}>3. Onde Ir</span>
            </div>
          </div>
        </div>
      </section>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Back Button */}
        {step !== 'triage' && (
          <button 
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-6 group focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Voltar
          </button>
        )}

        {/* STEP 1: TRIAGE */}
        {step === 'triage' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">O que você ou a pessoa necessitada está sentindo?</h2>
              <p className="text-slate-600 text-sm sm:text-base">Selecione o nível de urgência do problema para receber o encaminhamento correto do SUS.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Option 1: Light Severity */}
              <div 
                onClick={() => selectSeverity('light')}
                className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      Cuidados de Rotina / Casos Leves
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Consultas de rotina, vacinação, pré-natal, curativos simples, check-ups ou renovação de receitas.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Selecionar e Localizar</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Option 2: Moderate Severity */}
              <div 
                onClick={() => selectSeverity('moderate')}
                className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Sintomas Agudos / Urgências
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Febre alta persistente, dores intensas súbitas, vômito ou diarreia constante, pequenas queimaduras, ferimentos leves ou suspeita de fraturas.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>Ver Hospitais & UPAs 24h</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Option 3: Grave Severity */}
              <div 
                onClick={() => selectSeverity('grave')}
                className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      Emergências / Risco de Vida
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Falta de ar grave, dor opressiva no peito (infarto), perda de consciência, sangramento severo, convulsões ou acidentes graves.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600">
                  <span>Ver Ações de Emergência</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: LOCATION SELECTOR (LIGHT CASES ONLY) */}
        {step === 'location' && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Qual o seu local de residência?</h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                No SUS, o atendimento de rotina (USF) é referenciado pelo bairro de residência do usuário para assegurar o acompanhamento contínuo da equipe.
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Municipality Select */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Município</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setSelectedMunicipio('João Pessoa');
                      setSelectedBairro('');
                      setSelectedBairroSearch('');
                    }}
                    className={`h-12 rounded-xl font-bold border transition-all text-sm ${selectedMunicipio === 'João Pessoa' ? 'bg-primary text-white border-primary shadow-md shadow-primary/15' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                  >
                    João Pessoa
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMunicipio('Cabedelo');
                      setSelectedBairro('');
                      setSelectedBairroSearch('');
                    }}
                    className={`h-12 rounded-xl font-bold border transition-all text-sm ${selectedMunicipio === 'Cabedelo' ? 'bg-primary text-white border-primary shadow-md shadow-primary/15' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                  >
                    Cabedelo
                  </button>
                </div>
              </div>

              {/* Bairro Autocomplete Selector */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Seu Bairro</label>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Digite seu bairro (ex: Bessa, Torre, Miramar...)"
                    value={selectedBairroSearch}
                    onChange={(e) => {
                      setSelectedBairroSearch(e.target.value);
                      setSelectedBairro(''); // Clear selected neighborhood as user is typing
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      // Small delay to allow click event on suggestions to be registered before closing
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    className="w-full pl-10 pr-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100">
                      {filteredBairros.length > 0 ? (
                        filteredBairros.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => {
                              setSelectedBairro(b);
                              setSelectedBairroSearch(b); // Populate input with selected neighborhood
                              setShowSuggestions(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between font-semibold ${selectedBairro === b ? 'bg-primary/5 text-primary' : 'text-slate-700 hover:bg-slate-50 hover:text-primary'}`}
                          >
                            <span>{b}</span>
                            <MapPin className={`w-3.5 h-3.5 ${selectedBairro === b ? 'text-primary' : 'text-slate-300'}`} />
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-500">
                          Nenhum bairro encontrado para {selectedMunicipio}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-450 italic">
                  {selectedBairro ? (
                    <span className="text-emerald-600 font-semibold">Bairro "{selectedBairro}" selecionado com sucesso!</span>
                  ) : (
                    <span>Comece a digitar para ver os bairros ou selecione na lista acima.</span>
                  )}
                </p>
              </div>

              {/* CTA Action */}
              <div className="pt-4">
                <Button
                  onClick={() => setStep('results')}
                  disabled={!selectedMunicipio || !selectedBairro}
                  className="w-full h-13 rounded-xl bg-primary text-white shadow-lg disabled:opacity-50 text-base font-bold transition-all"
                >
                  Localizar Minha USF
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: RECOMMENDATION & RESULTS */}
        {step === 'results' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* EMERGENCY CASES (GRAVE) */}
            {severity === 'grave' && (
              <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Warning Card */}
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="flex items-center gap-4 text-red-700">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                      <ShieldAlert className="w-7 h-7 text-red-600 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black">Caso Grave / Emergência Emergencial</h2>
                      <p className="text-xs sm:text-sm text-red-600/90 font-medium">Risco imediato de morte ou sequelas permanentes.</p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-red-800 font-normal">
                    Em situações de dor forte ou aperto no peito, dificuldade respiratória acentuada, perda repentina de fala ou movimentos (suspeita de AVC), ferimentos profundos ou acidentes, **aja imediatamente**.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 items-center pt-2">
                    <a 
                      href="tel:192" 
                      className="w-full sm:w-auto h-14 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all duration-300"
                    >
                      <PhoneCall className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
                      Ligar para o SAMU (192)
                    </a>
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest sm:hidden">OU</span>
                    <p className="text-xs sm:text-sm font-semibold text-red-700">
                      Dirija-se imediatamente ao pronto-socorro hospitalar mais próximo.
                    </p>
                  </div>
                </div>

                {/* Emergency Hospital Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-red-500" />
                    Hospitais de Referência de Emergência (Porta Aberta 24h)
                  </h3>

                  <div className="grid gap-6">
                    {/* Trauma Hospital */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h4 className="text-base font-bold text-slate-800">Hospital Estadual de Emergência e Trauma Senador Humberto Lucena</h4>
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase">Geral</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          Referência absoluta para acidentes graves, fraturas severas, infartos, AVCs, queimaduras graves e cirurgias de emergência.
                        </p>
                        <div className="space-y-2 text-xs text-slate-500">
                          <p className="flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" /> Av. Othília Tenório de Alencar, s/n - Miramar, João Pessoa - PB</p>
                          <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> <a href="tel:8332167600" className="text-primary hover:underline font-semibold">(83) 3216-7600</a></p>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <Button 
                          variant="outline" 
                          className="h-10 w-full"
                          onClick={() => {
                            window.open('https://www.google.com/maps/search/?api=1&query=Hospital+de+Emergência+e+Trauma+Senador+Humberto+Lucena+Miramar+Joao+Pessoa', '_blank');
                          }}
                        >
                          <Navigation className="w-4 h-4 mr-2" /> Como chegar (Google Maps)
                        </Button>
                      </div>
                    </div>

                    {/* Maternidade Candida Vargas */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h4 className="text-base font-bold text-slate-800">Instituto de Saúde da Mulher - Maternidade Cândida Vargas</h4>
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 uppercase">Obstétrico</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          Referência para urgências e emergências obstétricas (partos, complicações na gestação, atendimento a gestantes).
                        </p>
                        <div className="space-y-2 text-xs text-slate-500">
                          <p className="flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" /> Av. João da Mata, s/n - Jaguaribe, João Pessoa - PB</p>
                          <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> <a href="tel:8332141350" className="text-primary hover:underline font-semibold">(83) 3214-1350</a></p>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <Button 
                          variant="outline" 
                          className="h-10 w-full"
                          onClick={() => {
                            window.open('https://www.google.com/maps/search/?api=1&query=Maternidade+Candida+Vargas+Jaguaribe+Joao+Pessoa', '_blank');
                          }}
                        >
                          <Navigation className="w-4 h-4 mr-2" /> Como chegar (Google Maps)
                        </Button>
                      </div>
                    </div>

                    {/* Pe Alfredo Barbosa Hospital */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h4 className="text-base font-bold text-slate-800">Hospital e Maternidade Municipal Pe Alfredo Barbosa (Cabedelo)</h4>
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase">Geral / Cabedelo</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          Porta de entrada principal de urgências e emergências clínicas e cirúrgicas no município de Cabedelo.
                        </p>
                        <div className="space-y-2 text-xs text-slate-500">
                          <p className="flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" /> R. Juarez Távora, 260 - Camalaú, Cabedelo - PB</p>
                          <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> <a href="tel:8332060486" className="text-primary hover:underline font-semibold">(83) 3206-0486</a></p>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <Button 
                          variant="outline" 
                          className="h-10 w-full"
                          onClick={() => {
                            window.open('https://www.google.com/maps/search/?api=1&query=Hospital+Maternidade+Municipal+Padre+Alfredo+Barbosa+Cabedelo', '_blank');
                          }}
                        >
                          <Navigation className="w-4 h-4 mr-2" /> Como chegar (Google Maps)
                        </Button>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="pt-4 text-center">
                  <Button 
                    onClick={() => {setStep('triage'); setSeverity(null);}} 
                    className="rounded-full px-6 bg-slate-200 hover:bg-slate-300 text-slate-700"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              </div>
            )}

            {/* MODERATE CASES (URGENCIAS - UPAS) */}
            {severity === 'moderate' && (
              <div className="space-y-8">
                
                {/* Intro advice banner */}
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-amber-800 flex items-center gap-1.5">
                      <Clock className="w-5 h-5" /> Atendimento de Urgência 24h
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      As UPAs estão abertas ininterruptamente para atender casos agudos. Não é necessária consulta pré-marcada.
                    </p>
                  </div>
                  
                  {/* Municipality Filter inside result screen */}
                  <div className="flex gap-2 bg-white border border-slate-200 p-1.5 rounded-xl self-start sm:self-center">
                    <button 
                      onClick={() => setUpaFilterMunicipio('Todos')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${upaFilterMunicipio === 'Todos' ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                      Todos
                    </button>
                    <button 
                      onClick={() => setUpaFilterMunicipio('João Pessoa')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${upaFilterMunicipio === 'João Pessoa' ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                      João Pessoa
                    </button>
                    <button 
                      onClick={() => setUpaFilterMunicipio('Cabedelo')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${upaFilterMunicipio === 'Cabedelo' ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                      Cabedelo
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Unidades de Pronto Atendimento Disponíveis</h2>
                  <p className="text-slate-500 text-xs sm:text-sm">Encontramos {displayUnits.length} estabelecimentos correspondentes na sua região.</p>
                </div>

                {/* Grid of UPAs */}
                <div className="grid md:grid-cols-2 gap-6">
                  {displayUnits.map((unit) => {
                    const formattedPhone = getSanitizedPhone(unit.telefone);
                    return (
                      <div 
                        key={unit.cnes} 
                        className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h4 className="text-base font-bold text-slate-800">{unit.nome}</h4>
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">UPA</Badge>
                          </div>
                          <div className="space-y-3 text-xs text-slate-600 mt-4">
                            <p className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                              <span>{unit.logradouro}, {unit.numero} - {unit.bairro}, {unit.municipio}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="font-semibold text-emerald-600">Aberto 24h • Segunda a Domingo</span>
                            </p>
                            {formattedPhone ? (
                              <p className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <a href={`tel:${formattedPhone}`} className="text-primary hover:underline font-semibold">{unit.telefone}</a>
                              </p>
                            ) : (
                              <p className="flex items-center gap-1.5 text-slate-400 italic">
                                <Phone className="w-3.5 h-3.5 text-slate-400/60 flex-shrink-0" />
                                <span>Sem telefone cadastrado</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                          <Button 
                            variant="outline" 
                            className="h-10 w-full"
                            onClick={() => {
                              const query = encodeURIComponent(`${unit.nome}, ${unit.logradouro}, ${unit.bairro}, ${unit.municipio}`);
                              window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                            }}
                          >
                            <Navigation className="w-4 h-4 mr-2" /> Como chegar (Google Maps)
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 text-center">
                  <Button 
                    onClick={() => {setStep('triage'); setSeverity(null);}} 
                    className="rounded-full px-6 bg-slate-200 hover:bg-slate-300 text-slate-700"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              </div>
            )}

            {/* LIGHT CASES (USFs BY NEIGHBORHOOD) */}
            {severity === 'light' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Info advising to seek appointment */}
                <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-2">
                  <h3 className="text-base font-extrabold text-primary flex items-center gap-1.5">
                    <MapPin className="w-5 h-5" /> Seu Atendimento Referenciado
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Você selecionou **{selectedBairro}** ({selectedMunicipio}). Para cuidados de saúde de rotina e prevenção, dirija-se à Unidade de Saúde da Família (USF) mapeada abaixo. 
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Unidades Básicas Localizadas</h2>
                    <p className="text-slate-500 text-xs sm:text-sm">Exibindo USFs cadastradas para o bairro selecionado.</p>
                  </div>
                  <Button 
                    onClick={() => setStep('location')} 
                    variant="outline" 
                    className="h-10 px-4 rounded-xl border-slate-300"
                  >
                    Alterar Bairro
                  </Button>
                </div>

                {/* Results listing */}
                {displayUnits.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Nenhuma USF cadastrada diretamente para {selectedBairro}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Não encontramos unidades primárias registradas sob o nome exato do bairro "{selectedBairro}". Algumas áreas são compartilhadas ou referenciadas em unidades localizadas em bairros vizinhos. 
                    </p>
                    <p className="text-xs text-slate-500">
                      Recomendamos buscar no bairro vizinho mais próximo ou entrar em contato com a Secretaria de Saúde do município.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {displayUnits.map((unit) => {
                      const formattedPhone = getSanitizedPhone(unit.telefone);
                      return (
                        <div 
                          key={unit.cnes} 
                          className="bg-white border border-slate-200/85 hover:border-primary/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <h4 className="text-base font-bold text-slate-800">{unit.nome}</h4>
                              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">USF</Badge>
                            </div>
                            
                            <div className="space-y-3 text-xs text-slate-600 mt-4">
                              <p className="flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                                <span>{unit.logradouro}, {unit.numero} - {unit.bairro}, {unit.municipio}</span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span>Segunda a Sexta: 07h às 17h (Rotina)</span>
                              </p>
                              {formattedPhone ? (
                                <p className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                  <a href={`tel:${formattedPhone}`} className="text-primary hover:underline font-semibold">{unit.telefone}</a>
                                </p>
                              ) : (
                                <p className="flex items-center gap-1.5 text-slate-400 italic">
                                  <Phone className="w-3.5 h-3.5 text-slate-400/60 flex-shrink-0" />
                                  <span>Sem telefone cadastrado</span>
                                </p>
                              )}
                              <p className="text-[10px] text-slate-400 font-mono">CNES: {unit.cnes}</p>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100">
                            <Button 
                              variant="outline" 
                              className="h-10 w-full"
                              onClick={() => {
                                const query = encodeURIComponent(`${unit.nome}, ${unit.logradouro}, ${unit.bairro}, ${unit.municipio}`);
                                window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                              }}
                            >
                              <Navigation className="w-4 h-4 mr-2" /> Como chegar (Google Maps)
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 text-center">
                  <Button 
                    onClick={() => {setStep('triage'); setSeverity(null);}} 
                    className="rounded-full px-6 bg-slate-200 hover:bg-slate-300 text-slate-700"
                  >
                    Voltar ao Início
                  </Button>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Info Guidelines footer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-200/60">
        <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Como funciona o atendimento de saúde no Brasil (SUS)</h3>
        <div className="grid sm:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">Atenção Primária (USF/UBS)</h4>
            <p>
              É o contato inicial e preventivo da saúde. Realiza o acompanhamento regular da família, oferece vacinação, exames periódicos, consultas agendadas, grupos de apoio e saúde odontológica básica. É geograficamente vinculada ao seu endereço residencial.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">Urgência e Emergência (UPA/Hospitais)</h4>
            <p>
              Estruturas hospitalares e unidades 24h prontas para tratar sintomas graves e repentinos que não podem esperar. Se você tiver mal-estar severo, dor repentina aguda ou sofrer um ferimento, procure uma UPA. O SAMU atua no socorro domiciliar imediato de acidentes e risco iminente de vida.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}