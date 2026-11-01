# Tests

Browser tests for `index.html`, one script per area (t2 … t130), plus `smoke`, `perr` (page errors), `a11y*` (accessibility in light, dark and print) and `monkey` (random clicking with data checks).

    cd tests && npm install && npx playwright install chromium   # first time
    ./run.sh          # everything, about 10 minutes (4 at a time; JOBS=2 for fewer)
    ./run.sh t24      # one test

If Playwright is already installed elsewhere, point `PW` at it: `PW=$(npm root -g)/playwright ./run.sh`.

Each script prints what it checked and ends with `errors []` when the page threw nothing. The runner marks a test failed if it crashes, times out or reports page errors. Screenshots go to `tests/out/`.
