---
title: "Plan: Day 02 — Get on board"
description: Install the Railway CLI, log in, and create my first project.
sidebar:
  label: Day 02 — Get on board
  order: 2
---

**Time:** about 1 hour · **Cost:** nothing · **Goal:** a logged-in CLI and a project called `playground`.

Railway is like an office building. My account is my ID card, a **project** is one rented office, an **environment** is one floor of it (live or test), and each **service** is a machine in that office running one program.

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or ⓘ to see what it means.</p><ul class="dm-tree"><li><details class="dm-node"><summary><span class="dm-ico">🪪</span><span class="dm-tt"><b>Account</b><small>railway login</small></span></summary><div class="dm-body"><p class="dm-plain">My Railway login, the ID card for the building. Everything I create belongs to it.</p><p><code>railway login</code> opens the browser to sign in; <code>railway whoami</code> shows who I'm logged in as.</p></div></details><ul><li><details class="dm-node"><summary><span class="dm-ico">🏢</span><span class="dm-tt"><b>Project: playground</b><small>railway init</small></span></summary><div class="dm-body"><p class="dm-plain">One rented office: a box that holds everything for one app or one client.</p><p><code>railway init</code> creates a new project and links my current folder to it. <code>railway link</code> links a folder to a project that already exists.</p></div></details><ul><li><details class="dm-node"><summary><span class="dm-ico">🟢</span><span class="dm-tt"><b>Environment: production</b><small>the live floor</small></span></summary><div class="dm-body"><p class="dm-plain">An environment is one complete copy of the project. <b>production</b> is the one real visitors use.</p><p>Every new project starts with this one.</p></div></details><ul><li><details class="dm-node"><summary><span class="dm-ico">📦</span><span class="dm-tt"><b>Service: hello <span class="dm-tag">Day 03</span></b><small>my code</small></span></summary><div class="dm-body"><p class="dm-plain">A service is one running program, like one machine in the office. This one runs my own app.</p></div></details><ul><li><details class="dm-node"><summary><span class="dm-ico">🚀</span><span class="dm-tt"><b>Deployments</b><small>one per release</small></span></summary><div class="dm-body"><p class="dm-plain">Every time I deploy, Railway builds and runs a new version. Each one is a <b>deployment</b>. Old ones stay in the list so I can roll back.</p></div></details></li></ul></li><li><details class="dm-node"><summary><span class="dm-ico">🐘</span><span class="dm-tt"><b>Service: Postgres <span class="dm-tag">Day 05</span></b><small>a database</small></span></summary><div class="dm-body"><p class="dm-plain">A database is a service too, just one Railway sets up for me instead of my own code.</p></div></details></li></ul></li><li><details class="dm-node"><summary><span class="dm-ico">🧪</span><span class="dm-tt"><b>Environment: staging <span class="dm-tag">Day 04</span></b><small>a test copy</small></span></summary><div class="dm-body"><p class="dm-plain">A second copy of the same services with its own settings and data, so I can try things without touching real visitors.</p></div></details></li></ul></li></ul></li></ul></div>

Today I create the first two levels.

## Steps

### 1. Install the CLI with Homebrew

```bash
brew install railway
railway --version
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Install the Railway CLI with Homebrew and show its version"</aside>

My old copy was installed under Node 22.16.0, so it disappears when I switch Node versions. The Homebrew copy doesn't depend on Node.

### 2. Log in

```bash
railway login
railway whoami
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Log me in to Railway and show which account I'm using"</aside>

`login` opens the browser to approve. `whoami` confirms which account the terminal is using. On a server with no browser: `railway login --browserless`.

### 3. Look around my account

```bash
railway list
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "List all my Railway projects"</aside>

### 4. Create the playground project

```bash
mkdir -p ~/Desktop/vibe-projects/railway-playground/hello
cd ~/Desktop/vibe-projects/railway-playground/hello
railway init      # name it: playground
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Create a Railway project called playground in my hello folder"</aside>

This creates the project on Railway and **links** this folder to it. Linking means "commands I run in this folder act on that project".

### 5. Check where I am

```bash
railway status
railway environment list
railway service list
railway open
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show which Railway project, environment and service this folder is linked to"</aside>

`status` is my "you are here" sign. Run it before every command that changes something.

### 6. Practice unlinking and relinking

```bash
railway unlink
railway status    # now says not linked
railway link      # pick playground again
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Unlink this folder from Railway, then link it back to playground"</aside>

This is how I'll switch a folder between client projects later.

## Done when

- [ ] `railway whoami` shows my account
- [ ] A project called `playground` exists
- [ ] I can explain project, environment and service in one sentence each

## At the agency

- One Railway project per client site, so their bills and settings stay separate.
- `railway status` before touching anything, so I never change the wrong client.
