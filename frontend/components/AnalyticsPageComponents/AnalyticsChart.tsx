"use client"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts"
import Image from "next/image"

export interface TokenHistoryPoint {
  timestamp: string
  tvl: number
  apr: number
}

interface TokenData {
  id: number
  symbol: string
  name: string
  priceUSD: number | null
  change24h: number | null
  marketCap: number | null
  volume24h: number | null
  history?: TokenHistoryPoint[]
}

interface TokenUI {
  id: number
  symbol: string
  name: string
  logo: any
}

interface AnalyticsChartProps {
  data: Record<string, TokenData>
  loading: boolean
  chartToken: string
  setChartToken: React.Dispatch<React.SetStateAction<string>>
  tokens: TokenUI[]
}

export function AnalyticsChart({
  data,
  loading,
  chartToken,
  setChartToken,
  tokens,
}: AnalyticsChartProps) {
  const activeColor =
    chartToken === "ETH"
      ? "#22d3ee"
      : chartToken === "MATIC"
      ? "#a855f7"
      : chartToken === "BNB"
      ? "#facc15"
      : chartToken === "SOL"
      ? "#38bdf8"
      : "#10b981"

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="
        relative mt-16 rounded-3xl border border-white/10
        bg-black/45 backdrop-blur-xl
        p-8 md:p-10 shadow-2xl overflow-visible
      "
    >
      {/* background aura */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                      rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl opacity-20" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="w-full">
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text 
                         bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            {chartToken} Pool Performance
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            TVL & APR movement across the last 14 days
          </p>
        </div>

        {/* TOKEN SELECTOR – fully responsive */}
        <div
          className="
            flex flex-wrap justify-start md:justify-end gap-3 
            w-full md:w-auto
          "
        >
          {tokens.map((t) => {
            const isActive = t.symbol === chartToken
            return (
              <button
                key={t.symbol}
                onClick={() => setChartToken(t.symbol)}
                className={`
                  group relative flex items-center gap-2 px-4 py-2 
                  rounded-xl min-w-[92px]
                  border transition-all backdrop-blur-md 
                  text-sm md:text-base
                  ${isActive ? 
                    "border-cyan-400 bg-white/10 shadow-lg scale-[1.03]" : 
                    "border-white/10 bg-white/5 hover:border-cyan-300/40"
                  }
                `}
              >
                <Image
                  src={t.logo}
                  width={20}
                  height={20}
                  alt={t.symbol}
                  className="rounded-full"
                />
                <span className="text-gray-200">{t.symbol}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[360px] sm:h-[420px]">
        {loading ? (
          <p className="text-gray-400 text-center py-20">Loading analytics...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data[chartToken]?.history || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                {/* neon glow */}
                <linearGradient id="tvlGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeColor} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={activeColor} stopOpacity={0.25} />
                </linearGradient>

                <linearGradient id="aprGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e879f9" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.25} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 3" stroke="rgba(255,255,255,0.05)" />

              <XAxis dataKey="timestamp" stroke="#b3b3b3" />
              <YAxis
                yAxisId="left"
                stroke={activeColor}
                tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#e879f9"
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.85)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#ccc" }}
              />

              <Legend wrapperStyle={{ paddingTop: 10 }} iconType="circle" />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tvl"
                stroke="url(#tvlGlow)"
                strokeWidth={3.5}
                dot={false}
                name="TVL (USD)"
                animationDuration={700}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="apr"
                stroke="url(#aprGlow)"
                strokeWidth={3.5}
                dot={false}
                name="APR (%)"
                animationDuration={700}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}
