// scripts/recipient_open.js <recipientPrivHex> <metadataPath> <cipherFile>
const fs = require('fs');
const sodium = require('libsodium-wrappers');
const path = require('path');

(async () => {
  await sodium.ready;
  const args = process.argv.slice(2);
  if (args.length < 3) { console.error("Usage: node recipient_open.js <recipientPrivHex> <metadataPath> <cipherFile>"); process.exit(1); }
  const [recipientPrivHex, metadataPath, cipherFile] = args;
  const priv = Buffer.from(recipientPrivHex, 'hex');
  // derive publicKey from privateKey (libsodium expects full keypair)
  const kp = sodium.crypto_box_keypair_from_secretkey(priv); // libsodium helper present in wasm?
  // If not available, store both keys at creation time (we did in demo_data).
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const sealedHex = metadata.sealedKeys.lender; // or regulator
  const sealed = Buffer.from(sealedHex, 'hex');
  const opened = sodium.crypto_box_seal_open(sealed, Buffer.from(kp.publicKey), Buffer.from(priv));
  console.log("Opened symmetric key (hex):", Buffer.from(opened).toString('hex'));
  const nonce = Buffer.from(metadata.nonce, 'hex');
  const ciphertext = fs.readFileSync(cipherFile);
  const plain = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, ciphertext, null, nonce, opened);
  console.log("Plaintext:", Buffer.from(plain).toString('utf8'));
})();
