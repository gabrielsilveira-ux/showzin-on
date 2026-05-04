import { NextRequest, NextResponse } from 'next/server'
import { updateEvent, deleteEvent, getEventById } from '@/lib/db'
import { EventFormData } from '@/types'

interface Ctx { params: Promise<{ id: string }> }

// PATCH /api/admin/events/[id] — atualiza
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const body: Partial<EventFormData> = await req.json()
    const event = await updateEvent(id, body)
    return NextResponse.json(event)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar evento'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/admin/events/[id] — deleta
export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    await deleteEvent(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao deletar evento'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// GET /api/admin/events/[id] — busca um
export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const event = await getEventById(id)
    if (!event) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(event)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar evento' }, { status: 500 })
  }
}
