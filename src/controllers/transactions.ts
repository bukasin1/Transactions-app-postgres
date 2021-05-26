import joi from 'joi';
import { v4 } from 'uuid';

import sql from '../stores/db';
import transactionsQueue from '../queues/transactions';

interface Transfer {
  from_account: string;
  to_account: string;
  amount: number;
  description?: string;
  reference: string;
}

const transferSchema = joi
  .object<Transfer>({
    from_account: joi.string().length(10).required().label('from'),
    to_account: joi.string().length(10).required().label('to'),
    amount: joi.number().min(1).precision(2).required(),
    description: joi.string().allow(''),
  })
  .rename('from', 'from_account')
  .rename('to', 'to_account');

export async function transferFunds(data: Record<string, unknown>) {
  const { value, error } = transferSchema.validate(data, {
    stripUnknown: true,
    abortEarly: false,
  });

  if (error) {
    throw error;
  }

  const { from_account, amount } = value as Transfer;
  const integerAmount = Math.trunc(amount * 100);

  const [{ check }] = await sql`
    SELECT balance >= ${integerAmount} AS check FROM balances WHERE account_number = ${from_account}
  `;

  if (!check) {
    throw Error('Insufficient Balance');
  }

  const reference = v4();

  transactionsQueue.add({ ...value, reference, integerAmount });
}
