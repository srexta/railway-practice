---
title: "Docker 01 — Install and first container"
description: Install Docker Desktop on a Mac and run the hello-world container.
sidebar:
  label: 01 · Install and first container
  order: 1
---

**Time:** 20 minutes · **Goal:** Docker running and my first container printed a message.

Docker has two parts. The **engine** is the cook in the back: it builds and runs containers. The **CLI** (`docker` in the terminal) is me shouting orders through the kitchen window. On a Mac, Docker Desktop installs both and runs the engine inside a small hidden Linux machine.

## What happens when I type `docker run hello-world`

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or diamond to see what it means.</p><div class="dm-zone "><span class="dm-zt">💻 My laptop</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">⌨️</span><span class="dm-tt"><b>I type the command</b><small>docker run hello-world</small></span></summary><div class="dm-body"><p class="dm-plain">The <code>docker</code> CLI sends my order to the Docker engine. The CLI itself does no work.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is the engine running?</summary><div class="dm-qb"><p>The engine only runs while Docker Desktop is open (whale icon in the menu bar). If it's closed, the CLI has nobody to talk to.</p></div></details><div class="dm-no ">no</div><div class="dm-end">❌ <code>Cannot connect to the Docker daemon</code>: open Docker Desktop and wait for it to say "running"</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is the image already on my laptop?</summary><div class="dm-qb"><p>Docker checks its local image list first. The first time, the answer is no.</p></div></details><div class="dm-no ">no</div><div class="dm-end dm-fix">⬇️ Download it from Docker Hub (<code>Unable to find image locally… Pulling</code>)</div></div><div class="dm-row"><div class="dm-link" data-l="yes / after download"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📦</span><span class="dm-tt"><b>Engine creates a container</b><small>a running copy of the image</small></span></summary><div class="dm-body"><p class="dm-plain">The container gets its own private files, process list and network, cut off from the rest of my Mac.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🖨️</span><span class="dm-tt"><b>Program runs, prints, exits</b><small>container status: Exited (0)</small></span></summary><div class="dm-body"><p class="dm-plain">hello-world prints a message and finishes. A container lives only as long as its main program. When the program ends, the container stops, but it isn't deleted.</p><p>Exit code <code>0</code> means "finished fine". Anything else means an error.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><div class="dm-ok">✅ "Hello from Docker!"</div></div></div></div>

## Steps

### 1. Install Docker Desktop

Download it from docker.com → Docker Desktop → Mac (Apple chip or Intel, check  → About This Mac). Or with Homebrew:

```bash
brew install --cask docker
open -a Docker
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Install Docker Desktop with Homebrew and open it"</aside>

Wait until the whale icon in the menu bar stops animating.

### 2. Check it works

```bash
docker --version
docker info
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show my Docker version and check the engine is running"</aside>

`--version` only checks the CLI. `docker info` actually talks to the engine. If `info` errors, the engine isn't running.

### 3. Run my first container

```bash
docker run hello-world
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Run the hello-world Docker container"</aside>

Read the message it prints. It lists the exact four steps from the diagram above.

### 4. See what's left behind

```bash
docker images
docker ps -a
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "List my Docker images and all containers, including stopped ones"</aside>

The image is still there (so the next run won't download), and so is the stopped container.

## Commands in this lesson

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker --version` | 🟢 VIEW | Shows the CLI version | "What Docker version do I have?" |
| `docker info` | 🟢 VIEW | Checks the engine and shows its settings | "Is Docker running?" |
| `docker run hello-world` | 🔵 CREATE | Downloads the test image and runs it | "Run the hello-world container" |
| `docker images` | 🟢 VIEW | Lists images on my laptop | "List my Docker images" |
| `docker ps -a` | 🟢 VIEW | Lists all containers, running and stopped | "Show all my containers" |

## Done when

- [ ] `docker info` prints details instead of an error
- [ ] `docker run hello-world` prints "Hello from Docker!"
- [ ] I can explain image vs container in one sentence each

## At the agency

- Every developer installs the same Docker Desktop, so client projects run the same on every laptop.
- When a teammate says "Docker isn't working", the first question is "is Docker Desktop open?"
