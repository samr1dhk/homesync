# HomeSync

A React + TypeScript build of **HomeSync**, a share-house coordination app I first designed as a Figma prototype for DESN2000 (UNSW). It has fair chore sharing, house rules kept in one place, and low-confrontation issue reporting, for both share houses and residential colleges.

**Live demo:** https://homesync-beige.vercel.app
**Figma prototype:** https://www.figma.com/design/ZXIHD193CZjv4o6UlJU6A8/desn-prototyping?node-id=384-1130&t=5n5zVucPO7VcuE3k-1

## Features

- **Onboarding** for both paths (set up a new household, or join with an invite code), with validation and a house-rules agreement step.
- **Household-type configuration.** Share houses and residential colleges get different wording, shared spaces, default rules and issue routing (housemates vs RA/facilities). Testing the original prototype showed the two paths felt identical.
- **Chores.** Filter by mine, everyone or overdue; tick chores off; add new ones.
- **Targeted chore swaps.** Choose exactly who to ask (with their current workload shown), and accept or decline incoming requests from the dashboard.
- **Shared-load view.** Shows who has done what, so fairness is visible without anyone having to bring it up.
- **Anonymous issue reporting** for shared spaces, on by default, with a status for each issue (open, in progress, resolved).
- **House rules** can be re-opened from the header at any time after joining.
- Responsive layout: a bottom tab bar on mobile and a top bar on desktop. Accessible form labels, `role="switch"`, native `<dialog>` modals, and visible focus states.
- Data is saved in `localStorage`, so the demo keeps your changes between visits.

## Tech

React 19, TypeScript, Vite, plain CSS (custom properties for theming). There is no UI library. State is managed with `useReducer` and React Context.

```
src/
  App.tsx              app shell + tab navigation
  components/          Onboarding, Dashboard, Chores, ChoreCard, SwapDialog, Issues, RulesSheet, Modal, Avatar
  state/store.tsx      reducer, actions, context + localStorage persistence
  data/config.ts       everything that differs between share houses and colleges
  data/seed.ts         demo housemates, chores and issues (dates relative to today)
  utils/dates.ts       "Due tomorrow", "2 days overdue" etc.
  styles/global.css    all styles; theme colours at the top
```

## Run locally

```bash
npm install
npm run dev
```
