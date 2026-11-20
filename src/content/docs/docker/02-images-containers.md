---
title: "Docker 02 — Images and containers"
description: The full life of a container, from pulling an image to removing it.
sidebar:
  label: 02 · Images and containers
  order: 2
---

**Time:** 40 minutes · **Goal:** take a container through its whole life and clean up after it.

An image is like a cake recipe card, and a container is a cake baked from it. One card can bake many cakes. Eating a cake (deleting a container) doesn't touch the card. Throwing away the card (deleting an image) only works when no cakes made from it are left.

## The life of a container

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or diamond to see what it means.</p><div class="dm-zone "><span class="dm-zt">📚 Image</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">⬇️</span><span class="dm-tt"><b>Pull</b><small>docker pull nginx:1.27</small></span></summary><div class="dm-body"><p class="dm-plain">Download an image from Docker Hub. <code>nginx</code> is the name, <code>1.27</code> is the <b>tag</b> (a version label). With no tag, Docker uses <code>latest</code>, which can change under me, so real projects always pin a tag.</p></div></details></div></div><div class="dm-merge"><div class="dm-link" style="height:1.4rem"></div></div><div class="dm-zone dm-z-st"><span class="dm-zt">📦 Container</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">▶️</span><span class="dm-tt"><b>Run</b><small>docker run -d --name web nginx:1.27</small></span></summary><div class="dm-body"><p class="dm-plain">Create a container from the image and start it.</p><p><code>-d</code> (detached) runs it in the background so my terminal is free. <code>--name web</code> gives it a name I can type, instead of a random one like <code>happy_turing</code>.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Does the main program keep running?</summary><div class="dm-qb"><p>A container is alive only while its main program runs. A web server runs forever; a script finishes and the container stops.</p></div></details><div class="dm-no ">no</div><div class="dm-end dm-fix">⏹️ Status <code>Exited</code>: check <code>docker logs web</code> to see why</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">👀</span><span class="dm-tt"><b>Running</b><small>docker ps</small></span></summary><div class="dm-body"><p class="dm-plain"><code>docker ps</code> lists running containers only. Add <code>-a</code> to include stopped ones.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">⏸️</span><span class="dm-tt"><b>Stop / start</b><small>docker stop web · docker start web</small></span></summary><div class="dm-body"><p class="dm-plain"><code>stop</code> asks the program to shut down politely (10 seconds, then forced). The container keeps its files and can be started again with <code>start</code>.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🗑️</span><span class="dm-tt"><b>Remove</b><small>docker rm web</small></span></summary><div class="dm-body"><p class="dm-plain">Deletes the stopped container and any files written inside it. Can't be undone. A running container must be stopped first (or use <code>rm -f</code>).</p></div></details></div></div><div class="dm-merge"><div class="dm-link" style="height:1.4rem"></div></div><div class="dm-zone dm-z-gh"><span class="dm-zt">🧹 Image cleanup</span><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Any container still uses the image?</summary><div class="dm-qb"><p>Docker refuses to delete an image that a container (even a stopped one) was made from.</p></div></details><div class="dm-no ">yes</div><div class="dm-end">❌ <code>image is being used by stopped container</code>: <code>docker rm</code> it first</div></div><div class="dm-row"><div class="dm-link" data-l="no"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🗑️</span><span class="dm-tt"><b>Remove image</b><small>docker rmi nginx:1.27</small></span></summary><div class="dm-body"><p class="dm-plain">Deletes the image from my laptop. I can always pull it again.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><div class="dm-ok">✅ Clean laptop</div></div></div></div>

## Steps

### 1. Pull an image and look at it

```bash
docker pull nginx:1.27
docker images
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Download the nginx 1.27 Docker image and list my images"</aside>

### 2. Run it in the background with a name

```bash
docker run -d --name web nginx:1.27
docker ps
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Start an nginx container in the background called web"</aside>

### 3. Run a throwaway container I can type into

```bash
docker run -it --rm ubuntu:24.04 bash
# inside: ls, cat /etc/os-release, whoami, then: exit
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Open a temporary Ubuntu container with a shell that deletes itself when I exit"</aside>

`-it` connects my keyboard and screen to it. `--rm` deletes the container automatically when I exit. Inside, it's a full Ubuntu system, but nothing I do touches my Mac.

### 4. Stop and start

```bash
docker stop web
docker ps -a
docker start web
```

<aside class="ai-prompt ai-update"><strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Stop the web container, show all containers, then start it again"</aside>

### 5. Clean up

```bash
docker rm -f web
docker rmi nginx:1.27
```

<aside class="ai-prompt ai-delete"><strong class="ai-delete">🔴 DELETE</strong> AI prompt: "Force-remove the web container and delete the nginx 1.27 image"</aside>

## Commands in this lesson

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker pull <image>:<tag>` | 🔵 CREATE | Downloads an image | "Pull nginx 1.27" |
| `docker run -d --name <n> <image>` | 🔵 CREATE | Starts a named container in the background | "Run nginx in the background as web" |
| `docker run -it --rm <image> bash` | 🔵 CREATE | Temporary container with a shell | "Give me a throwaway Ubuntu shell" |
| `docker ps` / `docker ps -a` | 🟢 VIEW | Running / all containers | "Show my containers" |
| `docker stop <n>` | 🟠 UPDATE | Shuts a container down politely | "Stop the web container" |
| `docker start <n>` | 🟠 UPDATE | Starts a stopped container again | "Start the web container" |
| `docker rm [-f] <n>` | 🔴 DELETE | Deletes a container | "Remove the web container" |
| `docker rmi <image>` | 🔴 DELETE | Deletes an image | "Delete the nginx image" |

## Done when

- [ ] I've run a named container, stopped it, started it and removed it
- [ ] I know why `docker rmi` sometimes refuses
- [ ] I know what `-d`, `-it`, `--rm` and `--name` do

## At the agency

- Always pin a tag (`node:22`, `postgres:16`). `latest` silently changes and breaks old client sites.
- `--rm` for one-off jobs, so stopped containers don't pile up.
