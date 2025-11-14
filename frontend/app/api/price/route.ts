import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const res = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_CMC_API_KEY || '',
        },
        cache: 'no-store',
      }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('CMC proxy error:', err)
    return NextResponse.json({ error: 'Failed to fetch CMC data' }, { status: 500 })
  }
}
