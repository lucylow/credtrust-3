import { z } from 'zod';

export const TelegramCampaignSchema = z.object({
  grantedAccesses: z.array(z.string().startsWith('0x')),
  content: z.string().min(1),
});
