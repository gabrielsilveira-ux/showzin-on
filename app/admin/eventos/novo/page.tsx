import EventForm from '@/components/admin/EventForm'
import { PlusCircle } from 'lucide-react'

export const metadata = { title: 'Novo Evento | Admin' }

export default function NewEventPage() {
  return (
    <>
      <header className="h-16 px-8 flex items-center justify-between border-b border-border sticky top-0 z-10 bg-surface/80 backdrop-blur-md">
        <div>
          <span className="font-semibold text-sm text-primary">Novo Evento</span>
          <span className="text-xs ml-2 font-mono text-muted">
            / admin / eventos / novo
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PlusCircle size={16} className="text-accent" />
          <span className="text-sm text-muted">Preencha os dados abaixo</span>
        </div>
      </header>
      <main className="p-8 flex-1">
        <EventForm mode="create" />
      </main>
    </>
  )
}
