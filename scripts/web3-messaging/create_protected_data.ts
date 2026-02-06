// scripts/web3-messaging/create_protected_data.ts
import { createSDKs } from '../../src/lib/iexecMessaging';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  // usage: npx ts-node scripts/web3-messaging/create_protected_data.ts user@example.com
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: create_protected_data.ts <email_or_chatid>');
    process.exit(1);
  }

  const sdk = createSDKs();
  console.log('Protecting data:', arg);
  const obj = arg.includes('@') ? { email: arg } : { telegram: arg };
  const pd = await sdk.dataProtector.protectData({ data: obj });
  console.log('ProtectedData created:', pd);
  console.log('Address:', pd.address || pd);
}

main().catch(e => { console.error(e); process.exit(1); });
