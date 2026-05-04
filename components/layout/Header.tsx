'use client'
import Link from 'next/link'
import { Search, User, Ticket, ShoppingCart } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: '#f2f4f7', borderColor: '#d8dde5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center gap-4">
        <Link href="/" className="shrink-0" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2rem', fontWeight: 700, color: '#1a2232' }}>
          ic<span style={{ color: '#e53935' }}>•</span>nes
        </Link>

        <div className="flex-1 flex items-center gap-2 rounded-md px-3 h-10" style={{ background: '#e9edf2', border: '1px solid #d5dbe5' }}>
          <Search size={16} color="#6a7385" />
          <input placeholder="Buscar eventos, artistas, etc..." className="bg-transparent outline-none text-sm w-full" />
        </div>

        <button className="h-10 px-4 rounded-md text-sm font-semibold text-white inline-flex items-center gap-2" style={{ background: '#e54b4b' }}>
          <Ticket size={14} /> Meus ingressos
        </button>
        <button className="h-10 px-4 rounded-md text-sm font-semibold text-white inline-flex items-center gap-2" style={{ background: '#2e77d0' }}>
          <User size={14} /> Entrar | Cadastrar
        </button>
        <button className="h-10 w-10 rounded-md inline-flex items-center justify-center" style={{ background: '#e9edf2', border: '1px solid #d5dbe5' }}>
          <ShoppingCart size={15} color="#5f6878" />
        </button>
      </div>
    </header>
  )
}
