'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const path = usePathname()
  const links = [
    { href: '/#eventos', label: 'Eventos' },
    { href: '/#cidades', label: 'Cidades' },
    { href: '/blog', label: 'Blog' },
  ]
  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--cream)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '1.3rem' }}>
            Eventos<span style={{ color: 'var(--accent)' }}>·</span>Livres
          </span>
          <span className="hidden sm:inline text-xs px-1.5 py-0.5 rounded" style={{ fontFamily: 'DM Mono,monospace', background: 'var(--surface-2)', color: 'var(--ink-muted)', letterSpacing: '0.08em' }}>
            BETA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
              style={{ color: path === l.href ? 'var(--accent)' : 'var(--ink-soft)' }}
            >{l.label}</Link>
          ))}
        </nav>

        <Link href="/#newsletter"
          className="text-sm font-medium px-4 py-2 rounded transition-colors"
          style={{ background: 'var(--ink)', color: '#fff' }}
        >
          Receber dicas →
        </Link>
      </div>
    </header>
  )
}
