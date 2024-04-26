import k from 'knex';

const data = k({
  client: 'sqlite3',
  connection: { filename: process.env.TEST_SQLITE_DB_PATH as string },
  useNullAsDefault: true,
});

export { data };
