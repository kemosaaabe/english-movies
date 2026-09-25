export const maximumMastery = 3;
export const reviewDelay = 3;
export const guestCookieMaxAge = 365 * 24 * 60 * 60 * 1000;
export const guestCookieName = 'study_guest';
export const databaseUrl =
  process.env.DATABASE_URL ?? 'postgresql://english_movies:english_movies@localhost:5432/english_movies';
export const schemaSql = `
CREATE TABLE IF NOT EXISTS study_owners (id text PRIMARY KEY);
CREATE TABLE IF NOT EXISTS study_modules (id text PRIMARY KEY, owner_id text NOT NULL REFERENCES study_owners(id), document jsonb NOT NULL);
CREATE INDEX IF NOT EXISTS study_modules_owner ON study_modules(owner_id);
CREATE TABLE IF NOT EXISTS study_cards (id text PRIMARY KEY, module_id text NOT NULL REFERENCES study_modules(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS study_progress (owner_id text NOT NULL REFERENCES study_owners(id), card_id text NOT NULL REFERENCES study_cards(id) ON DELETE CASCADE, document jsonb NOT NULL, PRIMARY KEY(owner_id, card_id));
CREATE TABLE IF NOT EXISTS study_sessions (module_id text PRIMARY KEY REFERENCES study_modules(id) ON DELETE CASCADE, owner_id text NOT NULL REFERENCES study_owners(id), document jsonb NOT NULL);
`;
