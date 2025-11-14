import { useReadContract, useChainId } from "wagmi"
import {
    grimStakeAddress,
    grimStakeAbi,
} from "@/src/generated"
import { Address } from 'viem';

/**
 * @dev Custom hook to fetch a user's staked amount and reward debt for a specific token.
 * @returns The result object from useReadContract: { data, isPending, error }
 */
export function useUserStakeInfo(
    userAddress: Address,
    tokenAddress: Address
) {
    const chainId = useChainId();

    const contractAddress = grimStakeAddress[chainId as keyof typeof grimStakeAddress];
    const isContractAddressValid = !!contractAddress;

    return useReadContract({
        address: contractAddress,
        abi: grimStakeAbi,
        functionName: 'getUserStake',
        args: [userAddress, tokenAddress],
        query: {
            enabled: isContractAddressValid,
        }
    });
}