import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Image from 'next/image'
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
      <Suspense><Header /></Suspense>
      <main>
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-6 pb-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors hover:text-orange-600" style={{ color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>
            <ArrowLeft size={14} /> Voltar para eventos
          </Link>
        </div>

        {/* Hero Banner Novo */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 mb-8 mt-4">
          <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl" style={{ background: '#1c1a17', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            {/* Informações na Esquerda */}
            <div className="p-8 md:p-10 md:w-[50%] flex flex-col justify-center">
              <h1 className="mb-6 uppercase leading-tight tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#ffffff' }}>
                {event.title}
              </h1>
              
              <div className="space-y-4 mb-8 text-sm font-medium" style={{ fontFamily: 'var(--font-inter), sans-serif', color: '#a1a1aa' }}>
                <div className="flex items-center gap-4">
                  <Calendar size={18} style={{ color: '#d4d4d8' }} />
                  <span className="uppercase tracking-wider">{formatFullDate(event.date_start)} {event.date_end ? `- ${formatFullDate(event.date_end)}` : ''}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock size={18} style={{ color: '#d4d4d8' }} />
                  <span className="uppercase tracking-wider">{event.time_start}{event.time_end ? ` - ${event.time_end}` : ''}</span>
                </div>
                <div className="flex items-center gap-4 uppercase tracking-wider">
                  <MapPin size={18} style={{ color: '#d4d4d8' }} />
                  <span>{event.localizacao.bairro ? `${event.localizacao.bairro} - ` : ''}{event.localizacao.cidade}</span>
                </div>
              </div>

              <div className="mt-auto">
                {event.ticket_url && (
                  <a href={event.ticket_url} target="_blank" rel="noopener noreferrer"
                    className="inline-block w-full sm:w-auto py-3.5 px-8 rounded-xl text-base font-black text-center uppercase transition-all hover:scale-105 active:scale-95"
                    style={{ background: '#ff33ff', color: '#000000', letterSpacing: '0.05em', boxShadow: '0 0 20px rgba(255, 51, 255, 0.4)' }}>
                    Comprar Ingresso
                  </a>
                )}
              </div>
            </div>

            {/* Imagem na Direita */}
            <div className="md:w-[50%] relative min-h-[280px] md:min-h-full bg-neutral-900">
              {event.image_url ? (
                <Image src={event.image_url} alt={event.title} fill className="object-cover" priority />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6" style={{ background: `linear-gradient(135deg, ${event.color}25, ${event.color}60)` }}>
                  <div className="text-9xl mb-4 drop-shadow-lg">{event.emoji}</div>
                </div>
              )}
              {/* Categoria Badge */}
              <div className="absolute top-6 right-6">
                <span className="px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-lg" style={{ background: event.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Main */}
            <div className="md:col-span-2">
              <p className="text-base leading-relaxed mb-8 mt-2" style={{ color: 'var(--ink-soft)', fontWeight: 300, lineHeight: 1.8 }}>
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
                  {event.ticket_url && (
                    <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <a href={event.ticket_url} target="_blank" rel="noopener noreferrer"
                        className="block w-full text-center py-3 rounded-lg text-sm font-black uppercase transition-transform hover:scale-105 active:scale-95"
                        style={{ background: '#ff33ff', color: '#000000', letterSpacing: '0.05em', boxShadow: '0 4px 14px rgba(255, 51, 255, 0.2)' }}>
                        Comprar Ingresso
                      </a>
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
