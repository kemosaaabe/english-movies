# ReelLingo

Listening practice from local movies, with private vocabulary modules, flashcards, and adaptive learning.

## Development with hot reload

```bash
npm run dev:docker
```

This runs Vite at `http://localhost:5173`, NestJS at `http://localhost:3000`, and PostgreSQL 17 on
`localhost:5432`. Frontend source changes use Vite HMR; backend source changes restart NestJS in watch mode.
PostgreSQL data lives in the `postgres_data` named volume. Rebuild after changing dependencies or configuration
not mounted by `compose.dev.yml`. If host servers already use the defaults, run
`BACKEND_PORT=3001 FRONTEND_PORT=5174 npm run dev:docker`; `POSTGRES_PORT` is also configurable. Stop with `docker compose -f compose.dev.yml down`; add `-v` only to erase the database.

To run Node on the host instead:

```bash
npm install
docker compose -f compose.dev.yml up -d postgres
npm run dev
```

The default database URL is `postgresql://english_movies:english_movies@localhost:5432/english_movies`.
Set `DATABASE_URL` to use another PostgreSQL database. Tables and indexes are initialized idempotently at backend
startup. The database must be available before starting the backend.

## Vocabulary

The **Vocabulary** page at `/vocabulary` lists all saved cards alphabetically with their meanings and source
modules. Search words, meanings, or module names, and filter by module. Cards saved in multiple modules remain
separate entries. Use **Modules** to manage collections and start study sessions.

Open **Vocabulary modules** from the home page, or use the book-plus icon beside an exercise word.
The module editor supports bulk import: paste `word translation` on each line, or use a tab or semicolon
for multi-word terms. Preview the cards before importing; incomplete lines are reported without discarding
your text. Import fills an empty editor or appends to existing cards.

The modal can append a word to an existing module or create a new module with one or more cards. Modules support editing,
reordering, and confirmed deletion. Module edits invalidate the active Learn session; its next submission returns
an explicit conflict instead of silently changing its questions. Historical progress for retained cards remains.

Flashcards support flipping, reverse direction, stable Fisher–Yates shuffling, navigation, looping, filters,
self-assessment, and a completion summary. Filters capture their deck when selected; marking a card does not
remove it mid-session. Restarting a deck preserves progress.

Learn uses mastery levels 0–3. A correct answer adds one level, and an incorrect answer subtracts one, bounded at
zero and three. Levels 0–1 prefer multiple choice; level 2 requires a written answer. Mastered cards leave the queue.
Selection prioritizes lower mastery, then past mistakes, with stable card-order tie breaking. Incorrect answers
are delayed for three other questions when the deck permits. Immediate repeats are avoided whenever another
unmastered card exists. Small decks relax the delay to prevent deadlocks.

Multiple choice uses distinct normalized definitions from the module, with fewer than four options when necessary.
One distinct definition falls back to written recall. Written answers use Unicode NFKC normalization, trimmed and
collapsed whitespace, and case-insensitive exact comparison. Spelling mistakes and synonyms are not accepted.

Questions and feedback survive reloads. Answers are committed before feedback is shown. A module row lock,
transaction, stable session/question identifiers, and persisted feedback prevent duplicate submissions from
counting twice. Continue retries also preserve the next question. A new review session starts at zero within the
session while preserving historical mastery. Starting fresh resets mastery after confirmation but preserves
attempt history. The separate confirmed **Reset all progress** action clears statuses, mastery, history, and session.

## Ownership and persistence

The app has no account authentication. A server-issued, random, HttpOnly, SameSite=Lax guest cookie identifies a
private browser owner; the backend checks ownership for every module operation. Clearing this cookie loses access
to that browser's modules. Cross-device login and account recovery are not implemented. Do not use a shared browser
profile for separate users. Set `COOKIE_SECURE=true` when serving through HTTPS.

PostgreSQL stores:

- `study_owners`: opaque guest identities.
- `study_modules`: owner, timestamps, and a typed JSONB module document including ordered card content.
- `study_cards`: stable card identifiers and module foreign keys, enabling cascading integrity.
- `study_progress`: per-owner/card self-assessment, mastery, attempt counts, and last review time.
- `study_sessions`: durable card snapshot, progress, question, feedback, review queue, and session statistics.

Card deletion cascades its progress; module deletion cascades cards, progress, and session. Self-assessment never
changes objective mastery, and Learn never changes self-assessment. Schema initialization is sufficient for the
initial schema; future schema changes should use versioned migrations.

## API

Frontend calls `/api/study/modules`; Vite and nginx proxy `/api` to NestJS.

| Method | Backend path | Operation |
| --- | --- | --- |
| GET / POST | `/study/modules` | List private modules / atomically create a module |
| GET / PATCH / DELETE | `/study/modules/:id` | Read module and progress / atomically edit / delete |
| POST | `/study/modules/:id/cards` | Append a term and definition |
| PATCH | `/study/modules/:id/cards/:cardId/status` | Set `{ status: 'unreviewed' \| 'known' \| 'learning' }` |
| DELETE | `/study/modules/:id/progress` | Explicitly reset all progress |
| POST | `/study/modules/:id/session/:action` | `resume`, `fresh`, `review`, `answer`, `override`, or `continue` |

Module writes accept `{ title, description?, cards: [{ id?, term, definition }] }`. Existing card IDs must be retained
on edit. Answer requests include `{ sessionId, questionId, answer }`; override and continue use
`{ sessionId, questionId }`.
Conflicting or invalidated sessions return HTTP 409, inaccessible modules return HTTP 404, and invalid content
returns HTTP 400. Contracts are in the backend study types and frontend study entity types.

## Verification

```bash
npm run lint
npm run build
docker compose config
docker compose -f compose.dev.yml config
```

## Production containers

```bash
docker compose up --build
```

The containerized app is available at `http://localhost:8080`. Set `POSTGRES_PASSWORD` for deployment and
`COOKIE_SECURE=true` behind HTTPS. Development and production Compose share the same project volume by default;
use different Compose project names (`-p`) if they need separate databases.

The video remains in the browser. Only subtitles are uploaded. MediaBunny trims the selected range locally, and
subtitle timestamps are rebased to the clip. Exercises contain up to ten clips each.
