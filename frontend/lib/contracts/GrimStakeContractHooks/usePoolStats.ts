import { useReadContract, useChainId } from "wagmi"
import {
    grimStakeAddress,
    grimStakeAbi,
} from "@/src/generated"
import { Address } from 'viem';

/**
 * @dev Custom hook to fetch the total staked amount, reward rate, and estimated APR for a token pool.
 * @returns The result object from useReadContract: { data, isPending, error }
 */
export function usePoolStats(
    tokenAddress: Address | undefined
) {
    const chainId = useChainId();

    const contractAddress = grimStakeAddress[chainId as keyof typeof grimStakeAddress];

    return useReadContract({
        address: contractAddress,
        abi: grimStakeAbi,
        functionName: 'getPoolStats',
        args: tokenAddress ? [tokenAddress] : undefined,
        query: {
            enabled: Boolean(contractAddress && tokenAddress),
        }
    });
}