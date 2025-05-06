#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOF
  CREATE TYPE transaction_types_enum AS ENUM ('INCOME', 'EXPENSE');
  CREATE TYPE transaction_legals_enum AS ENUM ('LEGAL', 'PHYSICAL');
  CREATE TYPE transaction_states_enum AS ENUM ('INITIAL', 'PENDING', 'APPROVED', 'FULFILLED', 'CANCELED', 'DELETED', 'RETURNED');

  CREATE TABLE transactions (
    id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title            varchar(100) not null,
    details          varchar(300),
    amount           integer not null,
    state            transaction_states_enum default 'INITIAL',
    flow_type        transaction_types_enum not null,
    legal_type       transaction_legals_enum not null,
    producer_bank_id uuid not null references banks(id),
    consumer_bank_id uuid not null references banks(id),
    producer_account varchar(20) not null,
    consumer_account varchar(20) not null,
    consumer_tin     varchar(12) not null,
    consumer_tel     varchar(12) not null,
    project_id       uuid not null references projects(id),
    category_id      uuid not null references transaction_categories(id),
    created          timestamp not null default current_timestamp
  );

  CREATE INDEX transactions_idx ON transactions (state, project_id, category_id, producer_bank_id, consumer_bank_id);
EOF
