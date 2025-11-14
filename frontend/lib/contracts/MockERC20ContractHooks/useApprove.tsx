import { useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { useEffect, useRef } from "react";
import {
    mockErc20Abi,
} from "@/src/generated";
import { Abi, Address } from 'viem';
import toast from 'react-hot-toast'

export function useApproveToken() {
  const toastId = useRef<string | null>(null)

  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract()

  const { isLoading, isSuccess, error: confirmationError } =
    useWaitForTransactionReceipt({ hash })

  // Toast lifecycle
  useEffect(() => {
    if (isWritePending) {
      toastId.current = toast.loading("Approving token…")
    }
  }, [isWritePending])

  useEffect(() => {
    if (isLoading && toastId.current) {
      toast.loading("Waiting for approval confirmation…", { id: toastId.current })
    }
  }, [isLoading])

  useEffect(() => {
    if (writeError && toastId.current) {
      toast.error(writeError.message, { id: toastId.current })
      toastId.current = null
    }
  }, [writeError])

  useEffect(() => {
    if (confirmationError && toastId.current) {
      toast.error("Approval failed.", { id: toastId.current })
      toastId.current = null
    }
  }, [confirmationError])

  const approve = (token: Address, spender: Address, amount: bigint) => {
    writeContract({
      address: token,
      abi: mockErc20Abi as Abi,
      functionName: "approve",
      args: [spender, amount],
    })
  }

  return {
    approve,
    isApproved: isSuccess,
    isApproving: isLoading || isWritePending,
  }
}
