'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// token logos
import ethLogo from '@/public/ethereum-eth-logo.png'
import usdtLogo from '@/public/tether-usdt-logo.png'
import maticLogo from '@/public/polygon-matic-logo.png'
import bnbLogo from '@/public/bnb-bnb-logo.png'
import solLogo from '@/public/solana-sol-logo.png'

import { AnalyticsChart } from '@/components/AnalyticsPageComponents/AnalyticsChart'


interface Token {
    id: number
    symbol: string
    name: string
    logo: any
}

const TOKENS: Token[] = [
    { id: 1027, symbol: 'ETH', name: 'Ethereum', logo: ethLogo },
    { id: 825, symbol: 'USDT', name: 'Tether USD', logo: usdtLogo },
    { id: 3890, symbol: 'MATIC', name: 'Polygon', logo: maticLogo },
    { id: 1839, symbol: 'BNB', name: 'Binance Coin', logo: bnbLogo },
    { id: 5426, symbol: 'SOL', name: 'Solana', logo: solLogo },
]

interface TokenData {
    id: number
    symbol: string
    name: string
    priceUSD: number | null
    change24h: number | null
    marketCap: number | null
    volume24h: number | null
    apr?: number
    totalStaked?: number
    totalStakers?: number
    rewardsGenerated?: number
    tvlUSD?: number
    history?: { timestamp: string; tvl: number; apr: number }[]
}


export default function AnalyticsPage() {
    const [tokenData, setTokenData] = useState<Record<string, TokenData>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [chartToken, setChartToken] = useState('ETH')

    useEffect(() => {
        async function fetchAnalytics() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch('/api/analytics/pools')
                if (!res.ok) throw new Error(`Request failed: ${res.status}`)
                const json = await res.json()

                const mapped: Record<string, TokenData> = {}
                    ; (json.data as TokenData[]).forEach((t) => {
                        mapped[t.symbol] = t
                    })
                setTokenData(mapped)
            } catch (err: any) {
                console.error('Analytics fetch error:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [])

    const totalMarketCap = Object.values(tokenData).reduce((acc, t) => acc + (t.marketCap || 0), 0)
    const avgChange = Object.values(tokenData).length
        ? Object.values(tokenData).reduce((acc, t) => acc + (t.change24h || 0), 0) / Object.values(tokenData).length
        : 0

    return (
        <section className="relative py-20 px-6 min-h-screen flex flex-col items-center justify-start text-center overflow-hidden">
            {/* background gradient */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f2027] via-[#203a43] to-[#2c5364]" />
            <div className="absolute inset-0 -z-10">
                <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/30 to-purple-500/20 blur-3xl rounded-full top-1/3 left-1/4 animate-pulse-slow" />
                <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-fuchsia-500/30 to-blue-400/20 blur-2xl rounded-full bottom-1/3 right-1/4 animate-pulse-slow" />
            </div>

            <div className="relative w-full max-w-6xl bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 text-left">
                {/* header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 border-b border-white/10 pb-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                        Staking Analytics
                    </h2>
                    <p className="text-gray-400 mt-3 md:mt-0">Real-time market metrics & pool statistics</p>
                </div>

                {error && (
                    <p className="text-red-400 text-sm mb-4">Error fetching analytics: {error}</p>
                )}

                {/* global stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 text-gray-300">
                        <h3 className="text-sm uppercase text-gray-400 mb-1">Total Market Cap</h3>
                        <p className="text-2xl font-semibold text-cyan-400">
                            {loading ? '—' : `$${(totalMarketCap / 1e9).toFixed(2)}B`}
                        </p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 text-gray-300">
                        <h3 className="text-sm uppercase text-gray-400 mb-1">Average 24h Change</h3>
                        <p className={`text-2xl font-semibold ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {loading ? '—' : `${avgChange.toFixed(2)}%`}
                        </p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 text-gray-300">
                        <h3 className="text-sm uppercase text-gray-400 mb-1">Total TVL (Placeholder)</h3>
                        <p className="text-2xl font-semibold text-purple-400">$—</p>
                        <p className="text-xs text-gray-500">Data will come from on-chain pools</p>
                    </div>
                </div>

                {/* token cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TOKENS.map((t) => {
                        const d = tokenData[t.symbol]
                        return (
                            <div
                                key={t.symbol}
                                className="bg-black/30 border border-white/10 rounded-2xl p-6 text-gray-300 hover:border-cyan-400/40 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Image src={t.logo} alt={t.symbol} width={32} height={32} className="rounded-full" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-100">{t.symbol}</h3>
                                        <p className="text-sm text-gray-400">{t.name}</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">
                                        Price:{' '}
                                        <span className="text-gray-100">
                                            {d && typeof d.priceUSD === 'number' ? `$${d.priceUSD.toFixed(2)}` : '—'}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        24h Change:{' '}
                                        <span className={d && d.change24h && d.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                                            {d && typeof d.change24h === 'number' ? `${d.change24h.toFixed(2)}%` : '—'}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Market Cap:{' '}
                                        <span className="text-gray-100">
                                            {d && typeof d.marketCap === 'number' ? `$${(d.marketCap / 1e9).toFixed(2)}B` : '—'}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Volume 24h:{' '}
                                        <span className="text-gray-100">
                                            {d && typeof d.volume24h === 'number' ? `$${(d.volume24h / 1e9).toFixed(2)}B` : '—'}
                                        </span>
                                    </p>
                                </div>

                                {/* 🔹 Placeholder for future on-chain analytics */}
                                <div className="mt-4 border-t border-white/10 pt-3 space-y-1">
                                    <p className="text-sm text-gray-400">APR (on-chain): <span className="text-green-400">—%</span></p>
                                    <p className="text-sm text-gray-400">TVL (on-chain): <span className="text-gray-100">$—</span></p>
                                    <p className="text-sm text-gray-400">Stakers: <span className="text-gray-100">—</span></p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-12 w-full">
                    <AnalyticsChart
                        data={tokenData}
                        loading={loading}
                        chartToken={chartToken}
                        setChartToken={setChartToken}
                        tokens={TOKENS}
                    />
                </div>


            </div>
        </section>
    )
}
