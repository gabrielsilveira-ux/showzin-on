'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
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
    <div className="flex min-h-screen" style={{ fontFamily: 'DM Sans,sans-serif', background: 'linear-gradient(180deg,#f7f3eb 0%,#efe9dc 100%)' }}>
      {/* Sidebar */}
      <aside className="min-h-screen flex flex-col fixed top-0 left-0 bottom-0 z-50 border-r" style={{ width: 272, background: 'linear-gradient(180deg,#191712 0%,#242018 100%)', borderColor: 'rgba(255,255,255,0.08)' }}>
        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Link href="/" className="block">
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
              Eventos<span style={{ color: 'var(--accent)' }}>·</span>Livres
            </div>
            <div className="text-xs mt-1" style={{ fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.42)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Painel Admin
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1.5">
          <div className="text-xs px-3 mb-2 mt-2" style={{ fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Menu</div>
          {NAV.map(item => {
            const Icon = item.icon
            const active = path === item.href || (item.href !== '/admin' && path.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all"
                style={{
                  background: active ? 'linear-gradient(135deg, rgba(232,67,10,0.26), rgba(232,67,10,0.12))' : 'transparent',
                  color: active ? '#ffd1bf' : 'rgba(255,255,255,0.7)',
                  border: active ? '1px solid rgba(232,67,10,0.42)' : '1px solid transparent',
                }}>
                <Icon size={17} />
                {item.label}
              </Link>
            )
          })}
          <div className="pt-4 border-t mt-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <a href="/" target="_blank"
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all hover:bg-white/5"
              style={{ color: 'rgba(0, 0, 0, 0.58)' }}>
              <ExternalLink size={17} /> Ver portal
            </a>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 rounded-xl border px-3 py-2.5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: 'rgba(232,67,10,0.25)', color: 'var(--accent)' }}>A</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: '#000000' }}>Admin</div>
              <div className="text-xs" style={{ fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.3)' }}>editor</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              title="Sair"
              aria-label="Sair da conta"
              className="transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 272 }}>
        {children}
      </div>
    </div>
  )
}
