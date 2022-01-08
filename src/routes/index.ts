import { Router } from 'express';

import {
  transferFunds,
  createAccount,
  getAccountBalance,
} from '../controllers/transactions';
import rateLimitTransferCreation from './middleware/transfer-rate-limit';

const router = Router();

router.get('/', function (_req, res) {
  res.status(200).send('The Bank Transactions API');
});

router.post('/create-account', async function createAccountRoute(req, res) {
  const data = req.body;

  createAccount(data)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ message: 'Could not create account', error: error.message });
    });
});

router.get('/balance/:accountNumber', function getBalanceRoute(req, res) {
  const data = req.params;

  getAccountBalance(data)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Could not get account balance',
        error: error.message,
      });
    });
});

router.post(
  '/transfer',
  rateLimitTransferCreation,
  async function transferRoute(req, res) {
    try {
      await transferFunds(req.body);

      res.status(200).json({ message: 'Transfer success' });
    } catch (error: any) {
      res.status(400).json({
        message: 'Could not complete the transaction',
        error: error.message,
      });
    }
  },
);

export default router;
