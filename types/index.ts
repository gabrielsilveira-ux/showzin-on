// ============================================================
// EVENTOSLIVRES — Types
// Substitua os campos de DB pela sua implementação (Supabase, Prisma, etc.)
// ============================================================

export type EventStatus = 'published' | 'draft' | 'review' | 'rejected'
export type EventSource = 'editorial' | 'user'
export type Period     = 'hoje' | 'fds' | 'mes' | ''

export type Category =
  | 'rock'
  | 'gastronomia'
  | 'infantil'
  | 'esportes'
  | 'teatro'
  | 'musica'
  | 'cultura'
  | 'tecnologia'

export interface Localizacao {
  estado:   string
  cidade:   string
  bairro?:  string
  endereco: string
  lat?:     number
  lng?:     number
}

export interface Event {
  id:          string
  slug:        string
  title:       string
  description: string
  category:    Category
  emoji:       string
  color:       string          // hex para identidade visual
  date_start:  string          // ISO string
  date_end?:   string
  time_start:  string          // e.g. "19:30"
  time_end?:   string
  localizacao: Localizacao
  tags:        string[]
  is_free:     boolean
  ticket_url?: string          // link de inscrição/ingresso
  image_url?:  string
  stay22_map?: string          // Iframe do mapa Stay22
  featured:    boolean
  status:      EventStatus
  source:      EventSource
  author_id?:  string
  created_at:  string
  updated_at:  string
}

export interface EventFilters {
  city:    string
  genre:   Category | ''
  period:  Period
  search:  string
}

// ── Admin ────────────────────────────────────────────────
export interface AdminUser {
  id:    string
  name:  string
  email: string
  role:  'admin' | 'editor' | 'curator'
}

export interface EventFormData {
  title:       string
  description: string
  category:    Category | ''
  emoji:       string
  date_start:  string
  date_end:    string
  time_start:  string
  time_end:    string
  estado:      string
  cidade:      string
  bairro:      string
  endereco:    string
  lat:         string
  lng:         string
  tags:        string[]
  is_free:     boolean
  ticket_url:  string
  image_url:   string
  stay22_map:  string
  featured:    boolean
  status:      EventStatus
}

// ── DB adapter (implemente aqui) ────────────────────────
// Quando conectar Supabase/Prisma, substitua as funções em lib/db.ts
export interface DBAdapter {
  getEvents:    (filters?: Partial<EventFilters>) => Promise<Event[]>
  getEventBySlug: (slug: string) => Promise<Event | null>
  createEvent:  (data: EventFormData) => Promise<Event>
  updateEvent:  (id: string, data: Partial<EventFormData>) => Promise<Event>
  deleteEvent:  (id: string) => Promise<void>
  getFeatured:  () => Promise<Event[]>
}
