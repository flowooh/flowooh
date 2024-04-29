#!/usr/bin/env node
import { config } from 'dotenv';
config();

import { program } from 'commander';
import { knex } from 'knex';
import { down, up } from '../db/schemas';
import { logger } from '../utils/logger';

const log = logger('scripts');

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
      await down(data).catch((e) => {
        if (e.message.includes('no such table')) {
          log.warn(e.message);
          return;
        }
        log.error(e);
        process.exit(1);
      });
    }

    await up(data)
      .catch((e) => {
        log.error(e);
        process.exit(1);
      })
      .finally(() => {
        data.destroy();
      });

    log.info('Database initialized');
  });

program.parse(process.argv);
