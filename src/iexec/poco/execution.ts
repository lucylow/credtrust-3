import { IExec } from "iexec";
import { createSignedRequestOrder, fetchMatchingOrders } from "./orders";
import { brokerDeal } from "./broker";
import { TEE_TAGS } from "./tags";
import { getPoCoReceipt } from "./receipts";

export interface ConfidentialJobParams {
  iexec: IExec;
  app: string;
  dataset?: string;
  params?: string;
  tag?: bigint;
}

/**
 * Runs a confidential job through the full PoCo lifecycle:
 * 1. Fetch matching App / Dataset / Workerpool orders
 * 2. Enforce TEE tags
 * 3. Create signed RequestOrder
 * 4. Match orders → Deal (on-chain)
 * 5. Monitor task execution (off-chain/enclave)
 * 6. Finalize & return receipt
 */
export async function runConfidentialJob({
  iexec,
  app,
  dataset,
  params,
  tag = TEE_TAGS.TEE,
}: ConfidentialJobParams) {
  console.log("--- Starting PoCo-Native CredTrust Job ---");

  // 1. & 2. Fetch matching orders and Enforce TEE tags
  console.log("Step 1: Fetching matching orders with TEE requirements...");
  const { appOrder, datasetOrder, workerpoolOrder } = await fetchMatchingOrders(
    iexec,
    app,
    dataset,
    tag
  );

  if (!appOrder) throw new Error("No matching app order found");

  // 3. Create RequestOrder
  console.log("Step 2: Creating signed RequestOrder...");
  const requestOrder = await createSignedRequestOrder(iexec, {
    app,
    dataset,
    params,
    tag,
  });

  // 4. Match orders → Deal
  console.log("Step 3: Matching orders to create PoCo Deal...");
  const { dealId } = await brokerDeal(
    iexec,
    requestOrder,
    appOrder,
    datasetOrder,
    workerpoolOrder
  );

  // 5. Get Task ID from Deal
  console.log("Step 4: Extracting Task ID from Deal...");
  const taskId = await iexec.deal.computeTaskId(dealId, 0);
  console.log(`Task ID: ${taskId}`);

  return { dealId, taskId };
}

/**
 * Waits for a task to complete and returns a PoCo receipt.
 */
export async function waitForPoCoExecution(iexec: IExec, dealId: string, taskId: string) {
  console.log(`Step 5: Waiting for TEE Worker to finalize task ${taskId}...`);
  
  // This will poll until the task is COMPLETED or FAILED
  const taskObservable = await iexec.task.obsTask(taskId);
  
  return new Promise((resolve, reject) => {
    taskObservable.subscribe({
      next: (data) => console.log(`Task Status: ${data.task.statusName}`),
      error: (err) => reject(err),
      complete: async () => {
        console.log("Step 6: PoCo Finalized. Generating receipt...");
        const receipt = await getPoCoReceipt(iexec, dealId, taskId);
        resolve(receipt);
      },
    });
  });
}
