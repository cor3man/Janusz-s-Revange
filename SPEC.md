# PrizeBlox Prank Page — Build Spec

Nov 24, 2026 · @Aleks

Build a static, zero-data prank web page that imitates a "free game currency" giveaway and rickrolls the visitor, hosted on GitHub Pages. The target audience is the builder's kids and their friends; the whole point is a harmless laugh, so the safety guardrails in this spec are as binding as the feature list.

## Overview & goal

PrizeBlox is a single-purpose joke website. A visitor who opens the link sees a flashy page claiming they've won a large amount of free in-game currency ("Blox Bucks") on a popular gaming platform. After a short, over-the-top "claiming" sequence, the page reveals it was a prank and redirects them to Rick Astley's "Never Gonna Give You Up" on YouTube.

A single-file prototype already exists; this spec takes it to a hosted, multi-step experience on GitHub Pages. The project and its repository are named **Janusz-s-Revange**; the on-page wordmark stays **PRIZEBLOX**. The audience is kids sharing it with friends, so it must land as an obvious, good-natured gag the moment the reveal hits — never as a real giveaway a child would keep waiting on.

## Non-negotiable guardrails

These are hard requirements. A build that breaks any one of them is wrong, no matter what else it gets right.

- **No data collection.** No email, name, password, phone number, or any other input is ever captured, stored, or transmitted. The only exception is reading a `name` value from the URL for a greeting (see Feature set), which must never be stored or sent anywhere.
- **No real-brand impersonation.** Do not use the Roblox name as if official, the Roblox logo, its exact fonts/colours, or any real company's logo or domain. The style is a generic, parody "blocky game" look, and the currency is the invented **Blox Bucks**, never "Robux".
- **The payoff is the rickroll, nothing else.** The one outbound link is the YouTube video `https://www.youtube.com/watch?v=dQw4w9WgXcQ`. No other external links, no adult content, no ads, no downloads, no app installs.
- **No tracking.** No cookies, no analytics, no third-party scripts, no fingerprinting.
- **Obvious reveal.** The prank must clearly announce itself ("GOTCHA / you've been pranked") as it redirects, so no one is left believing the prize was real.

## User flow

1. Visitor opens the shared link. The landing screen announces a big "Blox Bucks" prize with fake trust signals: a verified badge, star rating, a live "claimed today" counter, and a countdown timer.
2. *(Optional greeting)* If the link includes `?name=Kuba`, the headline greets them by name. With no name param, it shows a generic greeting.
3. Visitor taps **Claim my prize**.
4. **Platform picker** — a fake "Choose your platform" step with invented names (e.g. BloxWorld / FortCraft / SteemBox), not real brands.
5. **Amount selector** — pick how many Blox Bucks (10k / 50k / 100k) for extra buildup.
6. **Fake human verification** — a parody "I'm not a robot ✓" gate that mocks real scam pages; ticking it simply advances and verifies nothing.
7. **Generating sequence** — a progress bar with staged messages ("Connecting… Verifying… Generating your Blox Bucks… Almost there…") and an optional drumroll.
8. **Reveal** — the screen flips to "GOTCHA! You've been pranked", then after \~1.2s redirects the tab to the rickroll video.

## Feature set

| Feature | Behaviour | Data collected |
| --- | --- | --- |
| Personal greeting | Reads `?name=` from the URL and shows it in the headline; falls back to a generic greeting | None (read-only, never stored or sent) |
| Platform picker | Fake "choose your platform" step with invented brand names | None |
| Amount selector | Pick 10k / 50k / 100k Blox Bucks for buildup | None |
| Fake human verification | Parody "I'm not a robot" checkbox that just advances | None |
| Progress bar + sound | Staged "generating" messages with a progress bar and optional drumroll | None |
| Multi-step flow | Separate pages or swapped sections so it feels like a real funnel | None |
| Rickroll redirect | Final step sends the tab to the YouTube video | None |

All features are optional building blocks — the builder (Aleks) can drop any of them; none may add data collection.

