import { getAllEventsAdmin } from '@/lib/db'
import Link from 'next/link'
import { CalendarDays, CheckCircle, Clock, Eye, PlusCircle } from 'lucide-react'

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
      published: { bg: '#dcfce7', color: '#166534', label: 'Publicado' },
      draft:     { bg: '#fef9c3', color: '#854d0e', label: 'Rascunho' },
      review:    { bg: '#dbeafe', color: '#1e40af', label: 'Em revisão' },
      rejected:  { bg: '#fee2e2', color: '#991b1b', label: 'Rejeitado' },
    }
    return map[s] ?? map.draft
  }

  return (
    <>
      {/* Topbar */}
      <header className="h-14 px-8 flex items-center justify-between border-b sticky top-0 z-10" style={{ background: 'var(--cream)', borderColor: 'var(--border)' }}>
        <div>
          <span className="font-semibold text-sm">Dashboard</span>
          <span className="text-xs ml-2" style={{ color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>/ admin</span>
        </div>
        <Link href="/admin/eventos/novo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--accent)' }}>
          <PlusCircle size={15} /> Novo evento
        </Link>
      </header>

      <main className="p-8 flex-1">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total de eventos', value: events.length, icon: CalendarDays, sub: 'no sistema' },
            { label: 'Publicados', value: published, icon: CheckCircle, sub: `${Math.round(published / events.length * 100)}% do total` },
            { label: 'Em rascunho', value: drafts, icon: Clock, sub: 'aguardando revisão' },
            { label: 'Destaques', value: featured, icon: Eye, sub: 'na home do portal' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-5 border" style={{ background: '#fff', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>{s.label}</span>
                <s.icon size={16} style={{ color: 'var(--ink-muted)' }} />
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--ink-muted)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent events table */}
        <div className="rounded-xl border overflow-hidden" style={{ background: '#fff', borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-semibold">Eventos recentes</h2>
            <Link href="/admin/eventos" className="text-xs transition-colors hover:text-orange-600" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>ver todos →</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                {['Evento', 'Cidade', 'Data', 'Categoria', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider font-normal" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(ev => {
                const st = statusStyle(ev.status)
                return (
                  <tr key={ev.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)', maxWidth: 260 }}>
                      <div className="font-medium text-sm truncate">{ev.title}</div>
                      {ev.featured && <div className="text-xs mt-0.5" style={{ color: 'var(--accent)', fontFamily: 'DM Mono,monospace' }}>✦ destaque</div>}
                    </td>
                    <td className="px-5 py-3.5 border-b text-sm" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>{ev.localizacao.cidade}</td>
                    <td className="px-5 py-3.5 border-b text-xs whitespace-nowrap" style={{ borderColor: 'var(--border)', fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>
                      {new Date(ev.date_start).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-3.5 border-b text-sm" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>{ev.category}</td>
                    <td className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: st.bg, color: st.color, fontFamily: 'DM Mono,monospace' }}>{st.label}</span>
                    </td>
                    <td className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
                      <Link href={`/admin/eventos/${ev.id}`} className="text-xs px-3 py-1.5 rounded border transition-all hover:border-stone-400 hover:text-stone-700" style={{ border: '1px solid var(--border)', color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>editar</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
