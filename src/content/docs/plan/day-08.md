---
title: "Plan: Day 08 — Scaling and scheduling"
description: Replicas and regions, cron jobs, functions, sleeping apps and sandboxes on Railway.
sidebar:
  label: Day 08 — Scale & schedule
  order: 8
---

**Time:** about 2 hours · **Cost:** extra replicas cost extra, so scale back down after · **Goal:** more copies on demand, and tasks that run on a timer.

**Scaling** is opening more checkout counters when the queue gets long. A **cron job** is an alarm clock that runs a task at set times. A **function** is a tiny one-file helper that wakes up only when called.

```text
                        ┌──▶ hello · replica 1 (eu-west)
 visitors ──▶ edge ─────┼──▶ hello · replica 2 (eu-west)
          spreads load  └──▶ hello · replica 1 (us-east)

 cron service  "0 2 * * *"  ── every night at 02:00 ──▶ clean old rows in Postgres, then exit
 function      one file     ── only when called ──────▶ e.g. a form webhook
```

## Steps

### 1. Scale to more copies and regions

```bash
railway scale --help
railway scale eu-west=2
railway service status
railway scale eu-west=1     # back down to save money
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Scale my hello service to 2 replicas, then back to 1"</aside>

Each replica has its own memory, so the app must keep important things in the database, not in memory. `--help` shows the region names.

### 2. Make a cron job

```js
// cleanup.js: deletes old visits, then exits
const { Pool } = require('pg');
const db = new Pool({ connectionString: process.env.DATABASE_URL });
db.query("DELETE FROM visits WHERE at < now() - interval '7 days'")
  .then(r => { console.log('deleted', r.rowCount); process.exit(0); });
```

Deploy it as its own service and set its schedule in the service settings (or `cronSchedule` in `railway.json` on Day 09). It must exit when done, or the next run is skipped.

```bash
railway cron list
railway cron run            # trigger it now instead of waiting
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Show recent runs of my cleanup cron and trigger one now"</aside>

| Schedule | Means |
| --- | --- |
| `0 2 * * *` | Every day at 02:00 (UTC) |
| `*/15 * * * *` | Every 15 minutes |
| `0 9 * * 1` | Mondays at 09:00 (UTC) |

Railway cron times are UTC. Nepal is UTC+5:45, so 02:00 UTC is 07:45 in Kathmandu.

### 3. Try a function

```bash
railway functions new --help
railway functions list
railway functions push
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Create a Railway function in playground and deploy it"</aside>

Good for small webhooks, like "when a form is submitted, send an email".

### 4. Let a quiet app sleep

```bash
railway open      # service → Settings → Serverless
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Open my playground project dashboard"</aside>

A sleeping app costs almost nothing while idle; the first visitor after a quiet spell waits a few seconds while it wakes. Fine for staging, usually not for a client's live shop.

### 5. Spin up a throwaway sandbox

```bash
railway sandbox create
railway sandbox exec --help
railway sandbox list
railway sandbox --help     # how to remove it when done
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Create a Railway sandbox and run uname inside it"</aside>

A temporary computer for trying things without touching my services.

## Which one when?

| Need | Use |
| --- | --- |
| A website or API that's always on | Normal service |
| A task at a set time | Cron service |
| A small handler that runs on request | Function |
| A place to experiment, then throw away | Sandbox |

## Done when

- [ ] I scaled up and back down, and saw both replicas in the logs
- [ ] A cron job ran on its own and showed in `cron list`
- [ ] I can say when to use cron vs function vs normal service

## At the agency

- Nightly jobs: sync products, send reports, clean old data.
- Extra replicas during a client's festival sale (Dashain, Tihar) and back down after.
