# Transaction-App

This contains a transaction api to transfer money between accounts.

It is written in typescript and has been containerized using Docker.

As this is a node project, you would need to install dependencies using `yarn` (preferred), but `npm` would also work. Run

```bash
yarn # Or, npm install if you want to use npm
```

Then, to start the server, run

```bash
./scripts/build.sh
node bin/www
```

This would compile the code, prep the database, and start required docker services.

## Documentation

The link to the postman collection is at

```
https://www.getpostman.com/collections/95fd0f1e69299b906a45
```

You would need to create at least two accounts using the `Create Account API` or you can run

```bash
npm run seed
```

To seed the DB with three accounts.

```
account: 1234567890, balance: 10000.00

account: 0123456789, balance: 0.00

account: 1357924680, balance: 500.00
```

To create an account the endpoint is `http://localhost:3005/api/create-account`

To make a transfer the endpoint is `http://localhost:3005/api/transfer`

To view the account balance for an account the endpoint is `localhost:3005/api/balance/{{accountNumber}}`

NOTE: {{accountNumber}} should be replaced with an existing account number.

## Considerations

> Can you deal with the fact that one customer might tap on the "transfer" button twice, by mistake?

This service uses a rate-limiter to prevent the user from sending too many requests in quick succession.

> What happens if your database becomes unavailable in the middle of your logic?

This service uses a queue backed by redis(which is highly available) to process transactions. In the event that the db is offline, we can stop transaction processing on the queue and resume later.

> What happens if 2 users (A, B) transfer money to user C at the same time?

This service uses an ACID compliant relational database and performs queries to update balances in a transaction leveraging row locking to make sure the correct balance is always reflected.

> How will you handle transaction validity and consistency

This service uses sql transactions to update balances.
