# Stage 0 — Server Basics (Before Railway)

A beginner's study guide to the ten concepts every server error message assumes you know.
Study time: **2–3 days at ~2 hours/day**. Everything below runs on your own laptop; no Railway account needed yet.

> **Commands in this file** work on macOS and Linux. On Windows, install **WSL** (Windows Subsystem for Linux) first (`wsl --install` in PowerShell as admin) and run everything inside the Ubuntu terminal it gives you.

---

## Contents

1. [The big picture: what a "server" really is](#1-the-big-picture)
2. [Terminal / shell](#2-terminal--shell)
3. [Processes](#3-processes)
4. [Ports and localhost](#4-ports-and-localhost)
5. [HTTP, requests and status codes](#5-http-requests-and-status-codes)
6. [DNS](#6-dns)
7. [HTTPS / TLS certificates](#7-https--tls-certificates)
8. [Environment variables](#8-environment-variables)
9. [Logs: stdout and stderr](#9-logs-stdout-and-stderr)
10. [Containers and images (Docker)](#10-containers-and-images-docker)
11. [Databases](#11-databases)
12. [Putting it together: mini project](#12-putting-it-together-mini-project)
13. [How each concept maps to Railway](#13-how-each-concept-maps-to-railway)
14. [Self-test](#14-self-test)
15. [3-day study schedule](#15-3-day-study-schedule)

---

## 0. Install before you start

| Tool | Why | Check it works |
|---|---|---|
| Git | Version control; Railway deploys from Git | `git --version` |
| Node.js 20+ | Run small test servers | `node -v` |
| Docker Desktop | Run containers and databases locally | `docker --version` |
| `curl` | Talk HTTP from the terminal (usually preinstalled) | `curl --version` |
| `dig` / `nslookup` | Look up DNS (preinstalled on macOS/Linux) | `dig -v` |
| `psql` | Postgres client; Railway's `connect` needs it | `psql --version` |

Install `psql`:
- macOS: `brew install libpq && brew link --force libpq`
- Ubuntu/WSL: `sudo apt install postgresql-client`

---

## 1. The big picture

A **server** is just a computer that runs a program which waits for requests and answers them. There's nothing magic about it: your laptop becomes a server the moment you run a program that listens on a port.

What happens when someone opens `https://shop.example.com`:

```
Browser
  │ 1. DNS: "what IP is shop.example.com?"  → 203.0.113.10
  │ 2. Connect to 203.0.113.10 on port 443 (HTTPS)
  │ 3. TLS handshake: check the certificate, set up encryption
  │ 4. Send HTTP request: GET / 
  ▼
Server (a process listening on a port)
  │ 5. Reads config from environment variables (DB URL, secrets)
  │ 6. Queries the database
  │ 7. Writes a log line
  ▼
Browser receives HTTP response: 200 OK + HTML
```

Every concept in this guide is one step of that diagram. Learn them one at a time, then the whole picture makes sense.

---

## 2. Terminal / shell

### What it is
The **terminal** is a text window. The **shell** (bash, zsh) is the program inside it that reads your commands and runs them. Servers usually have no screen or mouse, so this is how you'll work with them, and the Railway CLI lives here too.

### Key ideas
- **Current directory**: where you "are". Commands act relative to it.
- **Paths**: `/` is the root, `~` is your home folder, `.` is "here", `..` is "one level up".
- **Flags**: options after a command, e.g. `ls -la` (`-l` long list, `-a` show hidden files).
- **Pipes** `|`: send one command's output into another.
- **Redirects** `>` (overwrite file), `>>` (append to file).

### Commands to learn
```bash
pwd                      # where am I?
ls -la                   # list files, including hidden ones (like .env)
cd ~/projects            # move into a folder
cd ..                    # go up one level
mkdir playground         # make a folder
touch notes.md           # make an empty file
cat notes.md             # print a file
less bigfile.log         # scroll a big file (q to quit)
head -n 20 file.log      # first 20 lines
tail -n 20 file.log      # last 20 lines
tail -f file.log         # follow a file live (Ctrl+C to stop)
grep "error" file.log    # find lines containing "error"
cp a.txt b.txt           # copy
mv a.txt old/a.txt       # move/rename
rm b.txt                 # delete (no recycle bin — careful!)
which node               # where is this program installed?
history                  # commands you've run
man ls                   # manual page for a command (q to quit)
```

### Keyboard shortcuts
- `Tab` — autocomplete file and command names
- `↑` / `↓` — previous commands
- `Ctrl+C` — stop the running command
- `Ctrl+R` — search your command history
- `Ctrl+L` — clear the screen

### ✅ What you can do (exercises)
1. Create `~/playground/stage0`, move into it, create three files, list them, rename one, delete one.
2. Run `ls -la ~` and find the hidden files (they start with `.`). Open `~/.zshrc` or `~/.bashrc` with `cat`.
3. Run `history | grep cd` — a pipe in action.
4. Write `echo "hello" > a.txt`, then `echo "world" >> a.txt`, then `cat a.txt`. Explain the difference between `>` and `>>`.

---

## 3. Processes

### What it is
A **process** is a running program. Your web app on a server is a process. It has an ID (**PID**), uses CPU and memory, and can:
- **keep running** (a web server, a queue worker),
- **finish and exit** (a script, a cron job), or
- **crash** (an error stops it).

When a process ends, it returns an **exit code**: `0` means success, anything else means failure. Platforms like Railway use this to decide whether to restart your app.

**Signals** are messages to a process. The important ones:
- `SIGINT` — what Ctrl+C sends ("please stop")
- `SIGTERM` — "please shut down cleanly" (Railway sends this before replacing your app during a deploy)
- `SIGKILL` — "stop now", can't be ignored

### Commands to learn
```bash
ps aux                   # all running processes
ps aux | grep node       # only node processes
top                      # live CPU/memory view (q to quit); try `htop` if installed
kill 12345               # send SIGTERM to PID 12345
kill -9 12345            # send SIGKILL (last resort)
echo $?                  # exit code of the last command
```

### ✅ What you can do
1. Start a process that runs forever:
   ```bash
   node -e "console.log('pid', process.pid); setInterval(()=>{}, 1000)"
   ```
   In a **second terminal**, find it with `ps aux | grep node`, then `kill <pid>`. Watch the first terminal stop.
2. Exit codes:
   ```bash
   node -e "process.exit(0)"; echo $?   # 0
   node -e "process.exit(1)"; echo $?   # 1
   ls /does-not-exist; echo $?          # non-zero
   ```
3. Graceful shutdown — save as `graceful.js` and run it, then press Ctrl+C or `kill <pid>` from another terminal:
   ```js
   console.log('started, pid', process.pid);
   const t = setInterval(() => console.log('working...'), 1000);
   const stop = (sig) => {
     console.log(`got ${sig}, cleaning up`);
     clearInterval(t);
     process.exit(0);
   };
   process.on('SIGTERM', () => stop('SIGTERM'));
   process.on('SIGINT', () => stop('SIGINT'));
   ```
   This is exactly the pattern your apps need on Railway so deploys don't cut off requests.

---

## 4. Ports and localhost

### What it is
One computer has one IP address but runs many programs. **Ports** (numbers 0–65535) let each program have its own "door".

| Port | Usually used by |
|---|---|
| 80 | HTTP |
| 443 | HTTPS |
| 22 | SSH |
| 5432 | PostgreSQL |
| 3306 | MySQL |
| 6379 | Redis |
| 3000 / 8000 / 8080 | Development web servers |

- **`localhost` / `127.0.0.1`** means "this same computer". Only your own machine can reach it.
- **`0.0.0.0`** (IPv4) or **`::`** (IPv6 + IPv4) means "listen on all network interfaces", so other machines can reach it.

> ⚠️ The #1 Railway beginner bug: an app listening on `127.0.0.1` or a hard-coded port. On Railway your app must listen on the port in the `PORT` environment variable, on `0.0.0.0`/`::`.

### Commands to learn
```bash
lsof -i :3000            # what's using port 3000? (macOS/Linux)
lsof -i -P | grep LISTEN # everything listening
nc -zv localhost 5432    # is anything listening on 5432?
```

### ✅ What you can do
1. Save as `server.js`:
   ```js
   const http = require('http');
   const port = process.env.PORT || 3000;
   http.createServer((req, res) => {
     console.log(req.method, req.url);
     res.end('Hello from port ' + port + '\n');
   }).listen(port, '::', () => console.log('listening on', port));
   ```
   Run `node server.js`, open `http://localhost:3000`.
2. Run it again in a second terminal **at the same time**. Read the error (`EADDRINUSE`) — two processes can't use one port.
3. Run `PORT=4000 node server.js` and open port 4000. You just configured a port from outside the code.
4. Use `lsof -i :3000` to find the process holding the port, then stop it with `kill`.

---

## 5. HTTP, requests and status codes

### What it is
**HTTP** is the language browsers and servers speak. A **request** has:
- a **method**: `GET` (read), `POST` (create/submit), `PUT`/`PATCH` (update), `DELETE`
- a **URL path**: `/products/42?color=red`
- **headers**: extra info (`Content-Type`, `Cookie`, `Authorization`, `User-Agent`)
- an optional **body**: form data or JSON

A **response** has a **status code**, headers and a body.

### Status codes you must know
| Code | Meaning | What it usually tells you |
|---|---|---|
| 200 | OK | Worked |
| 201 | Created | Something was saved |
| 301 / 302 | Redirect | Go to another URL (e.g. http → https) |
| 304 | Not modified | Browser cache is fine |
| 400 | Bad request | Client sent invalid data |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | Logged in but not allowed |
| 404 | Not found | Wrong URL or route missing |
| 405 | Method not allowed | Right URL, wrong method (GET vs POST) |
| 429 | Too many requests | Rate limited |
| 500 | Internal server error | **Your code** threw an error |
| 502 | Bad gateway | The proxy couldn't reach your app (crashed, wrong port, not ready) |
| 503 | Service unavailable | App overloaded or down for maintenance |
| 504 | Gateway timeout | App took too long to answer |

> Rule of thumb: **4xx = the request's fault, 5xx = the server's fault.** On Railway, a 502 almost always means your process isn't listening where the proxy expects.

**Proxy:** a server that sits in front of your app and forwards requests. Railway's edge is a proxy. It adds headers like `X-Forwarded-For` (real visitor IP) and `X-Forwarded-Proto` (was it https?). Your app must "trust the proxy" to read them.

### Commands to learn
```bash
curl https://example.com                 # get the body
curl -I https://example.com              # headers only
curl -v https://example.com              # everything, including the TLS handshake
curl -L http://github.com                # follow redirects
curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Sagar"}' http://localhost:3000/hello
curl -o /dev/null -s -w "%{http_code} %{time_total}s\n" https://example.com   # status + time
```

### ✅ What you can do
1. `curl -I http://github.com` — see the 301 redirect to https.
2. `curl -I https://github.com/this-page-does-not-exist-123` — see a 404.
3. Open your browser's DevTools → **Network** tab, reload any site, click a request, and find its method, status, request headers and response headers.
4. Extend `server.js` to return 404 for unknown paths and 500 on `/boom`:
   ```js
   if (req.url === '/boom') { res.statusCode = 500; return res.end('broke\n'); }
   if (req.url !== '/') { res.statusCode = 404; return res.end('not found\n'); }
   ```
   Test each with `curl -i`.

---

## 6. DNS

### What it is
**DNS** (Domain Name System) is the internet's phone book: it turns names like `railway.com` into IP addresses.

### Record types
| Record | Purpose | Example |
|---|---|---|
| A | Name → IPv4 address | `example.com → 93.184.215.14` |
| AAAA | Name → IPv6 address | `example.com → 2606:2800:...` |
| CNAME | Name → another name (alias) | `app.example.com → xyz.up.railway.app` |
| TXT | Text, used for verification and email security | `v=spf1 include:_spf.google.com ~all` |
| MX | Where email for the domain goes | `example.com → mail server` |
| NS | Which provider is in charge of the domain's DNS | `ns1.cloudflare.com` |

- **TTL** (time to live): how long resolvers cache a record, in seconds. Before a migration you lower it (e.g. to 300) so changes spread quickly.
- **Propagation**: after you change a record, old answers can stay cached until the TTL expires.
- **Apex vs subdomain**: `example.com` is the apex; `app.example.com` is a subdomain. CNAMEs aren't allowed on the apex in plain DNS — providers like Cloudflare solve this with "CNAME flattening".

On Railway you'll mostly add a **CNAME** (pointing your domain at Railway) and sometimes a **TXT** (to prove you own it).

### Commands to learn
```bash
dig example.com                 # full answer
dig +short example.com          # just the IP
dig +short AAAA example.com     # IPv6
dig +short CNAME www.github.com
dig +short MX gmail.com
dig +short TXT google.com
dig +short NS railway.com
dig @1.1.1.1 example.com        # ask a specific resolver (Cloudflare)
nslookup example.com            # alternative tool (also on Windows)
```

### ✅ What you can do
1. Look up A, AAAA, MX, TXT and NS for a domain your company owns (e.g. one of your client sites). Write down which DNS provider hosts it (the NS records tell you).
2. Find a CNAME in the wild: `dig www.github.com` and read the answer chain.
3. Compare `dig @1.1.1.1` and `dig @8.8.8.8` for the same domain — they should match.
4. Log in to your company's DNS provider (read-only!) and find where you'd add a CNAME later.

---

## 7. HTTPS / TLS certificates

### What it is
**HTTPS** = HTTP inside an encrypted **TLS** connection. A **certificate** proves the server really owns the domain; it's issued by a **Certificate Authority** (e.g. Let's Encrypt) and expires (often every 90 days, renewed automatically).

Railway issues and renews certificates for you once your DNS points correctly. Your jobs are: get DNS right, make your app redirect http → https, and set cookies as `Secure`.

### Common problems
| Symptom | Likely cause |
|---|---|
| "Your connection is not private" | Certificate missing, expired, or for a different domain |
| Certificate stuck "pending" | DNS record wrong or not propagated yet; a proxy (Cloudflare orange cloud) in the way |
| Infinite redirect loop | App doesn't trust the proxy, so it thinks every request is http |
| "Mixed content" warnings | Page loads some images/scripts over `http://` |

### Commands to learn
```bash
curl -vI https://example.com 2>&1 | grep -iE "subject|issuer|expire"
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

### ✅ What you can do
1. Click the padlock on three sites you manage. Note the issuer and expiry date.
2. Run the `openssl` command on the same sites and find the same info in the terminal.
3. Find a site that loads over `http://` and see what the browser warns.

---

## 8. Environment variables

### What it is
**Environment variables** are key=value settings given to a process from outside its code. They're how you pass config and secrets without hard-coding them:

```
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
STRIPE_SECRET_KEY=sk_test_...
APP_ENV=production
```

Why this matters: the **same code** runs on your laptop, staging and production — only the variables change. On Railway, you'll set them with `railway variable set`, and Railway also injects its own (`PORT`, `RAILWAY_PUBLIC_DOMAIN`, etc.).

### Rules
- **Never commit secrets** to Git. Put them in `.env` (git-ignored) locally, and in Railway variables in the cloud.
- Keep a `.env.example` in Git listing every variable name with fake values.
- Apps should **fail loudly at start-up** if a required variable is missing.

### Commands to learn
```bash
env                            # all variables in this shell
echo $HOME                     # one variable
export GREETING=hello          # set for this shell session
GREETING=hi node app.js        # set only for one command
unset GREETING                 # remove
```

Reading them in code:
```js
// Node
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) { console.error('DATABASE_URL is missing'); process.exit(1); }
```
```php
// PHP / Laravel
$dbUrl = getenv('DATABASE_URL');   // Laravel: env('DATABASE_URL')
```

**Connection URL anatomy** (you'll see these constantly):
```
postgresql://postgres:s3cret@postgres.railway.internal:5432/railway
└─scheme──┘ └─user─┘ └pass┘ └──────────host──────────┘ └port┘ └db─┘
```

### ✅ What you can do
1. `export GREETING=hello`, then `node -e "console.log(process.env.GREETING)"`. Open a new terminal and run it again — it's gone. Variables live per shell session.
2. Modify `server.js` to print `process.env.GREETING || 'no greeting set'` and run it with and without `GREETING=hi`.
3. Install `dotenv` (`npm i dotenv`), create `.env` with `GREETING=from-file`, add `require('dotenv').config()` to the top of `server.js`. Add `.env` to `.gitignore`.
4. Write a `.env.example` for a project you already work on (fake values only).

---

## 9. Logs: stdout and stderr

### What it is
Every process has two output streams:
- **stdout** (standard output) — normal messages (`console.log`, `echo`, `print`)
- **stderr** (standard error) — errors and warnings (`console.error`)

On a server you can't watch the screen, so these streams are collected as **logs**. Railway captures both automatically; `railway logs` is how you'll read them. **Logs are your #1 debugging tool.**

### Good logging habits
- One line per event, with a level: `info`, `warn`, `error`.
- Include context: request path, user ID, request ID, how long it took.
- Prefer **JSON** lines in production so tools can filter them:
  ```json
  {"level":"error","msg":"payment failed","order_id":482,"duration_ms":1203}
  ```
- **Never** log passwords, tokens or card numbers.
- When reading logs, start **from the top** of the error, not the last line.

### Commands to learn
```bash
node server.js > out.log 2> err.log    # split stdout and stderr into files
node server.js > all.log 2>&1          # both into one file
node server.js 2>&1 | tee all.log      # see it live AND save it
tail -f all.log                        # follow a log live
grep -i error all.log                  # find errors
grep -c "GET /" all.log                # count requests
```

### ✅ What you can do
1. Add `console.error('something bad')` to `server.js` on the `/boom` route. Run with `> out.log 2> err.log`, hit `/` and `/boom` with curl, then check which file each line landed in.
2. Make the server log one JSON line per request with method, path, status and duration.
3. With `tail -f` running, send 20 requests in a loop and watch them arrive:
   ```bash
   for i in $(seq 1 20); do curl -s localhost:3000/ > /dev/null; done
   ```

---

## 10. Containers and images (Docker)

### What it is
- An **image** is a packaged, read-only snapshot of an app *plus everything it needs*: OS libraries, language runtime, dependencies, your code, and the start command.
- A **container** is a running instance of an image — basically an isolated process.
- A **Dockerfile** is the recipe for building an image.

Why it matters: "it works on my machine" goes away, because the same image runs identically everywhere. **Railway turns every service into a container**, either by building an image for you (with its builder, Railpack) or from your Dockerfile.

Key properties:
- Containers are **disposable**. When they're replaced, files written inside them are **lost**. That's why uploads need a volume or bucket.
- A container only sees ports you **publish** (`-p host:container`).
- Config goes in through **environment variables** (`-e`).

### Commands to learn
```bash
docker run hello-world                        # first test
docker run -d -p 8080:80 --name web nginx     # run nginx in the background
docker ps                                     # running containers
docker ps -a                                  # including stopped ones
docker logs web                               # its stdout/stderr
docker logs -f web                            # follow live
docker exec -it web sh                        # shell INSIDE the container
docker stop web && docker rm web              # stop and remove
docker images                                 # local images
docker build -t myapp .                       # build an image from a Dockerfile
docker run -p 3000:3000 -e PORT=3000 myapp    # run your image
```

### ✅ What you can do
1. Run nginx, open `localhost:8080`, read its logs with `docker logs`, then go inside with `docker exec -it web sh` and run `ls /usr/share/nginx/html`.
2. Inside that container, create a file (`echo hi > /tmp/test.txt`). Run `docker rm -f web`, start a new nginx container, and check — the file is gone. **This is why containers need volumes for persistent data.**
3. Containerize your `server.js`. Create a `Dockerfile`:
   ```dockerfile
   FROM node:20-slim
   WORKDIR /app
   COPY server.js .
   ENV PORT=3000
   CMD ["node", "server.js"]
   ```
   Then:
   ```bash
   docker build -t hello-server .
   docker run -p 3000:3000 hello-server
   docker run -p 4000:5000 -e PORT=5000 hello-server   # map host 4000 → container 5000
   ```
   Explain to yourself why the second command works on `localhost:4000`.
4. Stop the container with `docker stop` and watch whether your SIGTERM handler (Section 3) runs.

---

## 11. Databases

### What it is
A **database** is a separate server process that stores data safely and lets many app processes read/write it at once. Your app connects to it over the network using a **connection URL** (host, port, user, password, database name).

| Type | Examples | Good for |
|---|---|---|
| Relational (SQL) | PostgreSQL, MySQL | Users, orders, bookings — structured data with relationships |
| Key-value / cache | Redis | Sessions, caching, job queues |
| Document | MongoDB | Flexible JSON-like data |

Core ideas:
- **Tables, rows, columns**; **primary key** (unique ID); **index** (makes lookups fast).
- **Migrations**: versioned scripts that change the schema (add a column, create a table). Run once per deploy, in order.
- **Connections are limited** (Postgres default: 100). Each app instance opens a **pool** of them.
- **Backups**: a copy of the data. A backup you've never restored is not a real backup.
- **Public vs private access**: databases should only be reachable by your app, not the whole internet.

### Commands to learn
```bash
# start a local Postgres
docker run -d --name pg -e POSTGRES_PASSWORD=dev -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16

# connect
psql postgresql://postgres:dev@localhost:5432/postgres
```

Inside `psql`:
```sql
\l                         -- list databases
\dt                        -- list tables
\d bookings                -- describe a table
\q                         -- quit

CREATE TABLE bookings (id SERIAL PRIMARY KEY, name TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());
INSERT INTO bookings (name) VALUES ('Sagar'), ('Sudin');
SELECT * FROM bookings;
UPDATE bookings SET name = 'Sagar K' WHERE id = 1;
DELETE FROM bookings WHERE id = 2;
SHOW max_connections;
SELECT count(*) FROM pg_stat_activity;   -- current connections
```

Backup and restore:
```bash
pg_dump  postgresql://postgres:dev@localhost:5432/postgres -Fc -f backup.dump
pg_restore --clean -d postgresql://postgres:dev@localhost:5432/postgres backup.dump
```

### ✅ What you can do
1. Start Postgres in Docker, create the `bookings` table, insert 5 rows.
2. **Backup drill:** `pg_dump` the database, `DELETE FROM bookings;`, then `pg_restore` and confirm all 5 rows are back. Time it.
3. **Persistence drill:** `docker rm -f pg`, start it again **with the same `-v pgdata:...`** — data survives. Start it **without** the volume — data is gone. (This is exactly how Railway databases work: an image + a volume.)
4. Connect `server.js` to the database using `DATABASE_URL` from an environment variable (`npm i pg`) and make `/bookings` return the rows as JSON.
5. Optional: run Redis (`docker run -d -p 6379:6379 redis`) and try `redis-cli SET hello world` / `GET hello`.

---

## 12. Putting it together: mini project

Build a tiny "Bookings" app that uses **every concept** from this guide. When it works, you're ready for Stage 1.

**Requirements**
- [ ] Listens on `process.env.PORT`, bound to `::` (Sections 4, 8)
- [ ] `GET /` returns HTML; `GET /bookings` returns JSON from Postgres; unknown paths → 404 (Sections 5, 11)
- [ ] `GET /health` returns 200 only if `SELECT 1` succeeds, otherwise 503 (Sections 5, 11)
- [ ] Reads `DATABASE_URL` from env and exits with an error if it's missing (Section 8)
- [ ] Logs one JSON line per request; errors go to stderr (Section 9)
- [ ] Handles `SIGTERM`: stops accepting requests, closes the DB pool, exits 0 (Section 3)
- [ ] Has a `Dockerfile` and runs with `docker run -e DATABASE_URL=... -p 3000:3000` (Section 10)
- [ ] Has `.env.example`, `.env` in `.gitignore`, pushed to GitHub (Sections 2, 8)
- [ ] A `README.md` explaining how to run it

**Stretch goals**
- Run app + Postgres together with `docker compose` (one `compose.yaml`, two services). This mirrors a Railway project with two services very closely.
- Use `curl` in a loop to send 500 requests and watch `SELECT count(*) FROM pg_stat_activity;` while it runs.

This same app will be what you deploy in Stage 3, so the effort carries forward.

---

## 13. How each concept maps to Railway

| Concept | On your laptop | On Railway |
|---|---|---|
| Terminal | Your shell | Where the `railway` CLI runs |
| Process | `node server.js` | A **deployment** of a **service** |
| Exit code / signals | `echo $?`, `kill` | Restart policy; `SIGTERM` sent during deploys |
| Port | `localhost:3000` | Railway sets `PORT`; edge proxy forwards traffic to it |
| HTTP / status codes | `curl -I` | Same; 502 = your app isn't reachable on `PORT` |
| DNS | `dig` | `railway domain` + a CNAME at your DNS provider |
| HTTPS | Padlock, `openssl` | Certificates issued and renewed automatically |
| Env vars | `export`, `.env` | `railway variable set`, reference variables like `${{Postgres.DATABASE_URL}}` |
| Logs | `tail -f`, `> file.log` | `railway logs`, `railway logs --build` |
| Container | `docker run` | Every service is a container (built by Railpack or your Dockerfile) |
| Volume | `docker -v pgdata:...` | `railway volume add` |
| Database | Postgres in Docker, `psql` | `railway add --database postgres`, `railway connect` |
| Backup | `pg_dump` / `pg_restore` | Scheduled backups + point-in-time recovery |

---

## 14. Self-test

Answer without notes. If you can't, reread that section.

1. What's the difference between a process exiting with code 0 and code 1? Why does a platform care?
2. Your app works on `localhost` but returns 502 on the server. Name two likely causes.
3. What does `SIGTERM` mean, and what should your app do when it receives it?
4. Which DNS record type would you add to point `app.yourcompany.com` at a hosting platform?
5. You changed a DNS record an hour ago and some people still see the old site. Why?
6. Why must secrets be environment variables instead of code?
7. Read this URL and name each part: `mysql://admin:pa55@db.internal:3306/shop`
8. A user uploaded a photo, you redeployed, and the photo is gone. Why? What are two fixes?
9. What's the difference between a 401, a 403 and a 404?
10. What's the difference between an image and a container?
11. Why should a database not be reachable from the public internet?
12. You have a backup file. How do you know it actually works?

---

## 15. 3-day study schedule

| Day | Morning (~1 h) | Afternoon (~1 h) | Output |
|---|---|---|---|
| **1** | Sections 1–3: big picture, terminal, processes | Sections 4–5: ports, HTTP. Build `server.js` | `server.js` with 404/500 routes and SIGTERM handling |
| **2** | Sections 6–7: DNS and HTTPS on real company domains | Sections 8–9: env vars and logs | DNS notes for one company domain; JSON logging in `server.js` |
| **3** | Sections 10–11: Docker and Postgres, backup drill | Section 12 mini project + self-test | Bookings app on GitHub, Dockerised, all checkboxes ticked |

**Keep a `notes.md`** as you go: every command you ran, what it did, and every error you hit and how you fixed it. That file becomes the start of your server runbook.

**Next:** Stage 1 — install the Railway CLI and log in (`railway login`, `railway whoami`).
