'use client'
import Link from 'next/link'
import { Search, User, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0 font-display text-2xl font-bold tracking-tight text-primary">
          show<span className="text-accent">zin</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-full px-4 h-10 bg-surface/50 border border-border focus-within:border-accent/50 transition-colors">
          <Search size={16} className="text-muted" />
          <input placeholder="Buscar eventos, artistas, etc..." className="bg-transparent outline-none text-sm w-full placeholder:text-muted/70" />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button className="h-10 px-4 rounded-full text-sm font-medium text-white inline-flex items-center gap-2 bg-accent hover:bg-accent-hover transition-colors">
            <User size={16} /> Entrar
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button className="h-10 w-10 rounded-full inline-flex items-center justify-center bg-surface border border-border">
            <Search size={16} className="text-primary" />
          </button>
          <button className="h-10 w-10 rounded-full inline-flex items-center justify-center bg-surface border border-border">
            <Menu size={16} className="text-primary" />
          </button>
        </div>
      </div>
    </header>
  )
}
