// import Queue from 'bull';

// import env from '../env';

// const queueStorage = env.require('REDIS_URL');

// export interface TransactionData {
//   from_account: string;
//   to_account: string;
//   amount: number;
//   integerAmount: number;
//   reference: string;
//   description?: string;
// }

// const transactionsQueue = new Queue<TransactionData>(
//   'Transactions queue',
//   queueStorage,
// );

// export default transactionsQueue;
