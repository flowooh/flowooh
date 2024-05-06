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

data.on('query', (query) => {
  const now = dayjs();
  if (query.method === 'update') {
    query.bindings.unshift(now.unix());
    query.sql = query.sql.replace('set', 'set `updated_at` = ?,');
  }
  if (query.method === 'insert') {
    query.bindings.push(now.unix(), now.unix());
    console.log('🚀 ~ data.on ~ sql:', query.sql);
    query.sql = query.sql.replace(') values (', ', `updated_at`, `created_at`) values (?, ?, ');
    console.log('🚀 ~ data.on ~ sql:', query.sql);
  }
});

export { data };
