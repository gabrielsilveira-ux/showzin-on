import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-slate-300 pt-14 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-2xl tracking-tight text-white">
              SHOW<span className="text-fuchsia-400">ZIN</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed max-w-xs text-slate-400">
              Um hub de eventos gratuitos com visual contemporâneo e foco em descoberta local.
            </p>
          </div>
          {[
            { title: 'Explorar', links: [['/#eventos', 'Todos os eventos'], ['/#cidades', 'Por cidade'], ['/#newsletter', 'Newsletter']] },
            { title: 'Conteúdo', links: [['/blog', 'Blog'], ['/blog', 'Roteiros'], ['/blog', 'Guias']] },
            { title: 'Portal', links: [['/enviar-evento', 'Enviar evento'], ['/admin', 'Painel Admin'], ['/sobre', 'Sobre']] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">{col.title}</h4>
              {col.links.map(([href, label]) => (
                <Link key={href + label} href={href} className="block text-sm mb-2 transition-colors hover:text-white">{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs border-t border-white/10 text-slate-500">
          <span>© {new Date().getFullYear()} SHOWZIN · Campinas, SP</span>
          <span>Experiência digital repensada para eventos locais.</span>
        </div>
      </div>
    </footer>
  )
}
