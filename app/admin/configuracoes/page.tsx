'use client'
import { useState } from 'react'

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    siteName:    'EventosLivres',
    region:      'Campinas e região',
    email:       'contato@eventoslivres.com.br',
    autoApprove: false,
    newsletter:  true,
    blogSync:    true,
  })

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <>
      <header className="h-14 px-8 flex items-center justify-between border-b sticky top-0 z-10"
        style={{ background: 'var(--cream)', borderColor: 'var(--border)' }}>
        <div>
          <span className="font-semibold text-sm">Configurações</span>
          <span className="text-xs ml-2" style={{ color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>
            / admin / configuracoes
          </span>
        </div>
      </header>

      <main className="p-8 max-w-2xl">
        <div className="space-y-6">

          {/* Portal */}
          <div className="rounded-xl border p-6" style={{ background: '#fff', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: "'Playfair Display',serif" }}>
              🌐 Configurações do portal
            </h2>
            {[
              { key: 'siteName', label: 'Nome do portal', placeholder: 'EventosLivres' },
              { key: 'region',   label: 'Região coberta',  placeholder: 'Campinas e região' },
              { key: 'email',    label: 'E-mail de contato', placeholder: 'contato@...' },
            ].map(f => (
              <div key={f.key} className="mb-4">
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ fontFamily: 'DM Mono,monospace', color: 'var(--ink-muted)' }}>{f.label}</label>
                <input
                  value={form[f.key as keyof typeof form] as string}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ background: '#fff', borderColor: 'var(--border)', fontFamily: 'DM Sans,sans-serif' }}
                />
              </div>
            ))}
          </div>

          {/* Governança */}
          <div className="rounded-xl border p-6" style={{ background: '#fff', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-5" style={{ fontFamily: "'Playfair Display',serif" }}>
              ⚙️ Governança e curadoria
            </h2>
            {[
              { key: 'autoApprove', label: 'Aprovação automática de eventos',   desc: 'Publicar eventos enviados por colaboradores sem revisão manual (não recomendado)' },
              { key: 'newsletter',  label: 'Newsletter automática semanal',      desc: 'Enviar e-mail toda quinta-feira com os eventos do fim de semana' },
              { key: 'blogSync',    label: 'Sincronizar eventos com o blog',     desc: 'Gerar automaticamente posts de roteiro com base nos eventos publicados' },
            ].map(opt => (
              <label key={opt.key} className="flex items-start gap-3 cursor-pointer mb-4 last:mb-0">
                <input
                  type="checkbox"
                  checked={!!form[opt.key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [opt.key]: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-orange-600"
                />
                <div>
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {/* DB stub */}
          <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-3" style={{ fontFamily: "'Playfair Display',serif" }}>
              🗄️ Banco de dados
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              O projeto está usando <strong>mock data</strong> em memória. Para conectar ao banco real:
            </p>
            <ol className="text-sm space-y-2" style={{ color: 'var(--ink-soft)' }}>
              {[
                'Crie uma conta no Supabase (supabase.com)',
                'Crie um projeto e copie as credenciais',
                'Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local',
                'Substitua as funções em lib/db.ts pelos comentários TODO',
                'Execute o schema SQL fornecido no painel do Supabase',
              ].map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 font-mono text-xs mt-0.5" style={{ color: 'var(--accent)' }}>{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <button onClick={save}
            className="px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ background: saved ? '#16a34a' : 'var(--accent)' }}>
            {saved ? '✓ Salvo!' : 'Salvar configurações'}
          </button>
        </div>
      </main>
    </>
  )
}
