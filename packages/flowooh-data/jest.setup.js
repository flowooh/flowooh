const { up, down } = require('./db/schemas');
const { knex } = require('knex');
require('dotenv').config();

const k = knex({
  client: 'sqlite3',
  connection: { filename: process.env.TEST_SQLITE_DB_PATH },
  useNullAsDefault: true,
});
global.beforeAll(async () => {
  await up(k);
});

global.afterAll(async () => {
  await down(k);
  await k.destroy();
});
