import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        create table if not exists interior_models (
            id uuid primary key default uuid_generate_v4(),
            model_id uuid references models(id) on delete cascade not null,
            interior_id uuid references interiors(id) on delete cascade not null,
            created_at timestamp with time zone not null default current_timestamp,
            updated_at timestamp with time zone not null default current_timestamp
        );
  `);
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        drop table if exists interior_models;
    `);
}
