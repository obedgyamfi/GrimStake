import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GrimStake
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const grimStakeAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rewardRate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PoolCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newRate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardRateUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Staked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Unstaked',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'rewardRate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addPool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokens_', internalType: 'address[]', type: 'address[]' }],
    name: 'claimMany',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getPoolStats',
    outputs: [
      { name: 'totalStaked', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardRate', internalType: 'uint256', type: 'uint256' },
      { name: 'aprBps', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getUserStake',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardDebt', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'pendingRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'pools',
    outputs: [
      { name: 'enabled', internalType: 'bool', type: 'bool' },
      { name: 'rewardRate', internalType: 'uint256', type: 'uint256' },
      { name: 'lastRewardTime', internalType: 'uint256', type: 'uint256' },
      { name: 'accRewardPerShare', internalType: 'uint256', type: 'uint256' },
      { name: 'totalStaked', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rescueTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'newRate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setRewardRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'stakes',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardDebt', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const grimStakeAddress = {
  11155111: '0x993233e676EFaf43E09086DE4a45bd4364374f62',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const grimStakeConfig = {
  address: grimStakeAddress,
  abi: grimStakeAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const mockErc20Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const mockErc20Address = {
  11155111: '0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const mockErc20Config = {
  address: mockErc20Address,
  abi: mockErc20Abi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link grimStakeAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useReadGrimStake = /*#__PURE__*/ createUseReadContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"getPoolStats"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useReadGrimStakeGetPoolStats = /*#__PURE__*/ createUseReadContract(
  {
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'getPoolStats',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"getUserStake"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useReadGrimStakeGetUserStake = /*#__PURE__*/ createUseReadContract(
  {
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'getUserStake',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"owner"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useReadGrimStakeOwner = /*#__PURE__*/ createUseReadContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"pendingRewards"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useReadGrimStakePendingRewards =
  /*#__PURE__*/ createUseReadContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'pendingRewards',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"pools"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useReadGrimStakePools = /*#__PURE__*/ createUseReadContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
  functionName: 'pools',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"stakes"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useReadGrimStakeStakes = /*#__PURE__*/ createUseReadContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
  functionName: 'stakes',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link grimStakeAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWriteGrimStake = /*#__PURE__*/ createUseWriteContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"addPool"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWriteGrimStakeAddPool = /*#__PURE__*/ createUseWriteContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
  functionName: 'addPool',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"claim"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWriteGrimStakeClaim = /*#__PURE__*/ createUseWriteContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
  functionName: 'claim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"claimMany"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWriteGrimStakeClaimMany = /*#__PURE__*/ createUseWriteContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
  functionName: 'claimMany',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"rescueTokens"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWriteGrimStakeRescueTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'rescueTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"setRewardRate"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWriteGrimStakeSetRewardRate =
  /*#__PURE__*/ createUseWriteContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'setRewardRate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"stake"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWriteGrimStakeStake = /*#__PURE__*/ createUseWriteContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWriteGrimStakeTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"unstake"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWriteGrimStakeUnstake = /*#__PURE__*/ createUseWriteContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
  functionName: 'unstake',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link grimStakeAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useSimulateGrimStake = /*#__PURE__*/ createUseSimulateContract({
  abi: grimStakeAbi,
  address: grimStakeAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"addPool"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useSimulateGrimStakeAddPool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'addPool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"claim"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useSimulateGrimStakeClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"claimMany"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useSimulateGrimStakeClaimMany =
  /*#__PURE__*/ createUseSimulateContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'claimMany',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"rescueTokens"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useSimulateGrimStakeRescueTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'rescueTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"setRewardRate"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useSimulateGrimStakeSetRewardRate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'setRewardRate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"stake"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useSimulateGrimStakeStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'stake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useSimulateGrimStakeTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link grimStakeAbi}__ and `functionName` set to `"unstake"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useSimulateGrimStakeUnstake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    functionName: 'unstake',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link grimStakeAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWatchGrimStakeEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: grimStakeAbi, address: grimStakeAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link grimStakeAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWatchGrimStakeOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link grimStakeAbi}__ and `eventName` set to `"PoolCreated"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWatchGrimStakePoolCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    eventName: 'PoolCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link grimStakeAbi}__ and `eventName` set to `"RewardClaimed"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWatchGrimStakeRewardClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    eventName: 'RewardClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link grimStakeAbi}__ and `eventName` set to `"RewardRateUpdated"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWatchGrimStakeRewardRateUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    eventName: 'RewardRateUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link grimStakeAbi}__ and `eventName` set to `"Staked"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWatchGrimStakeStakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    eventName: 'Staked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link grimStakeAbi}__ and `eventName` set to `"Unstaked"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x993233e676EFaf43E09086DE4a45bd4364374f62)
 */
export const useWatchGrimStakeUnstakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: grimStakeAbi,
    address: grimStakeAddress,
    eventName: 'Unstaked',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useReadIerc20 = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadIerc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadIerc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useWriteIerc20 = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteIerc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteIerc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteIerc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useSimulateIerc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateIerc20Approve = /*#__PURE__*/ createUseSimulateContract(
  { abi: ierc20Abi, functionName: 'approve' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateIerc20Transfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateIerc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useReadMockErc20 = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"allowance"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useReadMockErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"balanceOf"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useReadMockErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"decimals"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useReadMockErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"name"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useReadMockErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"symbol"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useReadMockErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"totalSupply"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useReadMockErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useWriteMockErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useWriteMockErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mint"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useWriteMockErc20Mint = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useWriteMockErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useWriteMockErc20TransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockErc20Abi,
    address: mockErc20Address,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useSimulateMockErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: mockErc20Abi,
  address: mockErc20Address,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useSimulateMockErc20Approve =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc20Abi,
    address: mockErc20Address,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mint"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useSimulateMockErc20Mint = /*#__PURE__*/ createUseSimulateContract(
  { abi: mockErc20Abi, address: mockErc20Address, functionName: 'mint' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useSimulateMockErc20Transfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc20Abi,
    address: mockErc20Address,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696)
 */
export const useSimulateMockErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc20Abi,
    address: mockErc20Address,
    functionName: 'transferFrom',
  })
