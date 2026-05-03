'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CalendarDays, PlusCircle, Settings, ExternalLink, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/admin/eventos/novo', label: 'Novo evento', icon: PlusCircle },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'DM Sans,sans-serif', background: '#F0EDE5' }}>
      {/* Sidebar */}
      <aside className="w-60 min-h-screen flex flex-col fixed top-0 left-0 bottom-0 z-50" style={{ background: 'var(--ink)' }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Link href="/" className="block">
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>
              Eventos<span style={{ color: 'var(--accent)' }}>·</span>Livres
            </div>
            <div className="text-xs mt-0.5" style={{ fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Painel Admin
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <div className="text-xs px-2 mb-2 mt-2" style={{ fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Menu</div>
          {NAV.map(item => {
            const Icon = item.icon
            const active = path === item.href || (item.href !== '/admin' && path.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{ background: active ? 'rgba(232,67,10,0.18)' : 'transparent', color: active ? 'var(--accent)' : 'rgba(255,255,255,0.55)' }}>
                <Icon size={17} />
                {item.label}
              </Link>
            )
          })}
          <div className="pt-4 border-t mt-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <a href="/" target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              <ExternalLink size={17} /> Ver portal
            </a>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: 'rgba(232,67,10,0.25)', color: 'var(--accent)' }}>A</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: '#fff' }}>Admin</div>
              <div className="text-xs" style={{ fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.3)' }}>editor</div>
            </div>
            <button className="transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}><LogOut size={15} /></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
