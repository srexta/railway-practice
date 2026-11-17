---
title: "Day 01 — Server basics"
description: The ten concepts every server error message assumes you know, learned on my own laptop before touching Railway.
sidebar:
  order: -1
---

A beginner's study guide to the ten concepts every server error message assumes you know.
Study time: **2–3 days at ~2 hours/day**. Everything below runs on your own laptop; no Railway account needed yet.

### Command colors

Every command here has a color type and an **AI prompt**, the plain-English request I give Claude to run it.

| Color | Type | Like HTTP | Meaning |
| --- | --- | --- | --- |
| 🟢 | **VIEW** | GET | Only looks. Changes nothing. Safe anytime. |
| 🔵 | **CREATE** | POST | Makes something new: a file, process, container or row. |
| 🟡 | **EDIT** | PATCH | Changes one part of something that exists. |
| 🟠 | **UPDATE** | PUT | Replaces, redeploys or syncs something as a whole. |
| 🔴 | **DELETE** | DELETE | Removes, stops or discards. **Can't be undone.** Claude warns me first. |

Do the exercises in a practice folder **outside** this site's repo:

```bash
mkdir -p ~/playground/day01 && cd ~/playground/day01
```

> 🔵 **CREATE** · AI prompt: "Make a practice folder ~/playground/day01 and move into it"

> **Commands in this file** work on macOS and Linux. On Windows, install **WSL** (Windows Subsystem for Linux) first (`wsl --install` in PowerShell as admin) and run everything inside the Ubuntu terminal it gives you.

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

> 🟢 **VIEW** · AI prompt: "Check which of these tools are installed: git, node, docker, curl, dig, psql"

Install `psql`:
- macOS: `brew install libpq && brew link --force libpq`
- Ubuntu/WSL: `sudo apt install postgresql-client`

> 🔵 **CREATE** · AI prompt: "Install the psql client on my Mac"

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
| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `pwd` | 🟢 VIEW | Shows which folder I'm in | "Which folder am I in?" |
| `ls -la` | 🟢 VIEW | Lists files, including hidden ones like `.env` | "List all files here, including hidden ones" |
| `cd ~/projects` | 🟢 VIEW | Moves into a folder | "Go into my projects folder" |
| `cd ..` | 🟢 VIEW | Goes up one folder | "Go up one folder" |
| `mkdir playground` | 🔵 CREATE | Makes a folder | "Make a folder called playground" |
| `touch notes.md` | 🔵 CREATE | Makes an empty file | "Create an empty notes.md" |
| `cat notes.md` | 🟢 VIEW | Prints a file | "Show me what's in notes.md" |
| `less bigfile.log` | 🟢 VIEW | Scrolls a big file (`q` to quit) | "Let me scroll through bigfile.log" |
| `head -n 20 file.log` | 🟢 VIEW | First 20 lines | "Show the first 20 lines of file.log" |
| `tail -n 20 file.log` | 🟢 VIEW | Last 20 lines | "Show the last 20 lines of file.log" |
| `tail -f file.log` | 🟢 VIEW | Follows a file live (Ctrl+C to stop) | "Watch file.log live as new lines arrive" |
| `grep "error" file.log` | 🟢 VIEW | Finds lines containing "error" | "Find every line with 'error' in file.log" |
| `cp a.txt b.txt` | 🔵 CREATE | Copies a file (**overwrites** `b.txt` if it exists) | "Copy a.txt to b.txt" |
| `mv a.txt old/a.txt` | 🟡 EDIT | Moves or renames a file | "Move a.txt into the old folder" |
| `rm b.txt` | 🔴 DELETE | Deletes a file. No recycle bin! | "Delete b.txt" |
| `which node` | 🟢 VIEW | Shows where a program is installed | "Where is node installed?" |
| `history` | 🟢 VIEW | Lists commands I've run | "Show my recent commands" |
| `man ls` | 🟢 VIEW | Opens the manual for a command (`q` to quit) | "Explain the ls command and its options" |

### Keyboard shortcuts
- `Tab` — autocomplete file and command names
- `↑` / `↓` — previous commands
- `Ctrl+C` — stop the running command
- `Ctrl+R` — search your command history
- `Ctrl+L` — clear the screen

