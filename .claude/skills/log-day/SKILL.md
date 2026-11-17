---
name: log-day
description: Write what happened this session into the learning site — today's journal page, new Railway commands, new errors. Use when the user types /log-day, says "log this" / "update my journal", or at the end of any task in this repo.
---

Log this session into the site. Only record what the user **actually learned and practiced about servers and Railway** in this conversation — never pre-fill things not yet practiced.

**Never log site/tooling work:** building or deploying this site, Astro/Starlight/Cloudflare/npm, `.claude/` setup, git commits of the site. If the session had no server/Railway learning, write nothing and say so.

1. **Find today's page.** Look in `src/content/docs/journal/` for a `day-NN.md` whose `date:` is today. If none exists, run `npm run new-day` and fill in its title, description, `stage` and `tags`.
2. **Update the journal page** (keep existing content, add to it):
   - *What I did*: numbered steps, with the exact commands run as `bash` code blocks. Redact secrets (`postgresql://user:****@host:5432/db`).
   - *What broke and how I fixed it*: one table row per problem.
   - *What I learned*: plain English, first person, short.
   - *Commands I learned*: one row per new command.
   - *Questions / still unclear* and *Next*.
3. **Railway commands** actually run → add a row to the right group in `src/content/docs/cheatsheet/railway-cli.md` (create the group heading only if it's needed now). Skip commands already listed.
4. **Errors hit** → add a row to `src/content/docs/cheatsheet/troubleshooting.md`: error → cause → fix → day link.
5. **Stage status**: if a stage was started, set it to *In progress* in the table in `src/content/docs/index.mdx`.
6. Run `npm run build` and confirm it succeeds.
7. Show the user a 2–3 line summary of what was logged. Commit as `day NN: <what I learned>` only if the user has asked for commits this session.

Tone: personal notebook — what I did, what broke, how I fixed it, what I learned.
