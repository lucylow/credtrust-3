#!/usr/bin/env ts-node
/**
 * scripts/iapp/monitor_task.ts
 *
 * Usage:
 *  npx ts-node scripts/iapp/monitor_task.ts --taskId <taskId> [--interval 5000] [--timeout 600000]
 *
 * In DEV_MODE this prints a fake completed result.
 */
import dotenv from "dotenv";
dotenv.config();
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getTaskStatus } from "../../src/lib/iexecOrder";

const argv = yargs(hideBin(process.argv))
  .option("taskId", { type: "string" })
  .option("interval", { type: "number", default: 5000 })
  .option("timeout", { type: "number", default: 600000 })
  .argv as any;

async function main() {
  const taskId = argv.taskId;
  if (!taskId) {
    console.error("Usage: monitor_task.ts --taskId <taskId>");
    process.exit(1);
  }
  const interval = argv.interval;
  const timeout = argv.timeout;
  const start = Date.now();

  console.log("Monitoring task:", taskId);

  while (Date.now() - start < timeout) {
    const status = await getTaskStatus(taskId);
    console.log("Status @", new Date().toISOString(), status);
    // Heuristic: if status.raw?.status or status.raw?.task?.status indicates done
    const s = status?.raw?.status || status?.raw?.task?.status || status?.status;
    if (s === "completed" || s === "failed" || s === "Succeeded" || s === "Completed" || s === "succeeded") {
      console.log("Task final status:", s);
      process.exit(0);
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  console.log("Timeout waiting for task");
  process.exit(2);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
