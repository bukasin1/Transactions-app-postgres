import { Router } from 'express';

import { transferFunds } from '../controllers/transactions';
import rateLimitTransferCreation from './middleware/transfer-rate-limit';

const router = Router();

router.get('/', function (_req, res) {
  res.status(200).send('The Bank Transactions API');
});

router.post(
  '/transfer',
  rateLimitTransferCreation,
  async function transferRoute(req, res) {
    try {
      await transferFunds(req.body);

      res.status(200).json({ message: 'Transfer success' });
    } catch {
      res.status(400).json({ message: 'Could not complete the transaction' });
    }

    return;
    res.status(200).json({ message: 'Transaction completed successfully' });
  },
);

export default router;
