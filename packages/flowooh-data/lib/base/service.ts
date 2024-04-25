import { FlowoohDataService } from '@flowooh-data';
import { data } from '@flowooh-data/data';
import { injectable } from 'inversify';
import { Knex } from 'knex';

@injectable()
export abstract class BaseService {
  readonly k: Knex;

  service!: FlowoohDataService;

  constructor() {
    this.k = data;
  }
}
