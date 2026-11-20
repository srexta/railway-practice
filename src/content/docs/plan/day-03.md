---
title: "Plan: Day 03 — First deploy"
description: Put a small Node app on the internet with Railway, read its logs, and take it down again.
sidebar:
  label: Day 03 — First deploy
  order: 3
---

**Time:** about 2 hours · **Cost:** a little trial credit · **Goal:** my app answering on a public `*.up.railway.app` URL.

Deploying is like sending a recipe to a restaurant kitchen. I send the recipe (my code), the kitchen prepares it (**build**), then starts serving it (**deploy**). A deployment is one batch; a redeploy cooks the same recipe again.

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or ⓘ to see what it means.</p><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📁</span><span class="dm-tt"><b>My folder <span class="dm-badge dm-you">you</span></b><small>server.js · package.json</small></span></summary><div class="dm-body"><p class="dm-plain">The code on my laptop. <code>package.json</code> tells Railway it's a Node app and which command starts it (<code>npm start</code>).</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">⬆️</span><span class="dm-tt"><b>Upload <span class="dm-badge dm-you">you</span></b><small>railway up</small></span></summary><div class="dm-body"><p class="dm-plain"><code>railway up</code> zips up this folder and sends it to Railway. Add <code>--detach</code> to get the terminal back straight away instead of watching the build.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🔨</span><span class="dm-tt"><b>BUILD <span class="dm-badge dm-auto">auto</span></b><small>Railpack finds Node</small></span></summary><div class="dm-body"><p class="dm-plain">The kitchen prepares the recipe. <b>Railpack</b> (Railway's builder) looks at my files, sees Node, installs the dependencies and packs everything into an <b>image</b>: a sealed, ready-to-run copy of the app.</p><p>Build problems show up in <code>railway logs --build</code>.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Build succeeded?</summary><div class="dm-qb"><p>Missing file, wrong Node version, a typo in <code>package.json</code>: any of these stops the build before anything runs.</p></div></details><div class="dm-no ">no</div><div class="dm-end ">❌ Build failed<small>read <code>railway logs --build</code></small></div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">▶️</span><span class="dm-tt"><b>DEPLOY <span class="dm-badge dm-auto">auto</span></b><small>container runs npm start</small></span></summary><div class="dm-body"><p class="dm-plain">Railway starts the image as a <b>container</b> (an isolated running copy) and runs the start command. The app must listen on the port Railway gives it in the <code>PORT</code> variable.</p><p>What the app prints shows up in <code>railway logs</code>.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Healthy?</summary><div class="dm-qb"><p>Does the app start and keep running, and does it answer on <code>PORT</code>? If it crashes, or listens on the wrong port, Railway marks the deployment failed or crashed.</p></div></details><div class="dm-no ">no</div><div class="dm-end ">❌ Failed / crashed<small>read <code>railway logs</code></small></div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><div class="dm-ok">✅ Live on <code>*.up.railway.app</code></div></div></div>

## The app I'll deploy

The Day 01 mini server, upgraded to read the port Railway gives it. Railway sets a variable called `PORT` and the app **must** listen on it. Forgetting this is the most common first-deploy mistake.

```js
// server.js
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  console.log(req.method, req.url);
  if (req.url === '/health') return res.end('ok');
  res.end(`hi from ${process.env.GREETING || 'railway'}\n`);
}).listen(port, () => console.log('listening on', port));
```

```json
{ "name": "hello", "scripts": { "start": "node server.js" } }
```

## Steps

### 1. Run it locally first

```bash
npm start
curl localhost:3000
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Start my hello app locally and curl it"</aside>

If it doesn't work on my laptop, it won't work on Railway.

### 2. Deploy the folder

```bash
railway up
```

<aside class="ai-prompt ai-update"><strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Deploy this folder to Railway"</aside>

Uploads the folder, builds it and streams the logs. The first time, it creates a service for me. `--detach` starts the deploy and gives my terminal back.

### 3. Give it a public address

```bash
railway domain
curl https://<my-app>.up.railway.app
curl -I https://<my-app>.up.railway.app/health
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Generate a public Railway domain for my service and curl it"</aside>

With no name given, `railway domain` generates a free `*.up.railway.app` address with HTTPS already working.

### 4. Read the logs and deploy history

```bash
railway logs --build
railway logs -n 50
railway logs --http --status 404
railway deployment list
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show the build logs and the last 50 runtime logs for my service"</aside>

### 5. Change the code and ship again

```bash
# edit the reply text in server.js, then
railway up
railway redeploy   # rebuild the latest deploy again
railway restart    # restart it without rebuilding
```

<aside class="ai-prompt ai-update"><strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Redeploy my service, then restart it"</aside>

| Command | Sends new code? | Rebuilds? | Use it when |
| --- | --- | --- | --- |
| `railway up` | Yes | Yes | I changed the code |
| `railway redeploy` | No | Yes | A variable or setting changed |
| `railway restart` | No | No | The app is stuck |

### 6. Take the latest deploy down

```bash
railway status
railway down
```

<aside class="ai-prompt ai-delete"><strong class="ai-delete">🔴 DELETE</strong> AI prompt: "Remove the latest deployment of my hello service"</aside>

Removes the most recent deployment, so the URL stops answering. `railway up` brings it back.

### 7. Three other ways to deploy

```bash
railway add --repo srexta/<a-small-repo>      # from GitHub, redeploys on every push
railway add --image nginx:alpine              # a ready-made Docker image
railway templates search umami                # browse one-click templates
railway deploy --template <template-name>     # provision one
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Add a service to playground that deploys from my GitHub repo"</aside>

## Break it on purpose

| Try this | What I'll see | What it teaches |
| --- | --- | --- |
| Hard-code `.listen(3000)` | Deploy succeeds, URL shows an error page | The app must listen on Railway's `PORT` |
| Delete the `start` script | Build or start fails | Railway needs to know how to start the app |
| Add `throw new Error('boom')` at the top | Crashes and restarts | Where crash messages show up in `railway logs` |

## Done when

- [ ] My app answers on a `*.up.railway.app` URL
- [ ] I broke it once and fixed it by reading the logs
- [ ] I can explain up vs redeploy vs restart vs down

## At the agency

- A client's Node or PHP backend, deployed from their GitHub repo.
- A quick preview link for a client with `railway up`, no GitHub needed.
