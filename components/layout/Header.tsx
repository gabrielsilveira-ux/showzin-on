'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, User, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '')
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  // Sincroniza o valor do input com a URL (caso o usuário mude o filtro no FilterBar)
  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '')
  }, [searchParams])

  const handleSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (!e || e.key === 'Enter') {
      const sp = new URLSearchParams(searchParams.toString())
      if (searchValue) sp.set('q', searchValue); else sp.delete('q')
      router.push(`/?${sp.toString()}`)
      setIsMobileSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0 font-display text-2xl font-bold tracking-tight text-primary">
          show<span className="text-accent">zin</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-full px-4 h-10 bg-surface/50 border border-border focus-within:border-accent/50 transition-colors">
          <Search size={16} className="text-muted" />
          <input 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Buscar eventos, artistas, etc..." 
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted/70 text-primary" 
          />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button className="h-10 px-4 rounded-full text-sm font-medium text-white inline-flex items-center gap-2 bg-accent hover:bg-accent-hover transition-colors">
            <User size={16} /> Entrar
          </button>
        </div>

        {/* Mobile Search Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="h-10 w-10 rounded-full inline-flex items-center justify-center bg-surface border border-border"
          >
            <Search size={16} className="text-primary" />
          </button>
          <button className="h-10 w-10 rounded-full inline-flex items-center justify-center bg-surface border border-border">
            <Menu size={16} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {isMobileSearchOpen && (
        <div className="md:hidden p-4 bg-surface border-b border-border animate-fade-up">
          <div className="flex items-center gap-2 rounded-full px-4 h-12 bg-background border border-border focus-within:border-accent/50 transition-colors">
            <Search size={18} className="text-muted" />
            <input 
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Buscar eventos..." 
              className="bg-transparent outline-none text-base w-full placeholder:text-muted/70 text-primary" 
            />
            {searchValue && (
              <button onClick={() => setSearchValue('')} className="p-1 text-muted">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
