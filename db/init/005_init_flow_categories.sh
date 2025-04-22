#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOF
  CREATE TABLE expense_categories (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       varchar(100) not null,
    description varchar(100),
    created     timestamp not null default current_timestamp
  );

  CREATE TABLE income_categories (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       varchar(100) not null,
    description varchar(100),
    created     timestamp not null default current_timestamp
  );
EOF

