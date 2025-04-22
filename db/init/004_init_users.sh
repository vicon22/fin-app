#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOF
  CREATE TYPE user_roles_enum AS ENUM ('ADMIN', 'USER');

  CREATE TABLE users (
    id       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name     varchar(100) not null,
    username varchar(100) not null,
    password text not null,
    created  timestamp not null default current_timestamp
  );

  CREATE TABLE user_roles (
    id      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    roles   user_roles_enum not null default 'USER',
    user_id uuid not null references users(id)
  );
EOF

