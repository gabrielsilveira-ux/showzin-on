import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types'
import { formatEventDate } from '@/lib/utils'
import { MapPin, Calendar } from 'lucide-react'

interface Props {
  event: Event
  variant?: 'vertical' | 'horizontal'
  style?: React.CSSProperties
}

export default function EventCard({ event, style }: Props) {
  return (
    <Link href={`/eventos/${event.slug}`}
      className="group relative overflow-hidden rounded-2xl glass-card flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30 animate-fadeup"
      style={style}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
        {event.image_url ? (
          <Image src={event.image_url} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl" style={{ backgroundColor: `${event.color}20` }}>{event.emoji}</div>
        )}
        <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded bg-background/80 backdrop-blur-md text-xs font-medium text-primary border border-white/10 flex items-center gap-1.5 shadow-sm">
          <Calendar size={12} className="text-accent" />
          {formatEventDate(event.date_start)}
        </div>
      </div>

      <article className="p-5 flex flex-col flex-1 relative z-20 -mt-8 pt-0">
        <p className="text-[10px] uppercase tracking-wider text-accent font-bold mb-2">{event.category}</p>
        <h3 className="font-display text-xl font-bold text-primary leading-tight mb-4 line-clamp-2 group-hover:text-accent transition-colors">{event.title}</h3>
        
        <div className="mt-auto flex flex-col gap-2 text-sm text-muted">
          <p className="flex items-start gap-2 line-clamp-2"><MapPin size={16} className="shrink-0 text-muted/50 mt-0.5" /> {event.localizacao.endereco}</p>
          <p className="flex items-center gap-2 pl-6 text-muted/70">{event.localizacao.cidade}</p>
        </div>
      </article>
    </Link>
  )
}
