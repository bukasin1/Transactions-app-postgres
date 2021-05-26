/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('balances', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    account_number: {
      type: 'VARCHAR(11)',
      unique: true,
      notNull: true,
    },
    balance: {
      type: 'BIGINT',
      notNull: true,
      default: 0,
      comment:
        'This stores the users account balance and the fractional value - For example $5.00 would be stored as 500',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('balances');
};
