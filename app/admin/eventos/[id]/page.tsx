import { notFound } from 'next/navigation'
import { getEventById } from '@/lib/db'
import { EventFormData, Category } from '@/types'
import EventForm from '@/components/admin/EventForm'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const ev = await getEventById(id)
  return { title: ev ? `Editar: ${ev.title}` : 'Evento não encontrado' }
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params
  const ev = await getEventById(id)
  if (!ev) notFound()

  const initial: Partial<EventFormData> = {
    title:       ev.title,
    description: ev.description,
    category:    ev.category as Category,
    emoji:       ev.emoji,
    date_start:  ev.date_start.slice(0, 10),
    date_end:    ev.date_end?.slice(0, 10) ?? '',
    time_start:  ev.time_start,
    time_end:    ev.time_end ?? '',
    estado:      ev.localizacao.estado,
    cidade:      ev.localizacao.cidade,
    bairro:      ev.localizacao.bairro ?? '',
    endereco:    ev.localizacao.endereco,
    lat:         ev.localizacao.lat?.toString() ?? '',
    lng:         ev.localizacao.lng?.toString() ?? '',
    tags:        ev.tags,
    is_free:     ev.is_free,
    ticket_url:  ev.ticket_url ?? '',
    image_url:   ev.image_url ?? '',
    stay22_map:  ev.stay22_map ?? '',
    featured:    ev.featured,
    status:      ev.status,
  }

  return (
    <>
      <header className="h-14 px-8 flex items-center justify-between border-b sticky top-0 z-10"
        style={{ background: 'var(--cream)', borderColor: 'var(--border)' }}>
        <div>
          <span className="font-semibold text-sm">Editar Evento</span>
          <span className="text-xs ml-2" style={{ color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>
            / admin / eventos / {id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded" style={{
            fontFamily: 'DM Mono,monospace',
            background: ev.status === 'published' ? '#dcfce7' : '#fef9c3',
            color:      ev.status === 'published' ? '#166534' : '#854d0e',
          }}>
            {ev.status === 'published' ? 'Publicado' : 'Rascunho'}
          </span>
        </div>
      </header>
      <main className="p-8 flex-1">
        <EventForm mode="edit" eventId={id} initial={initial} />
      </main>
    </>
  )
}
