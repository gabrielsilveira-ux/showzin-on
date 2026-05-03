'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CATEGORY_CONFIG } from '@/lib/db'
import { Category } from '@/types'

export default function CategoryPills() {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()
  const active   = params.get('genre') ?? ''

  const set = (val: string) => {
    const sp = new URLSearchParams(params.toString())
    if (val) sp.set('genre', val); else sp.delete('genre')
    router.push(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button onClick={() => set('')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
        style={{ background: !active ? 'var(--ink)' : 'var(--surface)', color: !active ? '#fff' : 'var(--ink-soft)', border: `1.5px solid ${!active ? 'var(--ink)' : 'transparent'}` }}>
        Todos
      </button>
      {(Object.entries(CATEGORY_CONFIG) as [Category, { label: string; color: string; emoji: string }][]).map(([key, cfg]) => (
        <button key={key} onClick={() => set(key)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
          style={{ background: active === key ? 'var(--ink)' : 'var(--surface)', color: active === key ? '#fff' : 'var(--ink-soft)', border: `1.5px solid ${active === key ? 'var(--ink)' : 'transparent'}` }}>
          <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
          {cfg.label}
        </button>
      ))}
    </div>
  )
}
