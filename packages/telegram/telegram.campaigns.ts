import { web3telegram } from './web3telegram.client';

export async function prepareTelegramCampaign(params: {
  grantedAccesses: string[];
  content: string;
}) {
  return web3telegram.prepareTelegramCampaign({
    grantedAccesses: params.grantedAccesses,
    telegramContent: params.content,
  });
}

export async function sendTelegramCampaign(campaignRequest: any) {
  return web3telegram.sendTelegramCampaign({
    campaignRequest,
  });
}
