import { Router } from 'express';
import { transferFunds } from '../controllers/transactions';

const router = Router();

router.get('/', function (_req, res) {
  res.status(200).send('The Bank Transactions API');
});

router.post('/transfer', async function transferRoute(req, res) {
  try {
    await transferFunds(req.body);

    res.status(200).json({ message: 'Transfer success' });
  } catch {
    res.status(400).json({ message: 'Could not complete the transaction' });
  }

  // Validate
  // Check balance (locks)
  // Add to Transaction Queue

  // Update Balance (locks)
  // Write transaction
  return;
  res.status(200).json({ message: 'Transaction completed successfully' });
});

export default router;
