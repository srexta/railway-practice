---
title: "Docker 09 — Docker on Railway"
description: Deploy my Dockerfile app to Railway, and run a ready-made Docker image as a service.
sidebar:
  label: 09 · Docker on Railway
  order: 9
---

**Time:** 1 hour · **Goal:** my `hello` app from lesson 04 runs on Railway from its Dockerfile.

Railway is a kitchen that will cook any recipe I send. If my folder has a `Dockerfile`, Railway follows it exactly, the same recipe I tested on my laptop. If there's no Dockerfile, Railway writes its own recipe for me (that builder is called **Railpack**). Either way, what runs on Railway is a container.

## From my folder to a live URL

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or diamond to see what it means.</p><div class="dm-zone "><span class="dm-zt">💻 My laptop</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">✅</span><span class="dm-tt"><b>Works locally first</b><small>docker build + docker run</small></span></summary><div class="dm-body"><p class="dm-plain">If it doesn't run in Docker on my Mac, it won't run on Railway. Test here first: it's faster and free.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📤</span><span class="dm-tt"><b>railway up</b><small>uploads the folder</small></span></summary><div class="dm-body"><p class="dm-plain">Sends my folder (minus <code>.gitignore</code>/<code>.railwayignore</code> entries) to Railway, like the build context in lesson 04.</p></div></details></div></div><div class="dm-merge"><div class="dm-link" style="height:1.4rem"></div></div><div class="dm-zone dm-z-st"><span class="dm-zt">🚂 Railway</span><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Is there a Dockerfile?</summary><div class="dm-qb"><p>Railway looks for <code>Dockerfile</code> in the root of the upload. The build logs say <code>Using Detected Dockerfile</code> when it finds one.</p></div></details><div class="dm-no ">no</div><div class="dm-end dm-fix">🧰 Railpack guesses how to build it</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🔨</span><span class="dm-tt"><b>Build the image</b><small>railway logs --build</small></span></summary><div class="dm-body"><p class="dm-plain">The same <code>docker build</code> steps, on Railway's machines (Linux, Intel/AMD CPU).</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Build succeeded?</summary><div class="dm-qb"><p>Same as locally: a failing <code>RUN</code> step stops the build. The old deployment keeps serving while I fix it.</p></div></details><div class="dm-no ">no</div><div class="dm-end">❌ Read <code>railway logs --build</code>, fix, <code>railway up</code> again</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">▶️</span><span class="dm-tt"><b>Run the container</b><small>Railway sets PORT</small></span></summary><div class="dm-body"><p class="dm-plain">Railway passes a <code>PORT</code> variable and sends web traffic to it. My app must read <code>process.env.PORT</code>, which the lesson 04 app already does. Railway variables are passed like <code>-e</code> in lesson 05.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Does the app listen on PORT and 0.0.0.0?</summary><div class="dm-qb"><p>If it hard-codes another port or listens only on 127.0.0.1, Railway can't reach it.</p></div></details><div class="dm-no ">no</div><div class="dm-end">❌ "Application failed to respond" (502)</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🌐</span><span class="dm-tt"><b>railway domain</b><small>*.up.railway.app</small></span></summary><div class="dm-body"><p class="dm-plain">Gives the service a public HTTPS address, the way <code>-p</code> opened it on my laptop.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><div class="dm-ok">✅ App live on Railway</div></div></div></div>

## Steps

Needs the Railway CLI logged in and the `playground` project (Railway week plan, Day 02).

### 1. Test the image locally the way Railway will run it

```bash
cd ~/Desktop/vibe-projects/docker-playground/hello
docker build --platform linux/amd64 -t hello:railway .
docker run --rm -p 3000:8080 -e PORT=8080 hello:railway
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Build my hello app for linux/amd64 and run it with PORT=8080 like Railway does"</aside>

### 2. Link the folder and deploy

```bash
railway link        # pick playground
railway up
```

<aside class="ai-prompt ai-update"><strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Link this folder to my playground project and deploy it to Railway"</aside>

### 3. Watch the build and the app

```bash
railway logs --build
railway logs
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show the Railway build logs, then the app logs"</aside>

Look for `Using Detected Dockerfile` in the build logs.

### 4. Give it a URL and a variable

```bash
railway domain
railway variable set GREETING=namaste
curl https://<my-domain>.up.railway.app
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Give my Railway service a public domain, set GREETING to namaste and call it"</aside>

Setting a variable triggers a new deployment with the new value.

### 5. Run a ready-made image instead of my code

In the Railway dashboard (or `railway add` and choose **Docker Image**), add a service from an image such as `nginx:1.27`. Railway pulls it from Docker Hub like `docker pull`, with no build step.

### 6. Compose on Railway

Railway doesn't run `compose.yaml` directly. Each Compose service becomes one Railway service: `app` from my Dockerfile, `db` from `railway add --database postgres`. Then `DATABASE_URL` comes from a Railway reference variable instead of `db:5432`.

## Docker → Railway translation

| On my laptop | On Railway |
| --- | --- |
| `docker build` | Build step of `railway up` |
| `docker run -e K=V` | `railway variable set K=V` |
| `-p 3000:3000` | `PORT` variable + `railway domain` |
| `docker logs` | `railway logs` |
| `docker exec -it … sh` | `railway ssh` |
| `-v pgdata:/data` | `railway volume add` |
| Compose service name `db` | Private network `db.railway.internal` |

## Done when

- [ ] Build logs show `Using Detected Dockerfile`
- [ ] My app answers on its `up.railway.app` URL
- [ ] Changing `GREETING` with `railway variable set` changed the response

## At the agency

- A Dockerfile in every client repo means the app builds the same on laptops, CI and Railway, and we can leave Railway later without rewriting anything.
- If Railpack builds an app fine, I don't need a Dockerfile. Add one when the app needs system packages, a specific OS, or an exact build recipe.
