# CLAUDE.md — railway-practice

Context for Claude Code in this repo. Read it at the start of every session.

## Who I am and what this repo is

- I'm Sagar, a developer at a web agency in Nepal. I've just been made responsible for all server work and I'm starting from **zero server experience**.
- I'm learning **Railway** (railway.com), working **CLI-first** (`railway` CLI, not the dashboard).
- This repo (`https://github.com/srexta/railway-practice`) is my **public learning journal**: a documentation website where I record what I learn each day.
- The site is built with **Astro Starlight** and deployed as a static site on **Cloudflare Workers** (static assets).

## How to work with me

- I'm a beginner at servers but not at code. Explain server concepts in plain language and keep the code explanations short.
- Before running anything that deploys, deletes, or touches a remote account (Railway, Cloudflare, GitHub), tell me what it will do and wait for my OK.
- Never commit secrets: no tokens, `.env` files, or Railway/Cloudflare credentials. Check `git diff --staged` for anything that looks like a key before every commit.
- Keep the site's tone like a personal notebook: what I did, what broke, how I fixed it, what I learned.
- **Track everything, every session, without being asked.** As we work, write it into the md files:
  - today's `days/day-NN.md` (create it with `npm run new-day` if missing): commands run, what broke, fixes, what I learned;
  - each practical task I complete → a `use-cases/<task>.md` page (syntax + real example + AI tip), created or extended;
  - every new `railway` command → `cheatsheet/railway-cli.md`;
  - every error → `cheatsheet/troubleshooting.md` (error → cause → fix).
  **Only log what I learned about servers and Railway.** Never write about building this site, the repo, Claude setup, npm/Astro/Cloudflare tooling, or commits. That work happens but stays off the site.
  **I run my commands through Claude.** Every command logged on the site gets an **AI tip**: a short plain-English request I could give Claude to run it (e.g. `railway logs -n 100` → *"Show me the last 100 lines of my app's logs"*). Command tables use the columns `Command | What it does | AI tip (ask Claude)`; for code blocks, put a `> AI tip:` line under the block.
  **Only publish what I've actually practiced.** No pre-filled guides, placeholder pages, empty command groups or future checklists on the site. A day page, use-case page or cheatsheet row appears only after I've done it. Study material I haven't worked through stays out of `src/content/docs/` (e.g. `server-basics.md` stays in the repo root). Never organise the site by "Stage N"; use days and use cases.
  Update the logs at the end of each task, not only at the end of the session.

## Site structure

```
src/content/docs/
├── index.mdx                 # Home: short intro and links
├── days/                     # One page per practice day (sidebar: newest first)
├── use-cases/                # One page per practical Railway task, e.g. deploy-node-app.md, add-postgres.md
├── cheatsheet/
│   ├── railway-cli.md        # Every railway command I've used, grouped, with AI tips
│   └── troubleshooting.md    # Error → cause → fix, filled in as I hit them
└── projects/                 # Real apps I study (only what I've looked at)
```

