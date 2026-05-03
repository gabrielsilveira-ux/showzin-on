import { getAllEventsAdmin } from '@/lib/db'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

export const metadata = { title: 'Eventos | Admin' }

export default async function AdminEventsList() {
  const events = await getAllEventsAdmin()

  const statusStyle = (s: string) => {
    const m: Record<string, [string,string,string]> = {
      published: ['#dcfce7','#166534','Publicado'],
      draft:     ['#fef9c3','#854d0e','Rascunho'],
      review:    ['#dbeafe','#1e40af','Em revisão'],
      rejected:  ['#fee2e2','#991b1b','Rejeitado'],
    }
    return m[s] ?? m.draft
  }

  return (
    <>
      <header className="h-14 px-8 flex items-center justify-between border-b sticky top-0 z-10" style={{ background: 'var(--cream)', borderColor: 'var(--border)' }}>
        <div>
          <span className="font-semibold text-sm">Eventos</span>
          <span className="text-xs ml-2" style={{ color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>/ admin / eventos</span>
        </div>
        <Link href="/admin/eventos/novo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}>
          <PlusCircle size={15} /> Novo evento
        </Link>
      </header>

      <main className="p-8">
        <div className="rounded-xl border overflow-hidden" style={{ background: '#fff', borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-semibold">Todos os eventos <span className="text-sm font-normal ml-1" style={{ color: 'var(--ink-muted)' }}>({events.length})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface)' }}>
                  {['Evento', 'Cidade', 'Data início', 'Categoria', 'Fonte', 'Status', 'Destaque', 'Ações'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider font-normal whitespace-nowrap" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map(ev => {
                  const [bg, color, label] = statusStyle(ev.status)
                  return (
                    <tr key={ev.id} className="transition-colors hover:bg-stone-50">
                      <td className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', maxWidth: 240 }}>
                        <div className="font-medium text-sm truncate">{ev.title}</div>
                        <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--ink-muted)' }}>{ev.slug}</div>
                      </td>
                      <td className="px-5 py-3 border-b text-sm whitespace-nowrap" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>{ev.localizacao.cidade}</td>
                      <td className="px-5 py-3 border-b text-xs whitespace-nowrap" style={{ borderColor: 'var(--border)', fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>
                        {new Date(ev.date_start).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-5 py-3 border-b text-sm" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>{ev.category}</td>
                      <td className="px-5 py-3 border-b text-xs" style={{ borderColor: 'var(--border)', fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>{ev.source}</td>
                      <td className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: bg, color, fontFamily: 'DM Mono,monospace' }}>{label}</span>
                      </td>
                      <td className="px-5 py-3 border-b text-center" style={{ borderColor: 'var(--border)' }}>
                        {ev.featured ? '✦' : <span style={{ color: 'var(--ink-muted)' }}>—</span>}
                      </td>
                      <td className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/eventos/${ev.id}`}
                            className="text-xs px-3 py-1.5 rounded border transition-all hover:border-stone-400"
                            style={{ border: '1px solid var(--border)', color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>
                            editar
                          </Link>
                          <Link href={`/eventos/${ev.slug}`} target="_blank"
                            className="text-xs px-3 py-1.5 rounded border transition-all hover:border-stone-400"
                            style={{ border: '1px solid var(--border)', color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>
                            ver
                          </Link>
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
