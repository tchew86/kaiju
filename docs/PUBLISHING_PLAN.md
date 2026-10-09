# Publishing Kaiju to the App Store & Google Play — Action Plan

> Goal: ship the game as a paid/monetized native app on **Apple App Store** and **Google Play**.
> This plan is written specifically for *this* project: a vanilla HTML/JS/CSS game,
> localStorage-only (no servers), already localized in EN/NL/DE/VI.

---

## TL;DR — read this first

Three things can stop this project dead. Resolve them **before** any other work:

1. **🟥 IP / trademark — the #1 blocker.** The game is built around **Godzilla and Toho/Universal-owned monsters** (Godzilla, Mothra, Rodan, King Ghidorah, Gigan, Hedorah, Mechagodzilla, Destroyah, Biollante, King Kong, …). There are 24 enemy sprites named after them and 100+ code references. **We cannot legally sell this as-is.** Toho actively enforces. Both stores will also remove it on an IP complaint. → **Rebrand to 100% original creatures/names/art before selling.**
2. **🟥 No Mac for iOS builds.** Building/submitting an iOS app requires Xcode on macOS. The dev machine is Linux/WSL. → Use a cloud-Mac CI (Codemagic/EAS/Appflow) **or** buy/borrow a Mac.
3. **🟧 Apple "minimum functionality" (Guideline 4.2).** Apple rejects thin website-in-a-wrapper apps. A self-contained offline *game* usually passes, but we must make it feel native (offline, haptics, no browser chrome, no external links).

Everything else (wrapping, store accounts, listings, compliance) is standard and very doable.

---

## Decisions needed from you

| # | Decision | Options | Affects |
|---|----------|---------|---------|
| D1 | **Rebrand scope** | (a) full original IP rebrand, (b) abandon, (c) license (unrealistic) | Whole project legality |
| D2 | **Monetization** | Paid up-front · Free + one-time unlock (IAP) · Free + subscription | Store config, compliance, code |
| D3 | **Seller identity** | Individual · Registered company (Ltd/BV) | Tax, banking, liability, store display name |
| D4 | **Kids positioning** | List in Kids/Families category · General "Education" | Strict extra compliance vs. lighter |
| D5 | **iOS build path** | Cloud Mac CI · Own a Mac | Cost, workflow |

My recommendations: **D1 = full rebrand**, **D2 = Free + one-time unlock** (kid-friendly, low friction, lets parents try before buying), **D4 = Education (not Kids category)** to avoid the strictest rules while still being family-appropriate, **D5 = Codemagic cloud Mac** (no hardware purchase).

---

## Phase 0 — Clear the blockers

### 0.1 Rebrand off Toho IP (mandatory before sale)
- [ ] Rename the hero: "Godzilla" → an original creature (e.g. a coined name). Update all evolution stage names in `js/core/game.js` (`evolutionStages`) and all 4 language blocks in `js/core/translations.js`.
- [ ] Replace all 24 enemy designs in `images/enemies/` with **original** monsters; rename files + the `enemyList`/pokedex `id`s in `js/ui/challenge-ui.js` and `js/ui/enemy-pokedex.js`.
- [ ] Rename the product itself if "Kaiju" feels too close (generic Japanese word, lower risk, but pick a distinctive store name to be safe and trademark-clean).
- [ ] Do a clearance pass: `grep -ri` for every old name across `js/`, `index.html`, assets, and store copy.
- [ ] (Optional, recommended) Run the chosen app name through a basic trademark search (USPTO TESS, EUIPO, UKIPO) for the games class.

### 0.2 Stand up the iOS build path
- [ ] Pick: **Codemagic** (free tier, Linux-friendly, builds iOS in the cloud) or **EAS Build** or own Mac.
- [ ] Verify you can produce a signed `.ipa` from this repo on that path with a throwaway test build.

### 0.3 Open developer accounts (start early — verification takes days)
- [ ] **Apple Developer Program** — $99/year. Individual or Organization (Organization needs a D-U-N-S number; allow 1–2 weeks).
- [ ] **Google Play Developer** — $25 one-time. New personal accounts now face identity verification + a **mandatory closed test (≥12–20 testers for 14 days)** before you can publish to production. Plan for this.

---

## Phase 1 — Make the game itself store-ready

The game is browser-first; harden it for phones.