### ✅ What you can do (exercises)
1. Create `~/playground/day01`, move into it, create three files, list them, rename one, delete one.
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
| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `ps aux` | 🟢 VIEW | Lists all running processes | "Show all running processes" |
| `ps aux \| grep node` | 🟢 VIEW | Only the node processes | "Show me every running node process" |
| `top` | 🟢 VIEW | Live CPU/memory view (`q` to quit) | "What's using the most CPU and memory right now?" |
| `kill 12345` | 🔴 DELETE | Asks process 12345 to stop (SIGTERM) | "Stop process 12345 gracefully" |
| `kill -9 12345` | 🔴 DELETE | Force-stops process 12345 (SIGKILL), last resort | "Force-kill process 12345" |
| `echo $?` | 🟢 VIEW | Exit code of the last command | "What was the exit code of the last command?" |

### ✅ What you can do
1. Start a process that runs forever:
   ```bash
   node -e "console.log('pid', process.pid); setInterval(()=>{}, 1000)"
   ```
   > 🔵 **CREATE** · AI prompt: "Start a node process that runs forever and prints its PID"
   In a **second terminal**, find it with `ps aux | grep node`, then `kill <pid>`. Watch the first terminal stop.
2. Exit codes:
   ```bash
   node -e "process.exit(0)"; echo $?   # 0
   node -e "process.exit(1)"; echo $?   # 1
   ls /does-not-exist; echo $?          # non-zero
   ```
   > 🟢 **VIEW** · AI prompt: "Run a command that succeeds and one that fails, and show me their exit codes"
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
   > 🔵 **CREATE** · AI prompt: "Create graceful.js that shuts down cleanly on Ctrl+C or SIGTERM, and run it"

   This is exactly the pattern your apps need on Railway so deploys don't cut off requests.

### Example 1: a real mini web server

The dummy process above just sits there. This one is a real server: it opens port 3000 (a numbered "door" on my computer), waits for visitors, and answers "hi". It's the same thing my apps will do on Railway, just tiny.

Think of it as opening a tiny shop: the port is the door, a request is a customer knocking, the reply is me answering.

**Step 1: start the server (terminal 1).** Paste as one line:

```bash
node -e "require('http').createServer((q,s)=>{console.log(q.url);s.end('hi\n')}).listen(3000)"
```

> 🔵 **CREATE** · AI prompt: "Start a tiny Node web server on port 3000 that replies 'hi'"

Nothing prints and the prompt doesn't come back. That's normal: the server is running and waiting.

**Step 2: visit it (terminal 2).**

```bash
curl localhost:3000
```

> 🟢 **VIEW** · AI prompt: "Send a request to my local server on port 3000"

It printed `hi`. Terminal 1 printed `/`, the server logging my visit. `localhost` means "this same computer".

**Step 3: find who owns port 3000.**

```bash
lsof -i :3000
```

> 🟢 **VIEW** · AI prompt: "Which process is using port 3000?"

The `PID` column is the server's process ID, the number the computer gives every running program.

**Step 4: stop it, then try again.**

```bash
kill <PID>
curl localhost:3000
```

> 🔴 **DELETE** · AI prompt: "Stop the process on port 3000 and check it's gone"

The second curl fails with `Connection refused`, which means nobody is behind that door anymore. On a real server, this error usually means the app crashed or isn't running.

**What broke:**

| Problem | Cause | Fix |
| --- | --- | --- |
| `SyntaxError: Invalid or unexpected token` | My first, longer command wrapped when I copied it, so a line break landed inside the `'...'` text. JavaScript text in quotes must stay on one line. | Used the shorter one-line command above. |

