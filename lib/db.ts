// ============================================================
// EVENTOSLIVRES — lib/db.ts
//
// MOCK DATA + DB ADAPTER STUB
// Para conectar ao banco real:
//   1. Instale: npm install @supabase/supabase-js
//   2. Crie .env.local com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
//   3. Substitua as funções abaixo pelas queries reais (ver comentários)
// ============================================================

import { Event, EventFilters, EventFormData, Category } from '@/types'
import { isToday, isWeekend, isSameMonth } from 'date-fns'

// ── CATEGORIA CONFIG ────────────────────────────────────────
export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; emoji: string }> = {
  rock:        { label: 'Rock',        color: '#E8430A', emoji: '🎸' },
  gastronomia: { label: 'Gastronomia', color: '#B85C00', emoji: '🍽️' },
  infantil:    { label: 'Infantil',    color: '#2E7D4F', emoji: '🎈' },
  esportes:    { label: 'Esportes',    color: '#1A5C9E', emoji: '⚽' },
  teatro:      { label: 'Teatro',      color: '#6B3FA0', emoji: '🎭' },
  musica:      { label: 'Música',      color: '#C41E5A', emoji: '🎵' },
  cultura:     { label: 'Cultura',     color: '#4A7A3D', emoji: '🎨' },
  tecnologia:  { label: 'Tecnologia',  color: '#1E5FA0', emoji: '💻' },
}

