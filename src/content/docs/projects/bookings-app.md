---
title: Bookings app
description: The practice app I build in Stage 0 and deploy to Railway in Stage 3.
---

A tiny app that uses every Stage 0 concept. It's the app I'll deploy to Railway later. Status: **not started**.

## Requirements

- [ ] Listens on `process.env.PORT`, bound to `::`
- [ ] `GET /` returns HTML; `GET /bookings` returns JSON from Postgres; unknown paths → 404
- [ ] `GET /health` returns 200 only if `SELECT 1` succeeds, otherwise 503
- [ ] Reads `DATABASE_URL` from env and exits with an error if it's missing
- [ ] Logs one JSON line per request; errors go to stderr
- [ ] Handles `SIGTERM`: stops accepting requests, closes the DB pool, exits 0
- [ ] Has a `Dockerfile` and runs with `docker run -e DATABASE_URL=... -p 3000:3000`
- [ ] Has `.env.example`, `.env` in `.gitignore`, pushed to GitHub
- [ ] A `README.md` explaining how to run it

## Stretch goals

- [ ] Run app + Postgres together with `docker compose`
- [ ] Send 500 requests with `curl` in a loop and watch `pg_stat_activity`

## Notes

Nothing yet.
