import toast from "react-hot-toast"

export async function addTokenToWallet({
  address,
  symbol,
  decimals,
  image,
}: {
  address: string
  symbol: string
  decimals: number
  image?: string
}) {
  try {
    // Must be client side
    if (typeof window === "undefined") return;

    let ethereum = (window as any).ethereum;
    
    if (!ethereum) {
      toast.error("No crypto wallet detected");
      return;
    }

    // If multiple wallets are installed, let user choose
    if (ethereum.providers?.length > 1) {
      const walletNames = ethereum.providers
        .map((p: any) => {
          if (p.isMetaMask) return "MetaMask";
          if (p.isCoinbaseWallet) return "Coinbase Wallet";
          if (p.isRabby) return "Rabby";
          if (p.isBraveWallet) return "Brave Wallet";
          if (p.isPhantom) return "Phantom";
          return "Unknown Wallet";
        })
        .filter((name: string, index: number, self: string[]) => 
          self.indexOf(name) === index
        );

      const choice = prompt(
        `Multiple wallets detected. Enter the number for your choice:\n${walletNames
          .map((name: string, i: number) => `${i + 1}. ${name}`)
          .join("\n")}`
      );

      const choiceIndex = parseInt(choice || "0") - 1;
      
      if (choiceIndex < 0 || choiceIndex >= ethereum.providers.length) {
        toast.error("Invalid wallet selection");
        return;
      }

      ethereum = ethereum.providers[choiceIndex];
    }

    const wasAdded = await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address,
          symbol,
          decimals,
          image,
        },
      },
    });

    if (wasAdded) {
      toast.success(`${symbol} added to wallet`);
    }

    return wasAdded;
  } catch (error) {
    toast.error(`Failed to add token: ${error}`);
  }
}