- [ ] **Mobile/touch QA**: test on real iOS + Android viewports. The number-pad input is touch-friendly already; verify layouts at small widths and notches (`viewport-fit=cover` is set ✓).
- [ ] **Offline-first**: ensure zero network dependencies (audit confirms none today ✓). All assets must be bundled.
- [ ] **Strip debug noise**: remove the heavy `console.log` calls flagged in code review (gate behind a `DEBUG` flag).
- [ ] **Audio on mobile**: Web Audio needs a user-gesture unlock on iOS — verify sound starts after first tap; add a mute toggle.
- [ ] **Save-data durability**: app stores in `localStorage` (`kaijuProfiles`, `lastProfile`). In a WebView this persists, but the OS can evict it. → migrate to Capacitor `Preferences`/filesystem so progress can't be wiped, and so we can offer backup.
- [ ] **Orientation lock** (pick portrait or support both consistently).
- [ ] **App icon + splash** source art (1024×1024 master icon, adaptive icon for Android).
- [ ] **Haptics + status-bar styling** for native feel (helps with Apple 4.2).
- [ ] **Versioning**: set a `version` and build-number scheme.

---

## Phase 2 — Wrap as a native app (Capacitor)

Capacitor (by Ionic) is the right wrapper for a vanilla web game — it bundles our HTML/JS/CSS into a native iOS/Android shell with plugin access.

- [ ] `npm init`, add Capacitor: `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`.
- [ ] Set `webDir` to the folder containing `index.html` (root here) — or restructure into a `www/`/`dist/` build output.
- [ ] `npx cap add ios && npx cap add android`.
- [ ] Add plugins as needed: `@capacitor/preferences` (save data), `@capacitor/haptics`, `@capacitor/status-bar`, `@capacitor/splash-screen`, `@capacitor/app` (back-button handling on Android).
- [ ] Generate icons/splash (`@capacitor/assets`).
- [ ] `npx cap sync`, then open in Xcode / Android Studio and run on device.
- [ ] Handle Android hardware **back button** (otherwise it exits the app mid-game).

---

## Phase 3 — Monetization plumbing

