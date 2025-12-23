-- 001-roles.sql
-- Idempotent setup for:
-- - main DB: conversations
-- - shadow DB: conversations_shadow
-- - schema: conv
-- - roles: conv_migrator (migrations), conv_app (runtime)

-- 1) Create roles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'conv_migrator') THEN
    CREATE ROLE conv_migrator LOGIN PASSWORD 'conv_migrator_password';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'conv_app') THEN
    CREATE ROLE conv_app LOGIN PASSWORD 'conv_app_password';
  END IF;
END$$;

-- 2) Ensure both databases exist (created by postgres during init: conversations; create shadow explicitly)
SELECT 'CREATE DATABASE conversations_shadow'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'conversations_shadow')\gexec

-- 3) Grants at DB level
GRANT CONNECT ON DATABASE conversations TO conv_migrator;
GRANT CONNECT ON DATABASE conversations TO conv_app;

GRANT CONNECT ON DATABASE conversations_shadow TO conv_migrator;
GRANT CONNECT ON DATABASE conversations_shadow TO conv_app;

-- 4) Setup schema + privileges in MAIN db
\connect conversations

CREATE SCHEMA IF NOT EXISTS conv;
ALTER SCHEMA conv OWNER TO conv_migrator;

GRANT USAGE, CREATE ON SCHEMA conv TO conv_migrator;
GRANT USAGE ON SCHEMA conv TO conv_app;

ALTER DEFAULT PRIVILEGES FOR ROLE conv_migrator IN SCHEMA conv
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO conv_app;

ALTER DEFAULT PRIVILEGES FOR ROLE conv_migrator IN SCHEMA conv
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO conv_app;

-- 5) Setup schema + privileges in SHADOW db
\connect conversations_shadow

CREATE SCHEMA IF NOT EXISTS conv;
ALTER SCHEMA conv OWNER TO conv_migrator;

GRANT USAGE, CREATE ON SCHEMA conv TO conv_migrator;
GRANT USAGE ON SCHEMA conv TO conv_app;

ALTER DEFAULT PRIVILEGES FOR ROLE conv_migrator IN SCHEMA conv
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO conv_app;

ALTER DEFAULT PRIVILEGES FOR ROLE conv_migrator IN SCHEMA conv
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO conv_app;
