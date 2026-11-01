# Tests

Browser tests for `index.html`, one script per area (t2 … t130), plus `smoke`, `perr` (page errors), `a11y*` (accessibility in light, dark and print) and `monkey` (random clicking with data checks).

    PW=$(npm root -g)/playwright tests/run.sh       # everything, about 30 minutes
    PW=$(npm root -g)/playwright tests/run.sh t24   # one test

Each script prints what it checked and ends with `errors []` when the page threw nothing. The runner marks a test failed if it crashes, times out or reports page errors. Screenshots go to `tests/out/`.
