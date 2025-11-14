"use client";

import { motion } from "framer-motion";

interface StakingPositionCardProps {
  userStaked: number;
  pendingRewards: number;
  symbol: string;
  onClaim: () => void;
  delay?: number;
}

export function StakingPositionCard({
  userStaked,
  pendingRewards,
  symbol,
  onClaim,
  delay = 0.25,
}: StakingPositionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative bg-black/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-lg mt-8"
    >
      {/* Claim Rewards Button */}
      <button
        onClick={onClaim}
        className="
          absolute top-4 right-4 
          px-4 py-2 
          rounded-xl 
          bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600
          text-white text-xs font-semibold
          shadow-lg shadow-black/30
          hover:opacity-90 hover:scale-[1.03]
          active:scale-[0.97]
          transition-all
        "
      >
        Claim Rewards
      </button>

      <h3 className="text-xl font-bold text-cyan-400 mb-4">Your Position</h3>

      <table className="w-full text-sm text-gray-300">
        <tbody className="[&>tr:hover]:bg-white/5 transition">
          <tr className="border-b border-white/10">
            <td className="py-2 px-2 text-gray-400">Staked</td>
            <td className="py-2 px-2 text-right text-gray-100">
              {userStaked.toLocaleString()} {symbol}
            </td>
          </tr>

          <tr>
            <td className="py-2 px-2 text-gray-400">Unclaimed Rewards</td>
            <td className="py-2 px-2 text-right text-gray-100">
              {pendingRewards.toLocaleString()} r{symbol}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="mt-3 text-xs text-gray-500">
        Rewards update on-chain automatically.
      </p>
    </motion.div>
  );
}
