---
name: stage-done
description: Close out a learning stage — write its refined notes page from what was practiced and mark it Done. Use when the user types /stage-done [N] or says they finished a stage.
---

The user finished a stage (number from the argument, or ask which one).

1. **Gather what was practiced.** Read every journal page in `src/content/docs/journal/` with `stage: N`, plus matching rows in `cheatsheet/railway-cli.md` and `cheatsheet/troubleshooting.md`.
2. **Write `src/content/docs/stages/NN-<topic>.md`** (zero-padded, e.g. `02-projects.md`; topic names are in `CLAUDE.md` → "My learning path"). Frontmatter: `title: "Stage N — <topic>"`, `description`, `sidebar: { order: N }`. Sections:
   - *What this stage is about*: one-paragraph plain-English summary with one analogy.
   - *Key ideas*: only concepts the user actually worked with.
   - *Commands*: table of commands actually used — `Command | What it does | AI tip (ask Claude)`.
   - *Gotchas I hit*: from the journal's "what broke" rows.
   - *Check yourself*: 3–6 questions drawn from what was practiced.
   - *Journal days*: links to the day pages.
   Do **not** include material the user didn't practice. If the page already exists, rewrite it with the improved understanding rather than appending.
3. **Update `src/content/docs/index.mdx`**: mark stage N *Done* and link it. Update "Current status" at the bottom of `CLAUDE.md`.
4. Run `npm run build` and confirm it succeeds.
5. Tell the user what was written and suggest the first step of stage N+1.
