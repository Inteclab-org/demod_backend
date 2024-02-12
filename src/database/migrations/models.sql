create table users (
  user_id int generated by default as identity not null primary key,
  first_name character varying(256) not null,
  last_name character varying(256),
  email character varying(13) not null,
  user_role int not null default 1,
  age smallint,
  is_male boolean,
  created_at timestamp with time zone  not null default current_timestamp
);

create table user_sessions (
  session_id int generated by default as identity not null primary key,
  user_id int references profiles(id) on delete cascade not null not null,
  token_id character varying(36) not null,
  is_logged_out boolean not null default false,
  logged_in_at timestamp with time zone not null default current_timestamp,
  logged_out_at timestamp with time zone,
  remote_ip inet not null, 
  device text not null
);

create table code_sessions (
  code_id int generated by default as identity not null primary key,
  code int not null,
  email character varying(13) not null,
  attempts smallint default 0,
  created_at timestamp with time zone not null default current_timestamp
);

create table tags (
  tag_id int generated by default as identity not null primary key,
  tag_name varchar(255) not null,
  tag_desc text,
);

create table categories (
  category_id int generated by default as identity not null primary key,
  category_name character varying(256) not null,
  category_desc text,
  created_at timestamp with time zone not null default current_timestamp
);

create table models (
  model_id int generated by default as identity not null primary key,
  model_title varchar(1024) not null,
  model_desc text not null,
  polygons_count bigint not null,
  vertices_count bigint not null,
  length int not null,
  height int not null,
  width int not null,
  brand_id int references brands (brand_id) not null,
  category_id int references categories (category_id) not null,
  created_at timestamp with time zone not null default current_timestamp
  updated_at timestamp with time zone not null 
);

create table model_tags (
  mt_id int generated by default as identity not null primary key,
  model_id int references models (model_id) not null,
  color_id int references colors (color_id) not null,
  material_id int references materials (reader_id) not null,
);   


create table colors (
  color_id int generated by default as identity not null primary key,
  color_title varchar(1024) not null,
  created_at timestamp wich time zone not null default current_timestamp
  updated_at timestamp with time zone not null 
);
  
create table model_colors (
  mc_id int generated by default as identity not null primary key,
  is_default boolean not null default false,
  model_id int references models (model_id) not null,
  color_id int references colors (color_id) not null,
  material_id int references materials (reader_id) not null,
);

create table model_color_images (

);

  await knex.schema.raw(`
    create table if not exists category_files(
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default current_timestamp,
      updated_at timestamp not null default current_timestamp,
      category_id uuid not null references categories(id),
      file_id uuid not null references files(id),
      is_main bool not null default false,
      is_active bool not null default true
    );
  `);

  await knex.schema.raw(`
    create table if not exists models(
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default current_timestamp,
      updated_at timestamp not null default current_timestamp,
      created_by uuid references users(id),
      title varchar(1024) not null,
      description jsonb not null,
      length int not null,
      height int not null,
      width int not null,
      polygons_count bigint not null,
      vertices_count bigint not null,
      brand_id int references brands (brand_id) not null,
      category_id uuid not null references categories(id),
      style_id uuid not null references styles(id),
      formfactor_id uuid not null references formfactors(id),
      slug varchar(256) not null,
      is_active bool not null default true
    );
  `);

  await knex.schema.raw(`
    create table colors (
      id uuid primary key default uuid_generate_v4(),
      name varchar(1024) not null,
      created_at timestamp wich time zone not null default current_timestamp
      updated_at timestamp with time zone not null 
    );
  `);

  await knex.schema.raw(`
    create table tags (
      id uuid primary key default uuid_generate_v4(),
      name varchar(1024) not null,
      created_at timestamp wich time zone not null default current_timestamp
      updated_at timestamp with time zone not null 
    );
  `);

  await knex.schema.raw(`
    create table formfactors (
      id uuid primary key default uuid_generate_v4(),
      name varchar(1024) not null,
      created_at timestamp wich time zone not null default current_timestamp
      updated_at timestamp with time zone not null 
    );
  `);

  await knex.schema.raw(`
    create table styles (
      id uuid primary key default uuid_generate_v4(),
      name varchar(1024) not null,
      created_at timestamp wich time zone not null default current_timestamp
      updated_at timestamp with time zone not null 
    );
  `);

  await knex.schema.raw(`
    create table formfactor_files (
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default current_timestamp,
      updated_at timestamp not null default current_timestamp,
      formfactor_id uuid not null references formfactors(id),
      file_id uuid not null references files(id),
      is_active bool not null default true
    );
  `);

  await knex.schema.raw(`
  create table brands (
    id uuid primary key default uuid_generate_v4(),
    name varchar(1024) not null,
    site_link varchar(1024) not null,
    created_at timestamp wich time zone not null default current_timestamp
    updated_at timestamp with time zone not null 
  );
`);

  await knex.schema.raw(`
    create table materials (
      id uuid primary key default uuid_generate_v4(),
      name varchar(1024) not null,
      created_at timestamp wich time zone not null default current_timestamp
      updated_at timestamp with time zone not null 
    );
  `);

  await knex.schema.raw(`
    create table if not exists model_colors(
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default current_timestamp,
      updated_at timestamp not null default current_timestamp,
      model_id uuid not null references models(id),
      color_id uuid not null references colors(id),
      is_main bool not null default false,
      is_active bool not null default true
    );
  `);

  await knex.schema.raw(`
  create table if not exists model_tags(
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    model_id uuid not null references models(id),
    color_id uuid not null references colors(id),
    is_main bool not null default false,
    is_active bool not null default true
  );
`);

  await knex.schema.raw(`
    create table if not exists model_color_materials(
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default current_timestamp,
      updated_at timestamp not null default current_timestamp,
      material_id uuid not null references materials(id),
      color_id uuid not null references colors(id),
      is_active bool not null default true
    );
`);

  await knex.schema.raw(`
    create table if not exists model_color_images(
    );
`);

  await knex.schema.raw(`
    create table if not exists model_files(
    );
  `);

  await knex.schema.raw(`
    do $$
      begin
          if not exists (select 1 from pg_type where typname = 'order_status') then
            create type order_status as enum('1', '2', '3', '4', '5');
          end if;
      end
    $$;
  `);