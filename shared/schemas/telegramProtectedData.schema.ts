import { z } from 'zod';

export const TelegramProtectedDataSchema = z.object({
  protectedData: z.string().startsWith('0x'),
  owner: z.string().startsWith('0x'),
});
