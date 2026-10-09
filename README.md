# KAIJU — Math Battle Arena

A browser math game: answer questions, battle kaiju, and evolve Gigarex through 22 stages.

## Play

Open `index.html` in a modern browser, create a profile, and choose **Start Battle**.
Choose multiplication tables, addition ranges, or a mix in the battle setup.
Use the on-screen number pad or your keyboard; Enter submits, Backspace deletes,
and Escape clears your answer.

**Modes** opens untimed practice, a 60-second challenge, and the 12-chapter campaign.
**Stats** shows learning progress and battle history; **Collection** shows defeated enemies.
English, Dutch, German, and Vietnamese are selectable from the home screen.
Setup, mode menus, feedback, and the manual follow the selected language.
Some detailed stats, hints, campaign text, and collection descriptions still use English.

Progress is saved in this browser's local storage. To move profiles, choose
**Change Profile → Export profiles**, then import the JSON backup on the other device.
Imports preserve existing profiles and number duplicate names. Personal challenge scores,
campaign progress, and learning history move with profiles; the device leaderboard stays
local. Exports also include unreadable originals for recovery. No account or server is required.

## Develop and check

There is no build step or runtime package dependency. For a consistent local origin:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8765`. Opening the file directly also works for the game,
but the diagnostics page needs HTTP. Keep the same origin to retain existing saves.

```sh
node tests/regressions.test.cjs
```

Open `test-load.html` through the local server to check the actual game startup.

## Code map

| Folder | Purpose |
| --- | --- |
| `js/core/` | Battle state, profiles, translations, generated sound |
| `js/features/` | Modes, analytics, achievements, hints, power-ups |
| `js/ui/` | Menus, mode screens, stats, collection, learning aids |
| `js/utils/` | Shared input, questions, arrays, UI helpers |
| `css/` | Game styles and effects |
| `images/` | 22 evolution sprites and 24 enemy sprites |
| `tests/` | Regression checks using Node's built-in test runner |
| `docs/` | Review notes, reference guides, and development history |
| `docs/archive/`, `js/legacy/`, `backup/` | Historical material; not loaded by the game |

Script order is defined in `index.html`: utilities, core systems, features, UI,
the game engine, then integration. This project uses browser globals rather than modules.

See [the review](docs/REVIEW.md) for fixes and remaining priorities.
Older development documents describe earlier versions; the code and this README
are the current starting point.
