'use client'
import Link from 'next/link'
import { Search, User, Ticket, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center gap-3">
        <Link href="/" className="shrink-0 text-2xl font-black tracking-tight text-white">
          SHOW<span className="text-fuchsia-400">ZIN</span>
        </Link>

        <div className="hidden md:flex flex-1 items-center gap-2 rounded-full px-4 h-11 bg-white/10 border border-white/15">
          <Search size={16} className="text-slate-300" />
          <input
            placeholder="Buscar eventos, artistas, locais..."
            className="bg-transparent outline-none text-sm w-full text-white placeholder:text-slate-400"
          />
        </div>

        <button className="hidden sm:inline-flex h-10 px-4 rounded-full text-sm font-semibold text-slate-100 bg-white/10 border border-white/20 items-center gap-2 hover:bg-white/15 transition-colors">
          <Ticket size={14} /> Ingressos
        </button>
        <button className="h-10 px-4 rounded-full text-sm font-semibold text-slate-950 bg-fuchsia-300 hover:bg-fuchsia-200 inline-flex items-center gap-2 transition-colors">
          <User size={14} /> Entrar
        </button>
        <button className="md:hidden h-10 w-10 rounded-full inline-flex items-center justify-center bg-white/10 border border-white/20">
          <Menu size={16} className="text-slate-100" />
        </button>
      </div>
    </header>
  )
}
