---
title: curl
description: Talking to servers from the terminal, with color types and AI prompts.
---

`curl` is a browser without the screen. A browser sends a request and draws the page it gets back. `curl` sends the same request and prints the raw reply as text. That makes it the fastest way to answer "is my server alive, and what is it saying?"

```
curl ──request──▶ server (localhost:3000, or a Railway URL)
     ◀──reply──── status code + headers + body
```

Real-world use:
- Checking whether a client's site or API is up, without opening a browser.
- Testing an API endpoint (login, contact form, webhook) before the front-end exists.
- Seeing the exact status code and headers when a page breaks: 404, 500, 502 or a redirect loop.
- Checking a fresh Railway deploy straight away: `curl -I https://myapp.up.railway.app`.

Each command has a color type: 🟢 VIEW (looks only) · 🔵 CREATE (makes something new) · 🟡 EDIT (changes part) · 🟠 UPDATE (replaces as a whole) · 🔴 DELETE (removes; Claude warns first).

New words:
- **Request:** what curl sends: a method (`GET`, `POST`, ...), a URL, headers, and sometimes a body.
- **Response (reply):** what the server sends back.
- **Status code:** a 3-digit result at the top of the reply. `200` = OK, `404` = not found, `500` = the server's code broke. [Full list in Day 01](/days/day-01/#status-codes-you-must-know).
- **Headers:** labels on the request or reply, like the writing on the outside of an envelope (`Content-Type`, `Date`, ...).
- **Body:** the actual content inside the envelope (`hi`, a web page, JSON).

## Practice server

Every example below can be run against the mini server from [Day 01, Example 1](/days/day-01/#example-1-a-real-mini-web-server). Start it in terminal 1:

```bash
node -e "require('http').createServer((q,s)=>{console.log(q.method,q.url);s.end('hi\n')}).listen(3000)"
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Start a tiny Node web server on port 3000 that replies 'hi' and logs each request"</aside>

Then run curl in terminal 2 and watch terminal 1 log each visit.

## Looking (GET)

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `curl localhost:3000` | 🟢 VIEW | Shows only the reply body | "Send a request to my local server on port 3000" |
| `curl -i localhost:3000` | 🟢 VIEW | Body plus status code and headers | "Show the status code and headers from my local server" |
| `curl -I localhost:3000` | 🟢 VIEW | Status code and headers only, no body | "Show only the headers from my local server" |
| `curl -v localhost:3000` | 🟢 VIEW | The whole conversation: what curl sent and what came back | "Show the full request and response for my local server" |
| `curl -L http://github.com` | 🟢 VIEW | Follows redirects (`301`/`302`) to the final page | "Fetch github.com over http and follow the redirect" |
| `curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" localhost:3000` | 🟢 VIEW | Prints only the status code and how long it took | "What status code does my server return, and how fast?" |

### Reading `curl -i` output

```text
HTTP/1.1 200 OK                      ← status code: it worked
Date: Tue, 17 Nov 2026 10:00:00 GMT  ← headers: info about the reply
Content-Length: 3
                                     ← blank line = headers end here
hi                                   ← body: the actual content
```

## Sending (POST, PATCH, PUT, DELETE)

The method tells the server what I want to do. The server decides what actually happens: my practice server ignores the method and always says `hi`, but terminal 1 shows that a different method arrived.

| Command | Type | What it does | AI prompt |
| --- | --- | --- | --- |
| `curl -X POST -H "Content-Type: application/json" -d '{"name":"Sagar"}' localhost:3000/users` | 🔵 CREATE | Sends JSON asking the server to create something | "Send a POST to /users with name Sagar as JSON" |
| `curl -X PATCH -H "Content-Type: application/json" -d '{"name":"Sagar K"}' localhost:3000/users/1` | 🟡 EDIT | Asks to change one field of user 1 | "Change user 1's name with a PATCH" |
| `curl -X PUT -H "Content-Type: application/json" -d '{"name":"Sagar K","city":"Kathmandu"}' localhost:3000/users/1` | 🟠 UPDATE | Asks to replace user 1 completely | "Replace user 1 with a PUT request" |
| `curl -X DELETE localhost:3000/users/1` | 🔴 DELETE | Asks the server to remove user 1 | "Delete user 1 with a DELETE request" |

Flags in plain words:
- `-X POST`: which method to use (default is `GET`).
- `-H "..."`: add a header. `Content-Type: application/json` tells the server "the body is JSON".
- `-d '...'`: the body (data) to send. Using `-d` alone already switches to `POST`.

> ⚠️ On a real app, a 🔴 `DELETE` request really deletes data. Only send it to my own practice server.

## When curl fails

| Error | What it means | Check |
| --- | --- | --- |
| `Failed to connect ... Connection refused` | Nothing is listening on that port: the app is stopped or crashed | `lsof -i :3000` |
| `Could not resolve host` | The domain name doesn't exist or is misspelled (DNS problem) | Spelling of the URL |
| `404` in the status line | The server is up, but that path doesn't exist | The path after the domain |
| `500` in the status line | The server is up, but its code threw an error | The app's logs |
| `502` on a Railway URL | Railway's proxy couldn't reach my app (crashed, wrong port, still starting) | `railway logs` |
