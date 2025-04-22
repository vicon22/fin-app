#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOF
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOF