import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types'
import { formatEventDate, cn } from '@/lib/utils'
import { CATEGORY_CONFIG } from '@/lib/db'
import { MapPin, Clock, ExternalLink } from 'lucide-react'

interface Props {
  event: Event
  variant?: 'vertical' | 'horizontal'
  style?: React.CSSProperties
}

export default function EventCard({ event, variant = 'vertical', style }: Props) {
  const cat = CATEGORY_CONFIG[event.category]

  if (variant === 'horizontal') {
    return (
      <Link href={`/eventos/${event.slug}`}
        className="group flex flex-col sm:grid overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-0.5 animate-fadeup"
        style={{ background: '#fff', borderColor: 'var(--border)', gridTemplateColumns: '260px 1fr', ...style }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ minHeight: 180, background: `linear-gradient(135deg, ${event.color}20, ${event.color}50)` }}>
          {event.image_url
            ? <Image src={event.image_url} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="w-full h-full flex items-center justify-center text-5xl">{event.emoji}</div>
          }
          <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded text-white font-medium" style={{ fontFamily: 'DM Mono,monospace', background: event.color, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.6rem' }}>{cat.label}</span>
          <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded" style={{ fontFamily: 'DM Mono,monospace', background: 'rgba(28,26,22,0.75)', color: 'var(--accent-warm)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', backdropFilter: 'blur(4px)' }}>GRÁTIS</span>
        </div>
        {/* Body */}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--accent)' }}>{formatEventDate(event.date_start)}</span>
            {event.time_start && <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>· {event.time_start}</span>}
          </div>
          <h3 className="font-bold leading-snug" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.1rem' }}>{event.title}</h3>
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--ink-soft)', fontWeight: 300 }}>{event.description}</p>
          <div className="flex items-center gap-1 text-xs mt-auto" style={{ color: 'var(--ink-muted)' }}>
            <MapPin size={12} />{event.localizacao.endereco}, {event.localizacao.cidade}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/eventos/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fadeup"
      style={{ background: '#fff', borderColor: 'var(--border)', ...style }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: `linear-gradient(135deg, ${event.color}18, ${event.color}40)` }}>
        {event.image_url
          ? <Image src={event.image_url} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">{event.emoji}</div>
        }
        <span className="absolute top-2 left-2 text-white px-2 py-0.5 rounded" style={{ fontFamily: 'DM Mono,monospace', background: event.color, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{cat.label}</span>
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded" style={{ fontFamily: 'DM Mono,monospace', background: 'rgba(28,26,22,0.75)', color: 'var(--accent-warm)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', backdropFilter: 'blur(4px)' }}>GRÁTIS</span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--accent)' }}>{formatEventDate(event.date_start)}</span>
          {event.time_start && <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>· {event.time_start}</span>}
        </div>
        <h3 className="font-bold leading-snug line-clamp-2" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.05rem' }}>{event.title}</h3>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
          <MapPin size={11} />{event.localizacao.endereco}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex gap-1 flex-wrap">
          {event.tags.slice(0, 2).map(t => (
            <span key={t} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--ink-soft)', fontSize: '0.62rem' }}>{t}</span>
          ))}
        </div>
        <span className="text-xs transition-colors group-hover:text-orange-600" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>
          ver mais →
        </span>
      </div>
    </Link>
  )
}
