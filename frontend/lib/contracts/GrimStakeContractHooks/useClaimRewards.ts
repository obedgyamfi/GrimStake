"use client";

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import {
    grimStakeAddress,
    grimStakeAbi,
} from "@/src/generated";
import { Address } from "viem";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { shortenError } from "@/lib/helpers/error";

/**
 * @dev Hook to claim pending rewards for a token pool.
 */
export function useClaimRewards() {
    const chainId = useChainId();
    const contractAddress =
        grimStakeAddress[chainId as keyof typeof grimStakeAddress];

    // Toast tracking
    const toastIdRef = useRef<string | null>(null);

    // Write contract
    const {
        data: hash,
        writeContract,
        isPending: isWritePending,
        error: writeError,
    } = useWriteContract();

    // Receipt tracking
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: confirmationError,
    } = useWaitForTransactionReceipt({ hash });

    /**
     * Claim rewards for a specific token.
     */
    const claimRewards = async (tokenAddress: Address) => {
        if (!contractAddress) {
            toast.error("GrimStake contract not found for this chain.");
            return;
        }

        writeContract({
            address: contractAddress,
            abi: grimStakeAbi,
            functionName: "claim",
            args: [tokenAddress],
        });
    };


    useEffect(() => {
        if (isWritePending) {
            toastIdRef.current = toast.loading("Submitting claim transaction…");
        }
    }, [isWritePending]);

    useEffect(() => {
        if (isConfirming && toastIdRef.current) {
            toast.loading("Waiting for confirmation…", {
                id: toastIdRef.current,
            });
        }
    }, [isConfirming]);

    useEffect(() => {
        if (writeError && toastIdRef.current) {
            toast.error(`Failed: ${shortenError(writeError.message)}`, {
                id: toastIdRef.current,
            });
            toastIdRef.current = null;
        }
    }, [writeError]);

    useEffect(() => {
        if (confirmationError && toastIdRef.current) {
            toast.error("Transaction reverted.", {
                id: toastIdRef.current,
            });
            toastIdRef.current = null;
        }
    }, [confirmationError]);

    useEffect(() => {
        if (isConfirmed && toastIdRef.current) {
            toast.success("Rewards claimed!", {
                id: toastIdRef.current,
            });
            toastIdRef.current = null;
        }
    }, [isConfirmed]);

    // Return API
    return {
        claimRewards,
        hash,
        isWriting: isWritePending,
        isConfirming,
        isConfirmed,
        error: writeError || confirmationError,
    };
}
