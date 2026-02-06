import { IExec } from "iexec";
import { PoCoExecutionReceipt } from "./types";

/**
 * Generates a CredTrust receipt from a completed PoCo deal.
 */
export async function getPoCoReceipt(
  iexec: IExec,
  dealId: string,
  taskId: string
): Promise<PoCoExecutionReceipt> {
  const deal = await iexec.deal.show(dealId);
  const task = await iexec.task.show(taskId);

  // Extract payment info from deal
  const appPaid = BigInt(deal.app.price || 0);
  const datasetPaid = BigInt(deal.dataset?.price || 0);
  const workerPaid = BigInt(deal.workerpool.price || 0);

  // Determine enclave type from tags
  const tag = deal.tag;
  let enclave: "SGX" | "TDX" | "NONE" = "NONE";
  
  // Basic tag mapping (iExec standard)
  if (tag.includes("0x0000000000000000000000000000000000000000000000000000000000000001")) {
    enclave = "SGX";
  } else if (tag.includes("0x0000000000000000000000000000000000000000000000000000000000000009")) {
    enclave = "TDX";
  }

  return {
    dealId,
    taskId,
    enclave,
    appPaid,
    datasetPaid,
    workerPaid,
    schedulerSlashed: task.status === 4, // 4 = FAILED in some iExec versions, logic may vary
  };
}
