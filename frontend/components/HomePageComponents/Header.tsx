'use client'
import Link from "next/link"
import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 shadow-lg
      bg-gradient-to-r from-[rgba(0,0,0,0.6)] via-[rgba(20,20,40,0.7)] to-[rgba(0,0,0,0.6)]
      transition-all"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-2xl tracking-wider text-transparent bg-clip-text 
                     bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:opacity-90 
                     flex items-center gap-2 transition-all"
        >
          {/* <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span> */}
          GRIM STAKE
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium items-center">
          <Link href="/#stake" className="hover:text-cyan-400 text-gray-300 transition-colors">
            Stake
          </Link>
          <Link href="/rewards" className="hover:text-pink-400 text-gray-300 transition-colors">
            Rewards
          </Link>
          <Link href="/analytics" className="hover:text-purple-400 text-gray-300 transition-colors">
            Analytics
          </Link>

          {/* RainbowKit button replaces “Connect Wallet” link */}
          <div className="ml-4">
            <ConnectButton chainStatus="full" showBalance={true} />
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-300 text-2xl"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 py-4
                        text-gray-300 bg-black/70 backdrop-blur-md border-t border-white/10">

          <Link href="/#stake" className="hover:text-cyan-400" onClick={() => setMenuOpen(false)}>
            Stake
          </Link>
          <Link href="/rewards" className="hover:text-pink-400" onClick={() => setMenuOpen(false)}>
            Rewards
          </Link>
          <Link href="/analytics" className="hover:text-purple-400" onClick={() => setMenuOpen(false)}>
            Analytics
          </Link>

          {/* RainbowKit in mobile menu */}
          <div className="pt-2">
            <ConnectButton chainStatus="none" showBalance={false} />
          </div>
        </div>
      )}
    </header>
  )
}
