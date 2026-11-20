---
title: "Docker 05 — Environment variables"
description: Change how a container behaves without rebuilding, and keep secrets out of images.
sidebar:
  label: 05 · Environment variables
  order: 5
---

**Time:** 30 minutes · **Goal:** the same image says different things depending on the settings I pass in.

An image is a printed form, and environment variables are what I write in the blanks when I start a container. The form stays the same; only the answers change. That's how one image can run as "staging" on Monday and "production" on Tuesday, and how the database password never gets printed on the form itself.

## Where a container's settings come from

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or diamond to see what it means.</p><div class="dm-zone "><span class="dm-zt">🗒️ docker run hello:2</span><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Passed with -e or --env-file?</summary><div class="dm-qb"><p>Values I pass at run time win over everything else. <code>-e GREETING=namaste</code> sets one; <code>--env-file .env</code> reads many from a file.</p></div></details><div class="dm-no ">no</div><div class="dm-end dm-fix">⬇️ Fall back to the image's <code>ENV</code> line</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📥</span><span class="dm-tt"><b>Run-time value used</b><small>-e GREETING=namaste</small></span></summary><div class="dm-body"><p class="dm-plain">The app reads it with <code>process.env.GREETING</code>. Nothing is rebuilt.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is it a secret?</summary><div class="dm-qb"><p>Passwords, API keys, database URLs. Anything written in a Dockerfile <code>ENV</code> line, or copied in as a file, is stored inside the image forever, and anyone with the image can read it with <code>docker history</code> or <code>docker inspect</code>.</p></div></details><div class="dm-no ">yes</div><div class="dm-end dm-fix">🔐 Only pass it at run time (or as a Railway variable), never in the Dockerfile</div></div><div class="dm-row"><div class="dm-link" data-l="no"></div></div><div class="dm-row"><div class="dm-ok">✅ Same image, different behaviour</div></div></div></div>

## Steps

Uses the `hello` app from [lesson 04](/docker/04-dockerfile/).

### 1. Pass one variable

```bash
docker rm -f hello
docker run -d --name hello -p 3000:3000 -e GREETING=namaste hello:2
curl http://localhost:3000
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Run hello:2 with GREETING set to namaste and call it"</aside>

### 2. Change the port the app listens on

```bash
docker rm -f hello
docker run -d --name hello -p 4000:5000 -e PORT=5000 hello:2
curl http://localhost:4000
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Run hello:2 so the app listens on 5000 inside and I reach it on 4000"</aside>

This is exactly what Railway does: it sets `PORT` and expects my app to listen on it.

### 3. Use an env file

```bash
printf 'GREETING=from-file\nAPP_ENV=staging\n' > .env
docker rm -f hello
docker run -d --name hello -p 3000:3000 --env-file .env hello:2
docker exec hello env
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Run hello:2 with the variables from my .env file and list the env vars inside it"</aside>

### 4. Prove why secrets don't belong in the image

Add `ENV API_KEY=supersecret` to the Dockerfile, build as `hello:leak`, then:

```bash
docker history --no-trunc hello:leak | grep API_KEY
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Search the hello:leak image history for API_KEY"</aside>

There it is, in plain text. Remove the line and delete the image with `docker rmi hello:leak`.

## Commands in this lesson

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker run -e KEY=value …` | 🔵 CREATE | Sets one variable at start | "Run hello with GREETING=namaste" |
| `docker run --env-file .env …` | 🔵 CREATE | Sets many variables from a file | "Run hello with my .env file" |
| `docker exec <n> env` | 🟢 VIEW | Lists the variables inside a container | "Show the env vars in hello" |

## Done when

- [ ] One image gave two different greetings without a rebuild
- [ ] I found the leaked key in `docker history` and understand why it matters

## At the agency

- One image per app, settings per client or environment. Never build a "client-A image" with their settings baked in.
- `.env` is in `.gitignore` and `.dockerignore`, always.
