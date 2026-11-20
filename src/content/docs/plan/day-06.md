---
title: "Plan: Day 06 — Networking"
description: Custom domains, the private network, TCP proxies, CDN, WAF and outbound IPs on Railway.
sidebar:
  label: Day 06 — Networking
  order: 6
---

**Time:** about 2 hours · **Needs:** a domain I own for the custom-domain part · **Goal:** my app on my own domain over HTTPS.

My **domain** is the shop's street address, **DNS** is the map that points the address to the shop, and **HTTPS** is the sealed envelope. The **private network** is the staff corridor between rooms that customers never see.

<div class="dm not-content"><p class="dm-zi" style="margin-bottom:.6rem">Click any card or ⓘ to see what it means.</p><div class="dm-lane"><span class="dm-lt">A visitor opens my site</span><div class="dm-h"><details class="dm-node"><summary><span class="dm-ico">🧑</span><span class="dm-tt"><b>Visitor</b><small>types railway.mydomain.com</small></span></summary><div class="dm-body"><p class="dm-plain">Someone opens my custom domain in a browser.</p></div></details><div class="dm-ha"><span>looks up</span></div><details class="dm-node"><summary><span class="dm-ico">🗺️</span><span class="dm-tt"><b>My DNS provider</b><small>CNAME record</small></span></summary><div class="dm-body"><p class="dm-plain">DNS is the map. A <b>CNAME</b> record says "this name is really that other name", pointing my domain at the Railway address <code>railway domain</code> gave me.</p></div></details><div class="dm-ha"><span>points to</span></div><details class="dm-node"><summary><span class="dm-ico">🛡️</span><span class="dm-tt"><b>Railway edge</b><small>HTTPS · CDN · WAF</small></span></summary><div class="dm-body"><p class="dm-plain">Railway's front door. It handles <b>HTTPS</b> (the certificate), <b>CDN</b> (caching files close to visitors) and <b>WAF</b> (a web firewall that blocks bad traffic).</p></div></details><div class="dm-ha"><span>forwards</span></div><details class="dm-node"><summary><span class="dm-ico">📦</span><span class="dm-tt"><b>hello</b><small>my app</small></span></summary><div class="dm-body"><p class="dm-plain">My app finally gets the request.</p></div></details><div class="dm-ha"><span>private · *.railway.internal</span></div><details class="dm-node"><summary><span class="dm-ico">🐘</span><span class="dm-tt"><b>Postgres</b></span></summary><div class="dm-body"><p class="dm-plain">App and database talk over the private network, which the internet can't reach.</p></div></details></div></div><div class="dm-lane"><span class="dm-lt">I open the database from a desktop tool</span><div class="dm-h"><details class="dm-node"><summary><span class="dm-ico">🖥️</span><span class="dm-tt"><b>Desktop DB tool <span class="dm-badge dm-you">you</span></b><small>TablePlus, DBeaver…</small></span></summary><div class="dm-body"><p class="dm-plain">A program on my laptop for browsing tables.</p></div></details><div class="dm-ha"><span>TCP proxy · host:port</span></div><details class="dm-node"><summary><span class="dm-ico">🐘</span><span class="dm-tt"><b>Postgres</b></span></summary><div class="dm-body"><p class="dm-plain">A <b>TCP proxy</b> gives the database a public host and port. TCP is the raw connection type databases use (not web pages).</p></div></details></div></div><div class="dm-lane"><span class="dm-lt">My app calls an API that only trusts known IPs</span><div class="dm-h"><details class="dm-node"><summary><span class="dm-ico">📦</span><span class="dm-tt"><b>hello</b></span></summary><div class="dm-body"><p class="dm-plain">My app making a request out to someone else.</p></div></details><div class="dm-ha"><span>outbound · static IP</span></div><details class="dm-node"><summary><span class="dm-ico">🏦</span><span class="dm-tt"><b>Client's payment / bank API</b><small>only allows known IPs</small></span></summary><div class="dm-body"><p class="dm-plain">Some APIs only accept requests from addresses on their allow list. A <b>static outbound IP</b> means my app always calls from the same address, so it can be added to that list.</p></div></details></div></div></div>

Traffic in (top), traffic between services (private), and traffic out (static IP).

## Steps

### 1. See my current domains

```bash
railway domain list
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "List the domains on my hello service"</aside>

### 2. Add a custom domain

```bash
railway domain railway.mydomain.com
# add the CNAME record it prints at my DNS provider, then:
railway domain status railway.mydomain.com
dig railway.mydomain.com CNAME +short
curl -I https://railway.mydomain.com
```

<aside class="ai-prompt ai-create"><strong class="ai-create">🔵 CREATE</strong> AI prompt: "Add railway.mydomain.com to my hello service and tell me the DNS record to create"</aside>

DNS changes can take minutes to hours. `domain status` says when DNS and the certificate are ready.

### 3. Explore the private network

```bash
railway private-network status
railway ssh -s hello
# inside the container:
getent hosts postgres.railway.internal
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show the private network address of my hello service"</aside>

Services in the same environment find each other by name. Nothing on the internet can reach these addresses.

### 4. Look at TCP proxies

```bash
railway tcp-proxy list -s Postgres
railway tcp-proxy create --help
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "List the TCP proxies on my Postgres service"</aside>

For tools that speak raw TCP, like a desktop database client. Each proxy is a door to the internet; close it when done.

### 5. Edge features: CDN and WAF

```bash
railway cdn status
railway cdn enable
railway cdn purge          # clear the cache after a change
railway waf under-attack --help
```

<aside class="ai-prompt ai-edit"><strong class="ai-edit">🟡 EDIT</strong> AI prompt: "Turn on CDN caching for my hello service"</aside>

The CDN keeps copies of pages close to visitors. "Under attack" mode makes visitors pass a check first, which helps during a flood of bad traffic.

### 6. Outbound traffic and network logs

```bash
railway outbound-network status
railway logs --http --status 500
railway logs --network
railway logs --dns
```

<aside class="ai-prompt ai-view"><strong class="ai-view">🟢 VIEW</strong> AI prompt: "Show the HTTP logs with status 500 for my hello service"</aside>

## Words for today

| Word | Plain meaning |
| --- | --- |
| CNAME | A DNS record that says "this name is really that other name" |
| Certificate | The proof that makes the browser show the padlock |
| CDN | Copies of my pages stored near visitors so they load faster |
| WAF | A guard that blocks obviously bad requests |
| TCP proxy | A public door straight to one port of a service |
| Static outbound IP | A fixed address my app's outgoing requests come from |

## Done when

- [ ] A custom domain loads over HTTPS
- [ ] I saw `*.railway.internal` resolve from inside a container
- [ ] I can explain CNAME, CDN and TCP proxy in plain words

## At the agency

- Pointing `api.clientsite.com` at a Railway service.
- A static outbound IP for a payment gateway or bank API that only accepts known IPs.
