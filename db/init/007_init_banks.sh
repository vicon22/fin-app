#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOF
  CREATE TABLE banks (
    id      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name    varchar(100) not null,
    reg     numeric(6) not null,
    ogrn    numeric(14) not null,
    created timestamp not null default current_timestamp
  );
EOF
