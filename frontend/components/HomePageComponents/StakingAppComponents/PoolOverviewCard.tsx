"use client";

import { motion } from "framer-motion";

interface PoolOverviewCardProps {
  loading: boolean;
  tvl: number;
  rewardRate?: bigint;
  aprPercent: number;
  contractAddress?: string;
  symbol: string;
  delay?: number;
}

export function PoolOverviewCard({
  loading,
  tvl,
  rewardRate,
  aprPercent,
  contractAddress,
  symbol,
  delay = 0.15,
}: PoolOverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-black/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-cyan-400 mb-4">Pool Overview</h3>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading pool data…</p>
      ) : (
        <div className="overflow-hidden">
          <table className="w-full text-gray-300 text-sm">
            <tbody className="[&>tr:hover]:bg-white/5 transition-all">

              <tr className="border-b border-white/10">
                <td className="py-2 px-2 text-gray-400">TVL</td>
                <td className="py-2 px-2 text-center text-gray-100">
                  {tvl.toLocaleString()} {symbol}
                </td>
              </tr>

              <tr className="border-b border-white/10">
                <td className="py-2 px-2 text-gray-400">Reward Rate</td>
                <td className="py-2 px-2 text-center text-gray-100">
                  {rewardRate?.toString()} wei / sec
                </td>
              </tr>

              <tr className="border-b border-white/10">
                <td className="py-2 px-2 text-gray-400">APR</td>
                <td className="py-2 px-2 text-center text-green-400">
                  {aprPercent.toFixed(2)}%
                </td>
              </tr>

              <tr>
                <td className="py-2 px-2 text-gray-400">Contract</td>
                <td
                  className="
                    py-2 px-2 text-center 
                    text-gray-100 truncate 
                    max-w-[200px]
                  "
                >
                  {contractAddress}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      )}

      <div className="pt-4 mt-2 border-t border-black/10 space-y-1 text-sm">
        <p className="text-gray-400">
          Market Price: <span className="text-gray-100">$—</span>
        </p>
        <p className="text-gray-400">
          24h Change: <span className="text-green-400">—%</span>
        </p>
        <p className="text-gray-400">
          Market Cap: <span className="text-gray-100">$—</span>
        </p>
      </div>
    </motion.div>
  );
}