## Technical requirements

- **Static only.** Plain HTML, CSS, and vanilla JavaScript. No backend, no server code, no database — it must run as static files on GitHub Pages.
- **No build step needed.** Prefer files that work when opened directly. A light build is fine only if it outputs plain static files; no framework (React/Vue) is warranted for something this small.
- **Minimal dependencies.** The only runtime externals are an optional web font and the single YouTube redirect. Fonts may load from Google Fonts with solid system fallbacks; everything else is self-hosted in the repo.
- **Mobile-first.** Most visitors are on a phone, so it must look right from \~320px wide and scale up cleanly.
- **Self-contained assets.** Any sounds or images live in `/assets`, never hotlinked from elsewhere.
- **Robust flow.** Each step advances on click. The multi-step version may use separate HTML files or one page with swapped sections — builder's choice — as long as refresh or back-button never breaks the gag or skips the reveal.

## Repo structure & key copy

Suggested layout (single-page version; a multi-file version may split steps into `claim.html`, `verify.html`, etc.):

```text
Janusz-s-Revange/
├── SPEC.md             # this spec
├── index.html          # landing + all step screens
├── css/
│   └── style.css
├── js/
│   └── app.js          # step logic, timers, redirect
├── assets/
│   ├── drumroll.mp3    # optional
│   └── airhorn.mp3     # optional
└── README.md           # states plainly: harmless prank, collects no data, redirects to a YouTube video
```

Key on-page copy (tone: loud, hypey, obviously too-good-to-be-true):

- Wordmark: **PRIZEBLOX**
- Headline: "CONGRATULATIONS{, NAME}! You've won 10,000 FREE BLOX BUCKS!"
- Trust signals: "✔ Official Verified Giveaway" · "★★★★★" · "2,847 players claimed today 🔥" · "⚠ Offer expires in 04:59"
- Button: "CLAIM MY PRIZE 🎁"
- Generating steps: "Connecting to the prize server" → "Verifying your account…" → "Generating your Blox Bucks…" → "Almost there…"
- Reveal: "GOTCHA! 🎉 You just got PRANKED 😜"

## Visual design

Aesthetic: a bright, blocky, playful "mobile game reward" vibe — rounded chunky buttons, drop-shadowed 3D text, confetti, a bouncing trophy, a gently animated gradient background. It should *evoke* kid gaming sites in general, never copy a specific brand's identity.

| Token | Value |
| --- | --- |
| Primary blue | `#00a2ff` |
| Accent green (CTA) | `#22c55e` |
| Highlight yellow | `#ffd60a` |
| Dark text | `#1b2838` |
| Display font | Luckiest Guy (blocky), bold rounded fallback |
| Body font | Fredoka / system rounded sans |

Motion: animated background gradient, floating blocks, bouncing trophy, pulsing CTA button, a spinner during "generating", and confetti on the reveal. Keep it CSS-driven where possible so it stays smooth on phones.

## Deployment & acceptance criteria

**Deploy to GitHub Pages:**

1. Create a public repo named `Janusz-s-Revange`.
2. Commit the files with `index.html` at the repo root.
3. In the repo, open *Settings → Pages* and deploy from the `main` branch, `/root` folder.
4. Wait \~1 minute; the site goes live at `https://cor3man.github.io/Janusz-s-Revange/`.

**Done when every check passes:**

- [ ] Opening the link on a phone shows the giveaway page, correctly scaled.
- [ ] `?name=Kuba` greets "Kuba"; no param shows a generic greeting; nothing is stored.
- [ ] Each step (platform → amount → verification → generating) advances on click.
- [ ] The final step shows the GOTCHA reveal, then redirects to the YouTube video.
- [ ] In the browser network tab, no requests leave the page except loading fonts/assets and the final YouTube redirect.
- [ ] No input is captured, stored, or transmitted anywhere.
- [ ] No real brand logos or names are used; the currency is "Blox Bucks".
- [ ] The site runs as static files on GitHub Pages with no backend.
