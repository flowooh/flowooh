#!/usr/bin/env node
import { config } from 'dotenv';
config();

import { program } from 'commander';
import { knex } from 'knex';
import { up as upSamples } from '../db/samples';
import { down, up } from '../db/schemas';
import { logger } from '../utils/logger';

const log = logger('scripts');

program
  .command('init-db')
  .description('Initialize the database')
  .option('-e --env <env>', 'Environment to run the script in', '.env')
  .option('--force', 'Force the initialization, dropping the existing tables')
  .option('--sample', 'Insert sample data')
  .action(async (options) => {
    config({ path: options.env });

    // get the data connection
    const data = knex({
      client: process.env.FLOWOOH_DATA_DB_CLIENT,
      connection:
        process.env.FLOWOOH_DATA_DB_CLIENT === 'sqlite3'
          ? //
            { filename: process.env.FLOWOOH_DATA_DB_CONNECTION }
          : process.env.FLOWOOH_DATA_DB_CONNECTION,
      useNullAsDefault: true,
    });

    // drop the tables if force is set
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

    // create the tables
    await up(data).catch((e) => {
      log.error(e);
      process.exit(1);
    });
    log.info('Database initialized');

    // insert sample data if sample is set
    if (options.sample) {
      await upSamples(data).catch((e) => {
        log.error(e);
        process.exit(1);
      });
      log.info('Sample data inserted');
    }

    // destroy the connection
    await data.destroy().catch((e) => {
      log.error(e);
      process.exit(1);
    });
  });

program.parse(process.argv);
