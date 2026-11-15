# INTRO CINEMATIC BACKDROPS — drop your photos here

Each file (if present) replaces one scene of the opening cinematic with
your image, full-screen. Dialogue moves to a subtitle bar at the bottom
automatically so it never covers your photo.

## File names

| File name    | Scene (as labelled in-game)                  |
|--------------|----------------------------------------------|
| `scene1`     | SCENE 1/4 — Earth, the look back home        |
| `scene2`     | SCENE 2/4 — mission control room             |
| `scene3`     | SCENE 3/4 — launch, then cruise to Mars      |
| `scene4`     | SCENE 4/4 — the landing                      |

Extensions accepted, in order of preference:
`scene1.jpg`, `scene1.png`, `scene1.jpeg`, `scene1.webp`

## Art direction

- 16:9 landscape, at least 960×540 px (1920×1080 ideal).
- Scene 1: a view of Earth from space, or a night sky over a launch site.
- Scene 2: a mission control room / clean room with engineers and screens.
- Scene 3: a rocket on the pad, or a spacecraft against the stars.
- Scene 4: a lander descending / a rover on red soil.
- The game adds a soft vignette, scanlines and a letterbox on top, so
  slightly busy photos still look cohesive.
- Leave the **bottom ~130 px** relatively calm — the subtitle bar sits
  there when the scene has dialogue.

## Notes

- Drop files in, then run `node tools/genmanifest.js` once to index them.
  Refresh the page.
- Missing files fall back to the built-in pixel-art scenes.
- Files are served statically — works on any static host.

## Outro photography

- [Earth from the Martian twilight, PIA17936](https://science.nasa.gov/photojournal/bright-evening-star-seen-from-mars-is-earth/)
- [Sunset in Gale Crater, PIA19400](https://science.nasa.gov/photojournal/sunset-in-mars-gale-crater/)

Both images were taken by Curiosity and credited to NASA/JPL-Caltech/MSSS/Texas A&M University.
