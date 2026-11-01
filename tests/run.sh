#!/usr/bin/env bash
# Runs every browser test. Screenshots and PDFs land in tests/out/ (not committed).
# Usage: tests/run.sh            all tests
#        tests/run.sh t24 t55    just these
# Needs Node and Playwright with Chromium. If Playwright is installed globally: PW=$(npm root -g)/playwright tests/run.sh
cd "$(dirname "$0")" && mkdir -p out && cd out || exit 1
list=("$@"); [ ${#list[@]} -eq 0 ] && list=($(ls ../t*.js | xargs -n1 basename | sed 's/\.js$//' | sort -V) smoke perr a11y a11yprint a11ylight monkey)
fail=0
for t in "${list[@]}"; do
  out=$(timeout 500 node "../$t.js" 2>&1); code=$?
  if [ $code -ne 0 ] || echo "$out" | grep -q "errors \[[^]]"; then echo "FAIL $t"; echo "$out" | grep -v '^\s*at ' | tail -6; fail=$((fail+1)); else echo "ok   $t"; fi
done
echo "$fail failed"; [ $fail -eq 0 ]
