import { web3telegram } from './web3telegram.client';

export async function sendTelegram(params: {
  protectedData: string;
  content: string;
}) {
  return web3telegram.sendTelegram({
    protectedData: params.protectedData,
    telegramContent: params.content,
  });
}
