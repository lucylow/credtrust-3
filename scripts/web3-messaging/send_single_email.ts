// scripts/web3-messaging/send_single_email.ts
import { createSDKs } from '../../src/lib/iexecMessaging';
import * as dotenv from 'dotenv';
dotenv.config();

// Usage: npx ts-node scripts/web3-messaging/send_single_email.ts <protectedDataAddress> "<subject>" "<body>"
async function main() {
  const pd = process.argv[2];
  const subject = process.argv[3] || 'Hello from CredTrust!';
  const body = process.argv[4] || 'This is a demo single email via Web3Mail';

  if (!pd) {
    console.error('Usage: send_single_email.ts <protectedDataAddress> "<subject>" "<body>"');
    process.exit(1);
  }

  const sdk = createSDKs();
  console.log('Sending single email to', pd);
  if (!sdk.web3mail) throw new Error('Web3Mail SDK not initialized');
  const res = await sdk.web3mail.sendEmail({
    protectedData: pd,
    emailSubject: subject,
    emailContent: body,
    contentType: 'text/plain',
  });
  console.log('sendEmail result:', res);
}

main().catch(e => { console.error(e); process.exit(1); });
