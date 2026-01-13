import { NextRequest, NextResponse } from 'next/server'

// Metronome API endpoint for querying usage/events
// Using events/search endpoint which supports querying by customer and date range
const METRONOME_API_URL = 'https://api.metronome.com/v1/events/search'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, start_date, end_date } = body

    if (!customer_id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    const apiToken = process.env.METRONOME_API_TOKEN

    if (!apiToken) {
      return NextResponse.json(
        { error: 'METRONOME_API_TOKEN environment variable is not set' },
        { status: 500 }
      )
    }

    // Format dates for Metronome API (ISO 8601)
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
    
    // Set end date to end of day
    endDate.setHours(23, 59, 59, 999)

    const start_iso = startDate.toISOString()
    const end_iso = endDate.toISOString()

    // Build search payload for Metronome events/search API
    // This endpoint supports filtering by customer_id and date range
    const payload = {
      customer_id,
      start: start_iso,
      end: end_iso,
    }

    const response = await fetch(METRONOME_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Metronome API error: ${response.status}`
      
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Handle different response formats from Metronome API
    // Response could be: array of events, {events: [...]}, or {data: [...]}
    let events: any[] = []
    
    if (Array.isArray(data)) {
      events = data
    } else if (data.events && Array.isArray(data.events)) {
      events = data.events
    } else if (data.data && Array.isArray(data.data)) {
      events = data.data
    }

    // Calculate totals
    let total_count_seconds = 0
    let total_events = events.length

    if (events.length > 0) {
      total_count_seconds = events.reduce((sum: number, event: any) => {
        return sum + (event.count_seconds || 0)
      }, 0)
    }

    return NextResponse.json({
      customer_id,
      start_time: start_iso,
      end_time: end_iso,
      events,
      total_events,
      total_count_seconds,
      raw_response: data, // Include raw response for debugging
    })
  } catch (error) {
    console.error('Error fetching usage data:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch usage data' 
      },
      { status: 500 }
    )
  }
}
