'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

// Logos (adjust to your paths)
import ethLogo from '@/public/ethereum-eth-logo.png'
import maticLogo from '@/public/polygon-matic-logo.png'
import usdtLogo from '@/public/tether-usdt-logo.png'
import bnbLogo from '@/public/bnb-bnb-logo.png'
import solLogo from '@/public/solana-sol-logo.png'

// -----------------------------
// Types
// -----------------------------
type TokenSymbol = 'ETH' | 'MATIC' | 'USDT' | 'BNB' | 'SOL'

interface RewardItem {
  symbol: TokenSymbol
  name: string
  logo: any
  apy: number                 // displayed APY
  staked: number              // user staked amount (token units)
  claimable: number           // claimable rewards (token units)
  claimableUsd: number        // claimable in USD (precomputed for UX)
  targetWeeklyUsd?: number    // optional target to animate ring
}

interface ClaimRow {
  symbol: TokenSymbol
  amount: number
  date: string
  tx: string
}

// -----------------------------
// Mock: price map + data simulators
// In production, replace with your CMC-backed server route and on-chain reads.
// -----------------------------
const PRICE_USD: Record<TokenSymbol, number> = {
  ETH: 3400,
  MATIC: 0.7,
  USDT: 1,
  BNB: 380,
  SOL: 140,
}

const REWARDS: RewardItem[] = [
  { symbol: 'ETH',  name: 'Ethereum',     logo: ethLogo,  apy: 4.8, staked: 1.23,   claimable: 0.042, claimableUsd: 0.042 * PRICE_USD.ETH,  targetWeeklyUsd: 25 },
  { symbol: 'MATIC',name: 'Polygon',      logo: maticLogo, apy: 6.2, staked: 512.7, claimable: 9.51,  claimableUsd: 9.51 * PRICE_USD.MATIC, targetWeeklyUsd: 20 },
  { symbol: 'USDT', name: 'Tether USD',   logo: usdtLogo,  apy: 8.1, staked: 890.4, claimable: 7.38,  claimableUsd: 7.38 * PRICE_USD.USDT,  targetWeeklyUsd: 30 },
  { symbol: 'BNB',  name: 'Binance Coin', logo: bnbLogo,   apy: 3.3, staked: 6.85,  claimable: 0.12,  claimableUsd: 0.12 * PRICE_USD.BNB,   targetWeeklyUsd: 15 },
  { symbol: 'SOL',  name: 'Solana',       logo: solLogo,   apy: 5.4, staked: 42.8,  claimable: 0.65,  claimableUsd: 0.65 * PRICE_USD.SOL,   targetWeeklyUsd: 18 },
]

// Simulated rewards history (USD) for the chart
const rewardsHistory = Array.from({ length: 30 }).map((_, i) => {
  const base = 20 + i * 1.2
  const noise = Math.sin(i / 2.8) * 4 + (Math.random() - 0.5) * 2
  return {
    day: `Day ${i + 1}`,
    rewardsUsd: Math.max(0, base + noise),
  }
})

// Simulated claim history
const CLAIMS: ClaimRow[] = [
  { symbol: 'ETH', amount: 0.042, date: '2025-11-12', tx: '0xabc...1234' },
  { symbol: 'MATIC', amount: 9.51, date: '2025-11-11', tx: '0xdef...5678' },
  { symbol: 'USDT', amount: 7.38, date: '2025-11-10', tx: '0x987...cafe' },
]

// -----------------------------
// Small utilities
// -----------------------------
function formatUsd(x: number | null | undefined) {
  if (!x || !Number.isFinite(x)) return '$—'
  return `$${x.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}
function formatNum(x: number) {
  return x.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

// -----------------------------
// Animated ring component
// -----------------------------
function RewardRing({
  percent,
  size = 96,
  stroke = 10,
  label,
  sublabel,
}: {
  percent: number
  size?: number
  stroke?: number
  label: string
  sublabel?: string
}) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const progress = Math.min(100, Math.max(0, percent))
  const dash = (progress / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${dash} ${circ - dash}`}
          style={{ transition: 'stroke-dasharray 800ms ease' }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute text-center leading-tight">
        <div className="text-sm text-gray-300">{label}</div>
        {sublabel && <div className="text-[11px] text-gray-500">{sublabel}</div>}
      </div>
    </div>
  )
}