**What I learned:** a server is just a program that keeps running and listens on a port. `curl` knocks on the door, `lsof -i :PORT` tells me who's behind it, and `kill` closes it. `Connection refused` = nothing is listening.

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
| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `lsof -i :3000` | 🟢 VIEW | What's using port 3000? | "Which process is using port 3000?" |
| `lsof -i -P \| grep LISTEN` | 🟢 VIEW | Everything that's listening on a port | "Show everything listening on a port" |
| `nc -zv localhost 5432` | 🟢 VIEW | Is anything listening on 5432? | "Is anything running on port 5432?" |

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

   > 🔵 **CREATE** · AI prompt: "Create server.js that reads PORT from the environment, and start it"
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
| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `curl https://example.com` | 🟢 VIEW | GET: fetches the page body | "Fetch example.com" |
| `curl -I https://example.com` | 🟢 VIEW | Headers only | "Show only the headers from example.com" |
| `curl -v https://example.com` | 🟢 VIEW | Everything, including the TLS handshake | "Show the full request and response for example.com" |
| `curl -L http://github.com` | 🟢 VIEW | Follows redirects | "Fetch github.com over http and follow the redirect" |
| `curl -X POST -H "Content-Type: application/json" -d '{"name":"Sagar"}' localhost:3000/hello` | 🔵 CREATE | POST: sends JSON to create something | "Send a POST to /hello with name Sagar as JSON" |
| `curl -X PATCH -H "Content-Type: application/json" -d '{"name":"Sagar K"}' localhost:3000/users/1` | 🟡 EDIT | PATCH: changes one field of user 1 | "Change user 1's name to Sagar K with a PATCH" |
| `curl -X PUT -H "Content-Type: application/json" -d '{"name":"Sagar K","city":"Kathmandu"}' localhost:3000/users/1` | 🟠 UPDATE | PUT: replaces user 1 completely | "Replace user 1 with a PUT request" |
| `curl -X DELETE localhost:3000/users/1` | 🔴 DELETE | DELETE: removes user 1 | "Delete user 1 with a DELETE request" |
| `curl -o /dev/null -s -w "%{http_code} %{time_total}s\n" https://example.com` | 🟢 VIEW | Just the status code and response time | "What status code does example.com return, and how fast?" |

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

   > 🟡 **EDIT** · AI prompt: "Make server.js return 404 for unknown paths and 500 on /boom, then test both with curl"

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
| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `dig example.com` | 🟢 VIEW | Full DNS answer | "Look up the DNS for example.com" |
| `dig +short example.com` | 🟢 VIEW | Just the IP (A record) | "What IP does example.com point to?" |
| `dig +short AAAA example.com` | 🟢 VIEW | IPv6 address | "What's the IPv6 address of example.com?" |
| `dig +short CNAME www.github.com` | 🟢 VIEW | Alias (CNAME) | "Is www.github.com a CNAME? Where does it point?" |
| `dig +short MX gmail.com` | 🟢 VIEW | Mail servers | "Which mail servers does gmail.com use?" |
| `dig +short TXT google.com` | 🟢 VIEW | Text records (verification, SPF) | "Show the TXT records for google.com" |
| `dig +short NS railway.com` | 🟢 VIEW | Which DNS provider runs the domain | "Who hosts the DNS for railway.com?" |
| `dig @1.1.1.1 example.com` | 🟢 VIEW | Ask a specific resolver (Cloudflare) | "Look up example.com using Cloudflare's 1.1.1.1" |
| `nslookup example.com` | 🟢 VIEW | Alternative lookup tool (also on Windows) | "Look up example.com with nslookup" |

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
| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `curl -vI https://example.com 2>&1 \| grep -iE "subject\|issuer\|expire"` | 🟢 VIEW | Who issued the certificate and when it expires | "Check the SSL certificate for example.com" |
| `echo \| openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \| openssl x509 -noout -subject -issuer -dates` | 🟢 VIEW | Same info, straight from the certificate | "Show the certificate issuer and expiry dates for example.com" |

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
| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `env` | 🟢 VIEW | All variables in this shell | "Show my environment variables" |
| `echo $HOME` | 🟢 VIEW | One variable | "What's the value of HOME?" |
| `export GREETING=hello` | 🔵 CREATE | Sets a variable for this terminal session | "Set GREETING to hello for this session" |
| `GREETING=hi node app.js` | 🔵 CREATE | Starts the app with a variable for that run only | "Run app.js with GREETING set to hi" |
| `unset GREETING` | 🔴 DELETE | Removes a variable | "Remove the GREETING variable" |

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
postgresql://postgres:******@postgres.railway.internal:5432/railway
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
| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `node server.js > out.log 2> err.log` | 🔵 CREATE | Runs the server, normal output → `out.log`, errors → `err.log` (**overwrites** both) | "Run server.js and save normal output and errors to separate files" |
| `node server.js > all.log 2>&1` | 🔵 CREATE | Both streams into one file | "Run server.js and save all output to all.log" |
| `node server.js 2>&1 \| tee all.log` | 🔵 CREATE | Shows output live **and** saves it | "Run server.js, show the output and save it to all.log" |
| `tail -f all.log` | 🟢 VIEW | Follows a log live | "Watch all.log live" |
| `grep -i error all.log` | 🟢 VIEW | Finds errors | "Find all errors in all.log" |
| `grep -c "GET /" all.log` | 🟢 VIEW | Counts requests | "How many GET requests are in all.log?" |

