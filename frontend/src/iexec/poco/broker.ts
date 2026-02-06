import { IExec } from "iexec";
import { RequestOrder, AppOrder, DatasetOrder, WorkerpoolOrder } from "./types";

/**
 * Brokers a deal by matching signed PoCo orders.
 * Matching is off-chain; only matchOrders touches the chain.
 * No gas spent until execution is guaranteed.
 */
export async function brokerDeal(
  iexec: IExec,
  requestOrder: any,
  appOrder: any,
  datasetOrder?: any,
  workerpoolOrder?: any
) {
  console.log("Brokering PoCo deal...");
  
  const matchParams: any = {
    requestorder: requestOrder,
    apporder: appOrder,
  };

  if (datasetOrder) {
    matchParams.datasetorder = datasetOrder;
  }

  if (workerpoolOrder) {
    matchParams.workerpoolorder = workerpoolOrder;
  }

  try {
    const { dealid, volume } = await iexec.order.matchOrders(matchParams);
    console.log(`Deal created: ${dealid} (volume: ${volume})`);
    return { dealId: dealid, volume };
  } catch (error) {
    console.error("Failed to broker deal:", error);
    throw error;
  }
}
