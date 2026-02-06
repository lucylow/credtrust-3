export const TASK_CATEGORIES: Record<number, { label: string; maxComputeMinutes: number }> = {
  0: { label: "XS", maxComputeMinutes: 1 },
  1: { label: "S", maxComputeMinutes: 2 },
  2: { label: "M", maxComputeMinutes: 5 },
  3: { label: "L", maxComputeMinutes: 10 },
  4: { label: "XL", maxComputeMinutes: 20 },
};
