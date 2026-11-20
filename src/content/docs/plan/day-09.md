---
title: "Plan: Day 09 — Config as code, CI and cost"
description: railway.json, config plan/apply, deploying from GitHub Actions, the API, usage limits and a security checklist.
sidebar:
  label: Day 09 — Code, CI & cost
  order: 9
---

**Time:** about 3 hours · **Goal:** a project defined in files, deployed from GitHub, with a spending limit.

So far I've set things up by hand, like decorating a room from memory. **Config as code** is writing the floor plan down, so I can rebuild the same room for the next client in one go and see exactly what changed.

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or ⓘ to see what it means.</p><div class="dm-lane"><span class="dm-lt">Push to GitHub</span><div class="dm-h"><details class="dm-node"><summary><span class="dm-ico">📁</span><span class="dm-tt"><b>Git repo <span class="dm-badge dm-you">you</span></b><small>code · railway.json · .railway/railway.ts</small></span></summary><div class="dm-body"><p class="dm-plain"><code>railway.json</code> holds build and deploy settings as a file. <code>.railway/railway.ts</code> describes the whole project (services, variables) as code, so it can be reviewed and recreated.</p></div></details><div class="dm-ha"><span>git push</span></div><details class="dm-node"><summary><span class="dm-ico">🐙</span><span class="dm-tt"><b>GitHub</b></span></summary><div class="dm-body"><p class="dm-plain">GitHub tells Railway about every push and every pull request.</p></div></details><div class="dm-ha"><span>then</span></div><div class="dm-fan"><details class="dm-node"><summary><span class="dm-ico">🚀</span><span class="dm-tt"><b>Auto deploy → Railway</b><small>on push to the watched branch</small></span></summary><div class="dm-body"><p class="dm-plain">Railway rebuilds and redeploys the service connected to that branch.</p></div></details><details class="dm-node"><summary><span class="dm-ico">🧪</span><span class="dm-tt"><b>PR opened → temporary PR environment</b></span></summary><div class="dm-body"><p class="dm-plain">A throwaway copy of the project just for that pull request. It's deleted when the PR closes.</p></div></details></div></div></div><div class="dm-lane"><span class="dm-lt">Deploy from CI</span><div class="dm-h"><details class="dm-node"><summary><span class="dm-ico">🤖</span><span class="dm-tt"><b>GitHub Actions</b><small>+ RAILWAY_TOKEN</small></span></summary><div class="dm-body"><p class="dm-plain">A <b>token</b> is a password for robots. With <code>RAILWAY_TOKEN</code> set as a GitHub secret, a workflow can run Railway commands without me logging in.</p></div></details><div class="dm-ha"><span>railway up</span></div><div class="dm-ok">🚂 Railway</div></div></div><div class="dm-lane"><span class="dm-lt">Change infrastructure from code</span><div class="dm-h"><details class="dm-node"><summary><span class="dm-ico">🧑‍💻</span><span class="dm-tt"><b>Me <span class="dm-badge dm-you">you</span></b><small>config plan → config apply</small></span></summary><div class="dm-body"><p class="dm-plain"><code>railway config plan</code> shows what would change (a preview). <code>railway config apply</code> makes Railway match the file.</p></div></details><div class="dm-ha"><span>applies to</span></div><div class="dm-ok">🚂 Railway</div></div></div><div class="dm-lane"><span class="dm-lt">Keep an eye on cost</span><div class="dm-h"><details class="dm-node"><summary><span class="dm-ico">🚂</span><span class="dm-tt"><b>Railway</b></span></summary><div class="dm-body"><p class="dm-plain">Everything running costs money by the minute.</p></div></details><div class="dm-ha"><span>reports</span></div><details class="dm-node"><summary><span class="dm-ico">📊</span><span class="dm-tt"><b>railway usage</b><small>limits + alerts</small></span></summary><div class="dm-body"><p class="dm-plain"><code>railway usage</code> shows what I've spent; a usage limit stops services before the bill gets out of hand.</p></div></details></div></div></div>

## Steps

### 1. Write a railway.json

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

Railway reads this file on every deploy. With a health check, a broken release never replaces a working one.

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Add a railway.json with a /health health check to my hello app"</aside>

### 2. Import the whole project as code

```bash
railway config init      # creates .railway/railway.ts from the linked project
railway config pull
railway config plan      # preview what would change
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Import my playground project as config code and show the plan"</aside>

`plan` is safe: it only shows the difference between the file and what's on Railway. (`init` and `pull` write a local file; nothing on Railway changes.)

### 3. Change something through code

```bash
# edit a variable or replica count in .railway/railway.ts, then
railway config plan
railway config apply
```

<aside class="ai-prompt ai-update"><strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Apply my Railway config changes after showing me the plan"</aside>

Always read `plan` before `apply`.

### 4. Deploy from GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: deploy
on: { push: { branches: [main] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm i -g @railway/cli
      - run: railway up --service hello --detach
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Set up a GitHub Action that deploys my hello service to Railway on push"</aside>

Create a **project token** in the dashboard (project settings → Tokens) and save it as a GitHub secret. A project token can only touch one project, which is safer than my personal login.

### 5. Talk to the API directly

```bash
railway api '{ me { name } }'
railway mcp --help
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Ask the Railway API for my account name"</aside>

The API can do everything the dashboard can. MCP lets Claude talk to Railway directly.

### 6. Watch the money

```bash
railway usage
railway usage projects
railway usage limit --help
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show my Railway usage by project and my current limits"</aside>

Set a usage limit so a bug or a traffic spike can't run up a big bill. Do this before any client project goes live.

### 7. Clean up the playground

```bash
railway status
railway volume list
railway bucket list
railway service list
# delete what I no longer need, one at a time
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "List everything in playground so I can decide what to delete"</aside>

End the week with only what I'm still using, so the trial credit lasts.

## Security checklist for client projects

- [ ] Secrets live in Railway variables (sealed where possible), never in git
- [ ] CI uses a project token, not my personal login
- [ ] Databases are reached privately; no TCP proxy left open
- [ ] Backups or PITR on, and I've practiced one restore
- [ ] Teammates have the lowest access level that works
- [ ] Usage limit set and a health check in `railway.json`

## Done when

- [ ] A push to GitHub deployed without me running anything
- [ ] I changed the project through `config apply`
- [ ] A usage limit is set

## At the agency

- A starter config I copy for every new client project.
- Teammates deploy by merging a PR; nobody needs my password.
