import { Suspense } from 'react'
import { CalendarDays, MapPin, Sparkles, ArrowUpRight } from 'lucide-react'
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
      <main className="bg-slate-950 text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(217,70,239,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.18),transparent_40%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-12">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-stretch">
              <div className="rounded-3xl border border-white/15 bg-white/5 p-7 md:p-10">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">
                  <Sparkles size={14} /> SHOWZIN • Descubra cultura local
                </p>
                <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  Eventos gratuitos com cara de plataforma premium.
                </h1>
                <p className="mt-5 text-slate-300 max-w-2xl text-base md:text-lg">
                  Um portal mais moderno para encontrar shows, feiras e experiências perto de você,
                  com foco total em rapidez, clareza e conversão.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full border border-white/20 px-4 py-2 text-slate-200">Interface limpa</span>
                  <span className="rounded-full border border-white/20 px-4 py-2 text-slate-200">Filtros rápidos</span>
                  <span className="rounded-full border border-white/20 px-4 py-2 text-slate-200">Descoberta local</span>
                </div>
              </div>

              {featuredEvent && (
                <div className="rounded-3xl border border-fuchsia-300/30 bg-gradient-to-b from-fuchsia-500/20 to-indigo-500/10 p-7 md:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200">Evento em destaque</p>
                  <h2 className="mt-3 text-2xl md:text-3xl font-bold">{featuredEvent.title}</h2>
                  <div className="mt-5 space-y-3 text-sm text-slate-200">
                    <p className="flex items-center gap-2"><CalendarDays size={16} /> {new Date(featuredEvent.date_start).toLocaleDateString('pt-BR', { dateStyle: 'full' })}</p>
                    <p className="flex items-center gap-2"><MapPin size={16} /> {featuredEvent.localizacao.endereco}, {featuredEvent.localizacao.cidade}</p>
                  </div>
                  <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors">
                    Ver detalhes <ArrowUpRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Agenda da semana</h2>
              <p className="mt-1 text-slate-300">Encontre os melhores eventos por estilo, cidade ou período.</p>
            </div>
            <p className="text-sm text-slate-400">{events.length} eventos encontrados</p>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-3">
            <Suspense><FilterBar count={events.length} /></Suspense>
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {events.map((ev, i) => <EventCard key={ev.id} event={ev} style={{ animationDelay: `${i * 0.03}s` }} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
