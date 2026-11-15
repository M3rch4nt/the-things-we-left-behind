# Avatar Images — How to Import Your Own

The game renders **hand-drawn pixel portraits by default**, but if you drop
your own image files in the right place they are used automatically — no
code changes needed.

## Where to drop the files

Copy your images into this folder (create it if missing):

```
C:\Users\HP\OneDrive\Desktop\nasa\maizay\assets\avatars\
```

Name each file exactly like the machine it replaces (the extension is free:
`.jpg`, `.jpeg`, `.png`, `.webp` all work):

| File name | Character |
|---|---|
| `viking1.jpg` | VIKING 1 |
| `viking2.jpg` | VIKING 2 |
| `pathfinder.jpg` | PATHFINDER |
| `sojourner.jpg` | SOJOURNER |
| `spirit.jpg` | SPIRIT |
| `opportunity.jpg` | OPPORTUNITY |
| `phoenix.jpg` | PHOENIX |
| `curiosity.jpg` | CURIOSITY |
| `insight.jpg` | INSIGHT |
| `ingenuity.jpg` | INGENUITY |
| `perseverance.jpg` | PERSEVERANCE |
| `player.jpg` | SEEKER (you, the player) — the file must be named `player` |

If the folder is empty or a file is missing, that character simply keeps its
pixel-art portrait — nothing breaks.

## How the mapping works (Godot → this game)

Your Godot notes used a `TextureRect` with `expand_mode = IGNORE_SIZE` and
`stretch_mode = KEEP_ASPECT_CENTERED`. This is a canvas game, so the same
behaviour is implemented in `js/images.js`:

- **Dialogue portraits** are drawn into a fixed 96×96 portrait slot.
  Imported photos render **aspect-contained and centred** (the canvas
  equivalent of `KEEP_ASPECT_CENTERED`): the whole image is visible, never
  squashed, never cropped, centred in the slot.
- **Archive slide photos** render through `TL.Images.drawContain` into the
  fixed-aspect stage container — same semantics, letterboxed on an opaque
  backing so the world background never bleeds through.
- **World characters** (`TL.CHAR_DRAW`) stay hand-drawn sprites; avatars are
  used for dialogue portraits and archive covers, matching the current game
  look.

## Getting sharp results

1. **The loader auto-crops for you.** Imported avatars go through
   `_autocrop` in `js/images.js`: it finds the subject bounding box, centre-
   crops it to a square, and downscales to ≤240px before the dialogue box
   draws it into its 96×96 slot. So don't pre-crop aggressively — a photo
   with the machine centred on a plain background works great.
2. **Export at 512×512 or larger.** Since the loader resamples anyway,
   bigger sources survive the auto-crop + downscale crisply.
3. **Any aspect ratio is fine** — the auto-crop squares it, and the final
   draw is contained and centred (no stretch, no crop surprises).
4. **PNG with transparency works** — the corner colour defines what counts
   as background, so transparent PNGs crop to the subject.
5. After adding files, regenerate the asset manifest so the browser loads
   them:

   ```
   node tools/genmanifest.js
   ```

6. Refresh the page (Ctrl+F5 if the browser caches an old manifest).

## Current state

The `assets/avatars/` folder already ships with NASA photography for most
machines (from the archive set). Drop a file with the same name to replace
any of them; keep a backup of the original if you want it back.

**2026-11-15:** all twelve supplied photos are installed — eleven robot
avatars (`viking1`, `viking2`, `pathfinder`, `sojourner`, `spirit`,
`opportunity`, `phoenix`, `curiosity`, `insight`, `ingenuity`,
`perseverance`, blurred photo-frame borders trimmed) plus `player.png`
(kept as-is, clean pixel art). Both the dialogue portraits and the
mission-archive header portraits now use the imported photos, falling
back to the built-in pixel art if a file is missing.

**2026-11-15 (blurring "coming back after a new game") — root cause was
browser caching, not the game.** The avatar-corruption fix in
`js/images.js` was correct on disk, but the browser kept executing a
stale cached copy of that file (`http.server` and GitHub Pages send
plain cache headers, so browsers reuse old JS for a while). The old code
re-autocropped the already-cropped canvas on concurrent portrait
requests, collapsing avatars to a blank 8×8 that stretched into mush —
and because the old JS stayed cached, the bug kept re-appearing even
after "the fix", including on every new game. Fix: `index.html` now
loads every script with a version query (`js/*.js?v=20261115a`). When
any JS or CSS file changes, bump the `?v=` value in `index.html` so
browsers fetch fresh code immediately (also worth a Ctrl+F5 once).
