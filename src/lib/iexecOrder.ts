// src/lib/iexecOrder.ts
import dotenv from "dotenv";
dotenv.config();

const DEV_MODE = process.env.DEV_MODE === "true";

import { ethers } from "ethers";

type IExecSDK = any;

/**
 * Dynamic import of iexec SDK to avoid startup errors in environments where it's not installed.
 * The iExec SDK exposes functionality:
 * - iexec.order.createRequestorder(...)
 * - iexec.order.signRequestorder(...)
 * - iexec.orderbook.fetchAppOrderbook(...)
 * - iexec.orderbook.fetchWorkerpoolOrderbook(...)
 * - iexec.order.matchOrders(...)
 * - iexec.task.show(taskId) (or using iexec.workers.task)
 *
 * SDK versions differ: adapt function names if your installed version varies.
 */

async function getIexec(pk?: string): Promise<{ iexec: IExecSDK; wallet?: any }> {
  if (DEV_MODE) return { iexec: null, wallet: null };
  const { IExec } = await import("iexec");
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
  const signer = pk ? new ethers.Wallet(pk, provider) : undefined;
  // IExec expects an ethProvider or signer. Pass signer.privateKey via getWeb3Provider if necessary.
  const iexec = new IExec({ ethProvider: (signer || provider) as any });
  return { iexec, wallet: signer };
}

/**
 * Build the classic requestorder params with CLI args, input files, secrets mapping.
 * `params` will be string or object depending on SDK convention. We'll pass an object: { iexec_args, iexec_input_files, iexec_secrets }
 */
export async function createAndSignRequestOrder(opts: {
  app: string; // app address or app order reference - required for real runs
  category?: number;
  appmaxprice?: number | string;
  workerpool?: string;
  args?: string;
  inputFiles?: string[];
  secrets?: Record<number, string>;
  requester?: string; // optional override
  privateKey?: string;
}) {
  if (DEV_MODE) {
    // simulate requestorder + signed order output
    return {
      requestorder: { id: "demo-request-" + Math.random().toString(36).slice(2, 9), params: opts },
      signedRequestOrder: { id: "signed-" + Math.random().toString(36).slice(2, 9), demo: true }
    };
  }

  const { iexec, wallet } = await getIexec(opts.privateKey);
  if (!iexec) throw new Error("IExec SDK not available");

  // Build params object for iExec "params"
  const paramsObj: any = {};
  if (opts.args) paramsObj.iexec_args = opts.args;
  if (opts.inputFiles && opts.inputFiles.length) paramsObj.iexec_input_files = opts.inputFiles;
  if (opts.secrets && Object.keys(opts.secrets).length) paramsObj.iexec_secrets = opts.secrets;

  const category = opts.category ?? Number(process.env.IEXEC_CATEGORY ?? 0);

  // createRequestorder API (SDK version dependent)
  // many iexec SDK versions use iexec.order.createRequestorder({ app, category, appmaxprice, workerpool, params })
  const requestOrderToSign = await iexec.order.createRequestorder({
    app: opts.app,
    category,
    appmaxprice: opts.appmaxprice ?? 0,
    workerpool: opts.workerpool ?? process.env.IEXEC_WORKERPOOL,
    params: typeof paramsObj === "string" ? paramsObj : paramsObj
  });

  // Sign the requestorder with the requester's wallet
  const signedRequestOrder = await iexec.order.signRequestorder(requestOrderToSign);

  return { requestorder: requestOrderToSign, signedRequestOrder };
}

/**
 * Fetch app and workerpool orders (simple helpers) and return top matches.
 */
export async function fetchTopAppAndWorkerpoolOrders(appAddress?: string, workerpoolAddress?: string) {
  if (DEV_MODE) {
    return { appOrders: [], workerpoolOrders: [] };
  }
  const { iexec } = await getIexec(process.env.PRIVATE_KEY);
  const app = appAddress || process.env.IEXEC_APP_ADDRESS;
  const wp = workerpoolAddress || process.env.IEXEC_WORKERPOOL;

  const appOrders = (await iexec.orderbook.fetchAppOrderbook(app)).orders || [];
  const workerpoolOrders = (await iexec.orderbook.fetchWorkerpoolOrderbook({ workerpool: wp })).orders || [];

  return { appOrders, workerpoolOrders };
}

/**
 * Match orders & submit task (requestorder + top apporder + workerpoolorder)
 * Returns taskId in SDK format (may be receipt object or raw id depending on SDK)
 */
export async function matchOrdersAndRun(opts: {
  requestOrderSigned: any;
  appOrder: any;
  workerpoolOrder: any;
}) {
  if (DEV_MODE) {
    const fakeTaskId = "demo-task-" + Math.random().toString(36).slice(2, 9);
    return { taskId: fakeTaskId, demo: true };
  }
  const { iexec } = await getIexec(process.env.PRIVATE_KEY);
  // matchOrders accepts an object with requestorder, apporder, workerpoolorder
  const matchRes = await iexec.order.matchOrders({
    requestorder: opts.requestOrderSigned,
    apporder: opts.appOrder,
    workerpoolorder: opts.workerpoolOrder
  });
  // matchRes often returns a taskId or a complex object; normalize to taskId if possible
  const taskId = matchRes?.taskId || matchRes?.task?.id || matchRes?.id || null;
  return { taskId, raw: matchRes };
}

/**
 * Check task status and optionally download results
 */
export async function getTaskStatus(taskId: string) {
  if (DEV_MODE) {
    return { taskId, status: "completed", result: { demo: true, taskId } };
  }
  const { iexec } = await getIexec(process.env.PRIVATE_KEY);
  const task = await iexec.service.task.show(taskId); // older SDKs use iexec.task.show or iexec.service.task.show
  return { taskId, raw: task };
}
