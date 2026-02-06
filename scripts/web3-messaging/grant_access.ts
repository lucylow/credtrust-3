// scripts/web3-messaging/grant_access.ts
import { createSDKs } from '../../src/lib/iexecMessaging';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Usage:
 * npx ts-node scripts/web3-messaging/grant_access.ts <protectedDataAddress> [--authorizedApp 0x...] [--authorizedUser 0x...] [--allowBulk true] [--number 10]
 */

function parseArgs() {
  const argv = process.argv.slice(2);
  const out: any = { pd: argv[0] };
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === '--authorizedApp') out.authorizedApp = argv[++i];
    if (argv[i] === '--authorizedUser') out.authorizedUser = argv[++i];
    if (argv[i] === '--allowBulk') out.allowBulk = argv[i + 1] === 'true'; // Fixed index for value
    if (argv[i] === '--number') out.numberOfAccess = Number(argv[++i]);
  }
  return out;
}

async function main() {
  const args = parseArgs();
  if (!args.pd) {
    console.error('Usage: grant_access <protectedDataAddress> ...');
    process.exit(1);
  }
  const sdk = createSDKs();
  const authorizedApp = args.authorizedApp || process.env.IEXEC_APP_ADDRESS;
  const authorizedUser = args.authorizedUser;
  const allowBulk = args.allowBulk ?? false;
  const numberOfAccess = args.numberOfAccess ?? 1;

  console.log('Granting access to', args.pd, { authorizedApp, authorizedUser, allowBulk, numberOfAccess });
  const res = await sdk.dataProtector.grantAccess({
    protectedData: args.pd,
    authorizedApp,
    authorizedUser,
    allowBulk,
    numberOfAccess,
  });

  console.log('Grant access result:', res);
}

main().catch(e => { console.error(e); process.exit(1); });
