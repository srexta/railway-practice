---
title: "Plan: Day 07 — Debugging and storage"
description: Find problems with logs, metrics, traces and SSH, and store files on volumes and buckets.
sidebar:
  label: Day 07 — Debug & storage
  order: 7
---

**Time:** 2–3 hours · **Goal:** find a bug without guessing, and keep files safe across deploys.

Debugging is a doctor's visit. **Logs** are what the patient tells me, **metrics** are the temperature and pulse, **traces** are the X-ray, and **SSH** is walking into the room myself.

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or ⓘ to see what it means.</p><div class="dm-row"><div class="dm-ok">🚨 Something's wrong</div></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Did the build fail?</summary><div class="dm-qb"><p>The deployment never got to "running": it shows <b>Build failed</b> in <code>railway deployment list</code>.</p></div></details><div class="dm-no dm-go">yes</div><div class="dm-end dm-fix">🔍 <code>railway logs --build</code><small>what the builder printed</small></div></div><div class="dm-row"><div class="dm-link" data-l="no"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Does it crash or restart?</summary><div class="dm-qb"><p>It builds, starts, then dies or keeps restarting. The reason is almost always in the last lines the app printed.</p></div></details><div class="dm-no dm-go">yes</div><div class="dm-end dm-fix">🔍 <code>railway logs -n 200</code><small>the last 200 lines from the app</small></div></div><div class="dm-row"><div class="dm-link" data-l="no"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Error page or 502?</summary><div class="dm-qb"><p>A <b>502</b> means Railway's edge couldn't reach my app: usually it listens on the wrong port or the start command is wrong.</p></div></details><div class="dm-no dm-go">yes</div><div class="dm-end dm-fix">🔍 Check <code>PORT</code> and start command<small><code>railway logs --http</code> shows each request and its status</small></div></div><div class="dm-row"><div class="dm-link" data-l="no"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Slow?</summary><div class="dm-qb"><p>It works, just slowly. Look at CPU and memory first, then follow single requests.</p></div></details><div class="dm-no dm-go">yes</div><div class="dm-end dm-fix">🔍 <code>railway metrics</code>, <code>railway trace list</code><small>metrics = pulse; traces = X-ray of one request</small></div></div><div class="dm-row"><div class="dm-link" data-l="still stuck"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🚪</span><span class="dm-tt"><b>Go inside <span class="dm-badge dm-you">you</span></b><small>railway ssh</small></span></summary><div class="dm-body"><p class="dm-plain"><code>railway ssh</code> opens a shell inside the running container, so I can look at files, env vars and processes myself.</p></div></details></div></div>

## Steps

### 1. Get good at logs

```bash
railway logs --since 1h
railway logs --filter "error"
railway logs --http --method POST --path /visits
railway logs --json | head
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show my hello service's errors from the last hour"</aside>

### 2. Read metrics

```bash
railway metrics
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show CPU and memory for my hello service"</aside>

CPU, memory, network and HTTP numbers. Run `curl` in a loop for a minute and watch them move.

### 3. Turn on tracing

```bash
railway trace enable
railway trace status
railway trace list
railway trace get <trace-id>
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Enable tracing on my hello service and show recent traces"</aside>

A trace shows each step of one request and how long it took, like the database query inside `/visits`.

### 4. Step inside the running container

```bash
railway ssh -s hello
# inside: ls, env | grep RAILWAY, ps aux, exit
railway dev --help
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Open an SSH session into my hello service"</aside>

Changes made inside the container disappear on the next deploy. `railway dev` runs my Railway services on my laptop.

### 5. Add a volume (a disk that survives deploys)

```bash
railway volume add --help
railway volume list
railway volume files --help
railway volume browse
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Add a volume to my hello service mounted at /data"</aside>

Attach one to `hello` at `/data`, write a file there from the app, redeploy, and check it's still there. Without a volume, files the app writes vanish on every deploy.

### 6. Create a storage bucket

```bash
railway bucket create uploads
railway bucket list
railway bucket info -b uploads
railway bucket credentials -b uploads
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Create a bucket called uploads and show its details"</aside>

A bucket is S3-style storage for files like images and PDFs. The credentials are secrets; never paste them here.

## Volume or bucket?

| | Volume | Bucket |
| --- | --- | --- |
| What it is | A disk attached to one service | Separate file storage, reached over the internet |
| Shared between services? | No | Yes |
| Good for | Database files, an app's own data folder | Uploads, images, PDFs, backups |

## Done when

- [ ] I found a bug using only logs, metrics or traces
- [ ] A file on a volume survived a redeploy
- [ ] I know when to use a volume vs a bucket

## At the agency

- "The site is down": find the cause in five minutes with the flowchart.
- Client uploads (photos, invoices) in a bucket, not on the app's disk.
