/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('transactions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    reference: {
      type: 'VARCHAR(100)',
      unique: true,
      notNull: true,
    },
    amount: {
      type: 'BIGINT',
      notNull: true,
      default: 0,
      comment:
        'This stores the transfer/transaction amount and the fractional value - For example $5.00 would be stored as 500',
    },
    from_account: {
      type: 'VARCHAR(11)',
      notNull: true,
      references: 'balances("account_number")',
    },
    to_account: {
      type: 'VARCHAR(11)',
      notNull: true,
      references: 'balances("account_number")',
    },
    description: {
      type: 'VARCHAR(100)',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('transactions');
};
