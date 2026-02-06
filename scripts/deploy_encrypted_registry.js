// scripts/deploy_encrypted_registry.js
const fs = require('fs');
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with", deployer.address);
  const Factory = await ethers.getContractFactory("contracts/EncryptedReceiptRegistry.sol:EncryptedReceiptRegistry");
  const reg = await Factory.deploy();
  await reg.deployed();
  console.log("EncryptedReceiptRegistry deployed to:", reg.address);
  fs.writeFileSync("deployed_encrypted.json", JSON.stringify({
    registry: reg.address,
    deployer: deployer.address
  }, null, 2));
}
main().catch(e => { console.error(e); process.exit(1); });
