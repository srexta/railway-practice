---
title: Troubleshooting
description: Every error I've hit, what caused it and how I fixed it.
---

Errors are added here as I hit them: error → cause → fix, with a link to the day it happened.

| Error | Cause | Fix | Day |
| --- | --- | --- | --- |
| `SyntaxError: Invalid or unexpected token` when running `node -e "..."` | The long command wrapped on paste, so a line break landed inside quoted text | Paste the command as one single line, or use a shorter version | [Day 01](/days/day-01/) |
| `curl: (7) Failed to connect ... Connection refused` | Nothing is listening on that port: the app stopped, crashed or never started | Start the app, then check with `lsof -i :PORT` | [Day 01](/days/day-01/) |
