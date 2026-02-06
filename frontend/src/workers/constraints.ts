import { WorkerCapabilities } from "./types";
import { TASK_CATEGORIES } from "../iexec/categories";

export function canWorkerRunTask(
  worker: WorkerCapabilities,
  categoryId: number
): boolean {
  const category = TASK_CATEGORIES[categoryId];
  if (!category) return false;

  // iExec minimum worker requirements
  if (worker.cpus < 2) return false;
  if (!worker.trusted) return false;

  // Category-specific constraints
  if (category.label === "XL" && worker.memoryGB < 16) return false;
  if (category.label === "L" && worker.memoryGB < 8) return false;

  // TDX required for high-security tasks (hypothetical constraint for demo)
  if (category.label === "XL" && worker.tee !== "TDX") return false;

  return true;
}
