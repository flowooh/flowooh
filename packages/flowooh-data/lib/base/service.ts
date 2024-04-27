import { data } from '@flowooh/data/data';
import { FlowoohDataService } from '@flowooh/data/lib/domains';
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
