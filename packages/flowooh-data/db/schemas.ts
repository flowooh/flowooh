import { knex } from 'knex';

export async function up(k: knex.Knex<any, unknown[]>) {
  await k.schema.createTable('flowooh_repo_definitions', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('description');
    table.string('version');
    table.boolean('enabled');
    table.boolean('published');
    table.string('content');
  });

  await k.schema.createTable('flowooh_repo_definition_contents', (table) => {
    table.increments('id').primary();
    table.string('definition_id');
    table.string('version');
    table.string('content');
    table.boolean('published');
  });

  await k.schema.createTable('flowooh_rt_executions', (table) => {
    table.string('id').primary();
    table.string('proc_instance_id');
    table.string('proc_definition_id');
    table.string('execution_id');
    table.string('parent_id');
    table.string('status');
    table.string('act_id');
  });

  await k.schema.createTable('flowooh_rt_variables', (table) => {
    table.increments('id').primary();
    table.string('proc_instance_id');
    table.string('proc_definition_id');
    table.string('execution_id');
    table.string('key');
    table.string('value_type');
    table.string('name');
    table.string('v_string');
    table.integer('v_int');
    table.double('v_double');
    table.boolean('v_boolean');
    table.date('v_date');
    table.jsonb('v_json');
  });
}

export async function down(k: knex.Knex<any, unknown[]>) {
  await k.schema.dropTable('flowooh_repo_definitions');
  await k.schema.dropTable('flowooh_repo_definition_contents');
  await k.schema.dropTable('flowooh_rt_executions');
  await k.schema.dropTable('flowooh_rt_variables');
}
