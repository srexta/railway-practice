#!/usr/bin/env bash
# Self-check for guard.sh: bash .claude/hooks/test-guard.sh
H="$(cd "$(dirname "$0")" && pwd)/guard.sh"
T=$(mktemp -d) && cd "$T" && git init -q && git commit -q --allow-empty -m init
fails=0
t() { out=$(jq -n --arg c "$2" '{tool_input:{command:$c}}' | CLAUDE_PROJECT_DIR=$T "$H" | jq -r '.hookSpecificOutput.permissionDecision // empty')
      [ "${out:-allow}" = "$1" ] && echo "PASS $1: $3" || { echo "FAIL (got ${out:-allow}) $3"; fails=1; }; }

t ask   "railway down"                  "railway down"
t ask   "railway volume delete -v data" "volume delete"
t allow "railway status"                "railway status"
echo hello > notes.md;                                         t allow "git commit -m x" "clean commit"
echo 'postgresql:''//postgres:Xy9fakepass77@postgres.railway.internal:5432/railway' > a.md
                                                               t deny  "git add -A && git commit -m x" "railway db url"
echo 'postgresql://user:****@host:5432/db' > a.md;             t allow "git commit -m x" "redacted url"
echo 'key sk_''live_abcdefghijklmnop' > a.md;                    t deny  "git commit -m x" "stripe key"
rm a.md; echo X=1 > .env;                                      t deny  "git commit -m x" ".env file"
rm -rf "$T"; exit $fails
