import { useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { useEffect, useRef } from "react";
import {
    grimStakeAddress,
    grimStakeAbi,
} from "@/src/generated";
import { Address } from 'viem';
import toast from 'react-hot-toast'

export function useStake() {
    const chainId = useChainId();
    const contractAddress = grimStakeAddress[chainId as keyof typeof grimStakeAddress];
    
    // Track toast IDs to dismiss them
    const toastIdRef = useRef<string | null>(null);

    const {
        data: hash,
        writeContract,
        isPending: isWritePending,
        error: writeError
    } = useWriteContract();

    const {
        isLoading,
        isSuccess,
        error: confirmationError
    } = useWaitForTransactionReceipt({ hash });

    // Handle state changes with useEffect
    useEffect(() => {
        if (isWritePending) {
            toastIdRef.current = toast.loading("Submitting Stake Transaction...");
        }
    }, [isWritePending]);

    useEffect(() => {
        if (isLoading && toastIdRef.current) {
            toast.loading("Transaction pending...", { id: toastIdRef.current });
        }
    }, [isLoading]);

    useEffect(() => {
        if (writeError && toastIdRef.current) {
            toast.error(writeError.message, { id: toastIdRef.current });
            toastIdRef.current = null;
        }
    }, [writeError]);

    useEffect(() => {
        if (confirmationError && toastIdRef.current) {
            toast.error("Transaction failed.", { id: toastIdRef.current });
            toastIdRef.current = null;
        }
    }, [confirmationError]);

    useEffect(() => {
        if (isSuccess && toastIdRef.current) {
            toast.success("Stake successful!", { id: toastIdRef.current });
            toastIdRef.current = null;
        }
    }, [isSuccess]);

    const stake = (tokenAddress: Address, amount: bigint) => {
        if (!contractAddress) {
            toast.error("GrimStake contract address not found for current chain.");
            return;
        }

        writeContract({
            address: contractAddress,
            abi: grimStakeAbi,
            functionName: 'stake',
            args: [tokenAddress, amount],
        });
    };

    return {
        stake,
        hash,
        isWriting: isWritePending,
        isLoading,
        isSuccess,
    };
}