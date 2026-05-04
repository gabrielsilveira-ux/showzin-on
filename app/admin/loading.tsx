export default function AdminLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#F0EDE5' }}>
      <div className="rounded-xl border px-5 py-3 text-sm animate-pulse" style={{ background: '#fff', borderColor: 'var(--border)', color: 'var(--ink-muted)' }}>
        Carregando painel administrativo...
      </div>
    </div>
  )
}
