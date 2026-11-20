---
title: "Docker 06 — Volumes and data"
description: Keep data alive after a container is deleted, with named volumes and bind mounts.
sidebar:
  label: 06 · Volumes and data
  order: 6
---

**Time:** 45 minutes · **Goal:** a Postgres database whose data survives deleting the container.

A container is a hotel room: when I check out, housekeeping wipes it. A **volume** is a storage locker in the basement. I can put my things there, check out, check into a new room, and my things are still in the locker.

There are two kinds:

- **Named volume**: Docker manages the locker for me (`-v pgdata:/var/lib/postgresql/data`). Best for databases.
- **Bind mount**: a folder on my Mac shown inside the container (`-v "$PWD":/app`). Best for live code editing.

## Where does the data go?

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or diamond to see what it means.</p><div class="dm-zone "><span class="dm-zt">🐘 Postgres writes a row</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">✍️</span><span class="dm-tt"><b>INSERT INTO notes …</b><small>written to /var/lib/postgresql/data</small></span></summary><div class="dm-body"><p class="dm-plain">Postgres always saves its data in that folder inside the container. The question is whether that folder is a volume.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is a volume mounted there?</summary><div class="dm-qb"><p><code>-v pgdata:/var/lib/postgresql/data</code> means "the folder on the right is really the locker on the left".</p></div></details><div class="dm-no ">no</div><div class="dm-end">❌ Data lives in the container: <code>docker rm</code> destroys it</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">💾</span><span class="dm-tt"><b>Saved in volume pgdata</b><small>docker volume ls</small></span></summary><div class="dm-body"><p class="dm-plain">The volume exists separately from any container.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🗑️</span><span class="dm-tt"><b>Container removed, new one started</b><small>same -v pgdata:…</small></span></summary><div class="dm-body"><p class="dm-plain">The new container mounts the same locker and finds the old data. This is also how I upgrade: new image, same volume.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Did I delete the volume?</summary><div class="dm-qb"><p><code>docker volume rm pgdata</code>, <code>docker compose down -v</code> or <code>docker volume prune</code> delete the locker itself.</p></div></details><div class="dm-no ">yes</div><div class="dm-end">❌ Data gone for good</div></div><div class="dm-row"><div class="dm-link" data-l="no"></div></div><div class="dm-row"><div class="dm-ok">✅ Row is still there</div></div></div></div>

## Steps

### 1. Start Postgres with a named volume

```bash
docker volume create pgdata
docker run -d --name db \
  -e POSTGRES_PASSWORD=devpass \
  -v pgdata:/var/lib/postgresql/data \
  -p 5432:5432 postgres:16
docker logs -f db   # wait for "ready to accept connections", then Ctrl+C
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Start Postgres 16 in a container called db with a pgdata volume and wait until it's ready"</aside>

`devpass` is a local practice password only.

### 2. Write some data

```bash
docker exec -it db psql -U postgres -c "CREATE TABLE notes (id serial, body text);"
docker exec -it db psql -U postgres -c "INSERT INTO notes (body) VALUES ('survives?');"
docker exec -it db psql -U postgres -c "SELECT * FROM notes;"
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Create a notes table in the db container, insert one row and select it"</aside>

### 3. Destroy the container, keep the volume

```bash
docker rm -f db
docker run -d --name db -e POSTGRES_PASSWORD=devpass \
  -v pgdata:/var/lib/postgresql/data -p 5432:5432 postgres:16
sleep 3; docker exec -it db psql -U postgres -c "SELECT * FROM notes;"
```

<aside class="ai-prompt ai-update"><strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Recreate the db container on the same pgdata volume and check the notes table"</aside>

The row is still there.

### 4. Bind mount: edit code live

```bash
cd ~/Desktop/vibe-projects/docker-playground
mkdir -p site && echo '<h1>Live edit</h1>' > site/index.html
docker run -d --name live -p 8080:80 -v "$PWD/site":/usr/share/nginx/html:ro nginx:1.27
curl http://localhost:8080
echo '<h1>Changed on my Mac</h1>' > site/index.html
curl http://localhost:8080
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Serve my site folder with nginx on port 8080 so edits on my Mac show up immediately"</aside>

`:ro` means read-only: the container can read my files but not change them.

### 5. Look at volumes

```bash
docker volume ls
docker volume inspect pgdata
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "List my Docker volumes and show details of pgdata"</aside>

## Commands in this lesson

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker volume create <v>` | 🔵 CREATE | Makes a named volume | "Create a volume called pgdata" |
| `docker run -v <v>:/path …` | 🔵 CREATE | Mounts a volume into a container | "Run Postgres with the pgdata volume" |
| `docker run -v "$PWD/dir":/path:ro …` | 🔵 CREATE | Shows a Mac folder inside, read-only | "Serve my site folder with nginx" |
| `docker volume ls` | 🟢 VIEW | Lists volumes | "List my volumes" |
| `docker volume inspect <v>` | 🟢 VIEW | Details of a volume | "Inspect pgdata" |
| `docker volume rm <v>` | 🔴 DELETE | Deletes a volume and its data | "Delete the pgdata volume" |

## Done when

- [ ] My `notes` row survived deleting the container
- [ ] I've seen a bind-mounted file change live
- [ ] I know which commands delete a volume

## At the agency

- Every database container gets a named volume, always.
- Before `docker volume rm` or `prune`, dump the database: `docker exec db pg_dump -U postgres > backup.sql`.
