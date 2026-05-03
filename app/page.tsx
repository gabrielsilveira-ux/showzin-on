import { Suspense } from 'react'
import Link from 'next/link'
import { getEvents, getFeaturedEvents, CITIES } from '@/lib/db'
import { EventFilters, Category } from '@/types'
import { formatEventDate } from '@/lib/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EventCard from '@/components/events/EventCard'
import FilterBar from '@/components/events/FilterBar'
import CategoryPills from '@/components/events/CategoryPills'
import NewsletterSection from '@/components/events/NewsletterSection'

interface Props {
  searchParams: Promise<{ city?: string; genre?: string; period?: string; q?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams
  const filters: Partial<EventFilters> = {
    city:   sp.city   ?? '',
    genre:  (sp.genre as Category) ?? '',
    period: (sp.period as EventFilters['period']) ?? '',
    search: sp.q ?? '',
  }

  const [events, featured] = await Promise.all([getEvents(filters), getFeaturedEvents()])
  const featuredList = featured.slice(0, 2)
  const restEvents   = events.filter(e => !featuredList.find(f => f.id === e.id))

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-0 grid md:grid-cols-2 gap-12 items-end">
          <div className="pb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs uppercase tracking-widest" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--accent)' }}>Região de Campinas</span>
              <span className="h-px w-8 bg-orange-600 inline-block" />
            </div>
            <h1 className="mb-5 leading-tight" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 'clamp(2.6rem,5vw,4.2rem)', letterSpacing: '-0.02em' }}>
              Cultura <em className="not-italic" style={{ color: 'var(--accent)' }}>gratuita</em><br />ao seu alcance
            </h1>
            <p className="text-lg mb-8 max-w-md" style={{ color: 'var(--ink-soft)', fontWeight: 300, lineHeight: 1.7 }}>
              Descobrimos e reunimos os melhores eventos gratuitos de Campinas e região. Rock, gastronomia, teatro, feiras e muito mais.
            </p>
            <div className="flex gap-8">
              {[['147+', 'eventos este mês'], ['12', 'cidades'], ['100%', 'gratuito']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{n}</div>
                  <div className="text-xs mt-1 uppercase tracking-widest" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {featuredList[0] && (
            <Link href={`/eventos/${featuredList[0].slug}`} className="group relative overflow-hidden rounded-xl cursor-pointer hidden md:block" style={{ aspectRatio: '4/3', background: 'var(--ink)' }}>
              <div className="w-full h-full flex items-center justify-center text-8xl" style={{ background: `linear-gradient(135deg, #1C1A16 0%, ${featuredList[0].color}40 100%)` }}>{featuredList[0].emoji}</div>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,26,22,0.92) 0%, rgba(28,26,22,0.2) 55%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-xs mb-2 px-2 py-0.5 rounded inline-block" style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'DM Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✦ Destaque</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.2 }}>{featuredList[0].title}</h2>
                <div className="flex gap-4 mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <span>📅 {formatEventDate(featuredList[0].date_start)}</span>
                  <span>📍 {featuredList[0].localizacao.cidade}</span>
                </div>
              </div>
            </Link>
          )}
        </section>

        {/* FILTERS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4 sticky top-16 z-40" style={{ background: 'var(--cream)' }} id="eventos">
          <Suspense><FilterBar count={events.length} /></Suspense>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-6">
          <Suspense><CategoryPills /></Suspense>
        </div>

        {/* FEATURED */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-12">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-2xl font-bold flex items-center gap-2.5" style={{ fontFamily: "'Playfair Display',serif" }}>
              <span className="w-5 h-0.5 inline-block" style={{ background: 'var(--accent)' }} />Destaques da semana
            </h2>
          </div>
          <div className="grid gap-4">
            {featuredList.map((ev, i) => <EventCard key={ev.id} event={ev} variant="horizontal" style={{ animationDelay: `${i * 0.08}s` }} />)}
          </div>
        </div>

        {/* ALL EVENTS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
          <h2 className="text-2xl font-bold flex items-center gap-2.5 mb-5" style={{ fontFamily: "'Playfair Display',serif" }}>
            <span className="w-5 h-0.5 inline-block" style={{ background: 'var(--accent)' }} />Todos os eventos
          </h2>
          {restEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>Nenhum evento encontrado</h3>
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Tente ajustar os filtros.</p>
            </div>
          ) : (
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
              {restEvents.map((ev, i) => <EventCard key={ev.id} event={ev} style={{ animationDelay: `${i * 0.04}s` }} />)}
            </div>
          )}
        </div>

        {/* BLOG BAND */}
        <section className="py-16 px-4 sm:px-8" style={{ background: 'var(--ink)' }} id="blog">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.9rem', lineHeight: 1.2, marginBottom: 12 }}>Do blog para<br /><em>o fim de semana</em></h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontWeight: 300 }}>Guias e roteiros feitos com base nos eventos reais do portal.</p>
              <Link href="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>Ler o blog →</Link>
            </div>
            {[{ tag: 'Roteiro · Campinas', title: '12 eventos gratuitos para curtir em Campinas este fim de semana' }, { tag: 'Guia · Gastronomia', title: 'Feiras gastronômicas gratuitas na região de Campinas em 2025' }].map(a => (
              <div key={a.title} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-xs mb-2" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--accent-warm)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{a.tag}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1rem', lineHeight: 1.35 }}>{a.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CITIES */}
        <section className="py-12 px-4 sm:px-8" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }} id="cidades">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2.5" style={{ fontFamily: "'Playfair Display',serif" }}>
              <span className="w-5 h-0.5 inline-block" style={{ background: 'var(--accent)' }} />Explorar por cidade
            </h2>
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

        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
