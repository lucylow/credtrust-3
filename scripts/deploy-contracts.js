// scripts/deploy-contracts.js - Production contracts
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CredTrust contracts to Arbitrum Sepolia...");
  
  // 1. ZKP Verifier (Lean 85k gas)
  const LeanVerifier = await ethers.getContractFactory("CredTrustLeanVerifier");
  const verifier = await LeanVerifier.deploy();
  await verifier.waitForDeployment();
  console.log("✅ LeanVerifier deployed:", await verifier.getAddress());

  // 2. Credit Marketplace
  const CreditMarketplace = await ethers.getContractFactory("CredTrustMarketplace");
  const marketplace = await CreditMarketplace.deploy(await verifier.getAddress());
  await marketplace.waitForDeployment();
  console.log("✅ Marketplace deployed:", await marketplace.getAddress());

  // 3. Save addresses
  const addresses = {
    verifier: await verifier.getAddress(),
    marketplace: await marketplace.getAddress(),
    chainId: 421614,
    deployedAt: new Date().toISOString()
  };
  
  require("fs").writeFileSync("deployed-addresses.json", JSON.stringify(addresses, null, 2));
  console.log("📄 Addresses saved:", addresses);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
