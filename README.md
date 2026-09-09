# ReelLingo

A small full-stack listening exercise built from a local video and an SRT subtitle file.

## Run locally

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the NestJS backend at `http://localhost:3000`.

## Other commands

```bash
npm run build
npm run lint
```

## Run with Docker

```bash
docker compose up --build
```

The containerized app is available at `http://localhost:8080`.

The video remains in the browser as an object URL. Only the subtitle file is sent to the API, which returns its first 30 parsed entries for three exercises of 10 clips.
