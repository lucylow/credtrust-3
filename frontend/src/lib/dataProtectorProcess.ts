// src/lib/dataProtectorProcess.ts
import dotenv from "dotenv";
dotenv.config();

import { getWeb3Provider, IExecDataProtectorCore } from "@iexec/dataprotector";
import { ethers } from "ethers";

const DEV_MODE = process.env.DEV_MODE === "true";

/**
 * DataProtectorProcess
 * - processProtectedData(params): starts an iExec run using ProtectedData
 * - getResultFromCompletedTask(taskId): fetch task result after completion
 *
 * In DEV_MODE, these functions simulate the behavior and return stubbed responses.
 */

export type ProcessParams = {
  protectedData: string; // protectedData address
  app?: string; // iExec app address (iApp)
  args?: string; // CLI args (string)
  inputFiles?: string[]; // public URLs
  secrets?: Record<number, string>; // mapping index->secret_name
  tag?: string; // human label for tracking
};

export type ProcessResponse = {
  taskId: string;
  status: "submitted" | "error";
  txHash?: string;
  message?: string;
};

export type TaskResult = {
  taskId: string;
  status: "succeeded" | "failed" | "running" | "unknown";
  result?: any;
  error?: string;
};

// internal helper to get DataProtector SDK
function createDataProtector(privateKey?: string) {
  if (DEV_MODE) return null;
  const pk = privateKey || process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY is required when DEV_MODE=false");
  const provider = getWeb3Provider(pk);
  const dp = new IExecDataProtectorCore(provider, {
    ipfsUploadUrl: process.env.IEXEC_IPFS_UPLOAD,
    iexecOptions: { smsURL: process.env.IEXEC_SMS_URL },
  } as any);
  return dp;
}

/**
 * Starts a processProtectedData run.
 */
export async function processProtectedData(params: ProcessParams, privateKey?: string): Promise<ProcessResponse> {
  if (DEV_MODE) {
    // simulate
    const fakeTaskId = "demo-task-" + Math.random().toString(36).slice(2, 10);
    console.log("[DEV_MODE] Simulated processProtectedData:", { params, fakeTaskId });
    return { taskId: fakeTaskId, status: "submitted", message: "DEV simulated run" };
  }

  const dp = createDataProtector(privateKey);
  if (!dp) throw new Error("DataProtector SDK not initialized");
  // DataProtectorCore.processProtectedData signature — adapt per SDK versions
  const res: any = await dp.processProtectedData({
    protectedData: params.protectedData,
    app: params.app || process.env.IEXEC_APP_ADDRESS,
    args: params.args,
    inputFiles: params.inputFiles,
    secrets: params.secrets,
  });
  // res likely contains taskId or task object. Normalize.
  const taskId = res?.taskId || res?.task?.id || res?.id || JSON.stringify(res).slice(0, 10);
  return { taskId, status: "submitted", message: "submitted to iExec", txHash: res?.txHash };
}

/**
 * After a run completes, fetch the results (decrypt/outputs).
 * The SDK provides getResultFromCompletedTask that downloads outputs.
 */
export async function getResultFromCompletedTask(taskId: string, privateKey?: string): Promise<TaskResult> {
  if (DEV_MODE) {
    // simulate success result with sample file content
    return {
      taskId,
      status: "succeeded",
      result: {
        outFiles: [{ path: "result.json", content: { message: "Simulated result", taskId } }]
      }
    };
  }

  const dp = createDataProtector(privateKey);
  if (!dp) throw new Error("DataProtector SDK not initialized");
  const res = await dp.getResultFromCompletedTask({ taskId });
  // SDK may return an object with urls or files; normalize for app
  return { taskId, status: "succeeded", result: res };
}
