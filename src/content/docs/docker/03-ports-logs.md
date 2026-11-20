---
title: "Docker 03 — Ports, logs and going inside"
description: Open a containerised web server in the browser, read its logs and step inside it.
sidebar:
  label: 03 · Ports, logs and going inside
  order: 3
---

**Time:** 40 minutes · **Goal:** nginx in a container loads in my browser, and I can see its logs.

A container is like a hotel room with the door locked. The app inside listens on its own port (room 80), but nobody outside can reach it. `-p 8080:80` is the front desk rule: "anyone who comes to door 8080 of the building, send them to room 80".

## How a browser request reaches the container

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or diamond to see what it means.</p><div class="dm-zone "><span class="dm-zt">💻 My Mac</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🌐</span><span class="dm-tt"><b>Browser opens localhost:8080</b><small>left side of -p 8080:80</small></span></summary><div class="dm-body"><p class="dm-plain"><code>localhost</code> means "this computer". <code>8080</code> is the port on my Mac. I pick it, and it must be free.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is a port mapping set?</summary><div class="dm-qb"><p>Without <code>-p</code>, the container's port is not reachable from my Mac at all.</p></div></details><div class="dm-no ">no</div><div class="dm-end">❌ Browser: "This site can't be reached". Re-run with <code>-p 8080:80</code></div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is port 8080 free on my Mac?</summary><div class="dm-qb"><p>Only one program can hold a port. Check with <code>lsof -i :8080</code>.</p></div></details><div class="dm-no ">no</div><div class="dm-end dm-fix">🔁 <code>port is already allocated</code>: use another left number, e.g. <code>-p 8081:80</code></div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div></div><div class="dm-zone dm-z-st"><span class="dm-zt">📦 Container</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🚪</span><span class="dm-tt"><b>Port 80 inside</b><small>right side of -p 8080:80</small></span></summary><div class="dm-body"><p class="dm-plain">The port the app inside listens on. It's fixed by the app: nginx uses 80, my Node app might use 3000. The image docs say which.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📜</span><span class="dm-tt"><b>nginx answers and logs it</b><small>docker logs -f web</small></span></summary><div class="dm-body"><p class="dm-plain">Containers write their logs to the screen (stdout). Docker saves that, so <code>docker logs</code> shows every request. <code>-f</code> keeps following new lines until Ctrl+C.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><div class="dm-ok">✅ "Welcome to nginx!" in the browser</div></div></div></div>

## Steps

### 1. Run nginx with a port mapping

```bash
docker run -d --name web -p 8080:80 nginx:1.27
docker ps
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Run nginx in a container called web, reachable on port 8080 of my Mac"</aside>

The `PORTS` column shows `0.0.0.0:8080->80/tcp`: Mac port 8080 goes to container port 80.

### 2. Call it

```bash
curl -i http://localhost:8080
open http://localhost:8080
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Call localhost:8080 and show the response headers"</aside>

### 3. Read the logs

```bash
docker logs web
docker logs -f --tail 20 web
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Follow the last 20 log lines of the web container"</aside>

Refresh the browser and watch a new line appear. Ctrl+C stops watching, not the container.

### 4. Go inside the running container

```bash
docker exec -it web sh
# inside: ls /usr/share/nginx/html, cat /etc/nginx/conf.d/default.conf, exit
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Open a shell inside the running web container"</aside>

`exec` runs an extra program in a container that's already running. Leaving with `exit` doesn't stop the container.

### 5. Change the page from inside, then see it vanish

```bash
docker exec web sh -c 'echo "<h1>Hi from Sagar</h1>" > /usr/share/nginx/html/index.html'
curl http://localhost:8080
docker rm -f web
docker run -d --name web -p 8080:80 nginx:1.27
curl http://localhost:8080
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Change the nginx homepage inside the web container, then recreate the container and check the page again"</aside>

My edit is gone after recreating. Files written inside a container die with it. Lesson 06 fixes that with volumes.

### 6. See the container's full details

```bash
docker inspect web
docker port web
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show the full settings and port mappings of the web container"</aside>

## Commands in this lesson

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker run -p 8080:80 …` | 🔵 CREATE | Maps Mac port 8080 to container port 80 | "Run nginx on port 8080" |
| `docker logs [-f] [--tail N] <n>` | 🟢 VIEW | Shows (and follows) a container's output | "Show the web container's logs" |
| `docker exec -it <n> sh` | 🔵 CREATE | Opens a shell in a running container | "Open a shell inside web" |
| `docker inspect <n>` | 🟢 VIEW | Every detail of a container, as JSON | "Inspect the web container" |
| `docker port <n>` | 🟢 VIEW | Its port mappings | "Which ports does web use?" |

## Done when

- [ ] nginx loads at `localhost:8080`
- [ ] I watched a request appear in `docker logs -f`
- [ ] I can explain why my edited page disappeared

## At the agency

- Run two client sites at once on different left ports: `-p 8081:80` and `-p 8082:80`.
- When a site "doesn't load", check three things in order: `docker ps` (running?), the `PORTS` column (mapped?), `docker logs` (crashing?).
