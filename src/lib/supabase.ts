import { createClient } from '@supabase/supabase-js';

// Sanitiza a URL base: remove aspas, espaços, barras finais e qualquer caminho de API
// que tenha sido colado acidentalmente (ex: /auth/v1, /rest/v1).
// Isso previne o erro "Invalid path specified in request URL" causado pela resolução
// relativa new URL("auth/v1", base) dentro do supabase-js quando base tem um caminho.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string)
  ?.replace(/^["']|["']$/g, '')
  ?.trim()
  ?.replace(/\/(auth|rest|storage|realtime|functions)(\/v\d+\/?)?$/, '')
  ?.replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.replace(/^["']|["']$/g, '')?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam ser definidas no arquivo .env');
}

// Validação extra para ajudar a identificar erros na URL
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`A URL do Supabase fornecida não é válida: "${supabaseUrl}". Certifique-se de que ela começa com "https://" e não tem espaços sobrando.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
