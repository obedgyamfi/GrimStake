# Grim Vault — Testnet Staking dApp

A full-stack Web3 staking application built with Solidity, Hardhat, Next.js, Wagmi, RainbowKit, and viem.
Grim Vault is a testnet staking platform for demonstrating:

* ERC-20 staking
* Real-time rewards
* Claiming rewards
* Unstaking
* Pool analytics (TVL, APR, reward rate)
* Auto-adding tokens to MetaMask

Deployed live on **Sepolia Testnet**.

---

# Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Smart Contracts](#smart-contracts)

   * [MockERC20Token.sol](#mockerc20tokensol)
   * [GrimStake.sol](#grimstakesol)
4. [Backend Deployment Guide](#backend-deployment-guide)
5. [Frontend Setup](#frontend-setup)
6. [Frontend Features](#frontend-features)
7. [Hook Architecture](#hook-architecture)
8. [User Workflow](#user-workflow)
9. [Project Structure](#project-structure)
10. [Running the Frontend](#running-the-frontend)
11. [CoinMarketCap Integration](#coinmarketcap-integration)

---

# Overview

Grim Vault provides a fully functional staking environment:

* Stake ERC-20 test tokens
* Earn block-based rewards
* Claim and unstake at any time
* Add tokens directly to MetaMask
* Live statistics from contract reads
* Modern UI built with Tailwind, RainbowKit, Framer Motion

All functionality runs on **Sepolia Testnet**.

---

# Architecture

### Backend

Solidity smart contracts managed via Hardhat.
Pools and reward accounting handled in GrimStake.

### Frontend

Next.js dApp using Wagmi v2, viem, and RainbowKit.

---

# Smart Contracts

## MockERC20Token.sol

A lightweight ERC-20 token with:

* `mint(address,uint256)`
* `approve`
* `transfer`
* `transferFrom`

Constructor:

```solidity
constructor(string memory _name, string memory _symbol)
```

Deploy multiple variants by changing constructor args.

---

## GrimStake.sol

Maintains staking pools and rewards.

### Pool Structure

```
Pool {
    uint256 totalStaked;
    uint256 rewardRatePerSecond;
}
```

### User Structure

```
UserInfo {
    uint256 amount;
    uint256 rewardDebt;
}
```

### Key Functions

* `addPool(token, rewardRate)`
* `stake(token, amount)`
* `unstake(token, amount)`
* `pendingRewards(user, token)`
* `claim(token)`
* `getPoolStats(token)`
* `getUserStake(user, token)`

---

# Backend Deployment Guide

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_REPO/grim-vault.git
cd grim-vault/grim-contract
npm install
```

## 2. Compile Contracts

```bash
npx hardhat compile
```

## 3. Deploy Using Remix (Recommended for Testnet)

### GrimStake

* Open GrimStake.sol
* Compile
* Select "Injected Provider – MetaMask"
* Deploy
* Copy address

### MockERC20

Deploy multiple tokens as needed:

Example arguments:

```
name: GrimToken
symbol: GRIM
```

---

## 4. Add Token Pool

Using Remix:

```
addPool(<TokenAddress>, <RewardRatePerSecond>)
```

Fast-demo example:

```
1e17
```

---

## 5. Fund the Reward Pool

On MockERC20:

```
mint(<admin>, 10000e18)
transfer(<GrimStake>, 5000e18)
```

---

# Frontend Setup

Navigate to the frontend folder:

```bash
cd ../frontend
npm install
```

### Wagmi Codegen

`wagmi.config.ts`:

```ts
deployments: {
  GrimStake: {
    11155111: "0x...grimstake"
  }
}
```

Generate:

```bash
npx wagmi generate
```

This creates:

```
src/generated.ts
```

Includes typed ABI and contract addresses.

---

# Frontend Features

* Token selection
* Add token to MetaMask
* Approve + stake
* Unstake
* Claim rewards
* Live pool stats
* User position
* Neon glass UI with animations

---

# Hook Architecture

| Hook                | Role                               |
| ------------------- | ---------------------------------- |
| `useStake`          | Handles approve + stake lifecycle  |
| `useUnstake`        | Unstaking workflow                 |
| `useClaimRewards`   | Reward claims                      |
| `usePendingRewards` | Real-time reward tracking          |
| `usePoolStats`      | TVL, APR, rewardRate               |
| `useUserStakeInfo`  | User stake amount                  |
| `useApprove`        | ERC-20 approve using MockERC20 ABI |

---

# User Workflow

1. Connect wallet to Sepolia
2. Add GRIM token to MetaMask
3. Mint test tokens
4. Approve + stake
5. Watch rewards accumulate
6. Claim rewards
7. Unstake

---

# Project Structure

```
grim-vault/
│── grim-contract/
│   ├── contracts/
│   │   ├── GrimStake.sol
│   │   └── MockERC20Token.sol
│   ├── hardhat.config.js
│
└── frontend/
    ├── src/generated.ts
    ├── lib/contracts/
    ├── components/
    ├── public/
    └── app/
```

---

# Running the Frontend

```bash
npm run dev
```

URL:

```
http://localhost:3000
```

---

# CoinMarketCap Integration

The app optionally displays:

* Market price
* 24h price change
* Market cap

Using the CoinMarketCap public API.

## 1. Add keys to `.env.local`

```
NEXT_PUBLIC_CMC_API_KEY=<YOUR_API_KEY>
```

## 2. Fetch Helper

```ts
export async function fetchCMCPrice(symbol: string) {
  const key = process.env.NEXT_PUBLIC_CMC_API_KEY;

  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
    {
      headers: { 'X-CMC_PRO_API_KEY': key }
    }
  );

  const json = await res.json();
  return json.data[symbol];
}
```

## 3. Use It in Pool Overview

```ts
const [price, setPrice] = useState(null);

useEffect(() => {
  fetchCMCPrice(selected.symbol).then((p) => {
    setPrice(p.quote.USD);
  });
}, [selected]);
```

## 4. Render

```
Market Price: $ {price?.price.toFixed(2) ?? "—"}
24h Change: {price?.percent_change_24h.toFixed(2) ?? "—"} %
Market Cap: $ {price?.market_cap.toLocaleString() ?? "—"}
```

