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
  - today's `journal/day-NN.md` (create it with `npm run new-day` if missing): commands run, what broke, fixes, what I learned;
  - every new `railway` command → `cheatsheet/railway-cli.md`;
  - every error → `cheatsheet/troubleshooting.md` (error → cause → fix);
  - stage progress → the table in `index.mdx` and the matching `stages/NN-*.md`.
  **Only log what I learned about servers and Railway.** Never write about building this site, the repo, Claude setup, npm/Astro/Cloudflare tooling, or commits. That work happens but stays off the site.
  **Only publish what I've actually practiced.** No pre-filled guides, placeholder stages, empty command groups or future checklists on the site. A stage page, cheatsheet row or project section appears only after I've done it. Study material I haven't worked through stays out of `src/content/docs/` (e.g. keep it in the repo root). (Day 1 content is an accepted exception.)
  Before the site exists, log to `notes.md` at the repo root and move it into the journal once it does. Update the logs at the end of each task, not only at the end of the session.

## Goal for the first session

Set up the site, publish it, and add my first day's notes.

1. Scaffold an Astro Starlight project at the repo root (`npm create astro@latest -- --template starlight`, or install `astro` + `@astrojs/starlight` by hand if the template download fails).
2. Set up the content structure below, a home page, and a working sidebar.
3. Add `wrangler.jsonc` for Cloudflare Workers static assets and the deploy scripts.
4. Add `scripts/new-day.mjs` so that `npm run new-day` creates the next day's log from the template.
5. Run `npm run build` and `npm run preview` and confirm every page renders.
6. Deploy (with my OK) and connect the repo to Cloudflare Workers Builds so each push auto-deploys.
7. Commit and push to `main`.

## Site structure

```
src/content/docs/
├── index.mdx                 # Home: what this is, progress table, links
├── journal/                  # One page per study day (sidebar: newest first)
│   └── day-01.md
├── stages/                   # Clean topic notes, one per learning stage
│   ├── 00-server-basics.md
│   ├── 01-cli-setup.md
│   └── ...                   # up to 12-monitoring-cost-security.md
├── cheatsheet/
│   ├── railway-cli.md        # Every railway command I've used, grouped
│   └── troubleshooting.md    # Error → cause → fix, filled in as I hit them
└── projects/
    └── bookings-app.md       # The practice app I'm deploying
```

- **journal/** is raw and chronological: what I did today.
- **stages/** is refined reference notes, rewritten as my understanding improves.
- **cheatsheet/** is quick lookup.

Sidebar groups, in order: Start here (home), Journal, Stages, Cheatsheets, Projects. Use Starlight `autogenerate` for the journal and stages folders.

## Daily log template (`npm run new-day` generates this)

```md
---
title: Day NN — <topic>
description: <one line>
date: YYYY-MM-DD
stage: <0–12>
tags: [railway, <topic>]
---

## Goal for today

## What I did
<!-- commands I ran, in order, as code blocks -->

## What broke and how I fixed it
| Problem | Cause | Fix |
| --- | --- | --- |

## What I learned (in my own words)

## Commands I learned
| Command | What it does |
| --- | --- |

## Questions / still unclear

## Next
```

The script should find the highest `day-NN.md`, create the next number with today's date, and print the file path.

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

## Content to seed on day one

- `stages/00-server-basics.md`: adapt it from `server-basics.md` (my Stage 0 study guide; I'll place it in the repo root). Keep the explanations and exercises, and turn the self-test into a "check yourself" section.
- `journal/day-01.md`: "Set up my learning site + started server basics", filled in from what we actually do this session.
- `cheatsheet/railway-cli.md`: start with the groups below; I'll add commands as I use them.
- `index.mdx`: a short intro and a progress table with Stages 0–12, each marked Not started, In progress, or Done.

## My learning path (for context and for the progress table)

| Stage | Topic |
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

Current status: **Stage 0, Day 1.**

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
- Commit messages: `day NN: <what I learned>` for journal entries, and `site: <change>` for site changes.
- Keep dependencies minimal: Astro, Starlight, `sharp`, and `wrangler` (dev).
- Add `.gitignore` entries for `node_modules/`, `dist/`, `.astro/`, `.wrangler/`, `.env*`, and `.dev.vars`.

## Safety rules for my Railway practice

- Practice only in a Railway project called `playground` until Stage 10.
- Run `railway status` before any destructive command (`down`, `delete`, `volume delete`, `environment delete`).
- Never paste real tokens or connection strings into the site. Redact them as `postgresql://user:****@host:5432/db`.
