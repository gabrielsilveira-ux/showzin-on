import { getAllEventsAdmin } from '@/lib/db'
import Link from 'next/link'
import { CalendarDays, CheckCircle, Clock, Eye, PlusCircle, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Dashboard | Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const events = await getAllEventsAdmin()
  const published = events.filter(e => e.status === 'published').length
  const drafts    = events.filter(e => e.status === 'draft').length
  const review    = events.filter(e => e.status === 'review').length
  const featured  = events.filter(e => e.featured).length

  const recent = events.slice(0, 6)

  const statusStyle = (s: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      published: { bg: 'bg-emerald-500/10', color: 'text-emerald-500', label: 'Publicado' },
      draft:     { bg: 'bg-amber-500/10', color: 'text-amber-500', label: 'Rascunho' },
      review:    { bg: 'bg-blue-500/10', color: 'text-blue-500', label: 'Em revisão' },
      rejected:  { bg: 'bg-red-500/10', color: 'text-red-500', label: 'Rejeitado' },
    }
    return map[s] ?? map.draft
  }

  return (
    <>
      {/* Topbar */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-border sticky top-0 z-10 bg-surface/80 backdrop-blur-md">
        <div>
          <span className="font-semibold text-sm text-primary">Dashboard</span>
          <span className="text-xs ml-2 font-mono text-muted">/ admin</span>
        </div>
        <Link href="/admin/eventos/novo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all bg-accent hover:bg-accent-hover shadow-lg shadow-accent/20">
          <PlusCircle size={16} /> Novo evento
        </Link>
      </header>

      <main className="p-8 flex-1">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total de eventos', value: events.length, icon: CalendarDays, sub: 'no sistema' },
            { label: 'Publicados', value: published, icon: CheckCircle, sub: `${Math.round(published / events.length * 100)}% do total` },
            { label: 'Em rascunho', value: drafts, icon: Clock, sub: 'aguardando revisão' },
            { label: 'Destaques', value: featured, icon: Eye, sub: 'na home do portal' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-6 border border-border bg-surface shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[10px] uppercase tracking-widest font-mono text-muted">{s.label}</span>
                <s.icon size={18} className="text-accent" />
              </div>
              <div className="font-display text-4xl font-bold leading-none text-primary relative z-10">{s.value}</div>
              <div className="text-xs mt-3 text-muted relative z-10">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent events table */}
        <div className="rounded-2xl border border-border overflow-hidden bg-surface shadow-sm">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-primary">Eventos recentes</h2>
            <Link href="/admin/eventos" className="text-xs flex items-center gap-1 transition-colors text-accent hover:text-accent-hover font-medium">ver todos <ArrowRight size={12} /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  {['Evento', 'Cidade', 'Data', 'Categoria', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs uppercase tracking-wider font-medium font-mono text-muted border-b border-border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(ev => {
                  const st = statusStyle(ev.status)
                  return (
                    <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 border-b border-border max-w-[260px]">
                        <div className="font-medium text-sm text-primary truncate">{ev.title}</div>
                        {ev.featured && <div className="text-[10px] mt-1 font-mono text-accent uppercase tracking-wider">✦ destaque</div>}
                      </td>
                      <td className="px-6 py-4 border-b border-border text-sm text-muted">{ev.localizacao.cidade}</td>
                      <td className="px-6 py-4 border-b border-border text-sm font-mono text-muted whitespace-nowrap">
                        {new Date(ev.date_start).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 border-b border-border text-sm text-muted">{ev.category}</td>
                      <td className="px-6 py-4 border-b border-border">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium font-mono ${st.bg} ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-4 border-b border-border text-right">
                        <Link href={`/admin/eventos/${ev.id}`} className="text-xs px-4 py-2 rounded-lg border border-border/50 text-muted transition-all hover:border-accent hover:text-accent opacity-0 group-hover:opacity-100">editar</Link>
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
