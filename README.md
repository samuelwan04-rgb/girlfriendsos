# GIRLFRIENDSOS

Momo helps Rinis decide what to eat. She answers six questions (Asian or ang moh, cuisine, hunger, budget, a vibe check, where she is) and Momo picks 2–3 dishes with a percentage for each, plus which of her spots sells them. Each verdict is emailed to Sam.

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `data.js` | The dish bank, Rinis' spots and Sam's email. Add places here. |
| `brain.js` | The scoring. Tunable numbers are in `P` at the top. |
| `sim.js` | Simulator: `node sim.js` (or `node sim.js 20000` for more days) |
| `img/` | Momo |

## Adding a spot

In `data.js`, add one line under the right area:

```js
O('school','Dumpling stall','dumplings',7.1);
O('home','Mala stall','mala',10,12,{note:'1 person portion'});
```

Area is `school`, `west`, `home`, `sengkang`, `east`, `central` or `north`. The third value is a dish id from the dish bank above it. If the food isn't in the bank yet, add a `D(...)` line first.

## What Momo knows about Rinis

Dishes carry flags in `data.js`: `spicy`, `heavy` and `junk` (unhealthy). `brain.js` uses them the way Sam described her: heavy meals are marked down, junk is fine but drops for a few days after she's had some, and spicy is a mood the vibe check picks up. Change a dish's flags to change how it's treated; the strengths are in `P`.

## Auto-email setup (once)

1. Open the live site and finish one round. FormSubmit sends an "activate form" email to the address in `data.js`. Click the link.
2. That email also gives a random code. Replace the address in `SAM_EMAIL` with it, so the address isn't in the public code.

## Hosting

GitHub Pages: repo Settings → Pages → Deploy from branch → `main`, folder `/ (root)`.
