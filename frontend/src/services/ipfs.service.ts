// IPFS Mock Service - Simulates Pinata/IPFS uploads

import type { EncryptedPayload } from '@/types/tee.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory IPFS store for development
const ipfsStore = new Map<string, any>();

// Generate mock CID
function generateMockCID(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const hash = Array.from({ length: 46 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `Qm${hash}`;
}

// Upload encrypted payload to mock IPFS
export async function uploadToIPFS(payload: EncryptedPayload): Promise<string> {
  await delay(300); // Simulate upload time
  
  const cid = generateMockCID();
  ipfsStore.set(cid, payload);
  
  console.log(`[Mock IPFS] Uploaded payload to ${cid}`);
  return cid;
}

// Upload raw blob to mock IPFS
export async function uploadBlobToIPFS(blob: Blob): Promise<string> {
  await delay(400);
  
  const cid = generateMockCID();
  const text = await blob.text();
  ipfsStore.set(cid, JSON.parse(text));
  
  console.log(`[Mock IPFS] Uploaded blob to ${cid}`);
  return cid;
}

// Fetch from mock IPFS
export async function fetchFromIPFS<T = any>(cid: string): Promise<T | null> {
  await delay(150);
  
  const data = ipfsStore.get(cid);
  if (!data) {
    console.warn(`[Mock IPFS] CID not found: ${cid}`);
    return null;
  }
  
  return data as T;
}

// Check if CID exists
export async function checkIPFSExists(cid: string): Promise<boolean> {
  await delay(50);
  return ipfsStore.has(cid);
}

// Get IPFS gateway URL (for display purposes)
export function getIPFSGatewayUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

// Pin existing CID (mock)
export async function pinCID(cid: string): Promise<boolean> {
  await delay(100);
  console.log(`[Mock IPFS] Pinned ${cid}`);
  return true;
}

// Unpin CID (mock)
export async function unpinCID(cid: string): Promise<boolean> {
  await delay(100);
  ipfsStore.delete(cid);
  console.log(`[Mock IPFS] Unpinned ${cid}`);
  return true;
}

// Get all pinned CIDs (dev only)
export function getAllPinnedCIDs(): string[] {
  return Array.from(ipfsStore.keys());
}
