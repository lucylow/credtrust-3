// src/lib/dataProtector.ts
import { IExecDataProtectorCore, getWeb3Provider } from '@iexec/dataprotector';
import { ethers } from 'ethers';

type Config = {
  privateKey?: string; // Node-only demo
  providerUrl?: string;
  ipfsUploadUrl?: string;
  smsURL?: string;
};

export class DataProtectorWrapper {
  dataProtector: IExecDataProtectorCore;
  provider: any;

  constructor(cfg: Config = {}) {
    if (cfg.privateKey) {
      // Node usage: ephemeral provider from private key
      this.provider = getWeb3Provider(cfg.privateKey);
      this.dataProtector = new IExecDataProtectorCore(this.provider, {
        ipfsNode: cfg.ipfsUploadUrl,
        iexecOptions: { smsURL: cfg.smsURL },
      });
    } else {
      // Browser: caller should pass window.ethereum provider to higher-level UI
      // In browser environment, we might need a way to pass the provider.
      // The iExec documentation mentions that if no provider is passed, it might try to use window.ethereum.
      this.dataProtector = new IExecDataProtectorCore((window as any).ethereum);
    }
  }

  // Protect a single contact (email / telegram chat id)
  async protectContact(dataObj: Record<string, any>) {
    const protectedData = await this.dataProtector.protectData({ data: dataObj as any });
    return protectedData; // object with .address etc.
  }

  // Grant access: authorizedApp or authorizedUser
  async grantAccess(params: {
    protectedData: string;
    authorizedApp?: string;
    authorizedUser?: string;
    allowBulk?: boolean;
    pricePerAccess?: number;
    numberOfAccess?: number;
  }) {
    const granted = await this.dataProtector.grantAccess({
      protectedData: params.protectedData,
      authorizedApp: params.authorizedApp,
      authorizedUser: params.authorizedUser,
      allowBulk: params.allowBulk ?? false,
      pricePerAccess: params.pricePerAccess ?? 0,
      numberOfAccess: params.numberOfAccess ?? 1,
    });
    return granted;
  }
}
