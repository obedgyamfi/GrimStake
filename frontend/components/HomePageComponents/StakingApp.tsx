'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

// token logos
import ethLogo from '@/public/ethereum-eth-logo.png'
import usdtLogo from '@/public/tether-usdt-logo.png'
import usdcLogo from '@/public/usd-coin-usdc-logo.png'
import wethLogo from '@/public/wrapped-ether-weth-logo-png.png'
import daiLogo from '@/public/dai-dai-logo-png.png'
import maticLogo from '@/public/polygon-matic-logo.png'

// hook imports
import { useStake } from '@/lib/contracts/GrimStakeContractHooks/useStake'
import { useUnstake } from '@/lib/contracts/GrimStakeContractHooks/useUnstake'
import { usePoolStats } from '@/lib/contracts/GrimStakeContractHooks/usePoolStats'
import { useUserStakeInfo } from '@/lib/contracts/GrimStakeContractHooks/UserStakeInfo'
import { usePendingRewards } from '@/lib/contracts/GrimStakeContractHooks/usePendingRewards'
import { useApproveToken } from '@/lib/contracts/MockERC20ContractHooks/useApprove'
import { useClaimRewards } from "@/lib/contracts/GrimStakeContractHooks/useClaimRewards";

import { parseUnits, Address } from 'viem'
import { motion } from "framer-motion"

import {
  grimStakeAddress,
} from "@/src/generated"

import { addTokenToWallet } from '@/lib/helpers/addToken'
import toast from 'react-hot-toast'

import { useChainId } from 'wagmi'
import { StakingPositionCard } from './StakingAppComponents/StakingCardPosition'
import { PoolOverviewCard } from './StakingAppComponents/PoolOverviewCard'

interface Token {
  symbol: string
  name: string
  logo: any
  supported?: boolean
  addresses: Record<number, `0x${string}`>
  decimals: number
}


export const TOKENS: Token[] = [
  {
    symbol: "GRIM",
    name: "GrimToken (Testnet)",
    logo: maticLogo,
    decimals: 18,
    supported: true,
    addresses: {
      11155111: "0xf5ca3b0ff6396a49a51bf8231fa9489de7ca6696",
    }
  },
  {
    symbol: "USDC",
    name: "USD Coin (Testnet)",
    logo: usdcLogo,
    decimals: 6,
    supported: true,
    addresses: {
      11155111: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    },
  },

  {
    symbol: "WETH",
    name: "Wrapped Ether (Testnet)",
    logo: wethLogo,
    decimals: 18,
    supported: true,
    addresses: {
      11155111: "0x4200000000000000000000000000000000000006",
    },
  },

  {
    symbol: "DAI",
    name: "Dai Stablecoin (Testnet)",
    logo: daiLogo,
    decimals: 18,
    supported: true,
    addresses: {
      11155111: "0x6E1750bc5d6ABBc2Ff5EbB5378D3A1beE2F6C15f",
    },
  },

  {
    symbol: "USDT",
    name: "Tether USD (Community Test Token)",
    logo: usdtLogo,
    decimals: 18,
    supported: true,
    addresses: {
      11155111: "0xD5563Ce9e6D641D58A86c580Bb68bb4bAf7A36dE",
    },
  },
];



