#!/usr/bin/env ts-node
/**
 * scripts/iapp/get_task_result.ts
 *
 * Usage:
 *  npx ts-node scripts/iapp/get_task_result.ts --taskId <taskId> [--saveOut ./outdir]
 */

import dotenv from "dotenv";
dotenv.config();
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getResultFromCompletedTask } from "../../src/lib/dataProtectorProcess";
import fs from "fs";
import path from "path";

const argv = yargs(hideBin(process.argv))
  .option("taskId", { type: "string", demandOption: true })
  .option("saveOut", { type: "string" })
  .argv as any;

async function main() {
  const taskId = argv.taskId;
  const saveOut = argv.saveOut;
  console.log("Fetching result for task:", taskId);
  const res = await getResultFromCompletedTask(taskId);
  console.log("Result:", JSON.stringify(res, null, 2));

  if (saveOut && res.result) {
    const outDir = path.resolve(saveOut);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    // If SDK returns outFiles with path+content structure, write them
    const outFiles = (res.result.outFiles || res.result.files || []);
    for (const f of outFiles) {
      const p = path.join(outDir, f.path || `file-${Math.random().toString(36).slice(2,6)}.json`);
      const content = typeof f.content === "object" ? JSON.stringify(f.content, null, 2) : String(f.content);
      fs.writeFileSync(p, content);
      console.log("Wrote output file:", p);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
