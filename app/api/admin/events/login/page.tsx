'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const res  = await signIn('credentials', {
      username: (form.elements.namedItem('username') as HTMLInputElement).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value,
      redirect: false,
    })
    if (res?.ok) {
      router.push('/admin')
    } else {
      setError('Usuário ou senha incorretos')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1C1A16', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.8rem', fontWeight: 900 }}>
            Eventos<span style={{ color: '#E8430A' }}>·</span>Livres
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>Painel administrativo</p>
        </div>

        <form onSubmit={submit} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24 }}>
          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: 6, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Usuário</label>
            <input name="username" required style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'sans-serif' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Senha</label>
            <input name="password" type="password" required style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'sans-serif' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: '#E8430A', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Entrando...' : 'Entrar no painel →'}
          </button>
        </form>
      </div>
    </div>
  )
}