# Stagehand

**Stage plots, patching, power and lighting for church production teams, in minutes instead of an evening.**

Each week someone works out who is on stage, where their gear goes, which input each mic lands on, what plugs into which circuit and how much cable to pull. Stagehand does it in one place:

1. **Add the team.** Import who's scheduled from Planning Center, paste a list, or type names.
2. **Build the stage.** One click places everyone's gear by position on your real stage shape, with cables run.
3. **It's patched and powered.** Inputs land on the nearest stage box in band order, outputs feed mains and monitors, and powered gear goes on the least-loaded circuit, with load checks.
4. **Print the paperwork.** Stage plot, input list, outputs, cable pull list, power, team and load-in, as one PDF or a file to share.

Open `index.html` in a modern browser. No install, no account, no server.

## The screens

- **Home**: every week you've planned, a calendar of the next Sundays, venues, reusable setups, the gear and cables you own, and preferences (including Planning Center). On a service day it leads with that day: Show mode, load-in and line check.
- **Plot**: the stage from above. Team, Gear and Room on the left; the details of whatever is picked on the right. Drag to move, right-click for more, `Ctrl+K` to search for any action. The status pill says what still needs a look.
- **Paperwork**: Overview (plot, things to check, floor marks), My spot cards, Inputs (with line check and wireless), Outputs (with monitor mixes), Cables, Power (with racks), Team (with the load-in checklist), Lighting when used, and Everything. Click a row to find it on the plot. The **Print** menu also prints the tech rider and spot cards, saves the plot as a picture and copies a text summary.
- **Lighting desk** (pick the lighting console, or `Ctrl+K`): looks, a stage map you can aim lights on, a front view from the room, colour wheel and dimmer. Planning only: nothing is sent to real lights.

## Good to know

- **Simple and Advanced** (⋯ menu): Simple keeps everyday controls; Advanced shows every setting, DMX detail and extra tools.
- **Flip** (button by the zoom tools): the plot from the band's side, audience at the top. Labels stay upright, and this device remembers it. Paperwork and pictures are always drawn from the house.
- **Show mode** (`F`): the plot full screen for an iPad on stage. Tap a person to see their channels and monitor.
- **Cable channels** (Advanced, `T`): floor trenches, trays and ramps, plus overhead paths. Start a channel on another one to branch off, end on one to join it. Channels that join or cross become one channel (one name, one label, picked and edited together); cables run through all of it, and branches stay attached when it is reshaped.
- **Patching follows the desk**: channel 7 goes into input 7 of its stage box (a second box's block starts after the first box's inputs), monitor mix 3 comes out of output 3, mains sit together after the mixes, and unused IEM transmitter channels are spare. Anything that can't line up is marked `*` on the sheets, to soft-patch at the desk.
- **Stage boxes and snakes**: a digital stage box on Cat6 to the desk, or an analog snake (8, 12, 16, 24 or 32 inputs). An analog snake's multicore runs to a digital stage box (or the desk) and fans out into one XLR tail per channel, so a mic in snake socket 3 lands on the stage box input that tail plugs into; the input list shows both (e.g. `SB·14 (A·3)`), and snake returns feed wedges from the box's outputs the same way.
- **Wireless and in-ears**: wireless mics go through rack receivers or single receivers on stage (each with its own XLR to the stage box); in-ear packs can be wireless (transmitter) or wired (a stage box output).
- **Power**: an extension lead plugs in with its own cord and 3-pin plug (drawn as a loose lead that follows the board), which doesn't use one of its sockets. Placing one asks you to click the power point or distro it plugs into.
- **Placing gear never adds cables.** Run them with the cable tool (`C`), or press **Re-run cabling** (Room tab → Cable maths) to patch and power everything at once.
- **Undo** everything with `Ctrl/Cmd+Z` (redo: add Shift, or `Ctrl+K` → Redo); version history is in the ⋯ menu.
- **Light and dark** themes follow your device, or pick one in Preferences. Text size, feet-and-inches and whether building the stage adds everyone's gear are there too.

## Saving

Weeks save automatically in this browser. **Home → Preferences** copies or downloads everything as a file, to keep safe or move to another computer.

## Mac and Windows app

`desktop/` packages Stagehand for Mac (`.dmg`) and Windows (`.exe`). It runs offline and saves weeks on the computer. See [desktop/README.md](desktop/README.md).

## Shortcuts

`A` add gear · `F` present · `V` move · `C` run cable · `H` hide cables · `Esc` cancel · `R` rotate (Shift+R 45°) · `D` duplicate · `Del` delete · `+`/`−` zoom · `0` fit · `?` help · arrows nudge 5 cm (Shift 50 cm) · `Ctrl/Cmd+Z` undo (add Shift to redo) · in Advanced: `E` side view · `S` select box · `M` measure · `T` draw channel

## Status

What has been tested, and what's still open before a public launch, is in [LAUNCH.md](LAUNCH.md).

## Release build

`tools/build.mjs` writes a minified copy to `dist/` for hosting and for the desktop installer: `cd tools && npm install && npm run build`. `index.html` stays the readable source.
