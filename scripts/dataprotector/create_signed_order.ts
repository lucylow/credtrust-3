#!/usr/bin/env ts-node
// scripts/dataprotector/create_signed_order.ts
import dotenv from "dotenv";
dotenv.config();
import { createSignedOrder, saveOrderLocal } from "../../src/lib/monetization";
import fs from "fs";

async function main() {
  // usage: ts-node create_signed_order.ts <protectedDataAddress> <price> <numberOfAccess> "<title>" "<description>"
  const args = process.argv.slice(2);
  const [pd, priceStr, numberStr, title, description] = args;
  if (!pd) {
    console.error("Usage: create_signed_order.ts <protectedData> <pricePerAccess> <numberOfAccess> \"<title>\" \"<description>\"");
    process.exit(1);
  }
  const price = priceStr ? Number(priceStr) : 0;
  const numberOfAccess = numberStr ? Number(numberStr) : null;

  const res = await createSignedOrder({
    protectedData: pd,
    authorizedApp: process.env.IEXEC_APP_ADDRESS,
    pricePerAccess: price,
    numberOfAccess,
    metadata: { title, description }
  });

  // persist (local or db)
  try {
    const saved = saveOrderLocal({
      id: res.grantedAccess || ("local-" + Math.random().toString(36).slice(2, 9)),
      protectedData: res.protectedData,
      owner: process.env.PRIVATE_KEY ? (await getOwnerFromPk(process.env.PRIVATE_KEY)) : "demo-owner",
      grantedAccess: res.grantedAccess,
      pricePerAccess: res.pricePerAccess,
      numberOfAccess: res.numberOfAccess,
      remaining: res.numberOfAccess,
      metadata: res.metadata || {}
    });
    console.log("Order created:", JSON.stringify(saved, null, 2));
  } catch (e) {
    console.error("Save error:", e);
  }
}

async function getOwnerFromPk(pk: string) {
  const { ethers } = await import("ethers");
  const w = new ethers.Wallet(pk);
  return w.address;
}

main().catch(e => { console.error(e); process.exit(1); });
