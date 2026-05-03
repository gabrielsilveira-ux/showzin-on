import { NextRequest, NextResponse } from 'next/server'
import { getEvents } from '@/lib/db'
import { EventFilters, Category } from '@/types'

// GET /api/events?city=Campinas&genre=rock&period=fds&q=festival
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const filters: Partial<EventFilters> = {
      city:   searchParams.get('city')   ?? '',
      genre:  (searchParams.get('genre') as Category) ?? '',
      period: (searchParams.get('period') as EventFilters['period']) ?? '',
      search: searchParams.get('q') ?? '',
    }
    const events = await getEvents(filters)
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 })
  }
}
