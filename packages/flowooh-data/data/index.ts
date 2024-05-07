import dayjs = require('dayjs');
import k from 'knex';

const data = k({
  client: process.env.FLOWOOH_DATA_DB_CLIENT,
  connection:
    process.env.FLOWOOH_DATA_DB_CLIENT === 'sqlite3'
      ? //
        { filename: process.env.FLOWOOH_DATA_DB_CONNECTION }
      : process.env.FLOWOOH_DATA_DB_CONNECTION,
  useNullAsDefault: true,
});

export { data };
