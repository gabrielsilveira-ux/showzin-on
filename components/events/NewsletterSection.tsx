'use client'
import { useState } from 'react'
import { CITIES } from '@/lib/db'

const INTERESTS = ['🎸 Rock', '🍔 Gastronomia', '👶 Infantil', '⚽ Esportes', '🎭 Teatro', '🎨 Cultura']

export default function NewsletterSection() {
  const [email, setEmail]     = useState('')
  const [city, setCity]       = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [sent, setSent]       = useState(false)

  const toggle = (i: string) => {
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : prev.length < 3 ? [...prev, i] : prev)
  }

  const submit = () => {
    if (!email || !city) return
    setSent(true)
  }

  return (
    <section className="py-16 px-4 sm:px-8" id="newsletter">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="mb-3 leading-tight" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.4rem)' }}>
            Receba os melhores eventos{' '}
            <em className="not-italic" style={{ color: 'var(--accent)' }}>toda semana</em>
          </h2>
          <p className="text-base" style={{ color: 'var(--ink-soft)', fontWeight: 300, lineHeight: 1.7 }}>
            Toda quinta-feira, uma seleção curada dos melhores eventos gratuitos do fim de semana. Escolha sua cidade e seus interesses.
          </p>
        </div>

        <div className="rounded-xl p-7 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {sent ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>Inscrição confirmada!</h3>
              <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Até quinta-feira com os melhores eventos gratuitos.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>Seu e-mail</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
                  style={{ background: '#fff', borderColor: 'var(--border)' }} />
              </div>
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>Sua cidade</label>
                <select value={city} onChange={e => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ background: '#fff', borderColor: 'var(--border)', fontFamily: 'DM Sans,sans-serif' }}>
                  <option value="">Selecione sua cidade</option>
                  {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>Interesses (até 3)</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => toggle(i)}
                      className="px-3 py-1.5 rounded-full text-sm border transition-all"
                      style={{ background: selected.includes(i) ? 'var(--ink)' : 'transparent', color: selected.includes(i) ? '#fff' : 'var(--ink-soft)', borderColor: selected.includes(i) ? 'var(--ink)' : 'var(--border-strong)' }}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={submit}
                className="w-full py-3 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ background: 'var(--accent)' }}>
                Quero receber →
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
