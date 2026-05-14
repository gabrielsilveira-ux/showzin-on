import React, { Suspense } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Suspense><Header /></Suspense>
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="mb-3" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '2.5rem' }}>
          Página não encontrada
        </h1>
        <p className="text-base mb-8 max-w-sm" style={{ color: 'var(--ink-soft)', fontWeight: 300 }}>
          O evento ou página que você procura não existe ou foi removido.
        </p>
        <Link href="/" className="px-6 py-3 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          ← Voltar para a home
        </Link>
      </main>
      <Footer />
    </>
  )
}
