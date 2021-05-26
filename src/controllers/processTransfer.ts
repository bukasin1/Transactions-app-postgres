import Bull from 'bull';

import sql from '../stores/db';
import { TransactionData } from '../queues/transactions';

export async function processTransfer(job: Bull.Job<TransactionData>) {
  // Doing the actual transfer
  const { reference, from_account, to_account, integerAmount, description } =
    job.data;

  sql.begin(async (sql) => {
    await sql`LOCK TABLE balances IN ROW EXCLUSIVE MODE`;

    const [{ check, balance: fromCurrentBalance }] =
      await sql`SELECT balance, balance >= ${integerAmount} AS check FROM balances WHERE account_number=${from_account} FOR UPDATE`;

    const [{ balance: toCurrentBalance }] =
      await sql`SELECT balance from balances WHERE account_number = ${to_account} FOR UPDATE`;

    if (!check) {
      throw Error('Insufficient balance');
    }

    const date = new Date().toISOString();

    const fromBalanceUpdate = {
      balance: fromCurrentBalance - integerAmount,
      updated_at: date,
    };

    const toBalanceUpdate = {
      balance: toCurrentBalance + integerAmount,
      updated_at: date,
    };

    const transactionsUpdate = {
      from_account,
      to_account,
      amount: integerAmount,
      description,
      reference,
    };

    return Promise.all([
      sql`UPDATE balances SET ${sql(
        fromBalanceUpdate,
      )} WHERE account_number=${from_account}`,

      sql`UPDATE balances SET ${sql(
        toBalanceUpdate,
      )} WHERE account_number=${to_account}`,

      sql`INSERT INTO transactions ${sql(transactionsUpdate)}`,
    ]);
  });
}
