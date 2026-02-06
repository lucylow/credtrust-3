// src/lib/iexecMessaging.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { getWeb3Provider, IExecDataProtectorCore } from '@iexec/dataprotector';
import { IExecWeb3mail } from '@iexec/web3mail';
import { IExecWeb3telegram } from '@iexec/web3telegram';
import { ethers } from 'ethers';

type SDKs = {
  provider: any;
  dataProtector: IExecDataProtectorCore;
  web3mail?: IExecWeb3mail;
  web3telegram?: IExecWeb3telegram;
};

const DEV_MODE = process.env.DEV_MODE === 'true';

export function makeProvider(privateKey?: string) {
  const rpc = process.env.RPC_PROVIDER_URL;
  if (privateKey) {
    // node usage with private key
    if (rpc) {
      const wallet = new ethers.Wallet(privateKey, new ethers.providers.JsonRpcProvider(rpc));
      return wallet.provider;
    } else {
      // fallback to in-memory provider (ethers default)
      return new ethers.Wallet(privateKey).provider;
    }
  }
  // browser or default
  return undefined;
}

export function createSDKs(privateKey?: string): SDKs {
  if (DEV_MODE) {
    // in dev mode we create dummy objects that log actions (avoid iExec)
    const provider = makeProvider(privateKey);
    const dp: any = {
      protectData: async ({ data }: any) => {
        return { address: '0xDEMO_PROTECTED_' + Buffer.from(JSON.stringify(data)).toString('hex').slice(0, 20) };
      },
      grantAccess: async (params: any) => ({ grantedAccess: '0xDEMO_GRANT' })
    };
    const mail: any = {
      fetchMyContacts: async ({ bulkOnly }: any) => ([]),
      prepareEmailCampaign: async (opts: any) => ({ campaignRequest: { demo: true } }),
      sendEmailCampaign: async (opts: any) => ({ tasks: [] }),
      sendEmail: async (opts: any) => ({ taskId: 'demo-task' })
    };
    const tg: any = {
      prepareTelegramCampaign: async (opts: any) => ({ campaignRequest: { demo: true } }),
      sendTelegramCampaign: async (opts: any) => ({ tasks: [] }),
      sendTelegram: async (opts: any) => ({ taskId: 'demo-task-tg' }),
      fetchMyContacts: async ({ bulkOnly }: any) => ([]),
    };
    return { provider, dataProtector: dp, web3mail: mail, web3telegram: tg };
  }

  const pk = privateKey || process.env.PRIVATE_KEY;
  if (!pk) throw new Error('PRIVATE_KEY missing: set in .env or pass as arg');

  const provider = getWeb3Provider(pk);
  const dataProtector = new IExecDataProtectorCore(provider, {
    ipfsNode: process.env.IEXEC_IPFS_UPLOAD,
    iexecOptions: { smsURL: process.env.IEXEC_SMS_URL },
  });

  const web3mail = new IExecWeb3mail(provider);
  const web3telegram = new IExecWeb3telegram(provider);

  return { provider, dataProtector, web3mail, web3telegram };
}
