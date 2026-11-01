# Launch readiness

What has been checked, how, and what is still open before a public launch.

## Checked

- **Automated tests**: about 130 end-to-end browser scripts (Playwright, Chromium) covering the stage and room, team and Planning Center import, gear and cabling, patching and power, undo and version history, saving and reloading, Home, every paperwork sheet, printing and file export, the lighting desk and looks, menus keeping their scroll, and the phone layout. The full suite runs before each release.
- **Accessibility**: axe-core on every screen, menu and lighting state, in light and dark: no violations. Contrast at least 4.5:1; every control reachable by keyboard; focus always visible.
- **Printing**: every sheet prints on its own page with headings carried across pages; ink-saver and blank stage sheet checked.
- **Layouts**: desktop, iPad and a 390 px phone with no sideways scrolling.
- **Robustness**: a random-interaction stress test (thousands of clicks, drags and keys) leaves the data intact; unreadable saved data is never overwritten; a reload straight after a change keeps it (a timestamped copy in the tab backs up the main save).
- **Planning Center**: argument names checked against the connector's schemas; response shapes confirmed with one read-only call each.
- **Performance**: a change on a full example week redraws in about 30 to 45 ms; screens that aren't showing don't redraw.

## Open before a public launch

- Open the Mac `.dmg` and Windows installer on a real Mac and PC, then sign them (Apple Developer ID with notarisation; a Windows code-signing certificate) so people don't see the unsigned-app warnings.

- **Safari and Firefox**: still not run on a real device (only Chromium can run here). A code audit found no JavaScript newer than Safari 15; the CSS needs Safari 16.2+ / Firefox 113+ for colour mixing (older browsers now get a one-time notice). Touch: pinch-to-zoom and dragging were tested with simulated touches in Chromium; check both on a real iPad.
- **Hosting**: the app is one static HTML file; it needs a home (any static host) and a domain.
- **Storage is per browser**: there are no accounts or sync. Teams share plans by exporting files. Accounts and team sharing would be the next major step.
- **Planning Center outside Claude**: the desktop app connects with a Personal Access Token and calls the Services API itself (tested against a mock that answers in the API's own format: C/U/D statuses, offset paging; not yet run against the live API). The browser version on its own site would still need a small server and a Planning Center OAuth app.
- **No analytics or error reporting**: nothing leaves the browser today, by design. Add an opt-in only if needed.

## Run the checks

The browser tests are in [tests/](tests/README.md). Run them all with `tests/run.sh` (Playwright and Chromium needed).
