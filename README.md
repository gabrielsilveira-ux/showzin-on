# EventosLivres — Portal de Eventos Gratuitos

Portal regional construído com **Next.js 15 + TypeScript + Tailwind CSS**. Deploy em 1 clique no Vercel.

---

## 🚀 Deploy no Vercel

### Via GitHub (recomendado)
```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/SEU-USUARIO/eventoslivres.git
git push -u origin main
```
Depois: **vercel.com → Add New Project → Import → Deploy**.

### Via CLI
```bash
npm i -g vercel && vercel login && vercel --prod
```

---

## 💻 Rodar localmente
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # produção
```

---

## 📁 Estrutura

```
app/
  page.tsx                    Home (hero + filtros + grid)
  eventos/[slug]/page.tsx     Página de cada evento
  admin/
    layout.tsx                Sidebar do painel
    page.tsx                  Dashboard
    eventos/page.tsx          Lista de eventos
    eventos/novo/page.tsx     Criar evento
    eventos/[id]/page.tsx     Editar evento
    configuracoes/page.tsx    Configurações
  api/
    events/route.ts           GET /api/events (público)
    admin/events/route.ts     GET, POST
    admin/events/[id]/route.ts PATCH, DELETE
components/
  layout/Header.tsx  Footer.tsx
  events/EventCard.tsx  FilterBar.tsx  CategoryPills.tsx  NewsletterSection.tsx
  admin/EventForm.tsx
lib/
  db.ts             Mock data + adapter (substituir por Supabase)
  utils.ts          Helpers de data e slug
types/index.ts      Todos os tipos TypeScript
.env.example        Template de variáveis
```

---

## 🗄️ Conectar Supabase

### 1. Instalar
```bash
npm install @supabase/supabase-js
```

### 2. `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 3. Schema SQL (rodar no Supabase SQL Editor)
```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text not null,
  emoji text, color text,
  date_start timestamptz not null,
  date_end timestamptz,
  time_start text, time_end text,
  estado text, cidade text, bairro text, endereco text,
  lat float, lng float,
  tags text[],
  is_free boolean default true,
  ticket_url text, image_url text,
  featured boolean default false,
  status text default 'draft',
  source text default 'editorial',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on events (cidade);
create index on events (category);
create index on events (date_start);
create index on events (status);
```

### 4. Substituir funções em `lib/db.ts`
Cada função tem comentário `// TODO:`. Exemplo:
```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getEvents(filters?) {
  let q = supabase.from('events').select('*').eq('status','published')
  if (filters?.city)  q = q.eq('cidade', filters.city)
  if (filters?.genre) q = q.eq('category', filters.genre)
  const { data } = await q
  return data ?? []
}
```

---

## 🔐 Proteger /admin

```bash
npm install next-auth
```
Criar `middleware.ts`:
```typescript
export { default } from 'next-auth/middleware'
export const config = { matcher: ['/admin/:path*'] }
```

---

## 📍 Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Home com filtros |
| `/?city=Campinas&genre=rock&period=fds` | Filtros via URL (SEO) |
| `/eventos/[slug]` | Página do evento |
| `/admin` | Dashboard |
| `/admin/eventos/novo` | Criar evento |
| `/admin/eventos/[id]` | Editar evento |
| `/api/events` | API pública |
| `/api/admin/events` | API admin |

## Stack
Next.js 15 · TypeScript · Tailwind CSS · Lucide React · date-fns · Vercel · Supabase (opcional)