- **days/** is raw and chronological: what I practiced today.
- **use-cases/** is refined how-to notes by task, built from the days: what it's for, the command syntax, a real example from my practice, AI tips, gotchas.
- **cheatsheet/** is quick lookup.

Sidebar groups, in order: Start here (home), Days, Use cases, Cheatsheets, Projects (all `autogenerate`).

## Day page template (`npm run new-day` generates this)

```md
---
title: Day NN — <what I practiced>
description: <one line>
date: YYYY-MM-DD
tags: [railway, <topic>]
sidebar:
  order: -NN
---

## Goal for today

## What I did
<!-- commands I ran, in order, as code blocks, each followed by > AI tip: "..." -->

## What broke and how I fixed it
| Problem | Cause | Fix |
| --- | --- | --- |

## What I learned (in my own words)

## Commands I learned
| Command | What it does | AI tip (ask Claude) |
| --- | --- | --- |

## Questions / still unclear

## Next
```

## Cloudflare Workers config

`wrangler.jsonc` (static site, so no Astro Cloudflare adapter is needed):

```jsonc
{
  "name": "railway-practice",
  "compatibility_date": "2026-11-17",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

`package.json` scripts:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro build && wrangler dev",
  "deploy": "astro build && wrangler deploy",
  "new-day": "node scripts/new-day.mjs"
}
```

To publish:

- **First deploy from my machine:** `npx wrangler login`, then `npm run deploy`. This gives a `railway-practice.<account>.workers.dev` URL.
- **Auto-deploy on every push:** Cloudflare dashboard → Workers & Pages → `railway-practice` → Settings → Builds → connect GitHub repo `srexta/railway-practice`, branch `main`. Build command `npm run build`, deploy command `npx wrangler deploy`.
- **Later (optional):** a custom domain such as `railway.<mydomain>` via Workers → Settings → Domains & Routes.

## My learning order (private plan: never shown on the site as stages)

| Step | Topic |
| --- | --- |
| 0 | Server basics: terminal, processes, ports, HTTP, DNS, HTTPS, env vars, logs, Docker, databases |
| 1 | Install and log in to the Railway CLI |
| 2 | Projects, environments, services (`init`, `link`, `status`, `environment`, `service`) |
| 3 | Deploying: `up`, GitHub repos, templates, Docker images, `deployment list`, `redeploy`, `down` |
| 4 | Variables: `variable list/set/delete`, shared, reference, sealed |
| 5 | Databases: `add --database`, `connect`, backups, PITR, HA, PgBouncer |
| 6 | Networking: `domain`, private network, `tcp-proxy`, `cdn`, `waf`, `outbound-network` |
| 7 | Debugging: `logs`, `metrics`, `trace`, `run`, `shell`, `dev`, `ssh` |
| 8 | Storage: `volume`, `bucket` |
| 9 | Scaling and scheduling: `scale`, `cron`, `functions`, serverless, `sandbox` |
| 10 | Config as code (`railway.json`), IaC (`config init/pull/plan/apply`), environments, PR envs |
| 11 | Automation: `RAILWAY_TOKEN`, CI/CD, `railway api`, MCP/agent |
| 12 | Monitoring, `usage`, cost limits, team access, security |

Current status: **nothing practiced on Railway yet. Next: install the Railway CLI and log in.**

## Railway CLI quick reference (current syntax, Nov 2026)

Note: the variable command is now `railway variable set KEY=value`. The old `railway variables --set` is outdated.

```bash
railway login | login --browserless | whoami | logout
railway init | link | unlink | list | status | open
railway up [--detach] | deploy --template <name> | redeploy | restart | down
railway deployment list | templates search <q>
railway add [--database postgres] [--repo user/repo] | service | scale
railway variable list | set K=V | delete K
railway environment [new <name> | delete <name>]
railway run <cmd> | shell | dev | ssh | connect <db>
railway logs [--build] [--dns] [-n 100] | metrics | trace ...
railway domain [example.com | list | status <d>] | cdn | waf | tcp-proxy | private-network | outbound-network
railway volume list|add|browse|delete | bucket list|create|info|credentials|delete
railway cron list|run | functions list|new|push | sandbox create|exec|ssh|destroy
railway config init|pull|plan|apply
railway usage [projects | limit status] | api '<graphql>'
railway upgrade | completion <shell> | docs
# Global flags: -s/--service, -e/--environment, --json, -y/--yes
```

Full reference: https://docs.railway.com/cli

## Conventions

- Markdown pages: sentence-case headings, code blocks tagged with a language (`bash`, `json`, `sql`), and tables for command lists.
- Commit messages: `day NN: <what I learned>` for day pages, and `site: <change>` for site changes.
- Keep dependencies minimal: Astro, Starlight, `sharp`, and `wrangler` (dev).
- Add `.gitignore` entries for `node_modules/`, `dist/`, `.astro/`, `.wrangler/`, `.env*`, and `.dev.vars`.

## Safety rules for my Railway practice

- Practice only in a Railway project called `playground` until I learn config as code (step 10).
- Run `railway status` before any destructive command (`down`, `delete`, `volume delete`, `environment delete`).
- Never paste real tokens or connection strings into the site. Redact them as `postgresql://user:****@host:5432/db`.
