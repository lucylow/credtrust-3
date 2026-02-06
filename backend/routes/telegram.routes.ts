import express from 'express';
import {
  fetchMyContacts,
  fetchUserContacts,
} from '../../packages/telegram/telegram.contacts';
import { sendTelegram } from '../../packages/telegram/telegram.service';

const router = express.Router();

router.get('/contacts/me', async (_req, res) => {
  try {
    res.json(await fetchMyContacts());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/contacts/:user', async (req, res) => {
  try {
    res.json(await fetchUserContacts(req.params.user));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/send', async (req, res) => {
  try {
    const { protectedData, content } = req.body;
    const tx = await sendTelegram({ protectedData, content });
    res.json(tx);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
