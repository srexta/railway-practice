// Creates the next journal page: src/content/docs/journal/day-NN.md
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';

const dir = 'src/content/docs/journal';
mkdirSync(dir, { recursive: true });
const days = readdirSync(dir).map((f) => f.match(/^day-(\d+)\.md$/)?.[1]).filter(Boolean).map(Number);
const n = Math.max(0, ...days) + 1;
const nn = String(n).padStart(2, '0');
const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time
const file = `${dir}/day-${nn}.md`;

writeFileSync(file, `---
title: Day ${nn} — <topic>
description: <one line>
date: ${today}
stage: 0
tags: [railway]
sidebar:
  order: ${-n}
---

## Goal for today

## What I did
<!-- commands I ran, in order, as code blocks -->

## What broke and how I fixed it
| Problem | Cause | Fix |
| --- | --- | --- |

## What I learned (in my own words)

## Commands I learned
| Command | What it does | AI tip (ask Claude) |
| --- | --- | --- |

## Questions / still unclear

## Next
`, { flag: 'wx' }); // wx: never overwrite an existing day

console.log(file);
