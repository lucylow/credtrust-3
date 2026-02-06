export type WorkerCapabilities = {
  cpus: number;
  tee: "SGX" | "TDX";
  memoryGB: number;
  trusted: boolean;
};

export type WorkerStatus =
  | "IDLE"
  | "BUSY"
  | "FAILED"
  | "OFFLINE";

export type WorkerExecutionSummary = {
  workerTEE: "SGX" | "TDX";
  executionTimeMinutes: number;
  category: number;
  workerRewarded: boolean;
  workerSlashed?: boolean;
};
