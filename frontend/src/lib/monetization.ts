// src/lib/monetization.ts
import dotenv from "dotenv";
dotenv.config();
import { createSDKs } from "./iexecMessaging"; // using existing sdk factory
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

const DEV = process.env.DEV_MODE === "true";

/**
 * Create a signed order by calling DataProtector.grantAccess with price/number.
 * Returns the `grantedAccess` object from the SDK which acts as a signed order.
 */
export async function createSignedOrder(opts: {
  protectedData: string;
  authorizedApp?: string;
  authorizedUser?: string;
  pricePerAccess?: number;
  numberOfAccess?: number;
  ownerPrivateKey?: string; // server owner key used for creation if needed
  metadata?: any;
}) {
  const pk = opts.ownerPrivateKey || process.env.PRIVATE_KEY;
  const { dataProtector } = createSDKs(pk);
  
  if (DEV) {
    // simulate result
    return {
      grantedAccess: "0xDEMO_GA_" + Math.random().toString(36).slice(2, 10),
      protectedData: opts.protectedData,
      pricePerAccess: opts.pricePerAccess || 0,
      numberOfAccess: opts.numberOfAccess || null,
      metadata: opts.metadata || {}
    };
  }
  
  const res = await dataProtector.grantAccess({
    protectedData: opts.protectedData,
    authorizedApp: opts.authorizedApp,
    authorizedUser: opts.authorizedUser,
    pricePerAccess: opts.pricePerAccess,
    numberOfAccess: opts.numberOfAccess
  });
  // res contains the signed order / grantedAccess detail
  return res;
}

/**
 * Custodial demo payment flow: buyer approves server address to spend RLC, then server executes transferFrom(buyer, owner, price)
 * WARNING: Custodial pattern: server must hold a private key allowed to transferFrom (spender). For production, prefer non-custodial escrow contract.
 */
export async function custodialPaymentTransfer(params: {
  buyer: string;
  owner: string;
  price: number; // in token decimals units expected
  tokenAddress: string;
  serverPrivateKey?: string;
  rpcUrl?: string;
}) {
  const serverPk = params.serverPrivateKey || process.env.PRIVATE_KEY;
  if (!serverPk) throw new Error("server private key needed for custodial transfer");
  const rpc = params.rpcUrl || process.env.RPC_PROVIDER_URL;
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(serverPk, provider);
  const erc20 = new ethers.Contract(params.tokenAddress, [
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)"
  ], wallet);

  const decimals = await erc20.decimals();
  const amount = ethers.utils.parseUnits(String(params.price), decimals);
  const tx = await erc20.transferFrom(params.buyer, params.owner, amount);
  const receipt = await tx.wait();
  return { txHash: receipt.transactionHash };
}

/**
 * Fallback simple file store for orders if Prisma not present.
 */
const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");
export function saveOrderLocal(order: any) {
  try {
    if (!fs.existsSync(path.dirname(ORDERS_FILE))) fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
    let arr: any[] = [];
    if (fs.existsSync(ORDERS_FILE)) arr = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    arr.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(arr, null, 2));
    return order;
  } catch (e) {
    throw e;
  }
}
