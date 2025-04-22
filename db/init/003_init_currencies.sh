#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOF
  CREATE TYPE currencies_enum AS ENUM ('RUB', 'USD', 'EUR');

  CREATE TABLE currencies (
    id       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    value    currencies_enum not null,
    created  timestamp not null default current_timestamp
  );
EOF

