import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="pt-12 pb-8 border-t border-border/50 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display font-bold text-2xl tracking-tight text-primary">
              show<span className="text-accent">zin</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted max-w-xs">
              O maior portal de eventos gratuitos da região de Campinas.
            </p>
          </div>
          {[
            { title: 'Explorar', links: [['/#eventos','Todos os eventos'],['/#cidades','Por cidade'],['/#newsletter','Newsletter']] },
            { title: 'Conteúdo', links: [['/blog','Blog'],['/blog','Roteiros'],['/blog','Guias']] },
            { title: 'Portal', links: [['/enviar-evento','Enviar evento'],['/admin','Painel Admin'],['/sobre','Sobre']] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs uppercase tracking-widest text-muted/50 font-medium">{col.title}</h4>
              {col.links.map(([href, label]) => (
                <Link key={href+label} href={href} className="block text-sm mb-2 text-muted hover:text-primary transition-colors">{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs border-t border-border/50 text-muted/60">
          <span>© {new Date().getFullYear()} EventosLivres · Campinas, SP</span>
          <span>Feito com ♥ para a comunidade</span>
        </div>
      </div>
    </footer>
  )
}
