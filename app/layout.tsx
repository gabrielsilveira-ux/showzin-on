import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: { default: 'EventosLivres — Descubra Eventos Premium', template: '%s | EventosLivres' },
  description: 'O melhor portal para descobrir eventos, shows e festivais incríveis.',
  keywords: ['eventos', 'shows', 'festivais', 'ingressos'],
  openGraph: { title: 'EventosLivres', description: 'Descubra eventos incríveis', type: 'website', locale: 'pt_BR' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="min-h-screen bg-background text-primary selection:bg-accent/30">
        {children}
      </body>
    </html>
  )
}
