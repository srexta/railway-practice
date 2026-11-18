---
title: Railway week — the plan
description: My eight-day plan to cover every part of Railway, from first login to running a client project safely.
sidebar:
  label: Overview
  order: 0
---

This is my plan for learning all of Railway in about a week. Each plan page has a goal, a diagram of how the pieces fit, the exact commands (checked against Railway CLI 5.69.0), a hands-on exercise and a "done when" checklist.

When I actually practice a day, what really happened goes on its [Days](/days/day-01/) page. These plan pages are the route; the Days pages are the trip.

```text
 Day 01 ─── Day 02 ─── Day 03 ─── Day 04 ─── Day 05 ─── Day 06 ─── Day 07 ─── Day 08 ─── Day 09
 server     get on     first      variables  databases  networking debug &    scale &    code, CI
 basics     board      deploy     & envs                           storage    schedule   & cost
   ●          ○          ○          ○          ○          ○          ○          ○          ○
  done
```

| Day | Topic | What I'll be able to do |
| --- | --- | --- |
| [02](/plan/day-02/) | Get on board | Install the CLI, log in, create the `playground` project |
| [03](/plan/day-03/) | First deploy | Put a Node app on the internet and read its logs |
| [04](/plan/day-04/) | Variables and environments | Change settings without code; run a staging copy |
| [05](/plan/day-05/) | Databases | Add Postgres, Redis, MySQL; connect an app; backups |
| [06](/plan/day-06/) | Networking | Custom domains, private network, TCP proxy, CDN |
| [07](/plan/day-07/) | Debugging and storage | Logs, metrics, traces, SSH, volumes, buckets |
| [08](/plan/day-08/) | Scaling and scheduling | Replicas, regions, cron jobs, functions, sandboxes |
| [09](/plan/day-09/) | Config as code, CI and cost | `railway.json`, `config apply`, GitHub Actions, usage limits |

## Ground rules for the whole week

- Practice only inside one Railway project called `playground`.
- Keep practice code in its own folder, `~/Desktop/vibe-projects/railway-playground/`, not in this site's repo.
- Run `railway status` before any 🔴 DELETE command.
- Never paste a real token or database URL anywhere public. Redact it as `postgresql://user:****@host:5432/db`.
- When this plan disagrees with `railway <command> --help`, trust the help.
