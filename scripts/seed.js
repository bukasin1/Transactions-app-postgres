require('dotenv').config();
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL);

const values = [
  {
    balance: 1000000,
    account_number: '1234567890',
  },
  {
    balance: 0,
    account_number: '0123456789',
  },
  { balance: 50000, account_number: '1357924680' },
];

sql`INSERT INTO balances ${sql(values)}`
  .then(() => {
    console.log('Seeding successful');
    sql.end({ timeout: 5 });
  })
  .catch(() => {
    console.log(
      'Seed values were not added. Possible they already exist in your DB',
    );
    sql.end({ timeout: 5 });
  });
