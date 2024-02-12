import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        create table if not exists messages ( 
            id uuid primary key default uuid_generate_v4(), 
            sender_id uuid references profiles(id) not null,
            receiver_id uuid references profiles(id) not null,
            subject varchar(256) not null, 
            message text not null
        );
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        drop table if exists messages;
    `)
}
