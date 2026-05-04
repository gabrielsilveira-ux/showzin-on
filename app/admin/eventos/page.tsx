import { getAllEventsAdmin } from '@/lib/db'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import EventActions from '@/components/admin/EventActions'

export const metadata = { title: 'Eventos | Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminEventsList() {
  const events = await getAllEventsAdmin()

  const statusStyle = (s: string) => {
    const m: Record<string, [string,string,string]> = {
      published: ['bg-emerald-500/10','text-emerald-500','Publicado'],
      draft:     ['bg-amber-500/10','text-amber-500','Rascunho'],
      review:    ['bg-blue-500/10','text-blue-500','Em revisão'],
      rejected:  ['bg-red-500/10','text-red-500','Rejeitado'],
    }
    return m[s] ?? m.draft
  }

  return (
    <>
      <header className="h-16 px-8 flex items-center justify-between border-b border-border sticky top-0 z-10 bg-surface/80 backdrop-blur-md">
        <div>
          <span className="font-semibold text-sm text-primary">Eventos</span>
          <span className="text-xs ml-2 font-mono text-muted">/ admin / eventos</span>
        </div>
        <Link href="/admin/eventos/novo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all bg-accent hover:bg-accent-hover shadow-lg shadow-accent/20">
          <PlusCircle size={16} /> Novo evento
        </Link>
      </header>

      <main className="p-8">
        <div className="rounded-2xl border border-border overflow-hidden bg-surface shadow-sm">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-primary">Todos os eventos <span className="text-sm font-normal ml-1 text-muted">({events.length})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  {['Evento', 'Cidade', 'Data início', 'Categoria', 'Fonte', 'Status', 'Destaque', 'Ações'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs uppercase tracking-wider font-medium font-mono text-muted border-b border-border whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map(ev => {
                  const [bg, color, label] = statusStyle(ev.status)
                  return (
                    <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 border-b border-border max-w-[240px]">
                        <div className="font-medium text-sm text-primary truncate">{ev.title}</div>
                        <div className="text-xs mt-1 text-muted truncate">{ev.slug}</div>
                      </td>
                      <td className="px-6 py-4 border-b border-border text-sm text-muted whitespace-nowrap">{ev.localizacao.cidade}</td>
                      <td className="px-6 py-4 border-b border-border text-sm font-mono text-muted whitespace-nowrap">
                        {new Date(ev.date_start).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 border-b border-border text-sm text-muted">{ev.category}</td>
                      <td className="px-6 py-4 border-b border-border text-xs font-mono text-muted">{ev.source}</td>
                      <td className="px-6 py-4 border-b border-border">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium font-mono ${bg} ${color}`}>{label}</span>
                      </td>
                      <td className="px-6 py-4 border-b border-border text-center">
                        {ev.featured ? <span className="text-accent">✦</span> : <span className="text-muted/50">—</span>}
                      </td>
                      <td className="px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link href={`/admin/eventos/${ev.id}`}
                            className="text-xs px-3 py-1.5 rounded-lg border border-border/50 text-muted transition-all hover:border-accent hover:text-accent">
                            editar
                          </Link>
                          <Link href={`/eventos/${ev.slug}`} target="_blank"
                            className="text-xs px-3 py-1.5 rounded-lg border border-border/50 text-muted transition-all hover:border-primary hover:text-primary">
                            ver
                          </Link>
                          <EventActions eventId={ev.id} currentStatus={ev.status} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}