### ✅ What you can do
1. Add `console.error('something bad')` to `server.js` on the `/boom` route. Run with `> out.log 2> err.log`, hit `/` and `/boom` with curl, then check which file each line landed in.
2. Make the server log one JSON line per request with method, path, status and duration.
3. With `tail -f` running, send 20 requests in a loop and watch them arrive:
   ```bash
   for i in $(seq 1 20); do curl -s localhost:3000/ > /dev/null; done
   ```
   > 🟢 **VIEW** · AI prompt: "Send 20 requests to my local server"

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
| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker run hello-world` | 🔵 CREATE | First test: runs a tiny container | "Run Docker's hello-world test" |
| `docker run -d -p 8080:80 --name web nginx` | 🔵 CREATE | Starts nginx in the background on port 8080 | "Start an nginx container called web on port 8080" |
| `docker ps` | 🟢 VIEW | Running containers | "Which containers are running?" |
| `docker ps -a` | 🟢 VIEW | Including stopped ones | "List all containers, including stopped ones" |
| `docker logs web` | 🟢 VIEW | A container's stdout/stderr | "Show the logs of the web container" |
| `docker logs -f web` | 🟢 VIEW | Follows them live | "Follow the web container's logs live" |
| `docker exec -it web sh` | 🟢 VIEW | Opens a shell **inside** the container | "Open a shell inside the web container" |
| `docker stop web && docker rm web` | 🔴 DELETE | Stops and removes the container | "Stop and remove the web container" |
| `docker images` | 🟢 VIEW | Images on my machine | "List my Docker images" |
| `docker build -t myapp .` | 🔵 CREATE | Builds an image from the Dockerfile here | "Build a Docker image called myapp from this folder" |
| `docker run -p 3000:3000 -e PORT=3000 myapp` | 🔵 CREATE | Runs my image on port 3000 | "Run my myapp image on port 3000" |

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
   > 🔵 **CREATE** · AI prompt: "Build my server into a Docker image called hello-server and run it on port 3000"
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

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker run -d --name pg ... postgres:16` | 🔵 CREATE | Starts a local Postgres with a `pgdata` volume | "Start a local Postgres 16 in Docker with a volume" |
| `psql postgresql://postgres:dev@localhost:5432/postgres` | 🟢 VIEW | Connects to the database | "Connect to my local Postgres" |

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

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `\l`, `\dt`, `\d bookings` | 🟢 VIEW | List databases, list tables, describe a table | "Show the tables in my database" |
| `CREATE TABLE bookings (...)` | 🔵 CREATE | Makes a new table | "Create a bookings table with id, name and created_at" |
| `INSERT INTO bookings ...` | 🔵 CREATE | Adds rows (like POST) | "Add two bookings: Sagar and Sudin" |
| `SELECT * FROM bookings` | 🟢 VIEW | Reads rows (like GET) | "Show all bookings" |
| `UPDATE bookings SET name = ... WHERE id = 1` | 🟡 EDIT | Changes part of a row (like PATCH) | "Rename booking 1 to Sagar K" |
| `DELETE FROM bookings WHERE id = 2` | 🔴 DELETE | Removes rows. **Forgetting `WHERE` deletes every row.** | "Delete booking 2" |
| `SHOW max_connections` / `SELECT count(*) FROM pg_stat_activity` | 🟢 VIEW | Connection limit / connections in use | "How many database connections are in use?" |

Backup and restore:
```bash
pg_dump  postgresql://postgres:dev@localhost:5432/postgres -Fc -f backup.dump
pg_restore --clean -d postgresql://postgres:dev@localhost:5432/postgres backup.dump
```

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `pg_dump ... -Fc -f backup.dump` | 🔵 CREATE | Saves a backup file | "Back up my local Postgres to backup.dump" |
| `pg_restore --clean ... backup.dump` | 🔴 DELETE | **Wipes** the current data, then restores the backup | "Restore my local Postgres from backup.dump" |

### ✅ What you can do
1. Start Postgres in Docker, create the `bookings` table, insert 5 rows.
2. **Backup drill:** `pg_dump` the database, `DELETE FROM bookings;`, then `pg_restore` and confirm all 5 rows are back. Time it.
3. **Persistence drill:** `docker rm -f pg`, start it again **with the same `-v pgdata:...`** — data survives. Start it **without** the volume — data is gone. (This is exactly how Railway databases work: an image + a volume.)
4. Connect `server.js` to the database using `DATABASE_URL` from an environment variable (`npm i pg`) and make `/bookings` return the rows as JSON.
5. Optional: run Redis (`docker run -d -p 6379:6379 redis`) and try `redis-cli SET hello world` / `GET hello`.

---

## 12. Putting it together: mini project

Build a tiny "Bookings" app that uses **every concept** from this guide. When it works, you're ready to start on Railway.

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

This same app is what I'll deploy to Railway later, so the effort carries forward.

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

## 14. Check yourself

Answer without notes, out loud or in your journal. If you can't, reread that section.

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

**Next:** install the Railway CLI and log in (`railway login`, `railway whoami`).
