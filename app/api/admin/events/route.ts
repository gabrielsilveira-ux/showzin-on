import { NextRequest, NextResponse } from 'next/server'
import { createEvent, getAllEventsAdmin } from '@/lib/db'
import { EventFormData } from '@/types'

// GET /api/admin/events — lista todos
export async function GET() {
  try {
    const events = await getAllEventsAdmin()
    return NextResponse.json(events)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 })
  }
}

// POST /api/admin/events — cria novo
export async function POST(req: NextRequest) {
  try {
    const body: EventFormData = await req.json()

    // Validação básica
    if (!body.title || !body.category || !body.date_start || !body.cidade) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const event = await createEvent(body)
    return NextResponse.json(event, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar evento'
    console.error('create event error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
