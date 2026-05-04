import { Suspense } from 'react'
import Link from 'next/link'
import { getEvents, getFeaturedEvents, CITIES } from '@/lib/db'
import { EventFilters, Category } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EventCard from '@/components/events/EventCard'
import FilterBar from '@/components/events/FilterBar'

interface Props {
  searchParams: Promise<{ city?: string; genre?: string; period?: string; q?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams
  const filters: Partial<EventFilters> = {
    city: sp.city ?? '',
    genre: (sp.genre as Category) ?? '',
    period: (sp.period as EventFilters['period']) ?? '',
    search: sp.q ?? '',
  }

  const [events, featured] = await Promise.all([getEvents(filters), getFeaturedEvents()])
  const featuredList = featured.slice(0, 3)
  const restEvents = events.filter(e => !featuredList.find(f => f.id === e.id))

  return (
    <>
      <Header />
      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-12">
          <div className="rounded-3xl p-8 md:p-12 border" style={{ background: 'linear-gradient(120deg,#fff 0%,#f8f4ec 55%,#efe8da 100%)', borderColor: 'var(--border)' }}>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs" style={{ background: '#fff', border: '1px solid var(--border)', fontFamily: 'DM Mono,monospace', color: 'var(--accent)' }}>● agenda gratuita atualizada</span>
              <h1 className="mt-5 leading-tight" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(2rem,4.2vw,3.8rem)', fontWeight: 800 }}>
                Descubra experiências gratuitas
                <span style={{ color: 'var(--accent)' }}> perto de você</span>
              </h1>
              <p className="mt-5 text-base md:text-lg max-w-xl" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                Um guia moderno para explorar shows, feiras, gastronomia e cultura na região de Campinas.
                Simples de buscar, rápido de usar e sempre atualizado.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#eventos" className="px-5 py-3 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>Explorar eventos</a>
                <a href="#cidades" className="px-5 py-3 rounded-xl text-sm font-medium" style={{ border: '1px solid var(--border)', color: 'var(--ink-soft)', background: '#fff' }}>Ver cidades</a>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-4" id="eventos">
          <Suspense><FilterBar count={events.length} /></Suspense>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>Destaques</h2>
            <span className="text-xs" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>curadoria semanal</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featuredList.map((ev, i) => <EventCard key={ev.id} event={ev} style={{ animationDelay: `${i * 0.08}s` }} />)}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
          <h2 className="text-2xl mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>Todos os eventos</h2>
          {restEvents.length === 0 ? (
            <div className="rounded-2xl border p-10 text-center" style={{ background: '#fff', borderColor: 'var(--border)' }}>
              <div className="text-4xl mb-3">🔎</div>
              <p style={{ color: 'var(--ink-muted)' }}>Nenhum resultado para os filtros aplicados.</p>
            </div>
          ) : (
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
              {restEvents.map((ev, i) => <EventCard key={ev.id} event={ev} style={{ animationDelay: `${i * 0.04}s` }} />)}
            </div>
          )}
        </section>

        <section className="py-12 px-4 sm:px-8" style={{ background: '#efe8da' }} id="cidades">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl mb-5" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>Explorar por cidade</h2>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
              {CITIES.map(c => (
                <Link key={c.value} href={`/?city=${c.value}`} className="bg-white rounded-xl p-4 text-center border transition-all hover:-translate-y-1 hover:shadow-md group" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-3xl mb-2">{c.emoji}</div>
                  <div className="text-sm font-medium transition-colors group-hover:text-orange-600">{c.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
