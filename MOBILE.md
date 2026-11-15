# Mobile support

The complete 960 × 540 game frame and all existing content remain available.
On touch devices, controls stay at least 44 CSS pixels tall/wide, outside the
game frame. Portrait places them below the game; short landscape screens put
them on either side. Desktop retains the monitor chassis and keyboard/mouse.

## Controls

- Arrows: movement, menu navigation, and route activities.
- Jump / Fire: jumping, timing actions, and held helicopter thrust.
- Interact / Select: conversations, confirmation, and opening archives.
- Pause / Back: pause/resume, leave menus, or skip the introduction.
- Tap the canvas to select; drag for sliders, samples, and archive lenses.
- Lens and Scan appear in mission slides. Prev / Next turn pages.
- Mute works independently of the archive lens.
- Enlarge opens a full-resolution view for reading small text. Swipe to pan;
  return to Fit view for drag interactions and action games. Landscape gives
  the largest complete game view on phones.

Safe-area padding accommodates notches. Input releases on cancellation,
loss of focus, and leaving the page. Audio unlocks on the first touch.
No missions, activities, archives, saves, audio, or settings were removed.
The decorative chassis is hidden on touch devices to make room for the game.

## Images on other computers

The image loader now probes image files when `assets/manifest.json` is
unavailable or stale. Intro, archive, and outro image paths resolve from the
game's script location, so hosted views in a project subfolder work even
when a web viewer uses a different page address. This also fixes opening
`index.html` from a local folder. Share the complete project folder or ZIP;
`index.html` alone does not contain the images. Browser checks confirm all
four intro photos and both outro photos load from `file://`, a hosted project
subfolder, and a hosted subfolder with the manifest unavailable.

## Verification

Browser emulation passed at 320×568, 390×844, 667×375, 844×390,
1024×768, and desktop 1440×900. Checks cover control sizing/bounds,
menu entry/exit, simultaneous movement and jumping, release, pause/resume,
volume dragging, enlarged view, slide navigation, independent lens/mute,
and construction/update/drawing of all 14 activities. JavaScript syntax and
git whitespace checks passed. Activity smoke checks are not a complete
playthrough. Physical iOS Safari and Android devices have not been tested.

Run the regression check with Node.js and Playwright installed:

```sh
npm install --no-save playwright
npx playwright install chromium
node tests/mobile.cjs
node tests/images.cjs
```

Optionally set MOBILE_TEST_BROWSER to an installed Chromium browser's path.
The test serves the project on localhost:8766 and writes two screenshots to
the OS temporary folder. Test progress does not modify the real browser save.

## Applying this version

Serve index.html and the css, js, and assets directories as before; no build
step or runtime dependency was added. Existing save keys and formats are
unchanged. Changed scripts/styles have new cache version strings.
This copy is based on Git revision 3fc1bf15205c71d6294db342738135ffbc6b69ec.
