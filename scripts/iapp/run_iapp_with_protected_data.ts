#!/usr/bin/env ts-node
/**
 * scripts/iapp/run_iapp_with_protected_data.ts
 *
 * Usage:
 *  npx ts-node scripts/iapp/run_iapp_with_protected_data.ts \
 *    --protectedData 0x123abc... \
 *    --app 0xMyIAppAddress \
 *    --args "--input-path data/input.csv --output-format json" \
 *    --inputFiles "https://example.com/config.json,https://example.com/data.csv" \
 *    --secrets "1:openai-api-key,2:db-pass" \
 *    --tag "loan-batch-2026-02-06"
 */

import dotenv from "dotenv";
dotenv.config();
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { processProtectedData } from "../../src/lib/dataProtectorProcess";

const argv = yargs(hideBin(process.argv))
  .option("protectedData", { type: "string", demandOption: true })
  .option("app", { type: "string" })
  .option("args", { type: "string" })
  .option("inputFiles", { type: "string" })
  .option("secrets", { type: "string" })
  .option("tag", { type: "string" })
  .argv as any;

async function parseSecrets(secretsRaw?: string) {
  if (!secretsRaw) return undefined;
  // format: "1:openai-api-key,2:db-pass" -> {1: 'openai-api-key', 2: 'db-pass'}
  const entries = secretsRaw.split(",").map(s => s.trim()).filter(Boolean);
  const map: Record<number, string> = {};
  for (const e of entries) {
    const [k, v] = e.split(":");
    map[Number(k)] = v;
  }
  return map;
}

async function main() {
  const protectedData = argv.protectedData;
  const app = argv.app;
  const args = argv.args;
  const inputFiles = argv.inputFiles ? argv.inputFiles.split(",").map((s: string) => s.trim()).filter(Boolean) : undefined;
  const secrets = await parseSecrets(argv.secrets);
  const tag = argv.tag;

  console.log("Starting iApp run with ProtectedData", { protectedData, app, args, inputFiles, secrets, tag });

  const res = await processProtectedData({
    protectedData,
    app,
    args,
    inputFiles,
    secrets,
    tag
  });

  console.log("submitted:", res);
  console.log("Use scripts/iapp/get_task_result.ts to poll for completion and fetch result.");
}

main().catch(err => { console.error(err); process.exit(1); });
