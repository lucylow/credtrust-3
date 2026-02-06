#!/usr/bin/env ts-node
/**
 * scripts/iapp/create_and_run_requestorder.ts
 *
 * Usage:
 *  npx ts-node scripts/iapp/create_and_run_requestorder.ts \
 *    --app 0xAppAddress \
 *    --workerpool 0xWorkerpool \
 *    --args "--param value" \
 *    --inputFiles "https://.../a.json,https://.../b.csv" \
 *    --secrets "1:openai-key,2:db-pass"
 */
import dotenv from "dotenv";
dotenv.config();
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as fs from "fs";
import path from "path";
import {
  createAndSignRequestOrder,
  fetchTopAppAndWorkerpoolOrders,
  matchOrdersAndRun
} from "../../src/lib/iexecOrder";

const argv = yargs(hideBin(process.argv))
  .option("app", { type: "string" })
  .option("workerpool", { type: "string" })
  .option("args", { type: "string" })
  .option("inputFiles", { type: "string" })
  .option("secrets", { type: "string" })
  .option("category", { type: "number" })
  .argv as any;

function parseSecrets(secretsRaw?: string) {
  if (!secretsRaw) return undefined;
  const pairs = secretsRaw.split(",").map((s: string) => s.trim()).filter(Boolean);
  const o: Record<number, string> = {};
  for (const p of pairs) {
    const [k, v] = p.split(":");
    o[Number(k)] = v;
  }
  return o;
}

async function main() {
  const app = argv.app || process.env.IEXEC_APP_ADDRESS;
  const workerpool = argv.workerpool || process.env.IEXEC_WORKERPOOL;
  const args = argv.args;
  const inputFiles = argv.inputFiles ? argv.inputFiles.split(",").map((s: string) => s.trim()).filter(Boolean) : undefined;
  const secrets = parseSecrets(argv.secrets);

  if (!app) {
    console.error("App address is required. Pass --app or set IEXEC_APP_ADDRESS in .env");
    process.exit(1);
  }

  console.log("Creating request order with:", { app, workerpool, args, inputFiles, secrets });

  const { requestorder, signedRequestOrder } = await createAndSignRequestOrder({
    app,
    workerpool,
    args,
    inputFiles,
    secrets,
    category: argv.category
  });

  console.log("Signed request order:", signedRequestOrder?.id ?? signedRequestOrder);

  // fetch app & workerpool orders
  const { appOrders, workerpoolOrders } = await fetchTopAppAndWorkerpoolOrders(app, workerpool);
  if (!appOrders || appOrders.length === 0) {
    console.warn("No app orders found (appOrders.length=0). You may need to create an app order in marketplace.");
  }
  if (!workerpoolOrders || workerpoolOrders.length === 0) {
    console.warn("No workerpool orders found. Provide a workerpool or configure env IEXEC_WORKERPOOL.");
  }

  // pick top match (basic)
  const apporder = appOrders[0]?.order || null;
  const workerpoolorder = workerpoolOrders[0]?.order || null;

  const matchRes = await matchOrdersAndRun({
    requestOrderSigned: signedRequestOrder,
    appOrder: apporder,
    workerpoolOrder: workerpoolorder
  });

  console.log("Match result / started task:", matchRes);
  // persist to tasks store
  const storePath = process.env.TASK_STORE || "./data/tasks.json";
  try {
    let arr = [];
    if (fs.existsSync(storePath)) arr = JSON.parse(fs.readFileSync(storePath, "utf8"));
    arr.push({ createdAt: new Date().toISOString(), requestorder: requestorder, matchRes });
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify(arr, null, 2));
    console.log("Saved to task store:", storePath);
  } catch (e) {
    console.warn("Could not persist task to store", e);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
