import { Suspense } from 'react'
import { getEvents, getFeaturedEvents } from '@/lib/db'
import { EventFilters, Category } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EventCard from '@/components/events/EventCard'
import FilterBar from '@/components/events/FilterBar'

interface Props { searchParams: Promise<{ city?: string; genre?: string; period?: string; q?: string }> }

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams
  const filters: Partial<EventFilters> = {
    city: sp.city ?? '',
    genre: (sp.genre as Category) ?? '',
    period: (sp.period as EventFilters['period']) ?? '',
    search: sp.q ?? '',
  }

  const [events, featured] = await Promise.all([getEvents(filters), getFeaturedEvents()])
  const featuredEvent = featured[0] ?? events[0]

  return (
    <>
      <Header />
      <main style={{ background: '#e7ebf0' }}>
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="rounded-lg overflow-hidden" style={{ background: '#111', minHeight: 330 }}>
            {featuredEvent && (
              <div className="p-8 md:p-10 grid md:grid-cols-3 gap-5 items-end" style={{ minHeight: 330, background: `radial-gradient(circle at 20% 0%, ${featuredEvent.color}66 0%, #0f1115 45%)` }}>
                <div>
                  <div className="text-5xl font-bold text-white">{new Date(featuredEvent.date_start).getDate()}</div>
                  <div className="text-2xl font-bold text-white/90 uppercase">{new Date(featuredEvent.date_start).toLocaleDateString('pt-BR', { month: 'short' })}</div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-yellow-300">Destaque</p>
                  <h1 className="text-3xl md:text-4xl mt-2 text-white" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>{featuredEvent.title}</h1>
                  <p className="mt-2 text-white/75 text-sm">{featuredEvent.localizacao.endereco}, {featuredEvent.localizacao.cidade}</p>
                </div>
                <div className="md:text-right">
                  <div className="inline-flex px-3 py-1 rounded text-xs font-semibold uppercase" style={{ background: '#ff4d4f', color: 'white' }}>Evento gratuito</div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
          <h2 className="text-4xl mb-1" style={{ color: '#1e2a3c', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>Eventos em andamento</h2>
          <p className="mb-4 text-sm" style={{ color: '#687385' }}>Confira os melhores eventos disponíveis</p>
          <div className="mb-4"><Suspense><FilterBar count={events.length} /></Suspense></div>

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {events.map((ev, i) => <EventCard key={ev.id} event={ev} style={{ animationDelay: `${i * 0.03}s` }} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