// ── MOCK DATA ────────────────────────────────────────────────
function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export const MOCK_EVENTS: Event[] = [
  {
    id: '1', slug: 'festival-indie-campinas-inverno-2025',
    title: 'Festival Indie Campinas — Edição Inverno 2025',
    description: 'Três palcos, oito bandas locais e entrada 100% gratuita. O maior festival indie da cidade chega ao Largo do Rosário trazendo o melhor do rock independente campineiro. Uma tarde de música ao vivo, arte urbana e gastronomia de rua. Não perca!',
    category: 'rock', emoji: '🎸', color: '#E8430A',
    date_start: daysFromNow(5), time_start: '15:00', time_end: '22:00',
    localizacao: { estado: 'SP', cidade: 'Campinas', bairro: 'Centro', endereco: 'Largo do Rosário, s/n', lat: -22.9064, lng: -47.0616 },
    tags: ['indie', 'rock nacional', 'live music', 'ao ar livre'],
    is_free: true, ticket_url: 'https://sympla.com.br', image_url: '',
    featured: true, status: 'published', source: 'editorial',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '2', slug: 'feira-gastronomica-mercado-largo',
    title: 'Feira Gastronômica do Mercado do Largo',
    description: 'Mais de 40 produtores locais reunidos em um único espaço com gastronomia regional, produtos orgânicos e artesanais. Entrada gratuita, consumação à parte. Ideal para um sábado em família.',
    category: 'gastronomia', emoji: '🍽️', color: '#B85C00',
    date_start: daysFromNow(2), time_start: '10:00', time_end: '18:00',
    localizacao: { estado: 'SP', cidade: 'Campinas', bairro: 'Centro', endereco: 'Mercado Municipal, Av. Benjamin Constant', lat: -22.9056, lng: -47.0617 },
    tags: ['feira', 'orgânicos', 'artesanal', 'família'],
    is_free: true, ticket_url: '', image_url: '',
    featured: true, status: 'published', source: 'editorial',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '3', slug: 'dia-parque-atividades-infantis-taquaral',
    title: 'Dia do Parque — Atividades Infantis e Família',
    description: 'Um domingo de diversão para toda a família: contação de histórias, oficinas de arte e brincadeiras tradicionais gratuitas no parque mais querido de Campinas.',
    category: 'infantil', emoji: '🎈', color: '#2E7D4F',
    date_start: daysFromNow(0), time_start: '09:00', time_end: '16:00',
    localizacao: { estado: 'SP', cidade: 'Campinas', bairro: 'Taquaral', endereco: 'Parque Portugal (Lagoa do Taquaral)', lat: -22.8820, lng: -47.0523 },
    tags: ['família', 'crianças', 'ao ar livre', 'gratuito'],
    is_free: true, ticket_url: '', image_url: '',
    featured: false, status: 'published', source: 'user',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '4', slug: 'corrida-noturna-paulinia-5k',
    title: 'Corrida Noturna Paulínia 5K',
    description: 'A corrida noturna mais aguardada da cidade! Percurso de 5km pelas ruas de Paulínia com iluminação especial e premiação simbólica. Inscrições gratuitas até o dia anterior.',
    category: 'esportes', emoji: '🏃', color: '#1A5C9E',
    date_start: daysFromNow(6), time_start: '19:30',
    localizacao: { estado: 'SP', cidade: 'Paulínia', bairro: 'Centro', endereco: 'Praça Central de Paulínia' },
    tags: ['corrida', '5K', 'noturna', 'esporte'],
    is_free: true, ticket_url: 'https://sympla.com.br', image_url: '',
    featured: false, status: 'published', source: 'user',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '5', slug: 'espetaculo-cartas-para-ninguem-teatro-rua',
    title: 'Espetáculo "Cartas para Ninguém" — Teatro de Rua',
    description: 'Performance teatral experimental ao ar livre sobre solidão e conexão humana. Duração de 55 minutos, sem reserva prévia, por ordem de chegada. Classificação livre.',
    category: 'teatro', emoji: '🎭', color: '#6B3FA0',
    date_start: daysFromNow(3), time_start: '19:00', time_end: '21:00',
    localizacao: { estado: 'SP', cidade: 'Campinas', bairro: 'Centro', endereco: 'Praça das Artes — Largo do Rosário' },
    tags: ['teatro', 'rua', 'experimental', 'artes cênicas'],
    is_free: true, ticket_url: '', image_url: '',
    featured: false, status: 'published', source: 'editorial',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '6', slug: 'mostra-curtas-brasileiros-cine-ar-livre',
    title: 'Mostra de Curtas Brasileiros — Cine ao Ar Livre',
    description: 'Seis curtas-metragens brasileiros selecionados do festival nacional, seguidos de bate-papo com os diretores. Inscrição gratuita via Sympla, vagas limitadas.',
    category: 'cultura', emoji: '🎬', color: '#4A7A3D',
    date_start: daysFromNow(7), time_start: '20:00',
    localizacao: { estado: 'SP', cidade: 'Campinas', bairro: 'Centro', endereco: 'SESC Campinas — Auditório' },
    tags: ['cinema', 'curtas', 'nacional', 'cultura'],
    is_free: true, ticket_url: 'https://sympla.com.br', image_url: '',
    featured: false, status: 'published', source: 'editorial',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '7', slug: 'meetup-devcampinas-ia-machine-learning',
    title: 'Meetup DevCampinas — IA e Machine Learning',
    description: 'Encontro mensal da comunidade de tecnologia de Campinas. Três palestras relâmpago sobre IA aplicada, mesa-redonda aberta e networking. Pizza e café inclusos.',
    category: 'tecnologia', emoji: '💻', color: '#1E5FA0',
    date_start: daysFromNow(4), time_start: '18:30', time_end: '21:00',
    localizacao: { estado: 'SP', cidade: 'Campinas', bairro: 'Cambuí', endereco: 'Hub Campinas — Estação Cultural, Av. Orosimbo Maia' },
    tags: ['tech', 'IA', 'networking', 'dev'],
    is_free: true, ticket_url: 'https://meetup.com', image_url: '',
    featured: false, status: 'published', source: 'user',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '8', slug: 'feira-vinil-midia-fisica-3-edicao',
    title: 'Feira de Vinil e Mídia Física — 3ª Edição',
    description: 'Mais de 80 expositores com LPs, CDs, fitas K7, revistas e raridades da cultura pop. Entrada gratuita, compras à parte. Um paraíso para colecionadores.',
    category: 'cultura', emoji: '💿', color: '#4A7A3D',
    date_start: daysFromNow(5), time_start: '10:00', time_end: '17:00',
    localizacao: { estado: 'SP', cidade: 'Campinas', bairro: 'Centro', endereco: 'Estação Cultura Campinas' },
    tags: ['vinil', 'colecionismo', 'cultura', 'música'],
    is_free: true, ticket_url: '', image_url: '',
    featured: false, status: 'published', source: 'user',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '9', slug: 'treino-funcional-coletivo-parque-sumare',
    title: 'Treino Funcional Coletivo no Parque',
    description: 'Treino funcional ao ar livre com professor voluntário toda semana. Todas as condições físicas são bem-vindas. Traga água e roupas confortáveis.',
    category: 'esportes', emoji: '💪', color: '#1A5C9E',
    date_start: daysFromNow(1), time_start: '07:00', time_end: '08:00',
    localizacao: { estado: 'SP', cidade: 'Sumaré', bairro: 'Centro', endereco: 'Parque Linear — Sumaré' },
    tags: ['fitness', 'ao ar livre', 'comunidade'],
    is_free: true, ticket_url: '', image_url: '',
    featured: false, status: 'published', source: 'user',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '10', slug: 'sarau-literario-vozes-interior-jundiai',
    title: 'Sarau Literário — Vozes do Interior',
    description: 'Sarau com poetas e escritores da região. Espaço aberto para leituras curtas (inscreva-se no local). Café e chá disponíveis durante o evento.',
    category: 'cultura', emoji: '📚', color: '#6B3FA0',
    date_start: daysFromNow(8), time_start: '18:00',
    localizacao: { estado: 'SP', cidade: 'Jundiaí', bairro: 'Centro', endereco: 'Biblioteca Municipal de Jundiaí' },
    tags: ['literatura', 'poesia', 'sarau', 'cultura'],
    is_free: true, ticket_url: '', image_url: '',
    featured: false, status: 'published', source: 'user',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '11', slug: 'show-acustico-mpb-indaiatuba',
    title: 'Show Acústico — Música Popular Brasileira',
    description: 'Tarde de MPB com três artistas locais no coreto histórico da Praça da Saudade. Evento familiar, ao ar livre, com espaço para crianças.',
    category: 'musica', emoji: '🎵', color: '#C41E5A',
    date_start: daysFromNow(2), time_start: '17:00',
    localizacao: { estado: 'SP', cidade: 'Indaiatuba', bairro: 'Centro', endereco: 'Praça da Saudade — Coreto Histórico' },
    tags: ['MPB', 'acústico', 'ao ar livre', 'família'],
    is_free: true, ticket_url: '', image_url: '',
    featured: false, status: 'published', source: 'user',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '12', slug: 'workshop-fotografia-urbana-campinas',
    title: 'Workshop Gratuito de Fotografia Urbana',
    description: 'Caminhada fotográfica pelo centro histórico com fotógrafo profissional. Vagas limitadas — inscreva-se com antecedência pelo link.',
    category: 'cultura', emoji: '📷', color: '#4A7A3D',
    date_start: daysFromNow(9), time_start: '09:00', time_end: '12:00',
    localizacao: { estado: 'SP', cidade: 'Campinas', bairro: 'Centro Histórico', endereco: 'Encontro: Catedral Metropolitana de Campinas' },
    tags: ['fotografia', 'workshop', 'arte', 'centro histórico'],
    is_free: true, ticket_url: 'https://sympla.com.br', image_url: '',
    featured: false, status: 'draft', source: 'editorial',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

// ── FILTER HELPERS ────────────────────────────────────────
export function filterEvents(events: Event[], filters: Partial<EventFilters>): Event[] {
  return events.filter(ev => {
    if (filters.city && ev.localizacao.cidade.toLowerCase() !== filters.city.toLowerCase()) return false
    if (filters.genre && ev.category !== filters.genre) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const hit = ev.title.toLowerCase().includes(q)
        || ev.description.toLowerCase().includes(q)
        || ev.tags.some(t => t.toLowerCase().includes(q))
        || ev.localizacao.cidade.toLowerCase().includes(q)
      if (!hit) return false
    }
    if (filters.period) {
      const date = new Date(ev.date_start)
      if (filters.period === 'hoje' && !isToday(date)) return false
      if (filters.period === 'fds') {
        const dow = date.getDay()
        if (dow !== 0 && dow !== 6) return false
      }
      if (filters.period === 'mes' && !isSameMonth(date, new Date())) return false
    }
    return true
  })
}

// ── DB ADAPTER (MOCK) ─────────────────────────────────────
// Substitua estas funções pelas suas queries reais
// Exemplo Supabase: const { data } = await supabase.from('events').select('*')

export async function getEvents(filters?: Partial<EventFilters>): Promise<Event[]> {
  // TODO: substituir por → await supabase.from('events').select('*')
  let events = MOCK_EVENTS.filter(e => e.status === 'published')
  if (filters) events = filterEvents(events, filters)
  return events
}

export async function getAllEventsAdmin(): Promise<Event[]> {
  // TODO: substituir por → await supabase.from('events').select('*').order('created_at', { ascending: false })
  return MOCK_EVENTS
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  // TODO: substituir por → await supabase.from('events').select('*').eq('slug', slug).single()
  return MOCK_EVENTS.find(e => e.slug === slug) ?? null
}

export async function getFeaturedEvents(): Promise<Event[]> {
  // TODO: substituir por → await supabase.from('events').select('*').eq('featured', true).eq('status', 'published')
  return MOCK_EVENTS.filter(e => e.featured && e.status === 'published')
}

export async function createEvent(data: EventFormData): Promise<Event> {
  // TODO: substituir por → await supabase.from('events').insert(data).select().single()
  const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const event: Event = {
    id: String(Date.now()),
    slug,
    title: data.title,
    description: data.description,
    category: data.category as Event['category'],
    emoji: CATEGORY_CONFIG[data.category as Category]?.emoji ?? '📅',
    color: CATEGORY_CONFIG[data.category as Category]?.color ?? '#1C1A16',
    date_start: data.date_start,
    date_end: data.date_end || undefined,
    time_start: data.time_start,
    time_end: data.time_end || undefined,
    localizacao: {
      estado: data.estado,
      cidade: data.cidade,
      bairro: data.bairro,
      endereco: data.endereco,
      lat: data.lat ? parseFloat(data.lat) : undefined,
      lng: data.lng ? parseFloat(data.lng) : undefined,
    },
    tags: data.tags,
    is_free: data.is_free,
    ticket_url: data.ticket_url,
    image_url: data.image_url,
    featured: data.featured,
    status: data.status,
    source: 'editorial',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  MOCK_EVENTS.push(event)
  return event
}

export async function updateEvent(id: string, data: Partial<EventFormData>): Promise<Event> {
  // TODO: substituir por → await supabase.from('events').update(data).eq('id', id).select().single()
  const idx = MOCK_EVENTS.findIndex(e => e.id === id)
  if (idx === -1) throw new Error('Event not found')
  const updated = { ...MOCK_EVENTS[idx], ...data, updated_at: new Date().toISOString() }
  MOCK_EVENTS[idx] = updated as Event
  return updated as Event
}

export async function deleteEvent(id: string): Promise<void> {
  // TODO: substituir por → await supabase.from('events').delete().eq('id', id)
  const idx = MOCK_EVENTS.findIndex(e => e.id === id)
  if (idx !== -1) MOCK_EVENTS.splice(idx, 1)
}

// ── CITIES ───────────────────────────────────────────────
export const CITIES = [
  { value: 'Campinas',   label: 'Campinas',   emoji: '🏙️' },
  { value: 'Paulínia',   label: 'Paulínia',   emoji: '🌳' },
  { value: 'Sumaré',     label: 'Sumaré',     emoji: '🏭' },
  { value: 'Indaiatuba', label: 'Indaiatuba', emoji: '🌻' },
  { value: 'Jundiaí',    label: 'Jundiaí',    emoji: '🍇' },
  { value: 'Valinhos',   label: 'Valinhos',   emoji: '🫒' },
  { value: 'Vinhedo',    label: 'Vinhedo',    emoji: '🌾' },
]
