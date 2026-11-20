---
title: "Plan: Day 05 — Databases"
description: Add Postgres, Redis and MySQL on Railway, connect an app to them, and learn backups.
sidebar:
  label: Day 05 — Databases
  order: 5
---

**Time:** 2–3 hours · **Cost:** databases bill while they run · **Goal:** an app that stores data that survives redeploys.

A database is the restaurant's storeroom. The kitchen (my app) can be rebuilt any time, but the storeroom keeps the stock. That's why it sits on a **volume**, a disk that survives redeploys.

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or ⓘ to see what it means.</p><div class="dm-zone dm-z-rw"><span class="dm-zt">🚂 Railway · playground / production</span><div class="dm-h"><details class="dm-node"><summary><span class="dm-ico">📦</span><span class="dm-tt"><b>hello</b><small>my app</small></span></summary><div class="dm-body"><p class="dm-plain">My app reads <code>DATABASE_URL</code> and connects to Postgres with it.</p></div></details><div class="dm-ha"><span>private network</span></div><details class="dm-node"><summary><span class="dm-ico">🐘</span><span class="dm-tt"><b>Postgres</b><small>postgres.railway.internal:5432</small></span></summary><div class="dm-body"><p class="dm-plain">The <b>private network</b> is the staff corridor: only services in this project can use <code>*.railway.internal</code> addresses. Fast, free, and invisible to the internet.</p><p><code>5432</code> is Postgres's usual port.</p></div></details><div class="dm-ha"><span>stores on</span></div><details class="dm-node"><summary><span class="dm-ico">💾</span><span class="dm-tt"><b>Volume</b><small>the data</small></span></summary><div class="dm-body"><p class="dm-plain">A disk that survives redeploys. The database program can be replaced; the data on the volume stays.</p></div></details></div></div><div class="dm-lane" style="margin-top:1rem"><span class="dm-lt">From outside Railway</span><div class="dm-h"><details class="dm-node"><summary><span class="dm-ico">💻</span><span class="dm-tt"><b>My laptop <span class="dm-badge dm-you">you</span></b><small>railway connect</small></span></summary><div class="dm-body"><p class="dm-plain"><code>railway connect</code> opens a <code>psql</code> session to the database from my terminal.</p></div></details><div class="dm-ha"><span>internet</span></div><details class="dm-node"><summary><span class="dm-ico">🚪</span><span class="dm-tt"><b>Public proxy</b><small>DATABASE_PUBLIC_URL</small></span></summary><div class="dm-body"><p class="dm-plain">A public door into the database, for when I'm not inside Railway. Its address is in <code>DATABASE_PUBLIC_URL</code>. Anyone with the password can knock, so treat it like a key.</p></div></details><div class="dm-ha"><span>into</span></div><div class="dm-ok">🐘 the same Postgres</div></div></div></div>

The app reaches the database privately (fast, not exposed). I reach it from my laptop through a public proxy.

## Steps

### 1. Add Postgres

```bash
railway add --database postgres
railway service list
railway variable list -s Postgres
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Add a Postgres database to playground and show its variables"</aside>

### 2. Open a SQL shell

```bash
railway connect Postgres
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Open a psql shell on my Railway Postgres"</aside>

```sql
CREATE TABLE visits (id serial PRIMARY KEY, at timestamptz DEFAULT now());
INSERT INTO visits DEFAULT VALUES;
SELECT * FROM visits;
\q
```

`railway connect` opens `psql`, so `psql` must be installed (`brew install libpq`).

### 3. Wire the app to the database

```bash
railway variable set -s hello 'DATABASE_URL=${{Postgres.DATABASE_URL}}'
npm install pg
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Point my hello service at the Postgres database with a reference variable"</aside>

```js
// add to server.js: count visits (make the request handler async)
const { Pool } = require('pg');
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// inside the request handler:
if (req.url === '/visits') {
  await db.query('INSERT INTO visits DEFAULT VALUES');
  const { rows } = await db.query('SELECT count(*) FROM visits');
  return res.end(`visits: ${rows[0].count}\n`);
}
```

Deploy with `railway up`, then curl `/visits` a few times and watch the number climb.

### 4. Prove the data survives a redeploy

```bash
railway redeploy -s hello
curl https://<my-app>.up.railway.app/visits
```

<aside class="ai-prompt ai-update"><strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Redeploy hello and check the visit count survived"</aside>

The count keeps going. The kitchen was rebuilt; the storeroom wasn't.

### 5. Safety features

```bash
railway postgres pitr --help        # point-in-time recovery (continuous backups)
railway postgres ha --help          # high availability (a standby copy)
railway postgres pgbouncer --help   # connection pooling
railway postgres history
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show me the point-in-time recovery options for my Postgres"</aside>

Read each `--help` first, then turn on PITR and find the backups tab with `railway open`. Leave HA off in playground; it runs extra copies and costs more.

### 6. Meet the other databases

```bash
railway add --database redis
railway connect Redis        # try: SET hello world, then GET hello
railway add --database mysql
railway add --database mongo
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Add a Redis database and open a shell on it"</aside>

`railway mysql` and `railway redis` manage their own HA and recovery options.

### 7. Clean up the extras

```bash
railway status
railway service delete -s MySQL
```

<aside class="ai-prompt ai-delete"><strong class="ai-delete">🔴 DELETE</strong> AI prompt: "Delete the MySQL service from playground"</aside>

Deleting a database service deletes its data.

## Which database for what

| Database | Good for | Agency example |
| --- | --- | --- |
| Postgres | Most new apps | A booking system's orders and users |
| MySQL | WordPress, Laravel, older PHP apps | A client's WordPress site |
| Redis | Fast, temporary data | Login sessions, cache, job queues |
| MongoDB | Loose, document-shaped data | Form submissions with changing fields |

## Done when

- [ ] `/visits` counts up and survives a redeploy
- [ ] I can explain private URL vs public URL
- [ ] I know where backups live and how to restore one

## At the agency

- A WordPress or Laravel site's MySQL, with backups turned on before launch.
- Redis for sessions or a cache in front of a slow API.
