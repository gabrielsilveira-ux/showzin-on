import { createClient } from '@supabase/supabase-js'
import { isToday, isWeekend, isSameMonth } from 'date-fns'
import { Event, EventFilters, EventFormData, Category } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

  let events = (data as Event[]) ?? []
  if (filters?.period) events = filterEvents(events, { period: filters.period })
  return events
}

export async function getAllEventsAdmin(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) { console.error('getAllEventsAdmin error:', error); return [] }
  return (data as Event[]) ?? []
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as Event
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('featured', true)
    .eq('status', 'published')
    .order('date_start', { ascending: true })

  if (error) { console.error('getFeaturedEvents error:', error); return [] }
  return (data as Event[]) ?? []
}

export async function createEvent(data: EventFormData): Promise<Event> {
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
  }

  const { data: created, error } = await supabase
    .from('events')
    .insert(row)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return created as Event
}

export async function updateEvent(id: string, data: Partial<EventFormData>): Promise<Event> {
  const { data: updated, error } = await supabase
    .from('events')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return updated as Event
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}