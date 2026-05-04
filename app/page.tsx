import { Suspense } from 'react'
import { CalendarDays, MapPin, Sparkles } from 'lucide-react'
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
      <main className="bg-slate-50">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  <Sparkles size={14} /> Portal Showzin
                </span>
                <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                  Eventos gratuitos com um visual mais clean, moderno e direto.
                </h1>
                <p className="mt-4 text-slate-600 max-w-xl">
                  O SHOWZIN conecta pessoas aos melhores eventos da região com uma navegação simples,
                  destaque para atrações e filtros rápidos.
                </p>
              </div>

              {featuredEvent && (
                <div className="rounded-2xl bg-slate-900 p-6 text-white">
                  <p className="text-xs uppercase tracking-widest text-violet-300">Evento em destaque</p>
                  <h2 className="mt-2 text-2xl font-bold">{featuredEvent.title}</h2>
                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p className="flex items-center gap-2"><CalendarDays size={16} /> {new Date(featuredEvent.date_start).toLocaleDateString('pt-BR', { dateStyle: 'full' })}</p>
                    <p className="flex items-center gap-2"><MapPin size={16} /> {featuredEvent.localizacao.endereco}, {featuredEvent.localizacao.cidade}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Agenda de eventos</h2>
          <p className="mt-1 mb-4 text-sm text-slate-600">Descubra eventos por cidade, estilo e período.</p>
          <div className="mb-5"><Suspense><FilterBar count={events.length} /></Suspense></div>

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {events.map((ev, i) => <EventCard key={ev.id} event={ev} style={{ animationDelay: `${i * 0.03}s` }} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
