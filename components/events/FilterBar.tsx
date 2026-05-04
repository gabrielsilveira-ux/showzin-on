'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { CITIES, CATEGORY_CONFIG } from '@/lib/db'
import { Category } from '@/types'
import { Search, X, SlidersHorizontal } from 'lucide-react'

const PERIODS = [
  { value: '', label: 'Qualquer data' },
  { value: 'hoje', label: 'Hoje' },
  { value: 'fds', label: 'Este fim de semana' },
  { value: 'mes', label: 'Este mês' },
]

interface Props { count: number }

export default function FilterBar({ count }: Props) {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  const update = useCallback((key: string, value: string) => {
    const sp = new URLSearchParams(params.toString())
    if (value) sp.set(key, value); else sp.delete(key)
    router.push(`${pathname}?${sp.toString()}`, { scroll: false })
  }, [params, pathname, router])

  const clear = () => router.push(pathname, { scroll: false })

  const hasFilters = params.get('city') || params.get('genre') || params.get('period') || params.get('q')

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full shadow-lg shadow-black/20 relative z-30">
      {/* Mobile Header for Filters */}
      <div className="flex items-center justify-between md:hidden pb-2 border-b border-border/50">
        <span className="flex items-center gap-2 text-primary font-medium">
          <SlidersHorizontal size={16} className="text-accent" /> Filtros
        </span>
        <span className="text-xs text-muted">
          <span className="text-accent font-bold">{count}</span> eventos
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-1 min-w-[200px] bg-surface border border-border focus-within:border-accent/50 transition-colors">
        <Search size={16} className="text-muted shrink-0" />
        <input
          defaultValue={params.get('q') ?? ''}
          placeholder="Buscar eventos..."
          className="bg-transparent text-sm outline-none flex-1 w-full text-primary placeholder:text-muted/70"
          onKeyDown={e => { if (e.key === 'Enter') update('q', (e.target as HTMLInputElement).value) }}
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-border/80 mx-2" />

      {/* Filters Wrapper */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1">
          <select
            value={params.get('city') ?? ''}
            onChange={e => update('city', e.target.value)}
            className="w-full appearance-none rounded-xl bg-surface border border-border px-4 py-2.5 text-sm text-primary outline-none focus:border-accent/50 cursor-pointer"
          >
            <option value="">📍 Todas as cidades</option>
            {CITIES.map(c => <option key={c.value} value={c.value} className="bg-surface text-primary">{c.emoji} {c.label}</option>)}
          </select>
        </div>

        <div className="relative flex-1">
          <select
            value={params.get('genre') ?? ''}
            onChange={e => update('genre', e.target.value)}
            className="w-full appearance-none rounded-xl bg-surface border border-border px-4 py-2.5 text-sm text-primary outline-none focus:border-accent/50 cursor-pointer"
          >
            <option value="">🎭 Todos os gêneros</option>
            {(Object.entries(CATEGORY_CONFIG) as [Category, { label: string; emoji: string }][]).map(([k, v]) => (
              <option key={k} value={k} className="bg-surface text-primary">{v.emoji} {v.label}</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1">
          <select
            value={params.get('period') ?? ''}
            onChange={e => update('period', e.target.value)}
            className="w-full appearance-none rounded-xl bg-surface border border-border px-4 py-2.5 text-sm text-primary outline-none focus:border-accent/50 cursor-pointer"
          >
            <option value="">📅 Qualquer data</option>
            {PERIODS.filter(p => p.value !== '').map(p => <option key={p.value} value={p.value} className="bg-surface text-primary">{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Desktop Count + clear */}
      <div className="hidden md:flex items-center gap-4 ml-2">
        <span className="text-sm text-muted whitespace-nowrap">
          <span className="text-accent font-bold">{count}</span> eventos
        </span>
        {hasFilters && (
          <button onClick={clear} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border/80 text-muted hover:text-primary hover:bg-surface transition-colors whitespace-nowrap">
            <X size={14} /> Limpar
          </button>
        )}
      </div>

      {/* Mobile Clear Button */}
      {hasFilters && (
        <button onClick={clear} className="md:hidden flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-xl bg-surface border border-border text-primary hover:bg-surface/80 transition-colors w-full mt-2">
          <X size={16} className="text-accent" /> Limpar filtros
        </button>
      )}
    </div>
  )
}
