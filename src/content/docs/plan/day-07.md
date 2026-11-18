---
title: "Plan: Day 07 — Debugging and storage"
description: Find problems with logs, metrics, traces and SSH, and store files on volumes and buckets.
sidebar:
  label: Day 07 — Debug & storage
  order: 7
---

**Time:** 2–3 hours · **Goal:** find a bug without guessing, and keep files safe across deploys.

Debugging is a doctor's visit. **Logs** are what the patient tells me, **metrics** are the temperature and pulse, **traces** are the X-ray, and **SSH** is walking into the room myself.

```text
 Something's wrong
   │
   ├─ Did the build fail? ──────────── yes ─▶ railway logs --build
   │
   ├─ Does it crash or restart? ────── yes ─▶ railway logs -n 200
   │
   ├─ Error page or 502? ───────────── yes ─▶ check PORT and start command,
   │                                         railway logs --http
   ├─ Slow? ────────────────────────── yes ─▶ railway metrics, railway trace list
   │
   └─ Still stuck ──────────────────────────▶ railway ssh, look around inside
```

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
