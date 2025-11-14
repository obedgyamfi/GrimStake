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

    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      console.error("No crypto wallet detected");
      return;
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

    return wasAdded;
  } catch (error) {
    console.error("Failed to add token:", error);
  }
}
