const { up, down } = require('./db/schemas');
const { knex } = require('knex');
require('dotenv').config();

const k = knex({
  client: 'sqlite3',
  connection: { filename: '.db/test.sqlite' },
  useNullAsDefault: true,
});
global.beforeAll(async () => {
  await up(k);
});

global.afterAll(async () => {
  await down(k);
  await k.destroy();
});
