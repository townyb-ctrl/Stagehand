# Launch readiness

What has been checked, how, and what is still open before a public launch.

## Checked

- **Automated tests**: 149 end-to-end browser scripts (Playwright, Chromium) in `tests/`, run on GitHub for every push against both `index.html` and the minified build, covering the stage and room, team and Planning Center import, gear and cabling, patching and power, undo and version history, saving and reloading, Home, every paperwork sheet, printing and file export, the lighting desk and looks, menus keeping their scroll, and the phone layout. A full run takes about 10 minutes (4 at a time).
- **Accessibility**: axe-core on every screen, menu and lighting state, in light and dark: no violations. Contrast at least 4.5:1; every control reachable by keyboard; focus always visible.
- **Printing**: every sheet prints on its own page with headings carried across pages; ink-saver and blank stage sheet checked.
- **Layouts**: desktop, iPad and a 390 px phone with no sideways scrolling. On a phone, tapping gear shows a strip with its name and actions, its details sit under the plot, and top-bar and toolbar buttons are at least 42 px.
- **Robustness**: a random-interaction stress test (thousands of clicks, drags and keys) leaves the data intact; unreadable saved data is never overwritten; a reload straight after a change keeps it (a timestamped copy in the tab backs up the main save).
- **Planning Center**: argument names checked against the connector's schemas; response shapes confirmed with one read-only call each.
- **Performance**: a change on a full example week redraws in about 30 to 45 ms; screens that aren't showing don't redraw.
- **Release build**: `tools/build.mjs` writes a minified copy to `dist/` (about 20% smaller) and names the offline cache after the build, so a new release replaces cached icons and manifest. The page itself is always fetched fresh when online.

## Open before a public launch

- **iPad held upright**: the team panel takes about 40% of the width, so the stage is small. Works, but landscape is better; a stacked layout like the phone's would fix it.
- **Sharing**: no read-only share link yet; no landing page, demo video or link-preview image.

- Open the Mac `.dmg` and Windows installer on a real Mac and PC, then sign them (Apple Developer ID with notarisation; a Windows code-signing certificate) so people don't see the unsigned-app warnings.

- **Safari and Firefox**: still not run on a real device (only Chromium can run here). A code audit found no JavaScript newer than Safari 15; the CSS needs Safari 16.2+ / Firefox 113+ for colour mixing (older browsers now get a one-time notice). Touch: pinch-to-zoom and dragging were tested with simulated touches in Chromium; check both on a real iPad.
- **Hosting**: host the contents of `dist/` on any static host, with a domain. Link previews have no image yet (needs a hosted `og:image`).
- **Storage is per browser**: there are no accounts or sync. Teams share plans by exporting files. Accounts and team sharing would be the next major step.
- **Planning Center outside Claude**: the desktop app connects with a Personal Access Token and calls the Services API itself (tested against a mock that answers in the API's own format: C/U/D statuses, offset paging; not yet run against the live API). The browser version on its own site would still need a small server and a Planning Center OAuth app.
- **No analytics or error reporting**: nothing leaves the browser today, by design. Add an opt-in only if needed.

## Run the checks

The browser tests are in [tests/](tests/README.md): `cd tests && npm install && npx playwright install chromium`, then `./run.sh`. To test the release build: `cd tools && npm install && npm run build`, then `STAGEHAND_DIR=dist tests/run.sh` (the path is relative to the repo).
