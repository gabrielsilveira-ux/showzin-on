import { Suspense } from 'react'
import { getEvents, getFeaturedEvents } from '@/lib/db'
import { EventFilters, Category } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EventCard from '@/components/events/EventCard'
import FilterBar from '@/components/events/FilterBar'
import { MapPin } from 'lucide-react'

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
      <main className="min-h-screen bg-background pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {featuredEvent && (
            <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-end glass-card group border-0 ring-1 ring-white/10 shadow-2xl">
              {/* Background with dynamic color */}
              <div 
                className="absolute inset-0 opacity-40 transition-opacity duration-1000 group-hover:opacity-60" 
                style={{ background: `radial-gradient(circle at 30% 20%, ${featuredEvent.color}80 0%, transparent 60%)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              
              <div className="relative p-8 md:p-12 w-full grid md:grid-cols-3 gap-8 items-end z-10">
                <div className="flex flex-col">
                  <div className="text-6xl font-display font-bold text-white drop-shadow-md">
                    {new Date(featuredEvent.date_start).getDate()}
                  </div>
                  <div className="text-2xl font-bold text-white/90 uppercase tracking-wider">
                    {new Date(featuredEvent.date_start).toLocaleDateString('pt-BR', { month: 'short' })}
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-accent text-white mb-4 animate-pulse">
                      Em Destaque
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 drop-shadow-sm group-hover:text-accent-hover transition-colors">
                      {featuredEvent.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                      <span className="flex items-center gap-1.5"><MapPin size={16} className="text-accent" /> {featuredEvent.localizacao.endereco}, {featuredEvent.localizacao.cidade}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button className="px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-xs bg-white text-background hover:bg-accent hover:text-white transition-colors duration-300 shadow-lg">
                      Garantir Vaga
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">Eventos em andamento</h2>
            <p className="text-muted text-lg">Descubra as melhores experiências perto de você.</p>
          </div>
          
          <div className="sticky top-[84px] z-40 mb-10">
            <Suspense><FilterBar count={events.length} /></Suspense>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((ev, i) => <EventCard key={ev.id} event={ev} style={{ animationDelay: `${i * 0.05}s` }} />)}
          </div>
          
          {events.length === 0 && (
            <div className="py-20 text-center glass-card rounded-3xl mt-8">
              <p className="text-xl text-muted font-display">Nenhum evento encontrado para estes filtros.</p>
              <p className="text-sm text-muted/70 mt-2">Tente buscar por outras cidades ou datas.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
