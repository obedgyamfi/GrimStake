import { useReadContract, useChainId } from "wagmi"
import {
    grimStakeAddress,
    grimStakeAbi,
} from "@/src/generated"
import { Address } from 'viem';

/**
 * @dev Custom hook to fetch a user's pending rewards for a specific token pool.
 * @returns The result object from useReadContract: { data, isPending, error }
 */
export function usePendingRewards(
    userAddress: Address,
    tokenAddress: Address
) {
    const chainId = useChainId();

    const contractAddress = grimStakeAddress[chainId as keyof typeof grimStakeAddress];
    const isContractAddressValid = !!contractAddress;

    return useReadContract({
        address: contractAddress,
        abi: grimStakeAbi,
        functionName: 'pendingRewards',
        args: [userAddress, tokenAddress],
        query: {
            enabled: isContractAddressValid,
            // watch: true, // Optional: uncomment to enable constant refetching
        }
    });
}