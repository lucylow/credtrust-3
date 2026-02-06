#!/usr/bin/env ts-node
// scripts/dataprotector/purchase_order.ts
import dotenv from "dotenv";
dotenv.config();
import { custodialPaymentTransfer } from "../../src/lib/monetization";
import fs from "fs";

async function main() {
  // usage: npx ts-node purchase_order.ts <orderId> <buyerAddress>
  const [orderId, buyer] = process.argv.slice(2);
  if (!orderId || !buyer) {
    console.error("Usage: purchase_order.ts <orderId> <buyerAddress>");
    process.exit(1);
  }

  // read order record from local store
  const ordersFile = './data/orders.json';
  if (!fs.existsSync(ordersFile)) { console.error('orders.json missing'); process.exit(1); }
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  const order = orders.find((o: any) => o.id === orderId);
  if (!order) { console.error('order not found'); process.exit(1); }

  // custodial transfer demo: server executes transferFrom(buyer -> owner)
  const tokenAddr = process.env.RLC_TOKEN_ADDRESS;
  if (!tokenAddr) { console.error('RLC_TOKEN_ADDRESS not set'); process.exit(1); }

  // price assumed in human units; adjust decimals in monetization.custodialPaymentTransfer
  const res = await custodialPaymentTransfer({
    buyer,
    owner: order.owner || (process.env.PRIVATE_KEY ? await getOwnerFromPk(process.env.PRIVATE_KEY) : 'demo-owner'),
    price: order.pricePerAccess || 0,
    tokenAddress: tokenAddr,
    serverPrivateKey: process.env.PRIVATE_KEY,
    rpcUrl: process.env.RPC_PROVIDER_URL
  });

  console.log('Purchase transfer result:', res);
  // For demo, we'll just decrement remaining locally
  order.remaining = (order.remaining || order.numberOfAccess) - 1;
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  console.log('Updated local order remaining:', order.remaining);
}

async function getOwnerFromPk(pk: string) {
  const { ethers } = await import("ethers");
  const w = new ethers.Wallet(pk);
  return w.address;
}

main().catch(e => { console.error(e); process.exit(1); });
