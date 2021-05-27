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

const createAccountSchema = joi
  .object({
    deposit: joi.number().precision(2).positive().required(),
    account_number: joi.string().length(10).required(),
  })
  .rename('accountNumber', 'account_number');

export async function createAccount(data: Record<string, unknown>) {
  const { value, error } = createAccountSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw error;
  }

  const { deposit, ...rest } = value;

  const balance = Math.trunc(deposit * 100);
  const record = {
    ...rest,
    balance,
  };

  //Todo: Check if the account number already exists

  return sql`INSERT into balances ${sql(
    record,
  )} RETURNING id, account_number, balance`;
}

const getBalanceSchema = joi
  .object({
    account_number: joi.string().length(10).required().label('accountNumber'),
  })
  .rename('accountNumber', 'account_number');

export async function getAccountBalance(data: Record<string, unknown>) {
  const { value, error } = getBalanceSchema.validate(data, {
    stripUnknown: true,
    abortEarly: false,
  });

  if (error) {
    throw error;
  }

  const { account_number } = value;

  return sql`SELECT balance FROM balances WHERE account_number=${account_number}`;
}
