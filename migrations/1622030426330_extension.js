/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createExtension('uuid-ossp', {
    ifNotExists: true,
  });
};

exports.down = (pgm) => {
  pgm.dropExtension('uuid-ossp');
};
