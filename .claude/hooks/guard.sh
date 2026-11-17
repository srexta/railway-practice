#!/usr/bin/env bash
# PreToolUse hook for Bash commands.
#  1. Destructive railway commands → ask the user first (playground-only rule).
#  2. git commit → block if new changes look like they contain a secret.
cmd=$(jq -r '.tool_input.command // empty')

decide() { # $1 = ask|deny, $2 = reason
  jq -n --arg d "$1" --arg r "$2" \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:$d,permissionDecisionReason:$r}}'
  exit 0
}

if grep -qE '\brailway\b.*\b(down|delete)\b' <<<"$cmd"; then
  decide ask "Destructive Railway command. Run 'railway status' first and confirm you're in the 'playground' project."
fi

if grep -qE '\bgit\b.*\bcommit\b' <<<"$cmd"; then
  cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
  # Everything that could land in the commit: tracked changes + new untracked files.
  # ponytail: scans git diff HEAD + untracked files, so `git add -A && git commit` is covered too.
  added=$( { git diff HEAD 2>/dev/null | grep '^+' ; git ls-files --others --exclude-standard -z | xargs -0 cat 2>/dev/null; } )
  files=$( { git diff HEAD --name-only; git ls-files --others --exclude-standard; } 2>/dev/null )

  if grep -qE '(^|/)\.env($|\.)|\.dev\.vars$' <<<"$files" && ! grep -qE '\.env\.example$' <<<"$files"; then
    decide deny "A .env / .dev.vars file is about to be committed. Remove it from the commit."
  fi
  hit=$(grep -noE \
    'sk_(live|test)_[A-Za-z0-9]{10,}|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|xox[baprs]-[A-Za-z0-9-]{10,}|[a-z]+://[^:/@ ]+:[^*@ /]{6,}@[a-z0-9.-]+\.(railway\.(internal|app)|rlwy\.net|com|net|io)|(api[_-]?key|token|secret|password)["'\'' ]*[:=][ ]*["'\'']?[A-Za-z0-9/+_-]{20,}' \
    <<<"$added" | head -3)
  if [ -n "$hit" ]; then
    decide deny "Possible secret in the changes (redact as user:****@host): $hit. If this is a false positive, commit it yourself from the terminal."
  fi
fi
exit 0
