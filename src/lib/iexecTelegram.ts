// src/lib/iexecTelegram.ts
import dotenv from 'dotenv';
dotenv.config();

import { getWeb3Provider, IExecDataProtectorCore } from '@iexec/dataprotector';
import { IExecWeb3telegram } from '@iexec/web3telegram';

const DEV_MODE = process.env.DEV_MODE === 'true';

export type SDKs = {
  provider?: any;
  dataProtector: any;
  web3telegram: any;
};

/**
 * Create provider + iExec SDKs.
 * In DEV_MODE the SDKs are stubbed and return synthetic results so local demos work offline.
 */
export function createTelegramSDKs(privateKey?: string): SDKs {
  if (DEV_MODE) {
    // Dry-run stubs
    const dpStub = {
      protectData: async ({ data }: any) => {
        const pseudo = '0xDEMO_PD_' + Buffer.from(JSON.stringify(data)).toString('hex').slice(0, 20);
        return { address: pseudo, data, demo: true };
      },
      grantAccess: async (options: any) => {
        return { grantedAccess: '0xDEMO_GRANT_' + Math.random().toString(36).slice(2, 10), options };
      }
    };
    const tgStub = {
      fetchMyContacts: async ({ bulkOnly }: any) => {
        // return a small demo array if bulkOnly true
        return bulkOnly
          ? [
              { protectedData: '0xPD1', grantedAccess: '0xGA1' },
              { protectedData: '0xPD2', grantedAccess: '0xGA2' }
            ]
          : [
              { protectedData: '0xPD1', grantedAccess: '0xGA1' },
              { protectedData: '0xPD2', grantedAccess: '0xGA2' },
              { protectedData: '0xPD3', grantedAccess: '0xGA3' }
            ];
      },
      prepareTelegramCampaign: async ({ grantedAccesses, telegramContent }: any) => {
        return { campaignRequest: { demo: true, grantedAccesses, telegramContent } };
      },
      sendTelegramCampaign: async ({ campaignRequest }: any) => {
        return { tasks: [{ taskId: 'demo-task-1' }, { taskId: 'demo-task-2' }], campaignRequest };
      },
      sendTelegram: async ({ protectedData, telegramContent }: any) => {
        return { taskId: 'demo-single-' + Math.random().toString(36).slice(2, 8), protectedData, telegramContent };
      }
    };
    return { dataProtector: dpStub, web3telegram: tgStub };
  }

  // Real mode
  const pk = privateKey || process.env.PRIVATE_KEY;
  if (!pk) throw new Error('PRIVATE_KEY is required in non-dev mode (set in .env)');

  const provider = getWeb3Provider(pk);
  const dataProtector = new IExecDataProtectorCore(provider, {
    ipfsUploadUrl: process.env.IEXEC_IPFS_UPLOAD,
    iexecOptions: { smsURL: process.env.IEXEC_SMS_URL }
  });

  const web3telegram = new IExecWeb3telegram(provider);

  return { provider, dataProtector, web3telegram };
}
