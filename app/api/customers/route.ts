import { NextRequest, NextResponse } from 'next/server'

// Metronome API endpoint for fetching customers
const METRONOME_API_URL = 'https://api.metronome.com/v1/customers'

export async function GET(request: NextRequest) {
  try {
    const apiToken = process.env.METRONOME_API_TOKEN

    if (!apiToken) {
      return NextResponse.json(
        { error: 'METRONOME_API_TOKEN environment variable is not set' },
        { status: 500 }
      )
    }

    const response = await fetch(METRONOME_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
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
    // Response could be: array of customers, {customers: [...]}, or {data: [...]}
    let customers: any[] = []
    
    if (Array.isArray(data)) {
      customers = data
    } else if (data.customers && Array.isArray(data.customers)) {
      customers = data.customers
    } else if (data.data && Array.isArray(data.data)) {
      customers = data.data
    }

    return NextResponse.json({
      customers,
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch customers' 
      },
      { status: 500 }
    )
  }
}
