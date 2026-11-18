---
title: "Plan: Day 02 — Get on board"
description: Install the Railway CLI, log in, and create my first project.
sidebar:
  label: Day 02 — Get on board
  order: 2
---

**Time:** about 1 hour · **Cost:** nothing · **Goal:** a logged-in CLI and a project called `playground`.

Railway is like an office building. My account is my ID card, a **project** is one rented office, an **environment** is one floor of it (live or test), and each **service** is a machine in that office running one program.

```text
 Account  (railway login)
   └── Project: playground  (railway init)
         ├── Environment: production
         │     ├── Service: hello      ← my code (Day 03)
         │     │     └── Deployments   ← one per release
         │     └── Service: Postgres   ← a database (Day 05)
         └── Environment: staging      ← a test copy (Day 04)
```

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
