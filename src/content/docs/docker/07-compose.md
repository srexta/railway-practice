---
title: "Docker 07 — Docker Compose"
description: Run an app and a Postgres database together from one file.
sidebar:
  label: 07 · Docker Compose
  order: 7
---

**Time:** 1 hour · **Goal:** `docker compose up` starts my app and its database, and they talk to each other.

Typing long `docker run` commands for every piece is like phoning each restaurant separately for one meal. Compose is a single order slip: `compose.yaml` lists every container, its settings, ports and volumes. One command starts them all, one command stops them all.

Compose also puts all the containers on a private **network**, where each one can reach the others by **service name**. My app connects to the database at host `db`, not `localhost`.

## The files

In `~/Desktop/vibe-projects/docker-playground/hello`, change `server.js` to count visits in Postgres:

```bash
npm install pg
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Install the pg package in my hello app"</aside>

```js
const http = require('node:http');
const { Pool } = require('pg');
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const port = process.env.PORT || 3000;

http.createServer(async (req, res) => {
  await db.query('CREATE TABLE IF NOT EXISTS visits (at timestamptz DEFAULT now())');
  await db.query('INSERT INTO visits DEFAULT VALUES');
  const { rows } = await db.query('SELECT count(*) FROM visits');
  res.end(`Visits: ${rows[0].count}\n`);
}).listen(port, () => console.log(`listening on ${port}`));
```

`compose.yaml`:

```yaml
services:
  app:
    build: .                      # build from the Dockerfile in this folder
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:devpass@db:5432/postgres
    depends_on:
      db:
        condition: service_healthy   # wait until the database is ready

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: devpass
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 2s
      retries: 10

volumes:
  pgdata:
```

## What `docker compose up` does

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or diamond to see what it means.</p><div class="dm-zone "><span class="dm-zt">🎼 docker compose up -d --build</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📄</span><span class="dm-tt"><b>Read compose.yaml</b><small>2 services, 1 volume</small></span></summary><div class="dm-body"><p class="dm-plain">Compose names everything after the folder (project <code>hello</code>), so containers become <code>hello-app-1</code> and <code>hello-db-1</code>.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🕸️</span><span class="dm-tt"><b>Create network + volume</b><small>hello_default · hello_pgdata</small></span></summary><div class="dm-body"><p class="dm-plain">A private network only these containers share. On it, the name <code>db</code> points to the database container. Like a phone extension inside one office.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🔨</span><span class="dm-tt"><b>Build app image, pull postgres</b><small>--build forces a rebuild</small></span></summary><div class="dm-body"><p class="dm-plain">Without <code>--build</code>, Compose reuses the last app image and ignores my code changes.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🐘</span><span class="dm-tt"><b>Start db first</b><small>healthcheck: pg_isready</small></span></summary><div class="dm-body"><p class="dm-plain">The healthcheck runs <code>pg_isready</code> every 2 seconds until Postgres says it accepts connections.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is db healthy?</summary><div class="dm-qb"><p><code>depends_on … service_healthy</code> makes the app wait. Without it, the app may start first and crash with <code>ECONNREFUSED</code>.</p></div></details><div class="dm-no ">no</div><div class="dm-end">❌ After 10 retries: <code>dependency failed to start</code>. Check <code>docker compose logs db</code></div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📦</span><span class="dm-tt"><b>Start app</b><small>connects to db:5432</small></span></summary><div class="dm-body"><p class="dm-plain">Inside the app container, <code>localhost</code> means the app container itself. The database is at host <code>db</code>.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><div class="dm-ok">✅ localhost:3000 → "Visits: 1"</div></div></div></div>

## Steps

### 1. Start everything

```bash
docker compose up -d --build
docker compose ps
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Build and start everything in compose.yaml in the background, then list the services"</aside>

### 2. Use it and read logs

```bash
curl http://localhost:3000
curl http://localhost:3000
docker compose logs -f app
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Call my app twice and follow the app service's logs"</aside>

### 3. Run a command in a service

```bash
docker compose exec db psql -U postgres -c "SELECT count(*) FROM visits;"
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Count the rows in the visits table in the compose database"</aside>

### 4. Change code and redeploy just the app

```bash
docker compose up -d --build app
```

<aside class="ai-prompt ai-update"><strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Rebuild and restart only the app service"</aside>

### 5. Stop everything

```bash
docker compose down      # removes containers + network, KEEPS the volume
docker compose up -d     # visit count continues where it left off
```

<aside class="ai-prompt ai-delete"><strong class="ai-delete">🔴 DELETE</strong> AI prompt: "Stop and remove the compose containers but keep the database volume"</aside>

`docker compose down -v` also deletes the volumes, wiping the database. Only use it when I want a fresh start.

## Commands in this lesson

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker compose up -d [--build]` | 🔵 CREATE | Builds and starts all services | "Start my compose stack" |
| `docker compose ps` | 🟢 VIEW | Lists this project's containers | "Show compose services" |
| `docker compose logs -f <svc>` | 🟢 VIEW | Follows one service's logs | "Follow the app logs" |
| `docker compose exec <svc> <cmd>` | 🔵 CREATE | Runs a command in a service | "Open psql in the db service" |
| `docker compose up -d --build <svc>` | 🟠 UPDATE | Rebuilds and replaces one service | "Redeploy just the app" |
| `docker compose down` | 🔴 DELETE | Removes containers and network | "Stop my compose stack" |
| `docker compose down -v` | 🔴 DELETE | Also deletes volumes (data) | "Tear down and wipe the database" |

## Done when

- [ ] The visit count goes up on every `curl`
- [ ] The count survived `down` then `up`
- [ ] I can explain why the app uses host `db`, not `localhost`

## At the agency

- Every client project gets a `compose.yaml`, so a new developer runs one command instead of installing Postgres, Redis and the right Node version.
- Railway works the same way: each service is one container, and they reach each other by name over the private network.
