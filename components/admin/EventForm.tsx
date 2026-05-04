'use client'
import { useState, KeyboardEvent } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { EventFormData, EventStatus, Category } from '@/types'
import { CATEGORY_CONFIG, CITIES } from '@/lib/db'
import { X } from 'lucide-react'

function Field({ label, required, error, hint, children }: { label: string; required?: boolean; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>
        {label}{required && <span style={{ color: 'var(--accent)' }}> *</span>}
      </label>
      {children}
      {error && <div className="text-xs mt-1" style={{ color: '#e24b4a' }}>{error}</div>}
      {hint && !error && <div className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>{hint}</div>}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="text-xs uppercase tracking-widest pt-5 pb-2 mb-2 border-t" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)', borderColor: 'var(--border)' }}>{children}</div>
}

interface Props {
  initial?: Partial<EventFormData>
  eventId?: string
  mode: 'create' | 'edit'
}

const EMPTY: EventFormData = {
  title: '', description: '', category: '', emoji: '', date_start: '', date_end: '',
  time_start: '', time_end: '', estado: 'SP', cidade: '', bairro: '', endereco: '',
  lat: '', lng: '', tags: [], is_free: true, ticket_url: '', image_url: '',
  featured: false, status: 'draft',
}

export default function EventForm({ initial = {}, eventId, mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<EventFormData>({ ...EMPTY, ...initial })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({})

  const set = (k: keyof EventFormData, v: unknown) => {
    setForm(prev => ({ ...prev, [k]: v }))
    setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !form.tags.includes(t) && form.tags.length < 8) {
      set('tags', [...form.tags, t])
      setTagInput('')
    }
  }
  const removeTag = (t: string) => set('tags', form.tags.filter(x => x !== t))
  const onTagKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }

  const validate = () => {
    const e: Partial<Record<keyof EventFormData, string>> = {}
    if (!form.title)      e.title      = 'Título é obrigatório'
    if (!form.category)   e.category   = 'Categoria é obrigatória'
    if (!form.date_start) e.date_start = 'Data de início é obrigatória'
    if (!form.time_start) e.time_start = 'Horário de início é obrigatório'
    if (!form.cidade)     e.cidade     = 'Cidade é obrigatória'
    if (!form.endereco)   e.endereco   = 'Endereço é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (status: EventStatus) => {
    if (!validate()) return
    setSaving(true)
    const payload = { ...form, status }
    try {
      const url = mode === 'edit' ? `/api/admin/events/${eventId}` : '/api/admin/events'
      const method = mode === 'edit' ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Erro ao salvar')
      setSaved(true)
      setTimeout(() => { router.push('/admin/eventos'); router.refresh() }, 900)
    } catch {
      alert('Erro ao salvar o evento. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = (err?: string) => `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${err ? 'border-red-400' : ''}`
  const inputStyle = (err?: string): CSSProperties => ({ background: '#fff', borderColor: err ? '#e24b4a' : 'var(--border)', fontFamily: 'DM Sans,sans-serif', boxShadow: err ? '0 0 0 2px rgba(226,75,74,0.1)' : '' })

  const catPreview = form.category ? CATEGORY_CONFIG[form.category as Category] : null

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Form - 2/3 */}
      <div className="lg:col-span-2 rounded-xl border p-6" style={{ background: '#fff', borderColor: 'var(--border)' }}>

        {/* ── INFORMAÇÕES BÁSICAS ── */}
        <SectionLabel>Informações básicas</SectionLabel>

        <Field label="Título do evento" required error={errors.title}>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Festival Indie Campinas — Edição Inverno" className={inputCls(errors.title)} style={inputStyle(errors.title)} />
        </Field>

        <Field label="Descrição" required hint="Descreva o evento com detalhes. Máx. 600 caracteres.">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Descreva o evento..."
            className={inputCls()} style={{ ...inputStyle(), resize: 'vertical', lineHeight: 1.6 }} />
          <div className="text-xs mt-1 text-right" style={{ color: 'var(--ink-muted)' }}>{form.description.length}/600</div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoria" required error={errors.category}>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls(errors.category)} style={inputStyle(errors.category)}>
              <option value="">Selecione...</option>
              {(Object.entries(CATEGORY_CONFIG) as [Category, { label: string; emoji: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => set('status', e.target.value as EventStatus)} className={inputCls()} style={inputStyle()}>
              <option value="draft">Rascunho</option>
              <option value="review">Em revisão</option>
              <option value="published">Publicado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </Field>
        </div>

        {/* ── DATA E HORA ── */}
        <SectionLabel>Data e horário</SectionLabel>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Data de início" required error={errors.date_start}>
            <input type="date" value={form.date_start} onChange={e => set('date_start', e.target.value)} className={inputCls(errors.date_start)} style={inputStyle(errors.date_start)} />
          </Field>
          <Field label="Data de término" hint="Opcional, para eventos de múltiplos dias">
            <input type="date" value={form.date_end} onChange={e => set('date_end', e.target.value)} className={inputCls()} style={inputStyle()} />
          </Field>
          <Field label="Horário de início" required error={errors.time_start}>
            <input type="time" value={form.time_start} onChange={e => set('time_start', e.target.value)} className={inputCls(errors.time_start)} style={inputStyle(errors.time_start)} />
          </Field>
          <Field label="Horário de término">
            <input type="time" value={form.time_end} onChange={e => set('time_end', e.target.value)} className={inputCls()} style={inputStyle()} />
          </Field>
        </div>

        {/* ── LOCALIZAÇÃO ── */}
        <SectionLabel>Localização</SectionLabel>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Estado">
            <input value={form.estado} onChange={e => set('estado', e.target.value)} placeholder="SP" className={inputCls()} style={inputStyle()} maxLength={2} />
          </Field>
          <Field label="Cidade" required error={errors.cidade}>
            <select value={form.cidade} onChange={e => set('cidade', e.target.value)} className={inputCls(errors.cidade)} style={inputStyle(errors.cidade)}>
              <option value="">Selecione a cidade...</option>
              {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              <option value="Outra">Outra cidade</option>
            </select>
          </Field>
        </div>

        <Field label="Bairro / Zona" hint="Opcional">
          <input value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Ex: Centro Histórico" className={inputCls()} style={inputStyle()} />
        </Field>

        <Field label="Endereço completo" required error={errors.endereco}>
          <input value={form.endereco} onChange={e => set('endereco', e.target.value)} placeholder="Ex: Largo do Rosário, s/n — Campinas, SP" className={inputCls(errors.endereco)} style={inputStyle(errors.endereco)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude" hint="Opcional — para link do Google Maps">
            <input value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="-22.9064" className={inputCls()} style={inputStyle()} />
          </Field>
          <Field label="Longitude">
            <input value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="-47.0616" className={inputCls()} style={inputStyle()} />
          </Field>
        </div>

        {/* ── TAGS ── */}
        <SectionLabel>Tags</SectionLabel>

        <Field label="Tags" hint="Pressione Enter ou vírgula para adicionar. Máx. 8 tags.">
          <div className="flex flex-wrap gap-2 items-center p-2 rounded-lg border min-h-11 cursor-text" style={{ background: '#fff', borderColor: 'var(--border)' }}
            onClick={() => document.getElementById('tag-input')?.focus()}>
            {form.tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink-soft)' }}>
                {t}
                <button type="button" onClick={() => removeTag(t)} className="ml-0.5 transition-colors hover:text-red-500" style={{ color: 'var(--ink-muted)' }}><X size={10} /></button>
              </span>
            ))}
            <input id="tag-input" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={onTagKey}
              placeholder={form.tags.length === 0 ? 'rock nacional, ao ar livre...' : ''}
              className="border-none outline-none bg-transparent text-sm flex-1 min-w-20" style={{ fontFamily: 'DM Sans,sans-serif', color: 'var(--ink)' }} />
          </div>
        </Field>

        {/* ── LINK E MÍDIA ── */}
        <SectionLabel>Link e mídia</SectionLabel>

        <Field label="URL da imagem de capa" hint="Cole a URL de uma imagem (JPG, PNG, WebP). Proporção ideal: 16:9">
          <input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." className={inputCls()} style={inputStyle()} />
        </Field>

        <Field label="Link de inscrição / ingressos" hint="Sympla, Eventbrite, site do evento, etc.">
          <input value={form.ticket_url} onChange={e => set('ticket_url', e.target.value)} placeholder="https://sympla.com.br/..." className={inputCls()} style={inputStyle()} />
        </Field>

        {/* ── OPÇÕES ── */}
        <SectionLabel>Opções</SectionLabel>

        <div className="flex flex-col gap-3">
          {[
            { key: 'is_free', label: 'Entrada gratuita', desc: 'Marque se não há cobrança de ingresso' },
            { key: 'featured', label: 'Destaque na home', desc: 'Exibir como evento em destaque na página inicial' },
          ].map(opt => (
            <label key={opt.key} className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={!!form[opt.key as keyof EventFormData]}
                onChange={e => set(opt.key as keyof EventFormData, e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-orange-600" />
              <div>
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Sidebar - 1/3 */}
      <div className="space-y-4">
        {/* Preview card */}
        <div className="rounded-xl border overflow-hidden" style={{ background: '#fff', borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b text-xs uppercase tracking-widest" style={{ borderColor: 'var(--border)', fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)', background: 'var(--surface)' }}>
            Preview do card
          </div>
          <div className="relative" style={{ aspectRatio: '16/9', background: catPreview ? `linear-gradient(135deg, ${catPreview.color}18, ${catPreview.color}45)` : 'var(--surface)' }}>
            <div className="w-full h-full flex items-center justify-center text-5xl">{catPreview?.emoji ?? '📅'}</div>
            {catPreview && <span className="absolute top-2 left-2 text-white px-2 py-0.5 rounded text-xs" style={{ background: catPreview.color, fontFamily: 'DM Mono,monospace', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.06em' }}>{catPreview.label}</span>}
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(28,26,22,0.75)', color: 'var(--accent-warm)', fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>GRÁTIS</span>
          </div>
          <div className="p-4">
            <div className="text-xs mb-1" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--accent)' }}>
              {form.date_start ? new Date(form.date_start).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Data não definida'}
              {form.time_start ? ` · ${form.time_start}` : ''}
            </div>
            <div className="font-bold leading-snug mb-1.5" style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.95rem' }}>
              {form.title || 'Título do evento'}
            </div>
            <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>{form.endereco || 'Endereço do local'}</div>
            {form.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {form.tags.slice(0, 2).map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--ink-soft)', fontSize: '0.62rem' }}>{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-xl border p-4 space-y-3" style={{ background: '#fff', borderColor: 'var(--border)' }}>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>Ações</div>
          <button onClick={() => submit('published')} disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-60"
            style={{ background: 'var(--accent)' }}>
            {saving ? 'Salvando...' : saved ? '✓ Salvo!' : '✦ Publicar evento'}
          </button>
          <button onClick={() => submit('draft')} disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--ink-soft)' }}>
            Salvar como rascunho
          </button>
          <button onClick={() => router.back()}
            className="w-full py-2.5 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--ink-muted)' }}>
            Cancelar
          </button>
        </div>

        {/* SEO hint */}
        <div className="rounded-xl border p-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>URL gerada</div>
          <div className="text-xs break-all" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-soft)' }}>
            /eventos/<span style={{ color: 'var(--accent)' }}>
              {form.title
                ? form.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50)
                : 'slug-do-evento'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
