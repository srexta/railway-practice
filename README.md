# Railway Practice

My public learning notebook for [Railway](https://railway.com): what I practiced each day, the commands I learned and the errors I hit, starting from zero server experience.

**Live site:** https://railway-practice.shrestha.workers.dev

Built with [Astro Starlight](https://starlight.astro.build) and hosted as a static site on Cloudflare Workers.

## What's inside

```
src/content/docs/
├── index.mdx       # Home page
├── days/           # One page per practice day (newest first)
├── use-cases/      # Practical Railway tasks: syntax, real example, color type, AI prompt
├── cheatsheet/     # Railway CLI, Git, troubleshooting (error → cause → fix)
└── projects/       # Real apps I study
```

Pages are added only after I've actually practiced something. Every command comes with a **color type** and an **AI prompt** (a plain-English request to give Claude to run it):

| Color | Type | Like HTTP | Meaning |
| --- | --- | --- | --- |
| 🟢 | VIEW | GET | Only looks. Safe anytime. |
| 🔵 | CREATE | POST | Makes something new. |
| 🟡 | EDIT | PATCH | Changes one part of something. |
| 🟠 | UPDATE | PUT | Replaces, redeploys or syncs as a whole. |
| 🔴 | DELETE | DELETE | Removes or stops something. Can't be undone; Claude warns first. |

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies (first time only) |
| `npm run dev` | Run the site locally at http://localhost:4321 with live reload |
| `npm run new-day` | Create the next `days/day-NN.md` from the template |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Build, then serve it locally the same way Cloudflare does |
| `npm run deploy` | Build and publish to Cloudflare Workers (needs `npx wrangler login` once) |

## Working with Claude Code

- `CLAUDE.md` holds the rules for this repo: what to log, the AI-tip format, and Railway safety rules.
- `/log-day` writes the session into today's day page, use-case pages and cheatsheets.
- `.claude/hooks/guard.sh` asks before destructive `railway` commands and blocks commits that look like they contain secrets. Test it with `bash .claude/hooks/test-guard.sh`.

## Practice files

Exercises are done **outside** this repo, in `~/playground/dayNN`. Only the notes come back here.
