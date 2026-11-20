---
title: "Docker 08 — Debugging and cleanup"
description: Find out why a container died, fix the common errors, and free disk space safely.
sidebar:
  label: 08 · Debugging and cleanup
  order: 8
---

**Time:** 45 minutes · **Goal:** I can find why a container stopped without guessing, and clean up without losing data.

Debugging a container is like a doctor's check-up: first ask "are you alive?" (`docker ps -a`), then "what happened?" (`docker logs`), then look closer (`docker inspect`, `docker exec`). Go in that order every time.

## Debug path: "my container isn't working"

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or diamond to see what it means.</p><div class="dm-zone "><span class="dm-zt">🩺 Check-up</span><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is it in docker ps?</summary><div class="dm-qb"><p><code>docker ps</code> only shows running containers. If it's missing, <code>docker ps -a</code> shows it with status <code>Exited (code)</code>.</p></div></details><div class="dm-no ">no</div><div class="dm-end dm-fix">📜 It crashed: <code>docker logs &lt;name&gt;</code>, read the last lines</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is it restarting over and over?</summary><div class="dm-qb"><p>Status <code>Restarting</code> or an uptime that keeps resetting means it crashes on start. The logs show the error.</p></div></details><div class="dm-no ">yes</div><div class="dm-end dm-fix">📜 <code>docker logs --tail 50 &lt;name&gt;</code></div></div><div class="dm-row"><div class="dm-link" data-l="no"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Does PORTS show a mapping?</summary><div class="dm-qb"><p>Running but unreachable usually means no <code>-p</code>, or the wrong right-hand port.</p></div></details><div class="dm-no ">no</div><div class="dm-end dm-fix">🔁 Recreate with <code>-p host:app-port</code></div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🔬</span><span class="dm-tt"><b>Look inside</b><small>docker exec -it &lt;name&gt; sh</small></span></summary><div class="dm-body"><p class="dm-plain">Check the files are where I expect, the env vars are set (<code>env</code>), and the app answers from inside (<code>wget -qO- localhost:3000</code>).</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><div class="dm-ok">✅ Cause found</div></div></div></div>

## Exit codes worth knowing

| Code | Plain meaning | Usual cause |
| --- | --- | --- |
| `0` | Finished normally | The main program just ended (a script, not a server) |
| `1` | App error | Crash in my code: read the logs |
| `127` | Command not found | Typo in `CMD`, or the program isn't installed in the image |
| `137` | Killed | Out of memory, or `docker kill` / forced stop |
| `143` | Stopped politely | `docker stop` |

## Common errors

| Error | Cause | Fix |
| --- | --- | --- |
| `Cannot connect to the Docker daemon` | Docker Desktop isn't running | Open Docker Desktop and wait |
| `port is already allocated` | Another program or container uses that host port | `lsof -i :8080`, or pick another left-hand port |
| `Conflict. The container name "/web" is already in use` | A stopped container still has that name | `docker rm web`, then run again |
| `pull access denied` / `manifest unknown` | Typo in image name or tag | Check the name on Docker Hub |
| `ECONNREFUSED 127.0.0.1:5432` | App uses `localhost` for another container | Use the service name, e.g. `db` |
| `no space left on device` | Old images and build cache filled the disk | `docker system df`, then prune (below) |
| `exec format error` | Image built for a different CPU (Mac ARM vs server Intel) | `docker build --platform linux/amd64 …` |

## Cleanup

### 1. See what's using space

```bash
docker system df
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show how much disk Docker images, containers, volumes and cache use"</aside>

### 2. Remove stopped containers and unused images

```bash
docker ps -a
docker container prune
docker image prune
```

<aside class="ai-prompt ai-delete"><strong class="ai-delete">🔴 DELETE</strong> AI prompt: "Remove all stopped containers and dangling images"</aside>

`image prune` removes only **dangling** images (old untagged layers). `image prune -a` removes every image no container uses.

### 3. Clear the build cache

```bash
docker builder prune
```

<aside class="ai-prompt ai-delete"><strong class="ai-delete">🔴 DELETE</strong> AI prompt: "Clear Docker's build cache"</aside>

### 4. The big one: be careful

```bash
docker system prune            # containers, networks, dangling images, cache
docker system prune --volumes  # ALSO unused volumes = database data
```

<aside class="ai-prompt ai-delete"><strong class="ai-delete">🔴 DELETE</strong> AI prompt: "Prune all unused Docker data but keep volumes"</aside>

Never add `--volumes` without first running `docker volume ls` and backing up any database I care about.

## Commands in this lesson

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker ps -a` | 🟢 VIEW | Shows crashed containers and exit codes | "Show all containers with status" |
| `docker inspect <n> --format '{{.State.ExitCode}}'` | 🟢 VIEW | Just the exit code | "Why did hello exit?" |
| `docker stats` | 🟢 VIEW | Live CPU and memory per container | "Show live container resource use" |
| `docker system df` | 🟢 VIEW | Disk use by type | "How much disk is Docker using?" |
| `docker container prune` | 🔴 DELETE | Removes all stopped containers | "Remove stopped containers" |
| `docker image prune [-a]` | 🔴 DELETE | Removes unused images | "Remove unused images" |
| `docker builder prune` | 🔴 DELETE | Clears build cache | "Clear the build cache" |
| `docker system prune [--volumes]` | 🔴 DELETE | Removes everything unused | "Prune Docker but keep volumes" |

## Done when

- [ ] I broke a container on purpose (typo in `CMD`) and found the cause from `ps -a` + `logs`
- [ ] I freed space with `docker system df` → prune, and my `pgdata` volume survived

## At the agency

- The check-up order (`ps -a` → `logs` → `exec`) is the same on Railway: deployments list → `railway logs` → `railway ssh`.
- Build images for servers with `--platform linux/amd64` when the server isn't ARM.
