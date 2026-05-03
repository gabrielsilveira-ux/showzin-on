'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { CITIES, CATEGORY_CONFIG } from '@/lib/db'
import { Category } from '@/types'
import { Search, X } from 'lucide-react'

const PERIODS = [
  { value: '', label: '📅 Qualquer data' },
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
    <div className="rounded-xl p-3 sm:p-4 flex flex-wrap gap-2 sm:gap-3 items-center" style={{ background: 'var(--ink)' }}>
      {/* Search */}
      <div className="flex items-center gap-2 rounded px-3 py-2 flex-1 min-w-40" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <Search size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
        <input
          defaultValue={params.get('q') ?? ''}
          placeholder="Buscar eventos..."
          className="bg-transparent text-sm outline-none flex-1"
          style={{ color: '#fff', fontFamily: 'DM Sans,sans-serif' }}
          onKeyDown={e => { if (e.key === 'Enter') update('q', (e.target as HTMLInputElement).value) }}
        />
      </div>

      <div className="w-px h-7 hidden sm:block" style={{ background: 'rgba(255,255,255,0.1)' }} />

      {/* City */}
      <select
        value={params.get('city') ?? ''}
        onChange={e => update('city', e.target.value)}
        className="rounded px-3 py-2 text-sm outline-none cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontFamily: 'DM Sans,sans-serif', minWidth: 140 }}
      >
        <option value="">📍 Todas as cidades</option>
        {CITIES.map(c => <option key={c.value} value={c.value} style={{ background: '#2a2722' }}>{c.emoji} {c.label}</option>)}
      </select>

      {/* Genre */}
      <select
        value={params.get('genre') ?? ''}
        onChange={e => update('genre', e.target.value)}
        className="rounded px-3 py-2 text-sm outline-none cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontFamily: 'DM Sans,sans-serif', minWidth: 140 }}
      >
        <option value="">🎭 Todos os gêneros</option>
        {(Object.entries(CATEGORY_CONFIG) as [Category, { label: string; emoji: string }][]).map(([k, v]) => (
          <option key={k} value={k} style={{ background: '#2a2722' }}>{v.emoji} {v.label}</option>
        ))}
      </select>

      {/* Period */}
      <select
        value={params.get('period') ?? ''}
        onChange={e => update('period', e.target.value)}
        className="rounded px-3 py-2 text-sm outline-none cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontFamily: 'DM Sans,sans-serif', minWidth: 140 }}
      >
        {PERIODS.map(p => <option key={p.value} value={p.value} style={{ background: '#2a2722' }}>{p.label}</option>)}
      </select>

      {/* Count + clear */}
      <span className="ml-auto text-xs whitespace-nowrap" style={{ fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ color: 'var(--accent-warm)', fontWeight: 500 }}>{count}</span> eventos
      </span>
      {hasFilters && (
        <button onClick={clear} className="flex items-center gap-1 text-xs px-3 py-2 rounded transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans,sans-serif' }}>
          <X size={12} /> Limpar
        </button>
      )}
    </div>
  )
}
