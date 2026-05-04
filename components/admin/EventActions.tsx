'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  eventId: string
  currentStatus: string
}

export default function EventActions({ eventId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'pause' | 'publish' | 'delete' | null>(null)

  const togglePause = async () => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published'
    setLoading(nextStatus === 'draft' ? 'pause' : 'publish')
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Erro ao atualizar status')
      }
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar status')
    } finally {
      setLoading(null)
    }
  }

  const removeEvent = async () => {
    if (!confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.')) return
    setLoading('delete')
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Erro ao excluir evento')
      }
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir evento')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={togglePause}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 rounded border transition-all hover:border-stone-400"
        style={{ border: '1px solid var(--border)', color: 'var(--ink-muted)', fontFamily: 'DM Mono,monospace' }}>
        {loading === 'pause' || loading === 'publish' ? 'salvando...' : currentStatus === 'published' ? 'pausar' : 'publicar'}
      </button>
      <button
        type="button"
        onClick={removeEvent}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 rounded border transition-all hover:border-red-400"
        style={{ border: '1px solid #fca5a5', color: '#b91c1c', fontFamily: 'DM Mono,monospace' }}>
        {loading === 'delete' ? 'excluindo...' : 'excluir'}
      </button>
    </div>
  )
}
