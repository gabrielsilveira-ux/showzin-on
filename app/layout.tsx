import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'EventosLivres — Eventos gratuitos em Campinas e região', template: '%s | EventosLivres' },
  description: 'Descubra eventos gratuitos em Campinas, Paulínia, Jundiaí e região.',
  keywords: ['eventos gratuitos', 'campinas', 'eventos grátis'],
  openGraph: { title: 'EventosLivres', description: 'Eventos gratuitos em Campinas e região', type: 'website', locale: 'pt_BR' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
