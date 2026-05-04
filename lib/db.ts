import { createClient } from '@supabase/supabase-js'
import { isToday, isWeekend, isSameMonth } from 'date-fns'
import { Event, EventFilters, EventFormData, Category, Localizacao } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(
  supabaseUrl,
  typeof window === 'undefined' && supabaseServiceRoleKey ? supabaseServiceRoleKey : supabaseAnonKey
)

function assertServiceRoleForAdminWrite() {
  if (typeof window === 'undefined' && !supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada no ambiente de servidor')
  }
}

type EventRow = Partial<Event> & Partial<Localizacao> & {
  estado?: string
  cidade?: string
  bairro?: string
  endereco?: string
  lat?: number
  lng?: number
}

function normalizeEvent(row: EventRow): Event {
  return {
    ...row,
    localizacao: {
      estado: row.estado ?? '',
      cidade: row.cidade ?? '',
      bairro: row.bairro ?? undefined,
      endereco: row.endereco ?? '',
      lat: row.lat ?? undefined,
      lng: row.lng ?? undefined,
    },
  } as Event
}

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

export const CITIES = [
  { value: 'Campinas',   label: 'Campinas',   emoji: '🏙️' },
  { value: 'Paulínia',   label: 'Paulínia',   emoji: '🌳' },
  { value: 'Sumaré',     label: 'Sumaré',     emoji: '🏭' },
  { value: 'Indaiatuba', label: 'Indaiatuba', emoji: '🌻' },
  { value: 'Jundiaí',    label: 'Jundiaí',    emoji: '🍇' },
  { value: 'Valinhos',   label: 'Valinhos',   emoji: '🫒' },
  { value: 'Vinhedo',    label: 'Vinhedo',    emoji: '🌾' },
]

// ── HELPER DE PERÍODO ───────────────────────────────────────
export function filterEvents(events: Event[], filters: Partial<EventFilters>): Event[] {
  return events.filter(ev => {
    if (!filters.period) return true
    const date = new Date(ev.date_start)
    if (filters.period === 'hoje') return isToday(date)
    if (filters.period === 'fds')  return date.getDay() === 0 || date.getDay() === 6
    if (filters.period === 'mes')  return isSameMonth(date, new Date())
    return true
  })
}

// ── SLUG ────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ── FUNÇÕES DO BANCO ────────────────────────────────────────

export async function getEvents(filters?: Partial<EventFilters>): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('date_start', { ascending: true })

  if (filters?.city)   query = query.eq('cidade', filters.city)
  if (filters?.genre)  query = query.eq('category', filters.genre)
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`)

  const { data, error } = await query
  if (error) { console.error('getEvents error:', error); return [] }

  let events = ((data as EventRow[]) ?? []).map(normalizeEvent)
  if (filters?.period) events = filterEvents(events, { period: filters.period })
  return events
}

export async function getAllEventsAdmin(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, slug, title, category, date_start, status, featured, source, cidade, estado, bairro, endereco, lat, lng, created_at')
    .order('created_at', { ascending: false })

  if (error) { console.error('getAllEventsAdmin error:', error); return [] }
  return ((data as EventRow[]) ?? []).map(normalizeEvent)
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return normalizeEvent(data)
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return normalizeEvent(data)
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('featured', true)
    .eq('status', 'published')
    .order('date_start', { ascending: true })

  if (error) { console.error('getFeaturedEvents error:', error); return [] }
  return ((data as EventRow[]) ?? []).map(normalizeEvent)
}

export async function createEvent(data: EventFormData): Promise<Event> {
  assertServiceRoleForAdminWrite()
  const slug = slugify(data.title) + '-' + Date.now()
  const cat  = CATEGORY_CONFIG[data.category as Category]

  const row = {
    slug,
    title:       data.title,
    description: data.description,
    category:    data.category,
    emoji:       cat?.emoji ?? '📅',
    color:       cat?.color ?? '#1C1A16',
    date_start:  data.date_start,
    date_end:    data.date_end   || null,
    time_start:  data.time_start,
    time_end:    data.time_end   || null,
    estado:      data.estado,
    cidade:      data.cidade,
    bairro:      data.bairro     || null,
    endereco:    data.endereco,
    lat:         data.lat ? parseFloat(data.lat) : null,
    lng:         data.lng ? parseFloat(data.lng) : null,
    tags:        data.tags,
    is_free:     data.is_free,
    ticket_url:  data.ticket_url || null,
    image_url:   data.image_url  || null,
    featured:    data.featured,
    status:      data.status,
    source:      'editorial',
    localizacao: {
      estado: data.estado,
      cidade: data.cidade,
      bairro: data.bairro || null,
      endereco: data.endereco,
      lat: data.lat ? parseFloat(data.lat) : null,
      lng: data.lng ? parseFloat(data.lng) : null,
    },
  }

  const { data: created, error } = await supabase
    .from('events')
    .insert(row)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return normalizeEvent(created as EventRow)
}

export async function updateEvent(id: string, data: Partial<EventFormData>): Promise<Event> {
  assertServiceRoleForAdminWrite()
  const payload: Record<string, unknown> = { ...data, updated_at: new Date().toISOString() }

  const { data: updated, error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return normalizeEvent(updated as EventRow)
}

export async function deleteEvent(id: string): Promise<void> {
  assertServiceRoleForAdminWrite()
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
