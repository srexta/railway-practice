---
title: "Docker 04 — My first Dockerfile"
description: Write a Dockerfile for a tiny Node app, build an image and run it.
sidebar:
  label: 04 · My first Dockerfile
  order: 4
---

**Time:** 1 hour · **Goal:** my own app, packaged as my own image, answering on `localhost:3000`.

A Dockerfile is a recipe written as numbered steps: "start from this base, copy these files, install this, then run that". `docker build` follows the recipe and saves the result as an image. Each step is saved as a **layer** (a snapshot), so if a step and everything before it hasn't changed, Docker reuses the saved snapshot instead of redoing it. That's the **build cache**.

## The app

```bash
mkdir -p ~/Desktop/vibe-projects/docker-playground/hello && cd $_
npm init -y
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Make a docker-playground/hello folder with a package.json"</aside>

`server.js`:

```js
const http = require('node:http');
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  console.log(req.method, req.url);
  res.end(`Hello from a container! Greeting: ${process.env.GREETING || 'none'}\n`);
}).listen(port, () => console.log(`listening on ${port}`));
```

In `package.json`, set `"scripts": { "start": "node server.js" }`.

## The Dockerfile

```dockerfile
# 1. Base image: Linux + Node 22, small "alpine" version
FROM node:22-alpine

# 2. Folder inside the image where my app lives
WORKDIR /app

# 3. Copy only the package files first (better caching)
COPY package*.json ./

# 4. Install dependencies (production only)
RUN npm ci --omit=dev

# 5. Now copy the rest of my code
COPY . .

# 6. Note which port the app uses (documentation only)
EXPOSE 3000

# 7. The command that runs when a container starts
CMD ["node", "server.js"]
```

`.dockerignore` (files `COPY . .` should skip, like `.gitignore`):

```text
node_modules
.git
.env
```

## How `docker build` works

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or diamond to see what it means.</p><div class="dm-zone "><span class="dm-zt">📝 Build: docker build -t hello:1 .</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📤</span><span class="dm-tt"><b>Send the build context</b><small>the "." at the end</small></span></summary><div class="dm-body"><p class="dm-plain">The <code>.</code> means "this folder". Docker packs it up (minus <code>.dockerignore</code> entries) and hands it to the engine. Only these files can be <code>COPY</code>'d.</p><p><code>-t hello:1</code> tags the result: name <code>hello</code>, version <code>1</code>.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🧱</span><span class="dm-tt"><b>FROM node:22-alpine</b><small>base layer</small></span></summary><div class="dm-body"><p class="dm-plain">Start from an existing image so I don't install Linux and Node myself. <code>alpine</code> is a tiny Linux, so the image stays small.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Did package*.json change?</summary><div class="dm-qb"><p>For each step, Docker asks: did this step or its files change since last build? If not, it reuses the saved layer (shown as <code>CACHED</code>). Copying package files before the code means a code-only change skips <code>npm ci</code>, which is the slow part.</p></div></details><div class="dm-no ">no</div><div class="dm-end dm-fix">⚡ <code>CACHED</code>: skip npm ci, seconds instead of minutes</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📥</span><span class="dm-tt"><b>RUN npm ci</b><small>install dependencies</small></span></summary><div class="dm-body"><p class="dm-plain"><code>RUN</code> executes a command during the build and saves the result. <code>npm ci</code> installs exactly what <code>package-lock.json</code> says.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Did every step succeed?</summary><div class="dm-qb"><p>If any <code>RUN</code> command fails, the build stops there and no image is made.</p></div></details><div class="dm-no ">no</div><div class="dm-end">❌ Build fails: read the red error under the failing step, fix, build again</div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><div class="dm-ok">✅ Image hello:1 saved</div></div></div><div class="dm-merge"><div class="dm-link" style="height:1.4rem"></div></div><div class="dm-zone dm-z-st"><span class="dm-zt">▶️ Run: docker run -p 3000:3000 hello:1</span><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🚀</span><span class="dm-tt"><b>CMD runs</b><small>node server.js</small></span></summary><div class="dm-body"><p class="dm-plain"><code>CMD</code> is not run during the build. It's the default command every new container starts with.</p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-q"><summary><span class="dm-dia"></span>Does the app listen on 0.0.0.0?</summary><div class="dm-qb"><p>Inside a container, an app listening only on <code>127.0.0.1</code> can't be reached from outside, even with <code>-p</code>. Node's <code>listen(port)</code> uses all addresses by default, so it's fine. Some frameworks need <code>--host 0.0.0.0</code>.</p></div></details><div class="dm-no ">no</div><div class="dm-end dm-fix">🔁 "Connection reset": make the app listen on <code>0.0.0.0</code></div></div><div class="dm-row"><div class="dm-link" data-l="yes"></div></div><div class="dm-row"><div class="dm-ok">✅ localhost:3000 answers</div></div></div></div>

## Steps

### 1. Build the image

```bash
docker build -t hello:1 .
docker images hello
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Build a Docker image from this folder and tag it hello:1"</aside>

### 2. Run it

```bash
docker run -d --name hello -p 3000:3000 hello:1
curl http://localhost:3000
docker logs hello
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Run my hello:1 image on port 3000 and call it"</aside>

### 3. Change code, rebuild, watch the cache

Edit the message in `server.js`, then:

```bash
docker build -t hello:2 .
docker rm -f hello
docker run -d --name hello -p 3000:3000 hello:2
curl http://localhost:3000
```

<aside class="ai-prompt ai-update"><strong class="ai-update">🟠 UPDATE</strong> AI prompt: "Rebuild my app as hello:2 and replace the running hello container with it"</aside>

In the build output, the `npm ci` step says `CACHED`. A running container never picks up new code by itself: rebuild the image, then replace the container.

### 4. Look at the layers

```bash
docker history hello:2
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show the layers of the hello:2 image and their sizes"</aside>

## Dockerfile instructions

| Instruction | Plain meaning |
| --- | --- |
| `FROM` | The base image to start from |
| `WORKDIR` | Make and switch into this folder |
| `COPY` | Copy files from my folder into the image |
| `RUN` | Run a command at build time, save the result |
| `ENV` | Set a default environment variable |
| `EXPOSE` | Note the app's port (doesn't open anything) |
| `CMD` | The default command when a container starts |

## Commands in this lesson

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `docker build -t <name>:<tag> .` | 🔵 CREATE | Builds an image from the Dockerfile here | "Build this folder as hello:1" |
| `docker history <image>` | 🟢 VIEW | Lists an image's layers | "Show the layers of hello:2" |
| `docker tag <img> <new>` | 🔵 CREATE | Gives an image another name | "Also tag hello:2 as hello:latest" |

## Done when

- [ ] `hello:1` answers on `localhost:3000`
- [ ] I've seen `CACHED` on the `npm ci` step
- [ ] I can explain the difference between `RUN` and `CMD`

## At the agency

- Copy `package*.json` before the code in every Node Dockerfile. It makes rebuilds fast.
- `.dockerignore` must list `.env`, or the client's secrets end up inside the image.
