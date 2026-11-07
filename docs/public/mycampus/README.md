# MyCampus Web

A browser port of the [MyCampus Android app](https://github.com/ShuhaibNC/MyCampus),
a direct client for the CEV Etlab portal (https://cev.etlab.in). Served at
https://shuhaibnc.github.io/mycampus/ as a standalone static app: `index.html`,
`styles.css`, `app.js`, `data.js`. No build step, no npm, no external CDN or
fonts. Relative asset paths inside the folder; only the shared site assets
`/theme-init.js` and `/icon.png` are absolute.

## Demo mode: read this first

A browser **cannot log in to cev.etlab.in** directly (no CORS, session
cookies), and no credentials are ever sent to any proxy. So this web version
runs on **sample data only** and says so on the login screen and in the UI.
The login form takes any name (or the "Explore demo" button) and opens the
demo; nothing is typed, stored or sent anywhere except a session-only flag
(`sessionStorage`) remembering that the demo was opened. **Live portal login
works in the Android app**, or through the Cloudflare Worker once it is
deployed (see Live mode below).

## Live mode (Cloudflare Worker)

The demo above is the default because a browser cannot log in to
cev.etlab.in directly. Live login is possible through a small backend
that does the login server-side — the same flow as the Android app:

- **Worker project:** `~/workspace/mycampus-worker/` (not deployed yet).
  A single Cloudflare Worker (`src/index.js`, no framework) logs in to
  the portal (GET `/user/login`, then POST the login form, following the
  redirect manually with the cookie jar) and serves the portal data as
  JSON: `POST /api/login`, `GET /api/profile`, `/api/attendance?sem=N`,
  `/api/monthly`, `/api/timetable`, `/api/results?sem=N`.
- **Sessions are stateless:** the Etlab cookie jar is encrypted with
  AES-GCM under a `WORKER_SECRET` secret and returned as an opaque
  token (12h expiry). Nothing is stored on the server. Credentials are
  used once, inside the login handler, and never stored or logged.
- **CORS is allow-listed** to `https://shuhaibnc.github.io` (plus
  `http://localhost:*` for local dev). `/api/login` is throttled per IP.
- **Enabling it:** deploy the Worker (see its README: `wrangler login`,
  `wrangler secret put WORKER_SECRET`, `wrangler deploy`), then set the
  `WORKER_URL` constant at the top of `app.js` to the deployed Worker
  URL (HTTPS only). The login form then signs in to the real portal:
  the token lives in `sessionStorage` only, a green **Live** badge
  replaces **Demo** in the UI, and sign-out clears the token. With
  `WORKER_URL` empty (the shipped default) the app stays in demo mode
  exactly as described above.

## What is verified vs demo

Verified against the live portal (see the Android repo history):

- Student: SHUHAIB N C, roll 26M018, MCA Semester 3, College of Engineering
  Vadakara (CEV), KTU MCA 2020 scheme.
- Sem 3 overall attendance about 95% (checked 2026-09-26). The Sem 3
  per-subject hours in `data.js` average to about 95%.
- Sem 1, Series Exam 1: 20MCA105 Advanced Data Structures, 23/30
  (checked 2026-10-24). Only that one row is shown; other Sem 1 subjects
  were not published in that sample.
- Sem 3 series exams are empty on the portal: "No sessional exams yet".

Deliberately left blank or demo:

- Date of birth, admission number and university registration number are
  not verified, so Profile shows a dash for them.
- Teacher names are not shown (Theory/Lab tags instead).
- Sem 1/2/4 attendance figures and the Sem 3 timetable are plausible demo
  data built from the real subject lists in `Etlab.java`; the monthly
  October 2026 grid is generated deterministically (seeded) from that
  timetable, with Sundays and 2 Oct (Gandhi Jayanti) as holidays.
- Blank-cell rule (from Android b24): a cell with no visible text can never
  read as Absent. Empty cells are N/A (grey) or Holiday (light), never red.

## Features

All five Android tabs, as one single-page app: Home (greeting, attendance
ring, today's classes, subject chart, weekly Mon-Sun strip with tap-a-day
period detail, quick actions), Attendance (semester picker 1-8, per-subject
rows with below-75% flags, October monthly grid with portal legend),
Timetable (full week, Periods 1-7), Results (semester picker, series
groups, honest empty state for Sem 3), Profile (initials avatar, details,
Appearance, About, Sign out). Top nav tabs on desktop, bottom tab bar
under 720px.

## Themes

12 themes in the picker: Default, AMOLED, Midnight, Forest, Catppuccin
Mocha, Paper, plus Nord, Dracula, Solarized Dark, Rose Pine, Gruvbox and
Ocean. The 6 new themes were also added to the main site
(`docs/.vitepress/theme/themes.css` and `theme-prefs.ts`) so the shared key
works everywhere. Preferences use the shared localStorage key
`shuhaib-site-prefs-v1` (theme, accent, text size, density, corners), so a
theme picked here follows the visitor to the main site and vice versa.
Two MyCampus-only extras (font family, content width) live under a
separate key `mycampus-prefs-v1` so the shared key stays compatible.
`theme-init.js` plus a small inline script in `<head>` apply both before
first paint, so there is no flash of the default theme.
