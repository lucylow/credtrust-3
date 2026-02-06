export type AppOrder = {
  app: string;
  appprice: bigint;
  volume: bigint;
  tag: bigint;
  datasetrestrict?: string;
  workerpoolrestrict?: string;
  requesterrestrict?: string;
};

export type DatasetOrder = {
  dataset: string;
  datasetprice: bigint;
  volume: bigint;
  tag: bigint;
};

export type WorkerpoolOrder = {
  workerpool: string;
  workerpoolprice: bigint;
  tag: bigint;
  category: number;
  trust: number;
};

export type RequestOrder = {
  app: string;
  dataset?: string;
  workerpool?: string;
  params: string;
  appmaxprice: bigint;
  datasetmaxprice: bigint;
  workerpoolmaxprice: bigint;
  tag: bigint;
  callback?: string;
};

export type PoCoExecutionReceipt = {
  dealId: string;
  taskId: string;
  enclave: "SGX" | "TDX" | "NONE";
  appPaid: bigint;
  datasetPaid: bigint;
  workerPaid: bigint;
  schedulerSlashed?: boolean;
};