// -----------------------------
// Reward card (per vault)
// -----------------------------
function RewardCard({
  r,
  onClaim,
  onCompound,
  busy,
}: {
  r: RewardItem
  onClaim: (sym: TokenSymbol) => void
  onCompound: (sym: TokenSymbol) => void
  busy: string | null
}) {
  const pct = useMemo(() => {
    if (!r.targetWeeklyUsd || r.targetWeeklyUsd <= 0) return 0
    return Math.min(100, (r.claimableUsd / r.targetWeeklyUsd) * 100)
  }, [r.claimableUsd, r.targetWeeklyUsd])

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-black/50 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-xl relative overflow-visible"
    >
      {/* glow */}
      <div className="absolute -top-20 -right-24 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent blur-3xl opacity-30 pointer-events-none" />
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <Image src={r.logo} alt={r.symbol} width={42} height={42} className="rounded-full" />
          <div>
            <h3 className="text-xl font-semibold text-white">{r.symbol}</h3>
            <p className="text-xs text-gray-400">{r.name}</p>
          </div>
        </div>
        <RewardRing
          percent={pct}
          label={`${Math.round(pct)}%`}
          sublabel="weekly goal"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-gray-400">APY</div>
          <div className="text-lg font-semibold text-green-400">{r.apy.toFixed(2)}%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-gray-400">Staked</div>
          <div className="text-lg font-semibold text-cyan-300">
            {formatNum(r.staked)} {r.symbol}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Claimable Rewards</div>
            <div className="text-xl font-bold text-emerald-400">
              {formatNum(r.claimable)} {r.symbol}
            </div>
            <div className="text-xs text-gray-400">{formatUsd(r.claimableUsd)}</div>
          </div>
          {/* future: live timer/streaming indicator */}
          <div className="text-[11px] px-2 py-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-300">
            accruing
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onClaim(r.symbol)}
          disabled={busy === r.symbol}
          className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-40"
        >
          {busy === r.symbol ? 'Claiming…' : 'Claim'}
        </button>
        <button
          onClick={() => onCompound(r.symbol)}
          disabled={busy === r.symbol}
          className="w-1/2 py-3 rounded-xl bg-white/10 border border-white/20 text-gray-100 hover:bg-white/15 transition-all disabled:opacity-40"
        >
          {busy === r.symbol ? 'Compounding…' : 'Compound'}
        </button>
      </div>
    </motion.div>
  )
}

// -----------------------------
// Rewards page
// -----------------------------
export default function RewardsPage() {
  const [busy, setBusy] = useState<string | null>(null)

  const totalClaimableUsd = useMemo(
    () => REWARDS.reduce((a, r) => a + r.claimableUsd, 0),
    []
  )

  // TODO: wire to on-chain:
  // - vault.earned(user) -> claimable
  // - vault.claim() for each symbol
  // - optional: claim & deposit flow for "Compound"
  function handleClaim(sym: TokenSymbol) {
    setBusy(sym)
    // TODO: wagmi writeContract({ address: vaultFor(sym), abi, functionName: 'claim' })
    setTimeout(() => setBusy(null), 1100)
  }
  function handleCompound(sym: TokenSymbol) {
    setBusy(sym)
    // TODO: claim(); approve(); deposit(); or a multicall/permit path
    setTimeout(() => setBusy(null), 1300)
  }

  return (
    <section className="relative min-h-screen py-20 px-6 flex flex-col items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f2027] via-[#203a43] to-[#2c5364]" />
      <div className="absolute inset-0 -z-10 blur-3xl opacity-70">
        <div className="absolute w-[650px] h-[650px] bg-gradient-to-br from-cyan-400/25 to-purple-500/25 rounded-full top-1/3 left-1/4 animate-pulse-slow" />
        <div className="absolute w-[420px] h-[420px] bg-gradient-to-tr from-fuchsia-400/25 to-blue-400/25 rounded-full bottom-1/3 right-1/4 animate-pulse-slow" />
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
          Grim Stake Rewards
        </h1>
        <p className="text-gray-400 mt-3">
          Track, claim, and compound your staking yields across all vaults.
        </p>
        <div className="mt-8">
          <ConnectButton />
        </div>

        <div className="mt-8 inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl">
          <span className="text-gray-400 text-sm">Total Claimable</span>
          <span className="text-3xl font-bold text-emerald-400">
            {formatUsd(totalClaimableUsd)}
          </span>
        </div>
      </motion.div>

      {/* Rewards grid */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {REWARDS.map((r) => (
          <RewardCard
            key={r.symbol}
            r={r}
            onClaim={handleClaim}
            onCompound={handleCompound}
            busy={busy}
          />
        ))}
      </div>

      {/* Rewards history chart */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-16 w-full max-w-6xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl relative overflow-visible"
      >
        <div className="absolute -top-20 -left-24 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent blur-3xl opacity-30 pointer-events-none" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Rewards Growth (USD)
            </h3>
            <p className="text-sm text-gray-400">Simulated 30-day reward accrual</p>
          </div>
        </div>

        <div className="w-full h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rewardsHistory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="lineC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.85)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#ccc' }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Rewards']}
              />
              <Line
                type="monotone"
                dataKey="rewardsUsd"
                stroke="url(#lineC)"
                strokeWidth={3}
                dot={false}
                name="Rewards (USD)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent claims */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mt-12 w-full max-w-6xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4">Recent Reward Claims</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-gray-300 text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-2 px-4 text-left">Token</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Tx</th>
              </tr>
            </thead>
            <tbody>
              {CLAIMS.map((c, i) => (
                <tr key={`${c.tx}-${i}`} className="border-b border-white/5">
                  <td className="py-2 px-4">{c.symbol}</td>
                  <td className="py-2 px-4">{c.amount}</td>
                  <td className="py-2 px-4">{c.date}</td>
                  <td className="py-2 px-4 text-cyan-400">
                    {/* TODO: use proper explorer per chain (etherscan/bscscan/polygonscan) */}
                    <a href="#" className="hover:underline">{c.tx}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  )
}
