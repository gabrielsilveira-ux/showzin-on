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
    <div className="flex min-h-screen bg-background text-primary">
      {/* Sidebar */}
      <aside className="min-h-screen flex flex-col fixed top-0 left-0 bottom-0 z-50 border-r border-border bg-surface w-[272px]">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border">
          <Link href="/" className="block">
            <div className="font-display font-black text-2xl text-primary tracking-tight">
              Eventos<span className="text-accent">·</span>Livres
            </div>
            <div className="text-[10px] mt-1 font-mono text-muted uppercase tracking-widest">
              Painel Admin
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-[10px] px-3 mb-4 font-mono text-muted/70 uppercase tracking-wider">Menu</div>
          {NAV.map(item => {
            const Icon = item.icon
            const active = path === item.href || (item.href !== '/admin' && path.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all border ${
                  active 
                    ? 'bg-accent/10 text-accent border-accent/30 font-medium shadow-sm shadow-accent/5' 
                    : 'text-muted hover:text-primary border-transparent hover:bg-white/5'
                }`}>
                <Icon size={18} className={active ? 'text-accent' : 'text-muted'} />
                {item.label}
              </Link>
            )
          })}
          <div className="pt-6 mt-6 border-t border-border">
            <a href="/" target="_blank"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-primary transition-all hover:bg-white/5">
              <ExternalLink size={18} /> Ver portal
            </a>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-border">
          <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-3 bg-white/5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-accent text-white">A</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate text-primary">Admin</div>
              <div className="text-xs font-mono text-muted">editor</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              title="Sair"
              aria-label="Sair da conta"
              className="text-muted hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/10">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen ml-[272px]">
        {children}
      </div>
    </div>
  )
}
