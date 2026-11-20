---
title: Docker tutorial — start here
description: A complete beginner Docker course I can come back to, from first container to deploying a Dockerfile on Railway.
sidebar:
  label: Overview
  order: 0
---

Docker is like a lunchbox. I pack my app plus everything it needs (the right Node version, libraries, settings) into one box. That box runs the same way on my laptop, a teammate's laptop and a Railway server. No more "it works on my machine".

This is a study course. When I actually practice a lesson, what really happened goes on a [Days](/days/day-01/) page.

## The words I need first

| Word | Plain meaning | Lunchbox version |
| --- | --- | --- |
| **Image** | A read-only package: an app plus everything it needs to run | The recipe and ingredients, sealed |
| **Container** | A running copy of an image | The meal cooked from the recipe |
| **Dockerfile** | A text file with the steps to build an image | The written recipe |
| **Registry** | An online library of images (Docker Hub is the main one) | The recipe shop |
| **Volume** | A storage folder that survives when a container is deleted | A fridge the meal can use |
| **Port mapping** | Connecting a port on my laptop to a port inside the container | A hatch in the box so food can come out |
| **Compose** | A file that starts several containers together | A full lunch order: main, side and drink |

## How the lessons build up

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card to see what that lesson covers.</p><div class="dm-zone "><span class="dm-zt">🧱 Basics</span><p class="dm-zi">Install Docker and learn to run other people's images.</p><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🐳</span><span class="dm-tt"><b>01 · Install and first container</b><small>docker --version · docker run hello-world</small></span></summary><div class="dm-body"><p class="dm-plain">Get Docker Desktop running and prove it works with a tiny test image.</p><p><b>Done when:</b> <code>docker run hello-world</code> prints "Hello from Docker!".</p><p><a href="/docker/01-install/">Open lesson →</a></p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📦</span><span class="dm-tt"><b>02 · Images and containers</b><small>pull · run · ps · stop · rm</small></span></summary><div class="dm-body"><p class="dm-plain">The full life of a container: download, start, look, stop, delete.</p><p><b>Done when:</b> I can start a container, find it, stop it and remove it.</p><p><a href="/docker/02-images-containers/">Open lesson →</a></p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🚪</span><span class="dm-tt"><b>03 · Ports, logs and going inside</b><small>-p 8080:80 · logs · exec</small></span></summary><div class="dm-body"><p class="dm-plain">Open a containerised web server in my browser, read its logs and step inside it.</p><p><b>Done when:</b> nginx loads at <code>localhost:8080</code>.</p><p><a href="/docker/03-ports-logs/">Open lesson →</a></p></div></details></div></div><div class="dm-merge"><div class="dm-link" style="height:1.4rem"></div></div><div class="dm-zone dm-z-st"><span class="dm-zt">🛠️ Build my own</span><p class="dm-zi">Package my own app and give it settings and storage.</p><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">📝</span><span class="dm-tt"><b>04 · My first Dockerfile</b><small>docker build · tags · layers</small></span></summary><div class="dm-body"><p class="dm-plain">Write the recipe for a tiny Node app, build an image and run it.</p><p><b>Done when:</b> my own image answers on <code>localhost:3000</code>.</p><p><a href="/docker/04-dockerfile/">Open lesson →</a></p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🗒️</span><span class="dm-tt"><b>05 · Environment variables</b><small>-e · --env-file</small></span></summary><div class="dm-body"><p class="dm-plain">Change how the app behaves without rebuilding, and keep secrets out of images.</p><p><a href="/docker/05-env-vars/">Open lesson →</a></p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">💾</span><span class="dm-tt"><b>06 · Volumes and data</b><small>-v · named volumes · Postgres</small></span></summary><div class="dm-body"><p class="dm-plain">Keep database data alive after the container is deleted.</p><p><a href="/docker/06-volumes/">Open lesson →</a></p></div></details></div></div><div class="dm-merge"><div class="dm-link" style="height:1.4rem"></div></div><div class="dm-zone dm-z-gh"><span class="dm-zt">🚀 Real apps</span><p class="dm-zi">Run several containers together, clean up, and ship to Railway.</p><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🎼</span><span class="dm-tt"><b>07 · Docker Compose</b><small>app + database in one file</small></span></summary><div class="dm-body"><p class="dm-plain">Start my app and Postgres together with one command.</p><p><a href="/docker/07-compose/">Open lesson →</a></p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🧹</span><span class="dm-tt"><b>08 · Debugging and cleanup</b><small>inspect · system df · prune</small></span></summary><div class="dm-body"><p class="dm-plain">Find out why a container died, and free disk space safely.</p><p><a href="/docker/08-debug-cleanup/">Open lesson →</a></p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><details class="dm-node"><summary><span class="dm-ico">🚂</span><span class="dm-tt"><b>09 · Docker on Railway</b><small>Dockerfile → railway up</small></span></summary><div class="dm-body"><p class="dm-plain">Railway sees my Dockerfile and builds my app from it.</p><p><a href="/docker/09-railway/">Open lesson →</a></p></div></details></div><div class="dm-row"><div class="dm-link"></div></div><div class="dm-row"><div class="dm-ok">🎯 I can package any client app and run it anywhere</div></div></div></div>

## Ground rules

- Keep practice code in `~/Desktop/vibe-projects/docker-playground/`, not in this site's repo.
- Before any 🔴 DELETE command (`rm`, `rmi`, `prune`, `down -v`), run `docker ps -a` to see what will go.
- Never put real passwords or tokens inside a Dockerfile or image. Use env vars (lesson 05).
- When this tutorial disagrees with `docker <command> --help`, trust the help.
