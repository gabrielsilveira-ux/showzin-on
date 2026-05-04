'use client'
import Link from 'next/link'
import { Menu, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: '#141419', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center gap-4 text-white">
        <Link href="/" className="shrink-0" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700 }}>
          SHOW<span style={{ color: '#a347e8' }}>ZIN</span>
        </Link>

        <div className="hidden md:flex flex-1 items-center gap-2 rounded-md px-3 h-10" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <Search size={16} color="#c6c6d1" />
          <input placeholder="O que você está procurando?" className="bg-transparent outline-none text-sm w-full text-white" />
        </div>

        <nav className="hidden lg:flex items-center gap-5 text-sm" style={{ color: '#d8d8e4' }}>
          <a href="#eventos">Próximos shows</a>
          <a href="#destaques">Destaques</a>
          <a href="#cidades">Cidades</a>
        </nav>

        <button className="lg:hidden h-10 w-10 rounded-md inline-flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <Menu size={18} />
        </button>
      </div>
    </header>
  )
}
