/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Adicione outras variáveis aqui se precisar no futuro
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}