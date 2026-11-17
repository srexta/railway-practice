---
title: Git
description: The Git commands I need for deploying on Railway, with color types and AI prompts.
---

Git is a save-point system for code. Each **commit** is a save point. **GitHub** keeps a copy online, and Railway watches GitHub: when I push to a branch, Railway rebuilds and redeploys that service.

```
my laptop ──git push──▶ GitHub ──Railway sees the push──▶ build ──▶ deploy
```

Each command has a color type: 🟢 VIEW (looks only) · 🔵 CREATE (makes something new) · 🟡 EDIT (changes part) · 🟠 UPDATE (replaces or syncs as a whole) · 🔴 DELETE (can't be undone; Claude warns first).

New words:
- **Repository (repo):** a project folder that Git tracks.
- **Commit:** one save point with a message describing what changed.
- **Branch:** a separate line of work. `main` is usually what production deploys from.
- **Remote:** the online copy, usually called `origin` (GitHub).
- **Push / pull:** send my commits to GitHub / bring GitHub's commits to my laptop.
- **PR (pull request):** asking to merge one branch into another on GitHub. Railway can spin up a temporary environment for each PR.

## The everyday flow

```bash
git status                       # 🟢 what changed?
git add .                        # 🟡 pick everything for the next save point
git commit -m "add health check" # 🔵 save it with a message
git push                         # 🟠 send to GitHub → Railway redeploys
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> <strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Commit my changes with a short message and push them."</aside>

## One-time setup

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `git config --global user.name "Your Name"` | 🟡 EDIT | Sets the name stamped on your commits | "Set my Git name" |
| `git config --global user.email "you@example.com"` | 🟡 EDIT | Sets the email stamped on your commits | "Set my Git email" |
| `git config --global init.defaultBranch main` | 🟡 EDIT | New repos start on `main` | "Make main my default branch" |
| `git config --list` | 🟢 VIEW | Shows your Git settings | "Show my Git settings" |

## Starting a project

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `git init` | 🔵 CREATE | Turns the current folder into a Git repo | "Start Git in this folder" |
| `git clone <url>` | 🔵 CREATE | Downloads a repo from GitHub | "Clone my bookings-app repo" |
| `git remote add origin <url>` | 🔵 CREATE | Connects a local repo to GitHub | "Connect this folder to my GitHub repo" |
| `git remote -v` | 🟢 VIEW | Shows which GitHub repo this folder is linked to | "Which GitHub repo is this linked to?" |
| `gh repo create <name> --private --source=. --push` | 🔵 CREATE | Creates a GitHub repo from this folder and pushes it (GitHub CLI) | "Create a private GitHub repo for this folder and push it" |

## Saving work

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `git status` | 🟢 VIEW | Lists changed, new and staged files | "What have I changed?" |
| `git diff` | 🟢 VIEW | Shows line-by-line changes not yet staged | "Show me what I changed in server.js" |
| `git diff --staged` | 🟢 VIEW | Shows what will go into the next commit; check for secrets here | "Show what I'm about to commit" |
| `git add <file>` / `git add .` | 🟡 EDIT | Stages one file / everything | "Stage only the Dockerfile" |
| `git commit -m "message"` | 🔵 CREATE | Saves a commit | "Commit this as 'add Dockerfile'" |
| `git log --oneline` | 🟢 VIEW | Lists commits, one line each | "Show my last 10 commits" |
| `git show <commit>` | 🟢 VIEW | Shows what one commit changed | "What changed in the last commit?" |

## GitHub (where Railway pulls from)

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `git push` | 🟠 UPDATE | Sends commits to GitHub (triggers a Railway deploy if the service is linked) | "Push my commits" |
| `git push -u origin main` | 🟠 UPDATE | First push of a branch; `-u` remembers where to push next time | "Push this branch to GitHub for the first time" |
| `git pull` | 🟠 UPDATE | Brings down new commits from GitHub | "Get the latest changes from GitHub" |
| `git fetch` | 🟢 VIEW | Checks GitHub for new commits without changing my files | "Is there anything new on GitHub?" |

## Branches (staging vs production, PR environments)

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `git branch` | 🟢 VIEW | Lists branches; `*` marks the current one | "Which branch am I on?" |
| `git switch -c <name>` | 🔵 CREATE | Creates a new branch and moves to it | "Make a branch called add-redis" |
| `git switch <name>` | 🟡 EDIT | Moves to an existing branch | "Switch back to main" |
| `git merge <name>` | 🟠 UPDATE | Brings another branch's commits into the current one | "Merge add-redis into main" |
| `git branch -d <name>` | 🔴 DELETE | Deletes a branch that's already merged | "Delete the add-redis branch" |
| `gh pr create --fill` | 🔵 CREATE | Opens a pull request on GitHub (Railway can create a PR environment for it) | "Open a pull request for this branch" |

Common Railway setup: `main` deploys to **production**, a `staging` branch deploys to **staging**, and each PR gets a temporary environment that is deleted when the PR closes.

## Undoing things

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `git restore <file>` | 🔴 DELETE | Throws away unsaved changes to a file. **Can't be undone.** | "Undo my changes to server.js" |
| `git restore --staged <file>` | 🟡 EDIT | Unstages a file but keeps the changes | "Unstage .env, I don't want to commit it" |
| `git commit --amend` | 🟡 EDIT | Edits the last commit (only before pushing) | "Fix the message of my last commit" |
| `git revert <commit>` | 🟠 UPDATE | Makes a new commit that undoes an old one; safe after pushing, and it triggers a redeploy | "Undo the last pushed commit safely" |
| `git stash` / `git stash pop` | 🟡 EDIT | Parks unfinished changes / brings them back | "Put my changes aside for a moment" |

> If a bad deploy is live, `railway redeploy` or the dashboard's rollback is the fastest fix. `git revert` + `git push` fixes the code so the next deploy is good too.

## Keeping secrets out

- Add `.env` to `.gitignore` **before** the first commit:

```bash
echo ".env" >> .gitignore
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Make sure .env is git-ignored."</aside>

- `git check-ignore -v .env` shows whether, and why, a file is ignored. 🟢 VIEW · AI prompt: "Is .env being ignored by git?"
- If a secret was pushed, **rotate it** (make a new key) right away. Removing it from Git isn't enough, because it stays in history.
- `railway up` also respects `.gitignore`, so ignored files are never uploaded.

## Tags (marking releases)

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `git tag v1.0.0` | 🔵 CREATE | Marks the current commit as a release | "Tag this commit as v1.0.0" |
| `git push --tags` | 🟠 UPDATE | Sends tags to GitHub | "Push my tags" |
