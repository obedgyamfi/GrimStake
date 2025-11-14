import { defineConfig } from "@wagmi/cli"
import { hardhat } from "@wagmi/cli/plugins"
import { react } from "@wagmi/cli/plugins"

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    hardhat({
      // Path to your Hardhat project root 
      project: "../grim-contract", // Optional: Hardhat artifacts directory 
      artifacts: "../grim-contract/artifacts", // Optional: Add deployed addresses 
      deployments: {
        GrimStake: {
           11155111: "0x993233e676EFaf43E09086DE4a45bd4364374f62"
        },
        MockERC20: { 
        11155111: "0xF5CA3B0FF6396a49a51Bf8231FA9489dE7ca6696", 
        }, 
      },
      // Optional: Hardhat commands used when watching 
      commands: {
        clean: "npm --prefix ../grim-contract run clean",
        build: "npm --prefix ../grim-contract run compile",
        rebuild: "npm --prefix ../grim-contract run compile",
      },
    }),
    // Generate React hooks 
    react(),
  ],
})