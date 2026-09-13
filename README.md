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

The video remains in the browser. Only the subtitle file is sent to the API. After the files are selected, MediaBunny
trims the chosen video range locally and the matching subtitle timestamps are rebased to the new clip. The selected
segments are split into as many exercises as needed, with up to 10 clips per exercise.
