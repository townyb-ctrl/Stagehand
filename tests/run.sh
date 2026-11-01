#!/usr/bin/env bash
# Runs the browser tests, several at a time. Each test works in its own folder under tests/out/ (not committed).
# Usage: tests/run.sh            all tests
#        tests/run.sh t24 t55    just these
#        JOBS=2 tests/run.sh     fewer at once on a small machine (default: 4)
# First time: cd tests && npm install && npx playwright install chromium
cd "$(dirname "$0")" || exit 1
here=$(pwd); mkdir -p out
list=("$@"); [ ${#list[@]} -eq 0 ] && list=($(ls t*.js | sed 's/\.js$//' | sort -V) smoke perr a11y a11yprint a11ylight monkey)

one() {   # run one test in its own folder; print "ok name" or "FAIL name" and the tail of its output
  t=$1; mkdir -p "$here/out/$t" && cd "$here/out/$t" || return
  out=$(timeout 500 node "$here/$t.js" 2>&1); code=$?
  if [ $code -ne 0 ] || echo "$out" | grep -q "errors \[[^]]"; then printf 'FAIL %s\n%s\n' "$t" "$(echo "$out" | grep -v '^\s*at ' | tail -6)"; else echo "ok   $t"; fi
}
export -f one; export here
printf '%s\n' "${list[@]}" | xargs -P "${JOBS:-4}" -I{} bash -c 'one {}' | tee "$here/out/results.txt"
fail=$(grep -c '^FAIL' "$here/out/results.txt")
echo "$((${#list[@]} - fail)) passed, $fail failed"; [ "$fail" -eq 0 ]
