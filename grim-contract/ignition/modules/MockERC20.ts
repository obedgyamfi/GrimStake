import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MockERC20Module", (m) => {
//   const mockERC20 = m.contract("MockERC20"); 

  // Mock tokens for local dev
  const eth = m.contract("MockERC20", ["MockETH", "mETH"]);
//   const usdt = m.contract("MockERC20", ["MockUSDT", "mUSDT"]);
//   const matic = m.contract("MockERC20", ["MockMATIC", "mMATIC"]);

//   Mint supply to deployer & vault
//   m.call(eth, "mint", [m.getAccount(0), 100_000n]);
//   m.call(usdt, "mint", [m.getAccount(0), 100_000n]);
//   m.call(matic, "mint", [m.getAccount(0), 100_000n]);

  // Fund vault with rewards
//   m.call(eth, "mint", [mockERC20, 50_000n]);
//   m.call(usdt, "mint", [mockERC20, 50_000n]);
//   m.call(matic, "mint", [mockERC20, 50_000n]);

  // Create pools (token, rewardRate = tokens per second)
//   m.call( eth, "addPool", [eth, 0.01]);
//   m.call( mockERC20, "addPool", [usdt, 0.01]);
//   m.call( mockERC20, "addPool", [matic, 0.01]);

//   return { mockERC20, eth, usdt, matic };
return {eth}
});
