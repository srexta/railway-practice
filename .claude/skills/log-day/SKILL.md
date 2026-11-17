---
name: log-day
description: Write what happened this session into the learning site — today's day page, use-case pages, new Railway commands, new errors. Use when the user types /log-day, says "log this" / "update my journal", or at the end of any task in this repo.
---

Log this session into the site. Only record what the user **actually learned and practiced about servers and Railway** in this conversation — never pre-fill things not yet practiced.

**Never log site/tooling work:** building or deploying this site, Astro/Starlight/Cloudflare/npm, `.claude/` setup, git commits of the site. If the session had no server/Railway learning, write nothing and say so.

**Never use "Stage N" names on the site.** Organise by days and use cases.

**AI tips:** the user runs commands through Claude, so every command gets an AI tip — a short plain-English request that would make Claude run it, e.g. `railway logs -n 100` → *"Show me the last 100 lines of my app's logs"*. In tables use `Command | What it does | AI tip (ask Claude)`; under code blocks add a `> AI tip: "…"` line. Base the tip on how the user actually phrased the request when possible.

1. **Day page.** Look in `src/content/docs/days/` for a `day-NN.md` whose `date:` is today. If none exists, run `npm run new-day` and fill in its title (`Day NN — <what I practiced>`), description and `tags`. Then add to it (keep existing content):
   - *What I did*: numbered steps, exact commands as `bash` code blocks with AI tips. Redact secrets (`postgresql://user:****@host:5432/db`).
   - *What broke and how I fixed it*: one row per problem.
   - *What I learned*: plain English, first person, short.
   - *Commands I learned*: one row per new command.
   - *Questions / still unclear* and *Next*.
2. **Use-case page.** For each practical task completed (e.g. "log in to Railway", "deploy a Node app", "add a Postgres database"), create or extend `src/content/docs/use-cases/<task-slug>.md`:
   - Frontmatter: `title` (the task, in plain words), `description`.
   - *When I need this*: one or two sentences.
   - *Syntax*: the general command form, e.g. `railway variable set KEY=value [--service <name>]`.
   - *Example*: the real command(s) from the user's practice, redacted, with the output trimmed to what matters, plus an AI tip.
   - *Gotchas*: what broke, if anything.
   - *Learned on*: links to the day pages.
3. **Railway commands** actually run → add a row (with AI tip) to `src/content/docs/cheatsheet/railway-cli.md`, under a group heading (create the heading only when its first command arrives). Skip commands already listed.
4. **Errors hit** → add a row to `src/content/docs/cheatsheet/troubleshooting.md` (create the table on the first error): `Error / symptom | Cause | Fix | Day`.
5. Run `npm run build` and confirm it succeeds.
6. Show the user a 2–3 line summary of what was logged. Commit as `day NN: <what I learned>` only if the user has asked for commits this session.

Tone: personal notebook — what I did, what broke, how I fixed it, what I learned.
