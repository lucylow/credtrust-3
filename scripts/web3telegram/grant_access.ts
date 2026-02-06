// scripts/web3telegram/grant_access.ts
import dotenv from 'dotenv';
dotenv.config();
import { createTelegramSDKs } from '../../src/lib/iexecTelegram';

function parseArgs() {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.error('Usage: grant_access.ts <protectedData> [--authorizedApp 0x..] [--authorizedUser 0x..] [--allowBulk true] [--number N]');
    process.exit(1);
  }
  const result: any = { protectedData: args[0] };
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--authorizedApp') result.authorizedApp = args[++i];
    if (args[i] === '--authorizedUser') result.authorizedUser = args[++i];
    if (args[i] === '--allowBulk') result.allowBulk = args[++i] === 'true';
    if (args[i] === '--number') result.numberOfAccess = Number(args[++i]);
  }
  return result;
}

async function main() {
  const opts = parseArgs();
  const sdk = createTelegramSDKs();
  console.log('Granting access for', opts.protectedData, 'allowBulk=', opts.allowBulk);
  const res = await sdk.dataProtector.grantAccess({
    protectedData: opts.protectedData,
    authorizedApp: opts.authorizedApp || process.env.IEXEC_APP_ADDRESS,
    authorizedUser: opts.authorizedUser,
    allowBulk: opts.allowBulk ?? false,
    numberOfAccess: opts.numberOfAccess ?? 1
  });
  console.log('GrantAccess result:', res);
}

main().catch(e => { console.error(e); process.exit(1); });
