#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOF
  CREATE TABLE expenses (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount      integer not null,
    title       varchar(100) not null,
    project_id   uuid not null references projects(id),
    category_id uuid not null references expense_categories(id),
    created     timestamp not null default current_timestamp
  );

  CREATE INDEX expenses_idx ON expenses (project_id, category_id);
EOF