> Reminder: selling **digital** content **must** use Apple/Google in-app purchase. Stores take **30%** (drops to **15%** via Apple Small Business Program and Google Play's first-$1M tier).

Depending on D2:
- **Paid up-front**: simplest — just set a price tier; the store handles payment. No IAP code. (Downside: no "try before buy".)
- **Free + one-time unlock (recommended)**: implement a non-consumable IAP with a Capacitor IAP plugin (e.g. `@capacitor-community/in-app-purchases` / RevenueCat). Free demo (e.g. tables 1–5), unlock everything once. Gate content behind a locally-stored entitlement + store receipt validation.
- **Subscription**: most overhead (renewals, restore, compliance) — overkill for this.
- [ ] Configure products in **App Store Connect** and **Google Play Console**.
- [ ] Implement **Restore Purchases** (Apple requires it).
- [ ] Test with sandbox/test accounts.

---

## Phase 4 — Legal & compliance (don't skip — top rejection cause)

- [ ] **Privacy Policy URL (required by both, even though we collect nothing).** Host free on GitHub Pages. State plainly: all data stays on-device, no tracking, no accounts.
- [ ] **Apple Privacy "Nutrition Label"** questionnaire — we can honestly answer "no data collected."
- [ ] **Google Play Data Safety** form — same.
- [ ] **Age rating** via IARC questionnaire (both stores) — this is a clean kids' math game, will rate low.
- [ ] **Kids/Children compliance** (if D4 = Kids/Families): COPPA (US), GDPR-K (EU), UK Age-Appropriate Design Code. No third-party ads/analytics without consent. Our no-network design makes this *much* easier — keep it that way.
- [ ] **Terms of Use / EULA** (Apple provides a standard one; or supply your own).
- [ ] **Tax & banking**: Apple "Agreements, Tax, and Banking" in App Store Connect; Google merchant/payments profile. Expect tax forms (e.g. W-8BEN equivalent for non-US).
- [ ] Confirm you have rights to all **fonts, sounds, and any remaining art** (the rebrand must produce assets you own or are licensed for commercial use).

---

## Phase 5 — Store listing assets

- [ ] **App name** (clean of IP) + subtitle.
- [ ] **Description** — reuse the EN copy; we already have **NL/DE/VI** translations, so do **localized listings** for those markets (a real distribution advantage).
- [ ] **Keywords** (App Store) / tags.
- [ ] **Screenshots** — required at specific sizes: iPhone 6.7"/6.5" + iPad; Android phone + tablet. 4–8 each, ideally with captions.
- [ ] **App preview video** (optional, boosts conversion).
- [ ] **Feature graphic** (Google Play, 1024×500).
- [ ] **Category**: Education / Educational Games.
- [ ] **Promotional text**, support URL, marketing URL.

---

## Phase 6 — Build & sign

**iOS**
- [ ] Certificates, App ID, provisioning profiles (or let Xcode/Codemagic manage automatically).
- [ ] Archive → upload to App Store Connect.

**Android**
- [ ] Generate an **upload keystore** (back it up — losing it is unrecoverable) or enrol in **Play App Signing**.
- [ ] Build a signed **AAB** (Android App Bundle — required format).

---

## Phase 7 — Beta testing

- [ ] **iOS — TestFlight**: invite testers, ≥1 round of real-device testing.
- [ ] **Android — Closed testing track**: satisfies Google's new pre-production testing requirement (gather the required testers early — this is often the longest pole for new accounts).
- [ ] Fix crashes, layout bugs, IAP edge cases, save/restore.

---

## Phase 8 — Submit for review

- [ ] Complete every metadata/compliance field (incomplete forms = instant rejection).
- [ ] Submit. Typical review: **Apple ~24–48h**, **Google hours–days** (longer for first submission / families program).
- [ ] Have a reply ready for a possible **Apple 4.2** ("minimum functionality") query — emphasize offline play, native features, original game content.
- [ ] Iterate on rejections (normal — budget for 1–2 rounds).

---

## Phase 9 — Launch & post-launch

- [ ] Set price/regions; schedule release.
- [ ] Basic store-analytics review (privacy-safe, store-provided).
- [ ] Plan updates: the **other game modes** (Challenge/Practice/Quiz) still have untranslated English UI — finish localization before marketing to NL/DE/VI.
- [ ] Respond to reviews; monitor crash reports (Xcode Organizer / Play Console — no third-party SDK needed).

---

## Cost summary (minimum, GBP/USD approx)

| Item | Cost |
|------|------|
| Apple Developer Program | **$99 / year** |
| Google Play Developer | **$25 one-time** |
| Privacy policy hosting (GitHub Pages) | Free |
| iOS build — Codemagic free tier | Free (paid if heavy use) |
| iOS build — own Mac (alt.) | ~$600 one-time |
| Icon/screenshot design (DIY) | Free–$200 |
| Store commission on sales | 15–30% of revenue |
| **Realistic startup minimum** | **~$125 + a Mac/cloud-Mac path** |

---

## Risk register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Toho/Universal IP (Godzilla et al.) | 🟥 Blocker | Full original rebrand before sale (Phase 0.1) |
| No Mac for iOS | 🟥 High | Cloud Mac CI (Codemagic/EAS) |
| Apple 4.2 "just a website" rejection | 🟧 Med | Native features, offline, no external links; positioned as a game |
| Google new-account testing gate | 🟧 Med | Recruit testers early, run closed track in parallel |
| Kids-privacy law (COPPA/GDPR-K/UK code) | 🟧 Med | Keep zero-network design; honest privacy labels; avoid Kids category if not needed |
| Save data eviction in WebView | 🟨 Low | Migrate localStorage → Capacitor Preferences/filesystem |
| Untranslated mode screens shipping | 🟨 Low | Finish i18n of Challenge/Practice/Quiz pre-launch |

---

## Suggested order of execution

1. **D1–D5 decisions** (especially rebrand + monetization).
2. **Phase 0** blockers (rebrand, iOS build path, accounts) — these have the longest lead times.
3. **Phase 1** game hardening → **Phase 2** Capacitor wrap (get a real app running on your phone — big morale + de-risk milestone).
4. **Phase 3** monetization → **Phase 4** compliance → **Phase 5** assets.
5. **Phase 6–7** build/sign/beta → **Phase 8** submit → **Phase 9** launch.

> **Fastest path to a first real milestone:** do the rebrand (0.1), then Phases 1–2, and get an unsigned/dev build running on your own Android phone via Capacitor. That proves the whole technical chain before spending on accounts or fighting review.
