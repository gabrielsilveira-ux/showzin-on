import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'rgba(255,255,255,0.55)' }} className="pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>
              Eventos<span style={{ color: 'var(--accent)' }}>·</span>Livres
            </p>
            <p className="mt-2 text-sm leading-relaxed max-w-xs" style={{ fontWeight: 300 }}>
              O maior portal de eventos gratuitos da região de Campinas.
            </p>
          </div>
          {[
            { title: 'Explorar', links: [['/#eventos','Todos os eventos'],['/#cidades','Por cidade'],['/#newsletter','Newsletter']] },
            { title: 'Conteúdo', links: [['/blog','Blog'],['/blog','Roteiros'],['/blog','Guias']] },
            { title: 'Portal', links: [['/enviar-evento','Enviar evento'],['/admin','Painel Admin'],['/sobre','Sobre']] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs uppercase tracking-widest" style={{ fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.3)' }}>{col.title}</h4>
              {col.links.map(([href, label]) => (
                <Link key={href+label} href={href} className="block text-sm mb-2 transition-colors hover:text-white">{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}>
          <span>© {new Date().getFullYear()} EventosLivres · Campinas, SP</span>
          <span>Feito com ♥ para a comunidade</span>
        </div>
      </div>
    </footer>
  )
}
