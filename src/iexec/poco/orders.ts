import { IExec } from "iexec";
import { RequestOrder, AppOrder, DatasetOrder, WorkerpoolOrder } from "./types";
import { TEE_TAGS } from "./tags";

/**
 * Creates and signs a RequestOrder for CredTrust execution.
 */
export async function createSignedRequestOrder(
  iexec: IExec,
  params: {
    app: string;
    dataset?: string;
    workerpool?: string;
    category?: number;
    params?: string;
    tag?: bigint;
    appmaxprice?: bigint;
    datasetmaxprice?: bigint;
    workerpoolmaxprice?: bigint;
  }
) {
  const userAddress = await iexec.wallet.getAddress();
  
  const requestOrderTemplate = await iexec.order.createRequestorder({
    app: params.app,
    dataset: params.dataset,
    workerpool: params.workerpool,
    category: params.category || 0,
    params: params.params || "",
    tag: params.tag?.toString() || TEE_TAGS.TEE.toString(),
    appmaxprice: params.appmaxprice?.toString() || "0",
    datasetmaxprice: params.datasetmaxprice?.toString() || "0",
    workerpoolmaxprice: params.workerpoolmaxprice?.toString() || "0",
    requester: userAddress,
  });

  const signedRequestOrder = await iexec.order.signRequestorder(requestOrderTemplate);
  return signedRequestOrder;
}

/**
 * Fetches matching orders for a given app and dataset.
 */
export async function fetchMatchingOrders(
  iexec: IExec,
  appAddress: string,
  datasetAddress?: string,
  tag?: bigint
) {
  const tagStr = tag?.toString() || TEE_TAGS.TEE.toString();
  
  const appOrders = await iexec.orderbook.fetchAppOrderbook(appAddress, {
    tag: tagStr
  });
  
  let datasetOrders = null;
  if (datasetAddress) {
    datasetOrders = await iexec.orderbook.fetchDatasetOrderbook(datasetAddress, {
      tag: tagStr
    });
  }
  
  const workerpoolOrders = await iexec.orderbook.fetchWorkerpoolOrderbook({
    tag: tagStr
  });

  return {
    appOrder: appOrders.orders[0]?.order,
    datasetOrder: datasetOrders?.orders[0]?.order,
    workerpoolOrder: workerpoolOrders.orders[0]?.order
  };
}
