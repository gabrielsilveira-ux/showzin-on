import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types'
import { formatEventDate } from '@/lib/utils'

interface Props {
  event: Event
  variant?: 'vertical' | 'horizontal'
  style?: React.CSSProperties
}

export default function EventCard({ event, style }: Props) {
  return (
    <Link href={`/eventos/${event.slug}`}
      className="group overflow-hidden rounded-md border bg-white transition-all hover:-translate-y-1 hover:shadow-lg animate-fadeup"
      style={{ borderColor: '#d8dde5', ...style }}
    >
      <div className="relative" style={{ aspectRatio: '16/9', background: `linear-gradient(135deg, ${event.color}35, #101317)` }}>
        {event.image_url
          ? <Image src={event.image_url} alt={event.title} fill className="object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">{event.emoji}</div>
        }
        <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded" style={{ background: '#111827', color: '#fff' }}>
          {formatEventDate(event.date_start)}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-xl leading-snug mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#1f2937', fontWeight: 700 }}>{event.title}</h3>
        <p className="text-xs uppercase tracking-wide" style={{ color: '#6b7280' }}>{event.category}</p>
        <p className="text-sm mt-2" style={{ color: '#475569' }}>{event.localizacao.endereco}</p>
        <p className="text-sm" style={{ color: '#475569' }}>{event.localizacao.cidade}</p>
      </div>
    </Link>
  )
}
