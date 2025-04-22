#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOF
  CREATE TABLE projects (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        varchar(100) not null,
    user_id     uuid not null references users(id),
    currency_id uuid not null references currencies(id),
    created     timestamp not null default current_timestamp
  );
EOF