export default function StakePage() {
  const [selected, setSelected] = useState<Token>(TOKENS[0])
  const [amount, setAmount] = useState('')
  const [isStaked, setIsStaked] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { chainId, address: userAddress } = useAccount()
  const chainAddrId = useChainId();

  // Abi hooks
  const { claimRewards } = useClaimRewards();
  const { stake, isWriting: isStakingWrite } = useStake()

  const { unstake, isWriting: isUnstakeWrite, isConfirming: isUnstakeConfirming, isConfirmed: isUnstakeConfirmed, error: unstakeError } = useUnstake()
  const { approve, isApproved, isApproving } = useApproveToken()
  const tokenAddr = chainId ? selected.addresses[chainId] : undefined;
  const contractAddress = grimStakeAddress[chainAddrId as keyof typeof grimStakeAddress];

  // pool stats
  const { data: poolStats, isPending: poolLoading } = usePoolStats(tokenAddr as Address);

  const totalStaked = poolStats?.[0];
  const rewardRate = poolStats?.[1];
  const aprBps = poolStats?.[2];
  const aprPercent = aprBps ? Number(aprBps) / 100 : 0;
  const tvl = totalStaked ? Number(totalStaked) / 10 ** selected.decimals : 0;

  // user stake  position
  const { data: userStakeInfo } = useUserStakeInfo(userAddress as Address, tokenAddr as Address);
  const userStaked = userStakeInfo
  const userStakedFormatted = userStaked?.[0] ? Number(userStaked[0]) / 10 ** selected.decimals : 0

  // user pending reward 
  const { data: pending } = usePendingRewards(userAddress as Address, tokenAddr as Address)
  const pendingFormatted = pending ? Number(pending) / 10 ** selected.decimals : 0

  const handleClaim = () => {
    if (!chainId) {
      toast.error("Connect your wallet first.");
      return;
    }
    const token = selected.addresses[chainId];
    if (!token) {
      toast.error("Token not deployed on this network");
      return;
    };
    claimRewards(selected.addresses[chainId])
  };

  const handleStake = () => {
    if (!chainId) return;

    const token = selected.addresses[chainId];
    if (!token) {
      toast.error("Token not deployed on this network");
      return;
    }

    const amt = parseUnits(amount, selected.decimals);

    approve(token as Address, contractAddress as Address, amt);
  };

  const handleUnstake = () => {
    if (!chainId || !userAddress) {
      toast.error("Connect your wallet first");
      return;
    }

    const token = selected.addresses[chainId];
    if (!token) {
      toast.error(`Token ${selected.symbol} not deployed on this chain`);
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid unstake amount");
      return;
    }

    // Convert to bigint using correct decimals
    const amt = parseUnits(amount, selected.decimals);

    // You already fetched user staked amount:
    if (userStaked === undefined) {
      toast.error("User stake not loaded yet");
      return;
    }

    if (amt > userStaked[0]) {
      toast.error("You cannot unstake more than your staked balance");
      return;
    }

    toast.loading("Submitting unstake transaction");
    unstake(token as Address, amt);
  };


  async function handleAddToken() {
    if (!selected || !chainId) return;

    const tokenAddress = selected.addresses[chainId];
    if (!tokenAddress) return;

    await addTokenToWallet({
      address: tokenAddress,
      symbol: selected.symbol,
      decimals: selected.decimals,
      image: selected.logo.src,
    });
  }

  useEffect(() => {
    if (!isApproved) return;

    const token = selected.addresses[chainId!];
    const amt = parseUnits(amount, selected.decimals);

    stake(token as Address, amt);
  }, [isApproved]);


  return (
    <section id="stake" className="relative py-20 px-6 min-h-screen flex flex-col items-center justify-start text-center overflow-hidden">
      {/* background layers */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f2027] via-[#203a43] to-[#2c5364]" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/30 to-purple-500/20 blur-3xl rounded-full top-1/3 left-1/4 animate-pulse-slow" />
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-fuchsia-500/30 to-blue-400/20 blur-2xl rounded-full bottom-1/3 right-1/4 animate-pulse-slow" />
      </div>

      {/* main container */}
      <div className="relative w-full max-w-6xl bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 text-left space-y-10">
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            Grim Stake - Dashboard
          </h2>
          <ConnectButton />
        </div>

        {/* grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* left column: staking controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* token selector */}
            <div className="space-y-3">
              <label className="block text-sm text-gray-300 font-semibold">
                Select Token to Stake
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex justify-between items-center px-5 py-3 rounded-xl border border-white/20 bg-white/10 text-gray-100 hover:border-cyan-400 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={selected.logo}
                      alt={selected.symbol}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <span className="font-semibold">{selected.symbol}</span>
                    {!selected.supported && (
                      <span className="ml-2 text-xs text-orange-400">
                        Unsupported
                      </span>
                    )}
                  </div>
                  <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'} text-gray-400`} />
                </button>

                {showDropdown && (
                  <div className="absolute w-full mt-2 rounded-xl border border-white/20 bg-black/90 backdrop-blur-sm max-h-56 overflow-y-auto shadow-2xl z-20">
                    {TOKENS.map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => {
                          setSelected(token)
                          setShowDropdown(false)
                          setIsStaked(false)
                        }}
                        className="flex justify-between w-full px-5 py-3 text-left hover:bg-white/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Image src={token.logo} alt={token.symbol} width={24} height={24} className="rounded-full" />
                          <div>
                            <p className="font-semibold text-gray-200">{token.symbol}</p>
                            <p className="text-xs text-gray-400">{token.name}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* stake input */}
            <div className="space-y-3">
              <label className="block text-sm text-gray-300 font-semibold">Amount to Stake</label>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-5 py-4 rounded-xl border border-white/20 bg-white/10 text-2xl font-semibold text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all text-right"
              />
              <p className="text-xs text-gray-400">Balance fetched from connected wallet (RainbowKit)</p>

              <button
                onClick={handleAddToken}
                className="
                  w-full
                  py-3
                  rounded-xl
                  text-sm
                  font-semibold
                  text-white
                  bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600
                  shadow-lg shadow-black/30
                  transition-all
                  hover:opacity-90 hover:scale-[1.02]
                  active:scale-[0.98]
                  flex items-center justify-center gap-2
                 "
              >
                <i className="fas fa-wallet text-white/80"></i>
                Add {selected.symbol} to Wallet
              </button>


            </div>

            {/* action buttons */}
            <div className="flex gap-4">
              <button
                disabled={Number(amount) <= 0}
                onClick={handleStake}
                className="flex-1 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white shadow-xl hover:opacity-90 transition-all"
              >
                Stake
              </button>
              <button
                disabled={!userStaked || Number(amount) <= 0 || isUnstakeWrite || isUnstakeConfirming}
                onClick={handleUnstake}
                className="flex-1 py-4 rounded-xl text-lg font-semibold border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 transition-all"
              >
                Unstake
              </button>
            </div>
          </div>

          <PoolOverviewCard
            loading={poolLoading}
            tvl={tvl}
            rewardRate={rewardRate}
            aprPercent={aprPercent}
            contractAddress={contractAddress}
            symbol={selected.symbol}
          />

        </div>

        <StakingPositionCard
          userStaked={userStakedFormatted}
          pendingRewards={pendingFormatted}
          symbol={selected.symbol}
          onClaim={handleClaim}
        />


      </div>
    </section>
  )
}
