import { TASK_CATEGORIES } from "../iexec/categories";
import { WorkerExecutionSummary } from "./types";
import { DEFAULT_WORKER } from "./capabilities";

export async function simulateWorkerExecution({
  taskId,
  categoryId,
}: {
  taskId: string;
  categoryId: number;
}): Promise<WorkerExecutionSummary & { taskId: string; workerStatus: string }> {
  const category = TASK_CATEGORIES[categoryId] || TASK_CATEGORIES[0];

  // Random execution time within category bounds
  const executionTime = Math.random() * category.maxComputeMinutes * 0.8 + 0.1;

  // Simulate latency
  await new Promise((r) =>
    setTimeout(r, Math.min(executionTime * 100, 2000))
  );

  return {
    taskId,
    workerStatus: "COMPLETED",
    workerTEE: DEFAULT_WORKER.tee,
    executionTimeMinutes: executionTime,
    category: categoryId,
    workerRewarded: true,
  };
}
