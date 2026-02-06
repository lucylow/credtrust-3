import { WorkerCapabilities } from "./types";

export const DEFAULT_WORKER: WorkerCapabilities = {
  cpus: 2,
  tee: "SGX",
  memoryGB: 8,
  trusted: true,
};

export const ADVANCED_WORKER: WorkerCapabilities = {
  cpus: 8,
  tee: "TDX",
  memoryGB: 32,
  trusted: true,
};
