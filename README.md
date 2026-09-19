# Gym Progress — PWA

A shareable, installable web version of the Gym Progress tracker. Works on iPhone
and Android, installs to the home screen, and runs offline. No app store needed.

Built with **React + TypeScript + Vite**, charts via **Recharts**, icons via
**lucide-react**, and PWA support via **vite-plugin-pwa**. Data is stored locally
in the browser (localStorage) — a cloud backend (Firebase) can be added later for
sync + the buddies/scoreboard feature.

## Features (matches the iOS app)

- Main screen with all 8 muscle groups as expandable colored cards
- Pre-seeded exercises for each muscle
- Add / delete exercises under a muscle
- Workout timer with Start / End and a live stopwatch
- Per-exercise **Set / Reps / Weight** table (default 3 rows, add/remove)
- Vertical **scroll pickers** for reps (step 1) and weight (**0.5 kg** steps)
- After logging an exercise, **Back** reopens that muscle and scrolls to it
- Pick any date; **Save** records that day's sets
- **Progress graph** of each day's heaviest set over time
- **History by day** — tap to edit a day, delete a day
- Light/dark mode, installable to the home screen

## Run it locally

```bash
cd gym-pwa
npm install
npm run dev
```

Then open the printed URL (usually http://localhost:5173/).

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Share it with friends (free)

1. Deploy the `dist/` folder to free hosting like **Vercel** or **Netlify**
   (e.g. `npx vercel` in this folder).
2. Send friends the URL.
3. On iPhone: open in Safari → Share → **Add to Home Screen**.
   On Android: open in Chrome → menu → **Install app**.

## Next steps (planned)

- Firebase backend for cloud sync across devices
- Buddies (connect with friends) + weekly scoreboard
