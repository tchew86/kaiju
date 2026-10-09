# Review and cleanup — 9 October 2026

Kaiju keeps its existing math battle loop and runs without a build step. This pass
reduces menu clutter, removes duplicate behavior, and makes saved progress portable.

## Completed

- Simplified the home screen with a single evolution name, consistent widths,
  quieter secondary actions, top alignment, browser zoom, labels, and focus rings.
- Added shared dialogs and stat cards. Mode choices are real buttons; dialogs trap
  keyboard focus, close with Escape, restore focus, and block game input underneath.
  Battle/challenge choices expose their selected state to assistive technology.
- Translated setup screens, mode menus, main feedback/results, backup controls, and
  the shorter current manual into English, Dutch, German, and Vietnamese. Fixed
  translation helpers to use the actual selected profile.
- Removed the hidden old table picker and unused QuizMode. Archived seven old
  root/reference reports and the previous user guide. Historical code/assets remain
  available in `js/legacy/`, `backup/`, and `docs/archive/`.
- Removed routine production logging and accidental JavaScript in a CSS file.
- Unified addition generation across battle, practice, and challenge. All operands
  remain inside the chosen range; the no-carry option also applies to three-part
  questions. Impossible custom ranges fail explicitly rather than inserting zero.
- Prevented duplicate scoring during battle animations and practice feedback.
  Practice quit/restart clears pending timers and keyboard handlers; response timing
  begins with the new question. Practice Again retains addition options.
- Made challenge time follow elapsed time, reject late answers, and refill exhausted
  question pools. Mixed challenges now award difficulty bonuses consistently.
- Protected storage reads/writes, preserved exact unreadable originals before
  replacement, filled missing nested profile defaults, and retained optional campaign,
  battle settings, personal scores, and learning history during migration.
- Added profile JSON export/import. Existing profiles stay intact and duplicate
  names receive numbers. Exports include unsaved active progress and recovery data.
  Imports restore profiles; the separate device leaderboard stays local.
- Rebuilt startup diagnostics against the real page and script order.

## Validation

`node tests/regressions.test.cjs`: 24 passing checks. They cover script parsing and
assets, keyboard input, practice lifecycle/timing, battle duplicate submissions,
challenge timing/refills/scoring, all supported addition ranges and options, storage
failures/recovery, migration, translations, and profile backup round trips.

Browser checks verified startup, practice answer/quit, a complete battle ending in
victory with saved XP, German setup labels, and real export/import preserving the
original profile beside a numbered copy. Mobile home layout was checked at 390 × 844.
The focused Node tests use a small DOM fixture rather than a full browser simulator.
Safari/iPad, all campaign chapters, and all evolution stages were not checked end to end.

## Useful next improvements

- Finish translations for detailed statistics, hint explanations, campaign narratives,
  and collection descriptions; some currently fall back to English.
- Extract the remaining repeated choice-grid styling and larger screen templates.
  Module-based code could make dependencies explicit, but is a larger follow-up.
- Add automated browser coverage for complete practice/challenge sessions and campaign
  progression, including touch devices. Existing checks cover the critical logic.
