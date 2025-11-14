import { NextResponse } from 'next/server'

const CMC_API_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY
const BASE_URL = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest'

// CoinMarketCap IDs for tokens in your dApp
const TOKEN_IDS = [1027, 825, 3890, 1839, 5426] // ETH, USDT, MATIC, BNB, SOL

// Utility: generate simple time-series points for charts
function simulateHistory(baseTVL: number, baseAPR: number, days: number = 14) {
  const now = new Date()
  const history = []
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000)
    const fluct = (Math.random() * 0.1 - 0.05) // ±5%
    const tvl = baseTVL * (1 + fluct)
    const apr = baseAPR * (1 + fluct / 2)
    history.push({
      timestamp: date.toISOString().split('T')[0],
      tvl: Number(tvl.toFixed(2)),
      apr: Number(apr.toFixed(2)),
    })
  }
  return history
}

export async function GET() {
  try {
    const url = `${BASE_URL}?id=${TOKEN_IDS.join(',')}`
    const res = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY || '',
        'Accept': 'application/json',
      },
      next: { revalidate: 120 },
    })
    if (!res.ok) throw new Error(`CMC error ${res.status}`)
    const cmc = await res.json()

    const pools = Object.values(cmc.data).map((token: any) => {
      const usd = token.quote?.USD
      const price = usd?.price ?? 0

      // simulate staking data
      const baseTVL = price * (Math.random() * 20000 + 10000) // $ value
      const baseAPR = Math.random() * 5 + 2 // 2–7%
      const totalStakers = Math.floor(Math.random() * 2000 + 300)
      const totalRewards = baseTVL * 0.05 // pretend 5% distributed

      return {
        id: token.id,
        symbol: token.symbol,
        name: token.name,
        priceUSD: price,
        change24h: usd?.percent_change_24h ?? 0,
        marketCap: usd?.market_cap ?? 0,
        apr: Number(baseAPR.toFixed(2)),
        totalStaked: Number((baseTVL / price).toFixed(2)),
        totalStakers,
        rewardsGenerated: Number(totalRewards.toFixed(2)),
        tvlUSD: Number(baseTVL.toFixed(2)),
        history: simulateHistory(baseTVL, baseAPR),
      }
    })

    return NextResponse.json({
      status: 'ok',
      count: pools.length,
      data: pools,
    })
  } catch (err: any) {
    console.error('Analytics pools error:', err)
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 })
  }
}
