'use client'
import { useState, KeyboardEvent } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { EventFormData, EventStatus, Category } from '@/types'
import { CATEGORY_CONFIG, CITIES } from '@/lib/db'
import { X } from 'lucide-react'

function Field({ label, required, error, hint, children }: { label: string; required?: boolean; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[10px] font-mono uppercase tracking-widest mb-2 text-muted">
        {label}{required && <span className="text-accent ml-1">*</span>}
      </label>
      {children}
      {error && <div className="text-xs mt-1.5 text-red-400">{error}</div>}
      {hint && !error && <div className="text-xs mt-1.5 text-muted/70">{hint}</div>}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="text-[10px] font-mono uppercase tracking-widest pt-6 pb-3 mb-4 border-t border-border/50 text-muted">{children}</div>
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
  stay22_map: '', featured: false, status: 'draft',
}

export default function EventForm({ initial = {}, eventId, mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<EventFormData>({ ...EMPTY, ...initial })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({})

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB')
      return
    }

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao enviar imagem')
      }

      const data = await res.json()
      set('image_url', data.url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setUploadingImage(false)
    }
  }

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
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Erro ao salvar')
      }
      setSaved(true)
      setTimeout(() => { router.push('/admin/eventos'); router.refresh() }, 900)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar o evento. Tente novamente.'
      alert(message)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = (err?: string) => `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-background text-primary placeholder:text-muted/50 ${err ? 'border-red-400/50 focus:border-red-400 focus:ring-1 focus:ring-red-400/20 shadow-[0_0_0_2px_rgba(248,113,113,0.1)]' : 'border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/20'}`

  const catPreview = form.category ? CATEGORY_CONFIG[form.category as Category] : null

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Form - 2/3 */}
      <div className="lg:col-span-2 rounded-2xl border border-border p-8 bg-surface shadow-sm">

        {/* ── INFORMAÇÕES BÁSICAS ── */}
        <SectionLabel>Informações básicas</SectionLabel>

        <Field label="Título do evento" required error={errors.title}>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Festival Indie Campinas — Edição Inverno" className={inputCls(errors.title)} />
        </Field>

        <Field label="Descrição" required hint="Descreva o evento com detalhes. Máx. 600 caracteres.">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Descreva o evento..."
            className={`${inputCls()} resize-y leading-relaxed`} />
          <div className="text-xs mt-2 text-right text-muted">{form.description.length}/600</div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoria" required error={errors.category}>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls(errors.category)}>
              <option value="">Selecione...</option>
              {(Object.entries(CATEGORY_CONFIG) as [Category, { label: string; emoji: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => set('status', e.target.value as EventStatus)} className={inputCls()}>
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
            <input type="date" value={form.date_start} onChange={e => set('date_start', e.target.value)} className={inputCls(errors.date_start)} />
          </Field>
          <Field label="Data de término" hint="Opcional, para eventos de múltiplos dias">
            <input type="date" value={form.date_end} onChange={e => set('date_end', e.target.value)} className={inputCls()} />
          </Field>
          <Field label="Horário de início" required error={errors.time_start}>
            <input type="time" value={form.time_start} onChange={e => set('time_start', e.target.value)} className={inputCls(errors.time_start)} />
          </Field>
          <Field label="Horário de término">
            <input type="time" value={form.time_end} onChange={e => set('time_end', e.target.value)} className={inputCls()} />
          </Field>
        </div>

        {/* ── LOCALIZAÇÃO ── */}
        <SectionLabel>Localização</SectionLabel>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Estado">
            <input value={form.estado} onChange={e => set('estado', e.target.value)} placeholder="SP" className={inputCls()} maxLength={2} />
          </Field>
          <Field label="Cidade" required error={errors.cidade}>
            <select value={form.cidade} onChange={e => set('cidade', e.target.value)} className={inputCls(errors.cidade)}>
              <option value="">Selecione a cidade...</option>
              {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              <option value="Outra">Outra cidade</option>
            </select>
          </Field>
        </div>

        <Field label="Bairro / Zona" hint="Opcional">
          <input value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Ex: Centro Histórico" className={inputCls()} />
        </Field>

        <Field label="Endereço completo" required error={errors.endereco}>
          <input value={form.endereco} onChange={e => set('endereco', e.target.value)} placeholder="Ex: Largo do Rosário, s/n — Campinas, SP" className={inputCls(errors.endereco)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude" hint="Opcional — para link do Google Maps">
            <input value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="-22.9064" className={inputCls()} />
          </Field>
          <Field label="Longitude">
            <input value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="-47.0616" className={inputCls()} />
          </Field>
        </div>

        {/* ── TAGS ── */}
        <Field label="Mapa Stay22 (Iframe)" hint="Cole aqui o código iframe do mapa Stay22">
          <textarea value={form.stay22_map} onChange={e => set('stay22_map', e.target.value)} rows={3} placeholder='<iframe id="stay22-widget" src="..."></iframe>' className={`${inputCls()} resize-y leading-relaxed font-mono text-xs`} />
        </Field>

        <SectionLabel>Tags</SectionLabel>

        <Field label="Tags" hint="Pressione Enter ou vírgula para adicionar. Máx. 8 tags.">
          <div className="flex flex-wrap gap-2 items-center p-2 rounded-xl border border-border min-h-[48px] cursor-text bg-background focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all"
            onClick={() => document.getElementById('tag-input')?.focus()}>
            {form.tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-surface border border-border text-primary font-medium">
                {t}
                <button type="button" onClick={() => removeTag(t)} className="ml-0.5 transition-colors text-muted hover:text-red-400"><X size={12} /></button>
              </span>
            ))}
            <input id="tag-input" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={onTagKey}
              placeholder={form.tags.length === 0 ? 'rock nacional, ao ar livre...' : ''}
              className="border-none outline-none bg-transparent text-sm flex-1 min-w-[120px] text-primary placeholder:text-muted/50 px-2" />
          </div>
        </Field>

        {/* ── LINK E MÍDIA ── */}
        <SectionLabel>Link e mídia</SectionLabel>

        <Field label="Imagem de capa" hint="Faça upload de uma imagem (JPG, PNG, WebP). Proporção ideal: 16:9">
          {form.image_url ? (
            <div className="relative rounded-xl overflow-hidden border border-border h-40 group">
              <img src={form.image_url} alt="Capa do evento" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button type="button" onClick={() => set('image_url', '')} className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg">Remover imagem</button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" title="Clique ou arraste a imagem" />
              <div className={`w-full h-40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted transition-colors ${uploadingImage ? 'bg-white/5 border-accent' : 'hover:border-accent hover:bg-white/5'}`}>
                {uploadingImage ? (
                  <div className="flex items-center gap-2 font-mono text-sm text-accent">
                    <span className="animate-spin text-xl">⏳</span> Enviando...
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl mb-2">📸</div>
                    <div className="text-sm font-medium">Clique ou arraste uma imagem</div>
                    <div className="text-xs mt-1 opacity-70">Máx. 5MB</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Field>

        <Field label="Link de inscrição / ingressos" hint="Sympla, Eventbrite, site do evento, etc.">
          <input value={form.ticket_url} onChange={e => set('ticket_url', e.target.value)} placeholder="https://sympla.com.br/..." className={inputCls()} />
        </Field>

        {/* ── OPÇÕES ── */}
        <SectionLabel>Opções</SectionLabel>

        <div className="flex flex-col gap-4">
          {[
            { key: 'is_free', label: 'Entrada gratuita', desc: 'Marque se não há cobrança de ingresso' },
            { key: 'featured', label: 'Destaque na home', desc: 'Exibir como evento em destaque na página inicial' },
          ].map(opt => (
            <label key={opt.key} className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={!!form[opt.key as keyof EventFormData]}
                onChange={e => set(opt.key as keyof EventFormData, e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border bg-background text-accent focus:ring-accent/50 cursor-pointer" />
              <div>
                <div className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{opt.label}</div>
                <div className="text-xs text-muted/80">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Sidebar - 1/3 */}
      <div className="space-y-6">
        {/* Preview card */}
        <div className="rounded-2xl border border-border overflow-hidden bg-surface shadow-sm relative group hover:shadow-accent/5 hover:border-accent/30 transition-all">
          <div className="px-5 py-3 border-b border-border text-[10px] uppercase tracking-widest font-mono text-muted bg-white/5">
            Preview do card
          </div>
          <div className="relative aspect-[4/3] bg-background overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
            {form.image_url ? (
              <img src={form.image_url} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl" style={{ backgroundColor: catPreview ? `${catPreview.color}20` : 'var(--color-surface)' }}>{catPreview?.emoji ?? '📅'}</div>
            )}
            
            {catPreview && <span className="absolute top-3 left-3 z-20 text-white px-2 py-1 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider">{catPreview.label}</span>}
            {form.is_free && <span className="absolute top-3 right-3 z-20 px-2 py-1 rounded bg-black/50 backdrop-blur-md border border-white/10 text-accent font-mono text-[10px] uppercase tracking-wider">GRÁTIS</span>}
          </div>
          <div className="p-5 flex flex-col relative z-20 -mt-8 pt-0">
            <p className="text-[10px] uppercase tracking-wider text-accent font-bold mb-2">
              {form.date_start ? new Date(form.date_start).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }) : 'DATA N/D'}
              {form.time_start ? ` · ${form.time_start}` : ''}
            </p>
            <div className="font-display font-bold text-lg leading-tight mb-3 text-primary line-clamp-2">
              {form.title || 'Título do evento'}
            </div>
            <div className="text-sm text-muted/70 flex flex-col gap-1">
              <span className="truncate">{form.endereco || 'Endereço do local'}</span>
              <span>{form.cidade || 'Cidade'}</span>
            </div>
            {form.tags.length > 0 && (
              <div className="flex gap-1.5 mt-4 flex-wrap">
                {form.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/5 text-muted uppercase tracking-wider">{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-2xl border border-border p-5 space-y-3 bg-surface shadow-sm">
          <div className="text-[10px] uppercase tracking-widest mb-4 font-mono text-muted border-b border-border/50 pb-2">Ações</div>
          <button onClick={() => submit('published')} disabled={saving}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 bg-accent hover:bg-accent-hover shadow-lg shadow-accent/20">
            {saving ? 'Salvando...' : saved ? '✓ Salvo!' : '✦ Publicar evento'}
          </button>
          <button onClick={() => submit('draft')} disabled={saving}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all bg-background border border-border text-primary hover:border-muted/50 hover:bg-white/5">
            Salvar como rascunho
          </button>
          <button onClick={() => router.back()}
            className="w-full py-3 rounded-xl text-sm transition-colors text-muted hover:text-primary">
            Cancelar
          </button>
        </div>

        {/* SEO hint */}
        <div className="rounded-2xl border border-border p-5 bg-white/5">
          <div className="text-[10px] uppercase tracking-widest mb-2 font-mono text-muted">URL gerada</div>
          <div className="text-xs break-all font-mono text-muted/70">
            /eventos/<span className="text-accent">
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
