'use client'
import Link from 'next/link'
import { Search, User, Ticket, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center gap-4">
        <Link href="/" className="shrink-0 text-2xl font-extrabold tracking-tight text-slate-900">
          SHOW<span className="text-violet-600">ZIN</span>
        </Link>

        <div className="hidden md:flex flex-1 items-center gap-2 rounded-xl px-3 h-10 bg-slate-100 border border-slate-200">
          <Search size={16} color="#667085" />
          <input placeholder="Buscar eventos, artistas, locais..." className="bg-transparent outline-none text-sm w-full text-slate-700" />
        </div>

        <button className="hidden sm:inline-flex h-10 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 items-center gap-2">
          <Ticket size={14} /> Ingressos
        </button>
        <button className="h-10 px-4 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 inline-flex items-center gap-2 transition-colors">
          <User size={14} /> Entrar
        </button>
        <button className="md:hidden h-10 w-10 rounded-xl inline-flex items-center justify-center bg-slate-100 border border-slate-200">
          <Menu size={16} color="#475467" />
        </button>
      </div>
    </header>
  )
}
