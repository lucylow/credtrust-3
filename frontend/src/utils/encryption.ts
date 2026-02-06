// Encryption utilities for CredTrust
// Uses Web Crypto API for secure client-side encryption

export interface EncryptedData {
  ciphertext: string;
  hash: string;
  iv: string;
  timestamp: number;
}

// Generate a random encryption key
async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Hash data using SHA-256
async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return bufferToHex(hashBuffer);
}

// Encrypt data using AES-256-GCM
export async function encryptData(data: string): Promise<EncryptedData> {
  const key = await generateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );
  
  const hash = await hashData(data);
  
  return {
    ciphertext: bufferToHex(encryptedBuffer),
    hash,
    iv: bufferToHex(iv.buffer as ArrayBuffer),
    timestamp: Date.now(),
  };
}

// Simulate TEE processing (mock for demo purposes)
export async function simulateTEEProcessing(
  encryptedData: EncryptedData
): Promise<{ score: number; attestation: string }> {
  // Simulate TEE processing delay (2-4 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  // Generate deterministic score from hash
  const hashNum = parseInt(encryptedData.hash.slice(0, 8), 16);
  const score = (hashNum % 300) + 500; // Score between 500-800
  
  // Generate mock attestation
  const attestation = await hashData(encryptedData.hash + encryptedData.timestamp.toString());
  
  return {
    score: Math.min(850, Math.max(300, score)),
    attestation: `0x${attestation}`,
  };
}

// Format wallet address
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
