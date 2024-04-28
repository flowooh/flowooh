import 'reflect-metadata';
import { injectable } from 'inversify';
import { Knex } from 'knex';
import { FlowoohDataService } from '.';
import { data } from '../data';

@injectable()
export abstract class BaseService {
  readonly k: Knex;

  service!: FlowoohDataService;

  constructor() {
    this.k = data;
  }
}
