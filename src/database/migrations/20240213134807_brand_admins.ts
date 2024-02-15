import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        create table if not exists brand_admins (
            id uuid primary key default uuid_generate_v4(),
            brand_id uuid references brands(id) on delete cascade not null,
            profile_id uuid references profiles(id) on delete cascade not null,
            created_at timestamp with time zone not null default current_timestamp,
            updated_at timestamp with time zone not null default current_timestamp
        );
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        drop table if exists brand_admins;
    `)
}

