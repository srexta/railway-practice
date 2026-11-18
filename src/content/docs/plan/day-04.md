---
title: "Plan: Day 04 — Variables and environments"
description: Change an app's settings without touching code, and run a separate staging copy.
sidebar:
  label: Day 04 — Variables & envs
  order: 4
---

**Time:** about 2 hours · **Goal:** production and staging running the same code with different settings.

**Variables** are settings on a sticky note attached to the app: the same app reads a different note in each place. **Environments** are a copy of the whole office on another floor. "Staging" is the test floor; "production" is where real customers walk in.

```text
 ┌──────── production ────────┐      ┌───────── staging ──────────┐
 │  hello                     │      │  hello                     │
 │   GREETING=customers       │      │   GREETING=testers         │
 │   DATABASE_URL ◀──┐        │      │   DATABASE_URL ◀──┐        │
 │                   │        │      │                   │        │
 │  Postgres ────────┘        │      │  Postgres ────────┘        │
 │  (real data)               │      │  (test data)               │
 └────────────────────────────┘      └────────────────────────────┘
           ▲                                    ▲
           └──── shared: ${{shared.APP_NAME}} ──┘

 DATABASE_URL = ${{Postgres.DATABASE_URL}}  (a reference variable)
```

Same services on two floors, each with its own settings and its own data.

## Steps

### 1. See what's already set

```bash
railway variable list
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "List the variables on my hello service"</aside>

Railway adds some itself, starting with `RAILWAY_`, like the public domain and environment name.

### 2. Set one and watch the app change

```bash
railway variable set GREETING=Kathmandu
curl https://<my-app>.up.railway.app
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Set GREETING to Kathmandu on my hello service"</aside>

Setting a variable triggers a redeploy, so the reply changes after a minute. `--skip-deploys` lets me set several first and deploy once.

### 3. Edit many at once

```bash
railway variable edit
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Open my service variables for bulk editing"</aside>

Opens all variables in my editor, then shows a before/after diff to confirm.

### 4. Use Railway variables on my laptop

```bash
railway run npm start    # runs locally with the Railway variables
railway shell            # opens a terminal with them all set
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Run my app locally using the Railway variables"</aside>

Handy for running a script against a real database without copying secrets into a `.env` file.

### 5. Make a staging environment

```bash
railway environment new staging --duplicate production
railway environment link staging
railway status
railway variable set GREETING=testers
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Create a staging environment copied from production and switch to it"</aside>

Any command can target one environment with `-e staging`.

### 6. Remove a variable

```bash
railway variable delete GREETING
```

<aside class="ai-prompt ai-delete"><strong class="ai-delete">🔴 DELETE</strong> AI prompt: "Delete the GREETING variable from my staging service"</aside>

## Kinds of variables

| Kind | Looks like | Use it for |
| --- | --- | --- |
| Service variable | `GREETING=hi` | Settings for one app |
| Shared variable | `${{shared.APP_NAME}}` | One value used by several services |
| Reference variable | `${{Postgres.DATABASE_URL}}` | Pointing at another service's value, so it updates by itself |
| Sealed variable | Set in the dashboard, then sealed | Secrets nobody can read back, only the app |
| Railway-provided | `PORT`, `RAILWAY_PUBLIC_DOMAIN` | Facts Railway gives every service |

## Done when

- [ ] Changing a variable changed my app's reply
- [ ] production and staging say different things
- [ ] I ran something locally with `railway run`

## At the agency

- Payment keys: test keys on staging, live keys on production, never in code.
- Show a client changes on staging before they go live.
