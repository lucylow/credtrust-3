// scripts/deploy_attestation_registry.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying AttestationRegistry with deployer:", deployer.address);

  const expiry = 86400; // 1 day default
  const Factory = await ethers.getContractFactory("EnclaveAttestationRegistry");
  const registry = await Factory.deploy(expiry);
  await registry.deployed();
  console.log("EnclaveAttestationRegistry deployed at:", registry.address);
  // write to file for scripts
  require('fs').writeFileSync('deployed_attestation_registry.json', JSON.stringify({ address: registry.address }, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
