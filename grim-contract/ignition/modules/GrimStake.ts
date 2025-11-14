import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GrimStakeModule", (m) => {
  const grimStake = m.contract("GrimStake"); 

  // // Mock tokens for local dev
  // const eth = m.contract("MockERC20", ["MockETH", "mETH"]);
  // const usdt = m.contract("MockERC20", ["MockUSDT", "mUSDT"]);
  // const matic = m.contract("MockERC20", ["MockMATIC", "mMATIC"]);

  // Mint supply to deployer & vault
  // m.call(eth, "mint", [m.getAccount(0), 100_000n]);
  // m.call(usdt, "mint", [m.getAccount(0), 100_000n]);
  // m.call(matic, "mint", [m.getAccount(0), 100_000n]);

  // // Fund vault with rewards
  // m.call(eth, "mint", [grimStake, 50_000n]);
  // m.call(usdt, "mint", [grimStake, 50_000n]);
  // m.call(matic, "mint", [grimStake, 50_000n]);

  // // Create pools (token, rewardRate = tokens per second)
  // m.call(grimStake, "addPool", [eth, 0.01]);
  // m.call(grimStake, "addPool", [usdt, 0.01]);
  // m.call(grimStake, "addPool", [matic, 0.01]);

  // return { grimStake, eth, usdt, matic };
  return { grimStake };
});
