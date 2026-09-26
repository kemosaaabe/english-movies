export const databaseUrl =
  process.env.DATABASE_URL ?? 'postgresql://english_movies:english_movies@localhost:5432/english_movies';

export const schemaSql = `
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS study_modules (id text PRIMARY KEY, owner_id text NOT NULL REFERENCES users(id), document jsonb NOT NULL);
CREATE INDEX IF NOT EXISTS study_modules_owner ON study_modules(owner_id);
CREATE TABLE IF NOT EXISTS study_cards (id text PRIMARY KEY, module_id text NOT NULL REFERENCES study_modules(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS study_progress (owner_id text NOT NULL REFERENCES users(id), card_id text NOT NULL REFERENCES study_cards(id) ON DELETE CASCADE, document jsonb NOT NULL, PRIMARY KEY(owner_id, card_id));
CREATE TABLE IF NOT EXISTS study_sessions (module_id text PRIMARY KEY REFERENCES study_modules(id) ON DELETE CASCADE, owner_id text NOT NULL REFERENCES users(id), document jsonb NOT NULL);
`;
