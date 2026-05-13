import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getEventBySlug, getEvents, CATEGORY_CONFIG } from '@/lib/db'
import { formatEventDate, formatFullDate } from '@/lib/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EventCard from '@/components/events/EventCard'
import { MapPin, Clock, Calendar, Tag, ExternalLink, ArrowLeft, Share2 } from 'lucide-react'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Evento não encontrado' }
  return {
    title: event.title,
    description: event.description.slice(0, 155),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 155),
      type: 'article',
    },
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const cat = CATEGORY_CONFIG[event.category]
  const allEvents = await getEvents({ genre: event.category })
  const related = allEvents.filter(e => e.id !== event.id).slice(0, 3)

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-6 pb-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors hover:text-orange-600" style={{ color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>
            <ArrowLeft size={14} /> Voltar para eventos
          </Link>
        </div>

        {/* Hero image / cover */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 mb-8">
          <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16/6', background: `linear-gradient(135deg, ${event.color}25, ${event.color}60)` }}>
            <div className="absolute inset-0 flex items-center justify-center text-9xl">{event.emoji}</div>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,26,22,0.5) 0%, transparent 60%)' }} />
            {/* Category + Free badge */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded text-white text-xs font-medium" style={{ background: event.color, fontFamily: 'DM Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cat.label}</span>
              <span className="px-3 py-1 rounded text-xs font-medium" style={{ background: 'rgba(28,26,22,0.75)', color: 'var(--accent-warm)', fontFamily: 'DM Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.06em', backdropFilter: 'blur(4px)' }}>GRÁTIS</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Main */}
            <div className="md:col-span-2">
              <h1 className="mb-4 leading-tight" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
                {event.title}
              </h1>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--ink-soft)', fontWeight: 300, lineHeight: 1.8 }}>
                {event.description}
              </p>

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-1.5 mb-3 text-xs uppercase tracking-widest" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>
                    <Tag size={12} /> Tags
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {event.tags.map(t => (
                      <span key={t} className="px-3 py-1 rounded text-sm" style={{ background: 'var(--surface)', color: 'var(--ink-soft)', border: '1px solid var(--border)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex gap-3 flex-wrap">
                {event.ticket_url && (
                  <a href={event.ticket_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ background: 'var(--accent)' }}>
                    <ExternalLink size={15} /> Inscrever-se / Ingressos
                  </a>
                )}
                <button className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--ink-soft)' }}>
                  <Share2 size={15} /> Compartilhar
                </button>
                <Link href={`/?city=${event.localizacao.cidade}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--ink-soft)' }}>
                  <MapPin size={15} /> Mais em {event.localizacao.cidade}
                </Link>
              </div>

              {/* Stay22 Map */}
              {event.stay22_map && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display',serif" }}>
                    <MapPin size={20} style={{ color: 'var(--accent)' }} />
                    Hospedagem próxima ao evento
                  </h3>
                  <div className="rounded-xl overflow-hidden border w-full" style={{ borderColor: 'var(--border)' }} dangerouslySetInnerHTML={{ __html: event.stay22_map }} />
                </div>
              )}
            </div>

            {/* Sidebar info card */}
            <div>
              <div className="rounded-xl p-5 border sticky top-24" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="space-y-4">
                  <InfoRow icon={<Calendar size={15} />} label="Data">
                    <span className="font-medium">{formatFullDate(event.date_start)}</span>
                  </InfoRow>
                  <InfoRow icon={<Clock size={15} />} label="Horário">
                    <span className="font-medium">{event.time_start}{event.time_end ? ` às ${event.time_end}` : ''}</span>
                  </InfoRow>
                  <InfoRow icon={<MapPin size={15} />} label="Local">
                    <span className="font-medium">{event.localizacao.endereco}</span>
                    {event.localizacao.bairro && <span className="block text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>{event.localizacao.bairro}</span>}
                  </InfoRow>
                  <InfoRow icon={<span>🏙️</span>} label="Cidade">
                    <span className="font-medium">{event.localizacao.cidade}, {event.localizacao.estado}</span>
                  </InfoRow>
                  {event.is_free && (
                    <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="text-xs text-center py-2 rounded font-medium" style={{ background: '#dcfce7', color: '#166534', fontFamily: 'DM Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>✓ Entrada Gratuita</div>
                    </div>
                  )}
                </div>

                {/* Map placeholder */}
                {event.localizacao.lat && (
                  <a href={`https://maps.google.com/?q=${event.localizacao.lat},${event.localizacao.lng}`} target="_blank" rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ background: 'var(--ink)', color: '#fff' }}>
                    <MapPin size={14} /> Ver no Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Related events */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2.5" style={{ fontFamily: "'Playfair Display',serif" }}>
                <span className="w-5 h-0.5 inline-block" style={{ background: 'var(--accent)' }} />
                Eventos relacionados em {cat.label}
              </h2>
              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {related.map(ev => <EventCard key={ev.id} event={ev} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>
        {icon} {label}
      </div>
      <div className="text-sm" style={{ color: 'var(--ink)' }}>{children}</div>
    </div>
  )
}
