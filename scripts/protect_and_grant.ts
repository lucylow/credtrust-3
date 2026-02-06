#!/usr/bin/env ts-node
// scripts/protect_and_grant.ts
import * as dotenv from 'dotenv';
dotenv.config();
import { DataProtectorWrapper } from '../src/lib/dataProtector';

async function main() {
  const pk = process.env.PRIVATE_KEY!;
  if (!pk) throw new Error('Set PRIVATE_KEY in .env');
  const dp = new DataProtectorWrapper({ 
    privateKey: pk, 
    ipfsUploadUrl: process.env.IEXEC_IPFS_UPLOAD, 
    smsURL: process.env.IEXEC_SMS_URL 
  });

  const email = process.argv[2] || 'user@example.com';
  console.log(`Protecting contact (email): ${email} ...`);
  
  try {
    const p = await dp.protectContact({ email });
    const protectedDataAddress = p.address || (p as any);
    console.log('ProtectedData address:', protectedDataAddress);
    
    const appAddress = process.env.IEXEC_APP_ADDRESS || '';
    console.log('Granting access to APP:', appAddress);
    
    const grant = await dp.grantAccess({
      protectedData: protectedDataAddress,
      authorizedApp: appAddress,
      allowBulk: true,
      numberOfAccess: 10
    });
    console.log('Grant result:', JSON.stringify(grant, null, 2));
  } catch (error) {
    console.error('Error during protect and grant:', error);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
