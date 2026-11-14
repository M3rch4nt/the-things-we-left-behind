# Presentation Frames — Image Audit

`node tools/imagedims.js assets/archives assets/cinematic assets/avatars`

Every presentation image now renders inside a **fixed-aspect container with
KEEP_ASPECT_CENTERED semantics** (`TL.Images.drawContain` in `js/images.js`,
used by the archive slide stage in `js/archives.js` and the lens magnifier).
The whole frame is always visible: never cropped, never stretched, always
centred on an opaque `#04080e` letterbox backing that also seals the world
background out during transitions.

That means **no image can look broken or scattered anymore** — odd-shaped
sources letterbox instead of distorting. The list below documents the frames
whose native aspect differs strongly from a photo frame (≈3:2 to 16:9), so
they display with large margins. If any of them bothers you, re-crop or
re-export the source and drop it over the same filename.

## Ultra-wide panoramic strips (very letterboxed, worth re-cropping)
| File | Size | Aspect | Note |
|---|---|---|---|
| `archives/opportunity/frame4.jpg` | 7000×1070 | 6.54 | Mars panoramic mosaic — huge margins top/bottom |
| `archives/spirit/frame5.jpg` | 1919×343 | 5.59 | thin panorama strip |
| `archives/curiosity/frame3.jpg` | 6612×1241 | 5.33 | panorama mosaic |
| `archives/curiosity/frame2.jpg` | 1920×445 | 4.31 | panorama strip |
| `archives/viking1/frame4.jpg` | 1744×512 | 3.41 | panorama strip (same file is used as `avatars/viking1.jpg` — very wide avatar source) |
| `avatars/viking2.jpg` | 1614×512 | 3.15 | wide strip as avatar source — crops well but is a panorama |

## Portrait / tall sources (large side margins)
| File | Size | Aspect | Note |
|---|---|---|---|
| `archives/viking1/frame2.jpg` | 732×1565 | 0.47 | tall scan/figure |
| `archives/phoenix/frame3.jpg` | 1024×2520 | 0.41 | very tall strip |
| `archives/viking2/frame1.jpg` | 1127×2989 | 0.38 | very tall scan |
| `archives/viking2/frame2.jpg` | 319×922 | 0.35 | very tall thin strip |
| `archives/kepler/frame1.jpg` + `avatars/kepler.jpg` | 1285×1920 | 0.67 | portrait |
| `archives/dawn/frame1.jpg` + `avatars/phoenix.jpg` | ~1260×1920 | 0.66 | portrait |
| `archives/near/frame1.jpg` | 694×1000 | 0.69 | portrait |
| `archives/kepler/frame2.jpg` | 1539×1920 | 0.80 | portrait |
| `archives/viking2/frame4.jpg` | 1505×1920 | 0.78 | portrait |
| `archives/near/frame3.jpg` | 792×1000 | 0.79 | portrait |
| `avatars/insight.jpg` | 1780×1920 | 0.93 | near-square portrait |
| `archives/relay/frame1.jpg` + `avatars/relay.jpg` | 1209×1280 | 0.94 | near-square portrait |

## Square sources (mild letterbox, fine as-is)
`dawn/frame2`, `dawn/frame4`, `insight/frame2`, `insight/frame3`,
`opportunity/frame3`, `p10/frame3`, `phoenix/frame2`, `spirit/frame2`,
`avatars/spirit.jpg`, `cinematic/scene1` (1920×1897).

## Everything else
60+ frames sit in the comfortable 1.3–1.8 photo range and fill the stage
with only thin margins — including all four cinematic scenes
(`cinematic/scene1–4`) and the remaining archive frames.

## Pipeline notes
- After dropping in new/edited images, regenerate the manifest:
  `node tools/genmanifest.js`
- The audit always reflects what ships: run it again after any asset change.
- Avatars are drawn at 96×96 in the dialogue box with smoothing enabled for
  imported photos; any aspect source is contained (see `AVATARS.md`).
