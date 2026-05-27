# SUS Conectar — Observatório GT

Portal de informação e educação em saúde digital desenvolvido pelo **GT 08** do projeto **PET-Saúde/SUS Digital – UFPB**. O site centraliza relatos de experiência das USFs de João Pessoa e Cabedelo, evidências científicas e materiais educativos produzidos pelos 12 Grupos de Trabalho do projeto.

---

## Funcionalidades

- **Observatório** — listagem e leitura de publicações com filtro por tipo de conteúdo e GT de origem
- **Localizador** — busca de UBS/USF com link direto para o Google Maps
- **Painel administrativo** — publicação de materiais e gerenciamento de perfil (acesso restrito)
- **Autenticação** — login, cadastro e recuperação de senha via e-mail (Supabase Auth)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 + Vite 6 |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Roteamento | React Router v7 |
| Backend / Auth | Supabase |
| Deploy | Vercel |

## Estrutura de pastas

```
src/
├── app/
│   ├── components/     # Layout, Home, About, Locator e componentes UI
│   └── routes.ts       # Definição das rotas
├── pages/              # Observatorio, Post, AdminDashboard
├── lib/
│   └── supabase.ts     # Cliente Supabase
└── imports/            # Assets estáticos (logos, imagens)
```

## Rodando localmente

**Pré-requisitos:** Node.js 18+ e pnpm

```bash
# 1. Instale as dependências
pnpm install

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com sua URL e chave anon do Supabase

# 3. Inicie o servidor de desenvolvimento
pnpm dev
```

O site estará disponível em `http://localhost:5173`.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

Nunca suba o arquivo `.env` para o repositório.

## Deploy (Vercel)

1. Conecte o repositório no [Vercel](https://vercel.com)
2. As configurações de build são detectadas automaticamente (Vite)
3. Adicione as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas Environment Variables do projeto
4. No Supabase Dashboard → Authentication → URL Configuration, adicione a URL de produção como Site URL e em Redirect URLs

## Banco de dados (Supabase)

### Tabela `posts`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | int8 | Chave primária |
| title | text | Título da publicação |
| summary | text | Resumo |
| content | text | Conteúdo completo (texto ou HTML) |
| data | date | Data de publicação |
| tipo_conteudo | text | Relato de Experiência, Educação em Saúde, etc. |
| gt_origem | text | GT responsável (GT 01 … GT 12) |
| territorio | text | Território/USF de origem |

### Tabela `profiles`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | FK para `auth.users` |
| full_name | text | Nome completo |
| gt_origem | text | GT de origem |
| cargo | text | Cargo ou função |
| territorio | text | Território de atuação |
| bio | text | Biografia curta |
| updated_at | timestamptz | Última atualização |

---

Projeto desenvolvido no âmbito do PET-Saúde/SUS Digital — UFPB, 2025.
