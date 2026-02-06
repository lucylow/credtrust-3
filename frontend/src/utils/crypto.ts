// Encryption utilities for CredTrust
// Uses Web Crypto API for secure client-side encryption

export interface EncryptedData {
  ciphertext: string;
  hash: string;
  iv: string;
  timestamp: number;
}

// Generate a random encryption key and return raw bytes
export async function generateKeyRaw(): Promise<Uint8Array> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  return new Uint8Array(raw);
}

// Convert ArrayBuffer/Uint8Array to hex string
export function bufToHex(buf: Uint8Array | ArrayBuffer): string {
  const arr = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Convert hex string to Uint8Array
export function hexToBuf(hex: string): Uint8Array {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Import raw key bytes as CryptoKey
export async function importKeyRaw(raw: Uint8Array): Promise<CryptoKey> {
  // Create a new ArrayBuffer copy to avoid SharedArrayBuffer issues
  const buffer = new ArrayBuffer(raw.length);
  new Uint8Array(buffer).set(raw);
  return crypto.subtle.importKey(
    "raw",
    buffer,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
}

// Hash data using SHA-256
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  return bufToHex(hashBuffer);
}

// Encrypt JSON object using AES-256-GCM
export async function encryptJSON(
  obj: unknown,
  rawKey: Uint8Array
): Promise<{ ciphertext: Uint8Array; iv: number[] }> {
  const key = await importKeyRaw(rawKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { ciphertext: new Uint8Array(ct), iv: Array.from(iv) };
}

// Decrypt JSON object using AES-256-GCM
export async function decryptJSON(
  ciphertextArr: number[],
  ivArr: number[],
  rawKey: Uint8Array
): Promise<unknown> {
  const key = await importKeyRaw(rawKey);
  const ct = new Uint8Array(ciphertextArr);
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(ivArr) },
    key,
    ct
  );
  return JSON.parse(new TextDecoder().decode(pt));
}

// Encrypt data using AES-256-GCM (legacy format for backward compatibility)
export async function encryptData(data: string): Promise<EncryptedData> {
  const rawKey = await generateKeyRaw();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importKeyRaw(rawKey);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    dataBuffer
  );

  const hash = await hashData(data);

  return {
    ciphertext: bufToHex(encryptedBuffer),
    hash,
    iv: bufToHex(iv.buffer as ArrayBuffer),
    timestamp: Date.now(),
  };
}

// Simulate TEE processing (mock for demo purposes)
export async function simulateTEEProcessing(
  encryptedData: EncryptedData
): Promise<{ score: number; attestation: string }> {
  // Simulate TEE processing delay (2-4 seconds)
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 2000)
  );

  // Generate deterministic score from hash
  const hashNum = parseInt(encryptedData.hash.slice(0, 8), 16);
  const score = (hashNum % 300) + 500; // Score between 500-800

  // Generate mock attestation
  const attestation = await hashData(
    encryptedData.hash + encryptedData.timestamp.toString()
  );

  return {
    score: Math.min(850, Math.max(300, score)),
    attestation: `0x${attestation}`,
  };
}

// Format wallet address
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Generate random bytes
export function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// Simple ECIES-like encryption using Web Crypto (for demo purposes)
// In production, use a proper ECIES library like eth-crypto
export async function mockECIESEncrypt(
  publicKeyHex: string,
  message: string
): Promise<string> {
  // For demo, we just base64 encode the message with a prefix
  // In production, use proper ECIES with the attestor's public key
  const encoded = btoa(message);
  return JSON.stringify({
    iv: bufToHex(randomBytes(16)),
    ephemPublicKey: bufToHex(randomBytes(65)),
    ciphertext: encoded,
    mac: bufToHex(randomBytes(32)),
  });
}

// Derive address from public key (simplified)
export function publicKeyToAddress(publicKeyHex: string): `0x${string}` {
  // In production, use proper keccak256 hash
  const hash = publicKeyHex.slice(-40);
  return `0x${hash}` as `0x${string}`;
}

// Format bytes32 from string
export function stringToBytes32(str: string): `0x${string}` {
  const bytes = new TextEncoder().encode(str.slice(0, 32).padEnd(32, '\0'));
  return ('0x' + bufToHex(bytes)) as `0x${string}`;
}

// Parse bytes32 to string
export function bytes32ToString(bytes32: `0x${string}`): string {
  const hex = bytes32.slice(2);
  const bytes = hexToBuf(hex);
  return new TextDecoder().decode(bytes).replace(/\0/g, '');
}
