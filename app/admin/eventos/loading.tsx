export default function AdminEventsLoading() {
  return (
    <div className="p-8">
      <div className="rounded-xl border p-6 animate-pulse" style={{ background: '#fff', borderColor: 'var(--border)' }}>
        <div className="h-5 w-56 mb-4 rounded" style={{ background: 'var(--surface-2)' }} />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded" style={{ background: 'var(--surface)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
