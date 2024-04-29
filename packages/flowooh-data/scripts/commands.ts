#!/usr/bin/env node
import { program } from 'commander';
import { config } from 'dotenv';
import { down, up } from '../db/schemas';
import knex = require('knex');

program
  .command('init-db')
  .description('Initialize the database')
  .option('-e --env <env>', 'Environment to run the script in', '.env')
  .option('--force', 'Force the initialization, dropping the existing tables')
  .action(async (options) => {
    config({ path: options.env });
    const data = knex({
      client: 'sqlite3',
      connection: { filename: process.env.TEST_SQLITE_DB_PATH as string },
      useNullAsDefault: true,
    });

    if (options.force) {
      await down(data)
        .catch((e) => {
          console.error(e);
          process.exit(1);
        })
        .catch((e) => {
          console.error('EEEEEEEE', e);
        });
    }

    await up(data)
      .catch((e) => {
        console.error(e);
        process.exit(1);
      })
      .finally(() => {
        data.destroy();
      });

    console.log('Database initialized');
  });

program.parse(process.argv);
