---
title: Day 01 — Set up my learning site + started server basics
description: Built this journal site with Astro Starlight and read through my Stage 0 study guide.
date: 2026-11-17
stage: 0
tags: [railway, setup, astro, server-basics]
sidebar:
  order: -1
---

## Goal for today

Set up a public site to track everything I learn about Railway, and start Stage 0 (server basics).

## What I did

1. Read my [Stage 0 study guide](/stages/00-server-basics/): ten concepts (terminal, processes, ports, HTTP, DNS, HTTPS, env vars, logs, Docker, databases) plus a mini project.
2. Added a rule to `CLAUDE.md` so every session gets logged here automatically.
3. Scaffolded the site with Astro Starlight. The folder wasn't empty, so I generated it in a temp folder and moved the files up:

```bash
npm create astro@latest _scaffold -- --template starlight --no-install --no-git --skip-houston --yes
# moved the files to the repo root, deleted the example pages
npm install
npm install -D wrangler
```

4. Set up the structure: `journal/`, `stages/`, `cheatsheet/`, `projects/`.
5. Wrote `scripts/new-day.mjs` so I can start a new day's page with one command:

```bash
npm run new-day   # creates src/content/docs/journal/day-NN.md
```

6. Added `wrangler.jsonc` so Cloudflare Workers can host the built site as static files.
7. Built and previewed the site locally:

```bash
npm run build
npm run preview
```

8. Committed and pushed everything to GitHub:

```bash
git add -A
git commit -m "day 01: set up learning site and started server basics"
git push -u origin main   # -u: remember origin/main so later I can just type `git push`
```

## What broke and how I fixed it

| Problem | Cause | Fix |
| --- | --- | --- |
| `npm create astro` into a folder that already had files | Astro wants an empty folder | Scaffolded into `_scaffold/`, moved files to the root |
| `EBADENGINE Unsupported engine` warnings on `npm install` | My Node (v22.16) is a bit older than some packages want (≥ 22.23) | Build still works; upgrade Node later |

## What I learned (in my own words)

- A **static site** is just HTML/CSS/JS files. There's no server program running, so hosting is cheap and simple. Cloudflare Workers can serve these files directly.
- `npm run <name>` runs a shortcut defined in `package.json` under `scripts`.
- Journal pages sort newest first because each one gets `sidebar.order: -N`.

## Commands I learned

| Command | What it does |
| --- | --- |
| `npm create astro@latest <dir> -- --template starlight` | Generate a new Starlight docs site |
| `npm install -D <pkg>` | Install a package only needed for development (here: `wrangler`) |
| `npm run new-day` | Create the next journal page |
| `npm run build` | Turn the Markdown into a static site in `dist/` |
| `npm run preview` | Build, then serve the site locally the same way Cloudflare will |
| `git push -u origin main` | Upload my commits to GitHub and set `main` to track it |

## Questions / still unclear

- What exactly does Cloudflare do differently from Railway? (Static files vs running processes, I think.)

## Next

- Deploy the site to Cloudflare and turn on auto-deploy from GitHub.
- Start Stage 0 exercises: terminal and processes (Sections 2–3).
