import { IExecDataProtectorCore, getWeb3Provider } from '@iexec/dataprotector';

const provider = getWeb3Provider(process.env.IEXEC_PRIVATE_KEY!);
export const dataProtector = new IExecDataProtectorCore(provider);

export async function protectTelegramChatId(chatId: string) {
  return dataProtector.protectData({
    data: { telegramChatId: chatId },
  });
}

export async function grantTelegramAccess(params: {
  protectedData: string;
  authorizedApp: string;
  authorizedUser: string;
  allowBulk?: boolean;
}) {
  return dataProtector.grantAccess({
    ...params,
    pricePerAccess: 0,
    numberOfAccess: 1000,
  });
}
