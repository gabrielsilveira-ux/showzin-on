import { Suspense } from 'react'
import Link from 'next/link'
import { getEvents, getFeaturedEvents } from '@/lib/db'
import { EventFilters, Category } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FilterBar from '@/components/events/FilterBar'

interface Props { searchParams: Promise<{ city?: string; genre?: string; period?: string; q?: string }> }

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams
  const filters: Partial<EventFilters> = {
    city: sp.city ?? '', genre: (sp.genre as Category) ?? '', period: (sp.period as EventFilters['period']) ?? '', search: sp.q ?? '',
  }

  const [events, featured] = await Promise.all([getEvents(filters), getFeaturedEvents()])
  const hero = featured[0] ?? events[0]
  const top = events.slice(0, 6)

  return (
    <>
      <Header />
      <main style={{ background: '#ececf1' }}>
        <section className="px-4 sm:px-8 py-8" style={{ background: 'radial-gradient(circle at top, #f5f5f7 0%, #e9e9ee 60%)' }}>
          <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden" style={{ background: '#111' }} id="destaques">
            {hero && (
              <div className="relative p-6 md:p-10 min-h-[320px] md:min-h-[380px]" style={{ background: `linear-gradient(120deg, #0f1015 0%, ${hero.color}55 100%)` }}>
                <h1 className="max-w-2xl text-3xl md:text-5xl text-white" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>
                  Descubra os melhores shows e festivais da região
                </h1>
                <p className="mt-4 text-white/80 max-w-xl">{hero.title} · {hero.localizacao.cidade}</p>
                <div className="grid md:grid-cols-3 gap-3 mt-8">
                  {top.slice(0, 3).map(ev => (
                    <Link key={ev.id} href={`/eventos/${ev.slug}`} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}>
                      <div className="text-xs text-white/70 mb-2">{new Date(ev.date_start).toLocaleDateString('pt-BR')}</div>
                      <div className="text-white font-semibold leading-snug">{ev.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16" id="eventos">
          <div className="mb-5"><Suspense><FilterBar count={events.length} /></Suspense></div>

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-3xl" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>Próximos shows</h2>
            <span className="text-xs" style={{ color: '#6f6d80', fontFamily: 'DM Mono,monospace' }}>VER TUDO</span>
          </div>

          <div className="grid gap-3">
            {top.map(ev => (
              <Link key={ev.id} href={`/eventos/${ev.slug}`} className="grid md:grid-cols-[240px_1fr] rounded-xl overflow-hidden border bg-white transition hover:shadow-md" style={{ borderColor: '#d8dde5' }}>
                <div style={{ background: `linear-gradient(120deg, ${ev.color}55, #1f2330)` }} className="min-h-[120px] flex items-center justify-center text-4xl">{ev.emoji}</div>
                <div className="p-4">
                  <h3 className="text-xl" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>{ev.title}</h3>
                  <p className="text-sm mt-1" style={{ color: '#6f6d80' }}>{ev.category}</p>
                  <p className="text-sm mt-2" style={{ color: '#3b4457' }}>{ev.localizacao.endereco} · {ev.localizacao.cidade}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
