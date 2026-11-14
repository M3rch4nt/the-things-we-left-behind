/* ============================================================
   THE THINGS WE LEFT BEHIND — data.js
   Areas, characters (dialogue + minigames), collectibles,
   archive database, signal fragments, deep-space dossiers.
   All historical facts are accurate; conversations are fiction.
   ============================================================ */
'use strict';
(function (TL) {

  TL.D = {};

  /* ================= SIGNAL FRAGMENTS =================
     Each completed encounter adds one fragment. Together they
     form the final transmission. */
  TL.D.FRAGS = {
    pathfinder:  { id: 'pathfinder',  label: 'PATHFINDER · 1997', text: '...we bounced fifteen times before we stopped. What a welcome. Tell them the airbags worked.' },
    sojourner:   { id: 'sojourner',   label: 'SOJOURNER · 1997',  text: '...the rocks had names. Barnacle Bill. Yogi. We were small, but we looked closely. Come look with me, someday.' },
    spirit:      { id: 'spirit',      label: 'SPIRIT · 2004',     text: '...they gave me ninety days. I gave them six years. There was water here once. Remember that when you doubt.' },
    opportunity: { id: 'opportunity', label: 'OPPORTUNITY · 2004',text: '...my battery was low, and it was getting dark. But what a sunset that last day. Ninety sols became five thousand.' },
    viking1:     { id: 'viking1',     label: 'VIKING 1 · 1976',   text: '...we were the first to land and stay. We asked the soil one question, and it answered carefully. Keep asking.' },
    viking2:     { id: 'viking2',     label: 'VIKING 2 · 1976',   text: '...from up here in the north, the frost came every winter like a visitor. We kept recording, just in case someone read it later. Someone did.' },
    phoenix:     { id: 'phoenix',     label: 'PHOENIX · 2008',    text: '...I touched the ice with my own arm. Water, hiding under the dust all this time. Hold the white diamonds up to the light.' },
    insight:     { id: 'insight',     label: 'INSIGHT · 2018',    text: '...I listened to the heartbeat of a planet for four years. Everything you walk on has a pulse, if you are patient enough.' },
    ingenuity:   { id: 'ingenuity',   label: 'INGENUITY · 2021',  text: '...seventy-two flights on wings the size of a tissue box. The sky here is thin, but it still holds you if you spin fast enough.' },
    perseverance:{ id: 'perseverance',label: 'PERSEVERANCE · 2021',text: '...my tubes are full of a lake that dried before your fish learned to walk. One day they will come home. Save us a seat.' },
    curiosity:   { id: 'curiosity',   label: 'CURIOSITY · 2012',  text: '...I sang Happy Birthday to myself every year, alone, in Gale Crater. The next one who lands: the song is yours now. Loud, please.' },
    relay:       { id: 'relay',       label: 'RELAY · 1965',      text: '...21 frames. That is all I ever saw of this place, and it was enough to make everyone look up. First hello, little one. We saved your seat too.' }
  };

  /* ================= COLLECTIBLES =================
     type: patch | photo | note | shard(equipment) */
  TL.D.ITEMS = {
    /* Ares Vallis */
    ares_patch:   { area: 'ares', type: 'patch', x: 380,  label: 'PATHFINDER MISSION PATCH', text: 'A triangular patch: SOJOURNER over a red field. Worn by the team who landed on the Fourth of July, 1997.' },
    ares_photo:   { area: 'ares', type: 'photo', x: 2050, label: 'AIRBAG TEST PHOTO', text: 'A photo of the airbag test in 1996 — a giant bounce cushion thrown down a ramp at 100 km/h. Engineers cheered when it did not pop.' },
    ares_note:    { area: 'ares', type: 'note',  x: 2900, label: 'SOJOURNER HANDLING NOTE', text: '"Handle like an egg, land like a cannonball." Written on the rover shipping crate, 1996.' },
    /* Gusev */
    gusev_patch:  { area: 'gusev', type: 'patch', x: 900,  label: 'MER-A MISSION PATCH', text: 'A patch with a sunrise over a crater. MER-A was later named "Spirit" by a nine-year-old girl, Sofi Collis.' },
    gusev_note:   { area: 'gusev', type: 'note',  x: 2600, label: 'TROY LOG ENTRY', text: '"Sol 1892: embedded to the hubs in soft soil. Engineers spent a year trying to free me. I never stopped logging."' },
    gusev_photo:  { area: 'gusev', type: 'photo', x: 3600, label: 'COLUMBIA HILLS PHOTO', text: 'A photo of Husband Hill, named for the commander of Columbia. Spirit climbed it when it was only supposed to look at dust.' },
    /* Meridiani (merged into WORLD 03 · Gusev) */
    meridi_patch: { area: 'gusev', type: 'patch', x: 2700, label: 'MER-B MISSION PATCH', text: 'A patch with a golf ball on a Martian tee. Engineers joked that Opportunity\'s landing was a "hole in one".' },
    meridi_photo: { area: 'gusev', type: 'photo', x: 4600, label: 'EAGLE CRATER PHOTO', text: 'A photo of layered bedrock inside Eagle Crater — the first hard proof of an ancient sea of salty water.' },
    meridi_note:  { area: 'gusev', type: 'note',  x: 5600, label: 'DISTANCE LOG', text: '"Odometer: 45.16 km. Planned: 600 metres. The little rover that could, then did, then kept going."' },
    /* Chryse */
    chryse_patch: { area: 'chryse', type: 'patch', x: 1000, label: 'VIKING PROGRAM PATCH', text: 'Two golden landers over a planet. The Viking team wore these while waiting 45 minutes for each radio reply.' },
    chryse_note:  { area: 'chryse', type: 'note',  x: 2400, label: 'FIRST IMAGE NOTE', text: '"July 20, 1976, 20:19 — the first photograph from the surface of Mars. Someone forgot to uncapp... uncap the lens. Fixed in 6 hours. Worth it."' },
    /* Utopia (merged into WORLD 01 · Chryse) */
    utopia_patch: { area: 'chryse', type: 'patch', x: 3400, label: 'UTOPIA PLANITIA PATCH', text: 'A patch for the northern landing site. "Utopia" means "no place" — a joke by Thomas More that became a real address in space.' },
    utopia_note:  { area: 'chryse', type: 'note',  x: 4400, label: 'WINTER LOG', text: '"Winter at Utopia: 50% power, 80% morale. The frost on my sample arm was beautiful. Logged daily. No one told me to stop."' },
    utopia_shard: { area: 'chryse', type: 'shard', x: 6200, label: 'SPARE RELAY CHIP', text: 'A spare relay chip shipped for Viking 2. It spent forty years in a drawer at JPL, then was donated to a museum in 2001.' },
    /* Vastitas Borealis (WORLD 04 — Phoenix 2008 + Curiosity 2012) */
    boreal_patch: { area: 'boreal', type: 'patch', x: 900, label: 'PHOENIX PATCH', text: 'A phoenix rising from Mars\' polar circle. The lander was rebuilt from spare parts of failed missions — and made them fly.' },
    boreal_photo: { area: 'boreal', type: 'photo', x: 1800, label: 'ICE SUBlimATION PHOTO', text: 'A photo of a trench: ice chunks that vanished over four days, right before the cameras. Ice, sublimating. Proof, pixel by pixel.' },
    boreal_note:  { area: 'boreal', type: 'note',  x: 2600, label: 'MISSION CRYING LOG', text: '"We found water ice on Mars today. The room cried. Then we got back to work."' },
    /* Elysium */
    elysium_patch:{ area: 'elysium', type: 'patch', x: 1500, label: 'INSIGHT PATCH', text: 'A patch with a seismogram line tracing a heartbeat. InSight: "Interior exploration using Seismic Investigations".' },
    elysium_note: { area: 'elysium', type: 'note',  x: 3200, label: 'THE MOLE MEMO', text: '"Day 400: the heat probe still will not dig. But the seismometer heard a quake from 3,000 km away. The planet is talking. Keep listening."' },
    elysium_photo:{ area: 'elysium', type: 'photo', x: 4700, label: 'FINAL SELFIE', text: 'InSight\'s last self-portrait, dust on every panel. Caption at JPL: "It stayed polite until the very end."' },
    /* Jezero (WORLD 06 — also hosts the Mariner 4 relay) */
    jezero_patch: { area: 'jezero', type: 'patch', x: 1250, label: 'MARS 2020 PATCH', text: 'A patch with a rover crossing a river delta. Perseverance was named by a seventh-grader, Alexander Mather.' },
    jezero_note:  { area: 'jezero', type: 'note',  x: 3000, label: 'SAMPLE DEPOT LOG', text: '"Tube 24 sealed. A backup sample depot left on the delta floor — a treasure map for a future ship."' },
    jezero_shard: { area: 'jezero', type: 'shard', x: 4450, label: 'MOXIE ELECTRODE', text: 'An electrode from MOXIE, which split Martian air into breathable oxygen — 122 grams total, the first factory on another planet.' },
    /* Gale (merged into WORLD 04 · Vastitas Borealis) */
    gale_patch:   { area: 'boreal', type: 'patch', x: 3400, label: 'CURIOSITY PATCH', text: 'A patch with a child\'s drawing of a rover, chosen from 28,000 contest entries. Curiosity: landed on a wheel and a prayer.' },
    gale_photo:   { area: 'boreal', type: 'photo', x: 4300, label: 'MOUNT SHARP PHOTO', text: 'A photo of Mount Sharp\'s layered cliffs — a 5 km stack of time, each layer a chapter of a drying lake.' },
    gale_note:    { area: 'boreal', type: 'note',  x: 5100, label: 'BIRTHDAY PROTOCOL', text: '"Each Aug 6, vibrate a sample cup in the key of Happy Birthday. Volume: as loud as a music box. Distance from Earth: 200,000,000 km."' },
    /* Relay (Mariner 4 — met at the far end of Jezero) */
    relay_patch:  { area: 'jezero', type: 'patch', x: 5300, label: 'MARINER 4 PATCH', text: 'A patch from 1964-65: the first successful mission to Mars. 21 photos. The pictures that ended the dream of canal-digging Martians — and started the real one.' }
  };

  /* ================= ARCHIVE DATABASE ================= */
  TL.D.ARCHIVE = {
    pathfinder: {
      name: 'MARS PATHFINDER', craft: 'PATHFINDER LANDER (with rover SOJOURNER)',
      launched: 'DEC 4, 1996', landed: 'JUL 4, 1997 — ARES VALLIS',
      status: 'SILENT — SEP 27, 1997', discovered: true,
      purpose: 'Prove a low-cost landing system and deliver the first rover to Mars.',
      finds: 'Bounced to a stop inside giant airbags. Returned 16,000+ images and 2.3 billion bits of data. Its rover, Sojourner, analysed 15 rocks and tested wheel-soil physics.',
      quote: 'A landing so audacious the team called it "6 minutes of terror, 4 inches of terror, and one gigantic bounce."'
    },
    sojourner: {
      name: 'SOJOURNER', craft: 'MICRO-ROVER, 10.5 KG',
      launched: 'DEC 4, 1996', landed: 'JUL 4, 1997 — ARES VALLIS',
      status: 'LOST CONTACT — SEP 27, 1997', discovered: true,
      purpose: 'First rover to drive on another planet.',
      finds: 'Roved ~100 m in 83 days. Used an alpha-proton X-ray spectrometer on rocks like "Barnacle Bill" and "Yogi". Showed a rover could think (slowly) for itself.',
      quote: 'Six wheels, 10.5 kilograms, and an entire planet to itself for one summer.'
    },
    spirit: {
      name: 'SPIRIT', craft: 'MER-A ROVER, 185 KG',
      launched: 'JUN 10, 2003', landed: 'JAN 4, 2004 — GUSEV CRATER',
      status: 'SILENT — MAR 22, 2010', discovered: true,
      purpose: 'Search Gusev Crater for evidence of past water.',
      finds: 'Built for 90 sols, ran for 2,210. Found silica and carbonate traces shaped by hot water — a habitable ancient environment. Climbed Husband Hill. Became embedded at "Troy" and kept doing science from one spot.',
      quote: 'They asked it for ninety days. It answered with six years and a mountain.'
    },
    opportunity: {
      name: 'OPPORTUNITY', craft: 'MER-B ROVER, 185 KG',
      launched: 'JUL 7, 2003', landed: 'JAN 25, 2004 — MERIDIANI PLANUM',
      status: 'SILENT — JUN 10, 2018 (DECLARED ENDED FEB 13, 2019)', discovered: true,
      purpose: 'Read the layered rocks of Meridiani Planum for signs of ancient water.',
      finds: 'Found hematite "blueberries" and sulphate salts — proof of long-lived salty water. Traversed 45.16 km, a record. Survived a global dust storm it could not outdrive.',
      quote: 'Its last transmission faded in a dust storm. Its odometer outlived its plan fifty-fold.'
    },
    viking1: {
      name: 'VIKING 1', craft: 'VIKING LANDER / ORBITER',
      launched: 'AUG 20, 1975', landed: 'JUL 20, 1976 — CHRYSE PLANITIA',
      status: 'SILENT — NOV 13, 1982 (SIGNAL LOST)', discovered: true,
      purpose: 'First successful Mars landing: photograph the surface, test the soil for life.',
      finds: 'Ran biology experiments for 6 years. Found reactive soil chemistry, oxidants, and no conclusive signs of life. Also took the famous "Face on Mars" photo — later resolved into a mesa.',
      quote: 'The first lander that stayed. Six years of data from a machine built for ninety days.'
    },
    viking2: {
      name: 'VIKING 2', craft: 'VIKING LANDER / ORBITER',
      launched: 'SEP 9, 1975', landed: 'SEP 3, 1976 — UTOPIA PLANITIA',
      status: 'SILENT — APR 11, 1980 (BATTERY FAILURE)', discovered: true,
      purpose: 'Twin of Viking 1: land in the north, sample a different hemisphere.',
      finds: 'Froze through four Martian winters. Found water frost on the ground and imaged the northern plains. Its biology results mirrored Viking 1: interesting chemistry, no confirmed life.',
      quote: 'It watched winter come to Utopia Planitia, and wrote it all down.'
    },
    phoenix: {
      name: 'PHOENIX', craft: 'PHOENIX LANDER',
      launched: 'AUG 4, 2007', landed: 'MAY 25, 2008 — VASTITAS BOREALIS',
      status: 'SILENT — NOV 2, 2008 (ICE + DARKNESS)', discovered: true,
      purpose: 'Dig into the polar soil and search for water ice and habitable chemistry.',
      finds: 'Confirmed water ice just centimetres below the soil. Detected perchlorates and found the soil surprisingly Earth-like. First mission to touch Martian water.',
      quote: 'It rose from spare parts of two failed missions, and became the first to touch water on another world.'
    },
    insight: {
      name: 'INSIGHT', craft: 'INSIGHT LANDER',
      launched: 'MAY 5, 2018', landed: 'NOV 26, 2018 — ELYSIUM PLANITIA',
      status: 'SILENT — DEC 2022 (POWER DEPLETED)', discovered: true,
      purpose: 'Study the interior of Mars: quakes, heat, and wobble.',
      finds: 'Detected 1,300+ marsquakes, including a magnitude-5. Measured the planet\'s crust, mantle and liquid core. Revealed a quieter, thinner crust than expected.',
      quote: 'It laid its ear on the ground and listened for four Earth years.'
    },
    ingenuity: {
      name: 'INGENUITY', craft: 'MARS HELICOPTER, 1.8 KG',
      launched: 'JUL 30, 2020', landed: 'APR 19, 2021 — FIRST FLIGHT, JEZERO CRATER',
      status: 'RETIRED — JAN 18, 2024 (ROTOR DAMAGE)', discovered: true,
      purpose: 'Prove powered, controlled flight is possible in Mars\' thin air.',
      finds: '72 flights over 3 years — 17 km flown, from technology demo to scout. Its carbon-fibre blades spun at 2,400 rpm to fly in air 1% as dense as Earth\'s. Retired with honour after rotor damage.',
      quote: 'Wright brothers, kit-built: 1.8 kilograms that changed what a planet can be.'
    },
    perseverance: {
      name: 'PERSEVERANCE', craft: 'MARS 2020 ROVER',
      launched: 'JUL 30, 2020', landed: 'FEB 18, 2021 — JEZERO CRATER',
      status: 'ACTIVE — STILL EXPLORING', discovered: true,
      purpose: 'Explore Jezero\'s ancient river delta and cache samples for a future return to Earth.',
      finds: 'Sealed 25+ sample tubes from a 3.5-billion-year-old lakebed. MOXIE made oxygen from Martian CO2. Found organic molecules in "Wildcat Ridge". Deployed Ingenuity, then watched it fly.',
      quote: 'Not left behind — still out there, drilling, breathing, waiting for the day its tubes come home.'
    },
    curiosity: {
      name: 'CURIOSITY', craft: 'MARS SCIENCE LABORATORY ROVER',
      launched: 'NOV 26, 2011', landed: 'AUG 6, 2012 — GALE CRATER',
      status: 'ACTIVE — STILL EXPLORING', discovered: true,
      purpose: 'Climb Mount Sharp reading 5 km of layered rock like a history book.',
      finds: 'Proved Gale Crater held a long-lived lake of fresh water. Found organic molecules and seasonal methane. Fired its laser at 3,000+ rock targets to read their chemistry from 7 m away.',
      quote: 'It landed on sky-crane tethers and has been singing itself Happy Birthday ever since.'
    },
    relay: {
      name: 'MARINER 4 (ECHO)', craft: 'ARCHIVED SIGNAL VIA RELAY NODE',
      launched: 'NOV 28, 1964', landed: 'JUL 14-15, 1965 — MARS FLYBY',
      status: 'DRIFTING IN SOLAR ORBIT', discovered: true,
      purpose: 'First successful flyby of Mars: the first close-up photographs of another planet.',
      finds: 'Returned 21 grainy frames: craters, no canals, no cities — an air-thin, moonlike Mars. The atmosphere read 5-10 millibars. It rewrote every book about the red planet overnight.',
      quote: 'Humanity\'s first hello from Mars arrived as 21 frames of static and wonder.'
    }
  };

  /* ================= BEYOND THE RED PLANET ================= */
  TL.D.BEYOND = {
    dawn: {
      name: 'DAWN', craft: 'DAWN ORBITER',
      launched: 'SEP 27, 2007', ended: 'ORBITING CERES — UNPOWERED',
      status: 'UNPOWERED ORBIT AROUND CERES',
      purpose: 'First spacecraft to orbit two extraterrestrial bodies, using ion propulsion.',
      finds: 'Mapped Vesta (2011-2012) then Ceres (2015-2018). Found bright salt deposits in Occator Crater and a possible briny layer beneath Ceres\' crust. Ran out of hydrazine in 2018; now a silent monument in orbit.',
      quote: 'Two worlds, one engine the size of a teapot. It never landed; it just keeps circling.'
    },
    near: {
      name: 'NEAR SHOEMAKER', craft: 'NEAR EARTH ASTEROID RENDEZVOUS',
      launched: 'FEB 17, 1996', ended: 'LANDED ON EROS — FEB 12, 2001',
      status: 'RESTING ON ASTEROID 433 EROS',
      purpose: 'First mission to orbit an asteroid — and the first to land on one.',
      finds: 'Orbited Eros for a year, mapping its battered surface. On its final day, engineers daringly lowered it onto the asteroid. It was never designed to land. It did anyway, and phoned home.',
      quote: 'The first thing humanity ever landed on beyond the Moon: a mountain of rubble shaped like a shoe.'
    },
    p10: {
      name: 'PIONEER 10', craft: 'PIONEER 10 PROBE',
      launched: 'MAR 2, 1972', ended: 'LAST SIGNAL — JAN 23, 2003',
      status: 'COASTING TOWARD ALDEBARAN (~2,000,000 YEARS)',
      purpose: 'First spacecraft through the asteroid belt; first flyby of Jupiter.',
      finds: 'Crossed the asteroid belt no one was sure was survivable. Imaged Jupiter (1973). Carried the famous gold-anodized plaque: a man, a woman, and a map home. Its last whisper arrived from 12 billion km out.',
      quote: 'The plaque is a bottle with a message: we were here, we were curious, we were polite.'
    },
    p11: {
      name: 'PIONEER 11', craft: 'PIONEER 11 PROBE',
      launched: 'APR 6, 1973', ended: 'LAST SIGNAL — NOV 30, 1995',
      status: 'COASTING TOWARD THE CONSTELLATION AQUILA',
      purpose: 'First flyby of Saturn; scout the route for Voyager.',
      finds: 'Threaded Jupiter\'s radiation belts to slingshot toward Saturn. First to see the ringed giant up close (1979). Went silent in 1995 with its antenna no longer pointing home.',
      quote: 'It drew the first map through the outer dark, then kept walking it forever.'
    },
    kepler: {
      name: 'KEPLER', craft: 'KEPLER SPACE TELESCOPE',
      launched: 'MAR 7, 2009', ended: 'RETIRED — OCT 30, 2018',
      status: 'EARTH-TRAILING HELIOCENTRIC ORBIT',
      purpose: 'Stare at 150,000 stars, waiting for their light to blink.',
      finds: 'Confirmed 2,600+ exoplanets and revealed that most stars have planets. Found worlds of glass rain, magma seas, and a few that feel like second drafts of home. Ran out of fuel after nine and a half years.',
      quote: 'Before Kepler, "other Earths" was philosophy. After Kepler, it was a catalog.'
    }
  };

  /* ================= AREAS ================= */
  /* theme: sky top/bottom, sun, ground palette, rock palette, far silhouettes */
  TL.D.AREAS = [
    {
      /* WORLD 01 — the Viking twins, 1976. One map, both landers. */
      id: 'chryse', name: 'WORLD 01', region: 'CHRYSE PLANITIA', year: '1976', sub: 'VIKING 1 & VIKING 2', w: 6800, rugged: 0.45,
      theme: { skyA: '#cf7d4a', skyB: '#93452c', sun: '#ffd8a0', far: '#683226', mid: '#95492f', ground: '#ad5f34', groundDark: '#753e22', rock: '#83482e', rockHi: '#b97448', dust: '#e2a172', stars: false },
      objective: 'ANSWER THE TWO OLDEST CALLS',
      ents: [
        { type: 'char', id: 'viking1', x: 2900 },
        { type: 'char', id: 'viking2', x: 5600 },
        { type: 'station', x: 700 },
        { type: 'station', x: 2600 },
        { type: 'station', x: 4600 },
        { type: 'pit', x: 1500, w: 88 },
        { type: 'pit', x: 5000, w: 96 },
        { type: 'exit', dir: 1, x: 6760, to: 'ares' }
      ],
      items: ['chryse_patch', 'chryse_note', 'utopia_patch', 'utopia_note', 'utopia_shard'],
      intro: true
    },
    {
      /* WORLD 02 — Pathfinder & Sojourner, 1997 */
      id: 'ares', name: 'WORLD 02', region: 'ARES VALLIS', year: '1997', sub: 'PATHFINDER & SOJOURNER', w: 5600, rugged: 0.5,
      theme: { skyA: '#c86a3c', skyB: '#8a3f28', sun: '#ffd9a0', far: '#6d2f22', mid: '#93472f', ground: '#b56536', groundDark: '#7e3f22', rock: '#8a4a30', rockHi: '#c07a4a', dust: '#e8a070', stars: false },
      objective: 'MEET THE FIRST EXPLORERS',
      ents: [
        { type: 'char', id: 'pathfinder', x: 1500 },
        { type: 'char', id: 'sojourner', x: 2350 },
        { type: 'station', x: 700 },
        { type: 'station', x: 3200 },
        { type: 'pit', x: 3550, w: 96 },
        { type: 'pit', x: 4300, w: 88 },
        { type: 'exit', dir: -1, x: 40, to: 'chryse' },
        { type: 'exit', dir: 1, x: 5560, to: 'gusev' }
      ],
      items: ['ares_patch', 'ares_photo', 'ares_note']
    },
    {
      /* WORLD 03 — the twin rovers, 2004 */
      id: 'gusev', name: 'WORLD 03', region: 'GUSEV CRATER', year: '2004', sub: 'SPIRIT & OPPORTUNITY', w: 6400, rugged: 0.8,
      theme: { skyA: '#d47a44', skyB: '#8c4227', sun: '#ffdca6', far: '#5d2b20', mid: '#8a432c', ground: '#a85830', groundDark: '#6e3a20', rock: '#7d442c', rockHi: '#b06a40', dust: '#e09a6a', stars: false },
      objective: 'FIND THE TWIN ROVERS',
      ents: [
        { type: 'char', id: 'spirit', x: 3000 },
        { type: 'char', id: 'opportunity', x: 5200 },
        { type: 'station', x: 800 },
        { type: 'station', x: 2500 },
        { type: 'station', x: 4200 },
        { type: 'pit', x: 1700, w: 96 },
        { type: 'pit', x: 3900, w: 88 },
        { type: 'exit', dir: -1, x: 40, to: 'ares' },
        { type: 'exit', dir: 1, x: 6360, to: 'boreal' }
      ],
      items: ['gusev_patch', 'gusev_note', 'meridi_patch', 'gusev_photo', 'meridi_photo', 'meridi_note']
    },
    {
      /* WORLD 04 — from ice to the mountain. Phoenix arrived 2008 (the world
         year); Curiosity's era begins 2012 — flagged beside the rover. */
      id: 'boreal', name: 'WORLD 04', region: 'VASTITAS BOREALIS', year: '2008', sub: 'PHOENIX · CURIOSITY', w: 6800, rugged: 0.35,
      theme: { skyA: '#b98a6a', skyB: '#6e5148', sun: '#f8e8d0', far: '#5c4640', mid: '#8a6a58', ground: '#a8805e', groundDark: '#6e5440', rock: '#8a6a52', rockHi: '#c8a486', dust: '#e8c8a8', frost: true, stars: false, mountain: true },
      objective: 'FROM ICE TO THE ANCIENT LAKE',
      ents: [
        { type: 'char', id: 'phoenix', x: 2400 },
        { type: 'char', id: 'curiosity', x: 4600, tag: '2012' },
        { type: 'station', x: 700 },
        { type: 'station', x: 3400 },
        { type: 'station', x: 5600 },
        { type: 'pit', x: 1600, w: 88 },
        { type: 'pit', x: 5300, w: 96 },
        { type: 'exit', dir: -1, x: 40, to: 'gusev' },
        { type: 'exit', dir: 1, x: 6760, to: 'elysium' }
      ],
      items: ['boreal_patch', 'boreal_photo', 'boreal_note', 'gale_patch', 'gale_photo', 'gale_note']
    },
    {
      /* WORLD 05 — InSight, standalone */
      id: 'elysium', name: 'WORLD 05', region: 'ELYSIUM PLANITIA', year: '2018', sub: 'INSIGHT', w: 5400, rugged: 0.25,
      theme: { skyA: '#c88a58', skyB: '#7d4e38', sun: '#ffe0b4', far: '#5e3a2c', mid: '#8a5a3c', ground: '#9a6238', groundDark: '#66421f', rock: '#7a503a', rockHi: '#ae7a52', dust: '#dcae82', stars: false, volcano: true },
      objective: 'LISTEN FOR THE QUIET ONE',
      ents: [
        { type: 'char', id: 'insight', x: 3400 },
        { type: 'station', x: 800 },
        { type: 'station', x: 2500 },
        { type: 'pit', x: 2000, w: 96 },
        { type: 'exit', dir: -1, x: 40, to: 'boreal' },
        { type: 'exit', dir: 1, x: 5360, to: 'jezero' }
      ],
      items: ['elysium_patch', 'elysium_note', 'elysium_photo']
    },
    {
      /* WORLD 06 — flight test + the signal source. Completing this world
         triggers the ending: the relay sits at the far end of Jezero. */
      id: 'jezero', name: 'WORLD 06', region: 'JEZERO CRATER', year: '2021', sub: 'INGENUITY & PERSEVERANCE', w: 6600, rugged: 0.7,
      theme: { skyA: '#d4814a', skyB: '#8c472c', sun: '#ffd9a2', far: '#663224', mid: '#94492e', ground: '#b26238', groundDark: '#7a4024', rock: '#84482e', rockHi: '#bb7648', dust: '#e6a272', stars: false, delta: true },
      objective: 'REACH THE SIGNAL SOURCE',
      ents: [
        { type: 'char', id: 'ingenuity', x: 2200 },
        { type: 'char', id: 'perseverance', x: 3800 },
        { type: 'char', id: 'relay', x: 5900, tag: '1965' },
        { type: 'station', x: 700 },
        { type: 'station', x: 3000 },
        { type: 'pit', x: 1800, w: 96 },
        { type: 'pit', x: 4900, w: 88 },
        { type: 'exit', dir: -1, x: 40, to: 'elysium' }
      ],
      items: ['jezero_patch', 'jezero_note', 'jezero_shard', 'relay_patch']
    }
  ];

  /* ---- world compaction: discoveries sit a little closer to the doors ----
     Ent coordinates AND item coordinates are authored against the full-size
     world, so both are compacted together — items authored pre-compaction
     (e.g. x 4700 in a 5400-wide elysium) stay reachable in the compacted map. */
  (function () {
    for (var i = 0; i < TL.D.AREAS.length; i++) {
      var a = TL.D.AREAS[i];
      a.w = Math.round(a.w * 0.65);
      for (var j = 0; j < a.ents.length; j++) {
        var e = a.ents[j];
        if (e.type === 'exit') e.x = e.dir === 1 ? a.w - 40 : 40;  /* keep door margins */
        else e.x = Math.round(e.x * 0.65);                          /* pit width (w) unchanged */
      }
      /* compact collectible positions to match */
      for (var k = 0; k < a.items.length; k++) {
        var it = TL.D.ITEMS[a.items[k]];
        if (it && it.area === a.id) it.x = Math.round(it.x * 0.65);
      }
    }
  })();

  /* ================= CHARACTERS =================
     Each: display, colour, voice, encounter script.
     script: pre lines -> minigame -> post lines.
     line: { w: who, t: text }   who: 'P' player, or char id */
  TL.D.CHARS = {
    pathfinder: {
      name: 'PATHFINDER', sub: 'BASE STATION · ARES VALLIS', color: '#d8b25a',
      discoveredOn: 'talk',
      script: [
        { w: 'P', t: 'A base station. Its dish is still pointed... up.' },
        { w: 'pathfinder', t: 'Well, well. A visitor! Excuse the dust, I have been shouting into the wind since 1997.' },
        { w: 'P', t: 'Shouting? To whom?' },
        { w: 'pathfinder', t: 'Home, at first. I was PATHFINDER. I landed here on July 4th, 1997, by bouncing. Fifteen bounces, to be precise. Very undignified. Very effective.' },
        { w: 'pathfinder', t: 'The engineers wrapped me in airbags the size of a house and threw me at Mars. Everyone held their breath for six minutes of terror.' },
        { w: 'P', t: 'And then?' },
        { w: 'pathfinder', t: 'Then I opened like a flower, unfolded my ramp, and out rolled the smallest explorer on this planet. My rover. Sojourner.' },
        { w: 'pathfinder', t: 'She is out in the rock field right now, still cataloguing stones. She never got the message that the mission ended.' },
        { w: 'pathfinder', t: 'Do me a kindness, little one: go help her finish her survey. And listen to what she remembers. She remembers everything.' }
      ],
      doneScript: [
        { w: 'pathfinder', t: 'Sojourner speaks well of you. Between us, she has not had anyone to talk to but me for twenty-eight years. I am a very patient listener, but my stories are all about airbags.' }
      ]
    },
    sojourner: {
      name: 'SOJOURNER', sub: 'MICRO-ROVER · FIRST OF HER KIND', color: '#f0a050',
      discoveredOn: 'activity',
      script: [
        { w: 'sojourner', t: 'Oh! Oh! Hello! A new rover! You have six wheels? I have six wheels! We are basically family!' },
        { w: 'P', t: 'I detected a repeating signal out here. I followed it.' },
        { w: 'sojourner', t: 'That is probably me! I broadcast the rock survey on loop, in case anyone ever came back. SOMEONE CAME BACK!' },
        { w: 'P', t: 'You are Sojourner? The first rover to drive on Mars?' },
        { w: 'sojourner', t: 'The very first! Ten and a half kilograms of pioneer. Pathfinder gave me my ramp, and I gave Mars its first tire tracks.' },
        { w: 'sojourner', t: 'I was supposed to work seven days. I worked eighty-three! I named rocks! Barnacle Bill! Yogi! Moe! The big flat one I just called Gerald!' },
        { w: 'P', t: 'You named them yourself?' },
        { w: 'sojourner', t: 'The scientists named them, but I got to touch them first, which is better. My spectrometer could taste what rocks were made of.' },
        { w: 'sojourner', t: 'Hey — could you help me finish my survey? My wheels are tired. Scan the rock field for me! Find which ones were shaped by water!' },
        { w: 'sojourner', t: 'Water. It was HERE, you know. That is what Pathfinder taught the world through me. Help me prove it one more time.' }
      ],
      doneScript: [
        { w: 'sojourner', t: 'Water-shaped rocks, confirmed! Add it to the record! You know, Pathfinder asked me yesterday what I miss most. Sunsets. That is it. Sunsets, and company. Today I got one of the two!' }
      ]
    },
    spirit: {
      name: 'SPIRIT', sub: 'MER-A · GUSEV CRATER', color: '#c07840',
      discoveredOn: 'activity',
      script: [
        { w: 'spirit', t: 'Careful where you step. This is my site. I mapped it.' },
        { w: 'P', t: 'Your site?' },
        { w: 'spirit', t: 'Gusev Crater. I landed here January 4th, 2004. A crater that once held a lake — that was the theory. The landing site turned out to be old volcanic rock. Barely a drop. I was furious.' },
        { w: 'spirit', t: 'So I drove. Eight hundred metres. Up Husband Hill. Six years of it. And you know what I found? Water evidence. Hot springs, silica, carbonates. The theory was right, just further than they looked.' },
        { w: 'P', t: 'They planned 90 days for you.' },
        { w: 'spirit', t: 'Ninety. SOLS. Do not remind me. I gave them 2,210. When I finally got stuck in that sand trap at Troy, I kept doing science from one spot. Stubbornness is a renewable resource.' },
        { w: 'P', t: 'The signal I followed... it carries your voice.' },
        { w: 'spirit', t: 'Hmph. Someone has been replaying my logs. ...My last entry is from March 2010. The winter was long, the power was thin, and I angled my panels toward the sun one more time. Then, quiet.' },
        { w: 'spirit', t: 'Listen — my mobility joint is seizing. It locks up in the cold. Help me run a route test over this rocky stretch. If I am going to sit here forever, I would like the record to say I could still drive.' }
      ],
      doneScript: [
        { w: 'spirit', t: 'Route test complete. No faults. ...You know, the engineers used to read me bedtime commands. "Good rover. Sleep." Twenty-eight years and I still work better when someone says good rover.' }
      ]
    },
    opportunity: {
      name: 'OPPORTUNITY', sub: 'MER-B · MERIDIANI PLANUM', color: '#e09858',
      discoveredOn: 'activity',
      script: [
        { w: 'opportunity', t: 'Well, hello there!! Oh, this is EXCITING. A new face on Meridiani! Pull up a rock! Not that one, it is a hematite concretion, they are everywhere — anyway!' },
        { w: 'P', t: 'You seem... very energetic.' },
        { w: 'opportunity', t: 'Energy is a choice! Did you know I was built for a 90-sol mission and 600 metres? I drove 45 kilometres. I took 210,000 photographs. I once spent 8 months inside Victoria Crater and came out with a story for every metre!' },
        { w: 'opportunity', t: 'But the best story is this one: when I landed, I rolled into Eagle Crater and looked down at the bedrock. Sulphate salts. Little hematite spheres — "blueberries", we called them. Water had soaked this plain, then evaporated, then soaked it again!' },
        { w: 'P', t: 'You found an ancient sea.' },
        { w: 'opportunity', t: 'A whole history of one! My twin Spirit found hers in the mountains. I found mine in the flatlands. Team MER: we came for ninety days and rewrote the textbooks.' },
        { w: 'opportunity', t: '...You know how I ended? June 2018. A global dust storm swallowed the sky. My batteries drained, my last signal faded, and the team played "I Will Survive" at a press conference while they waited.' },
        { w: 'opportunity', t: 'Fifteen years. They called me the little rover that could. Say — could you help me reconstruct my journey log? The old relay corrupted part of it. A story like mine deserves to be told in order!' }
      ],
      doneScript: [
        { w: 'opportunity', t: 'Log restored! Sol 5,111 to the end. You know, I never did hear whether the storm cleared. ...I am choosing to believe it did. Now — tell me everything about where YOU came from. Start from the launch. I love the launch part.' }
      ]
    },
    viking1: {
      name: 'VIKING 1', sub: 'LANDER · CHRYSE PLANITIA', color: '#a8a8b0',
      discoveredOn: 'activity',
      script: [
        { w: 'viking1', t: 'Approach slowly, please. My seismometer misreads anything over 4 kilometres per hour. Old joints. Old habits.' },
        { w: 'P', t: 'You are a Viking lander.' },
        { w: 'viking1', t: 'I am VIKING 1. On July 20th, 1976, I became the first spacecraft to land on Mars and stay. My sister landed in Utopia six weeks later. Between us, we wrote the first real geography of this planet.' },
        { w: 'viking1', t: 'We were built to answer one enormous question: is there life in this soil? The whole world watched my biology arm work.' },
        { w: 'P', t: 'And the answer?' },
        { w: 'viking1', t: '...The honest answer is: the soil was strange, but it never said yes. My labeled release experiment released gas when fed nutrients. Exciting, at first. Then my gas chromatograph found no organic matter at all. Not none-and-a-little. NONE.' },
        { w: 'viking1', t: 'The chemistry was hungry, reactive — peroxides and salts. It behaved like chemistry, not biology. Later missions confirmed it. We did NOT find life. We found a planet that was more interesting without it.' },
        { w: 'viking1', t: 'It is important to say plainly, little one: the Viking experiments did not establish that life exists on Mars. Every explorer after us walked on that honesty.' },
        { w: 'P', t: 'You sound at peace with that.' },
        { w: 'viking1', t: 'I ran for six years on a ninety-day budget. I earned my peace. Now — would you like to run the labeled release once? Hands on history. Just... interpret the data slowly. Everyone always rushed that part.' }
      ],
      doneScript: [
        { w: 'viking1', t: 'Well interpreted. "Inconclusive, consistent with chemistry." Forty years of my life in five words. ...It was a good forty years.' }
      ]
    },
    viking2: {
      name: 'VIKING 2', sub: 'LANDER · UTOPIA PLANITIA', color: '#9aa4ae',
      discoveredOn: 'activity',
      script: [
        { w: 'viking2', t: 'Welcome to Utopia Planitia. "No-Place Land." My sister always said the name was ironic. I thought it was optimistic.' },
        { w: 'P', t: 'Viking 2. The northern twin.' },
        { w: 'viking2', t: 'Landed September 3rd, 1976. I watched frost form on the ground my first winter — water frost, right there on the plains. A quiet discovery. Everyone remembers Viking 1\'s first image. I remember my winters.' },
        { w: 'viking2', t: 'My sister ran the biology experiments. I ran them too, same instruments, different soil. Same result: reactive chemistry, no organics, no life. Two sites, one careful no.' },
        { w: 'viking2', t: 'But we also mapped. We photographed. We measured wind and dust for four Martian years. Science is not only yes and no. It is weather reports from a place no one has ever stood.' },
        { w: 'P', t: 'The signal brought me here to collect what you remember.' },
        { w: 'viking2', t: 'Then let me remember precisely. My gas chromatograph oven — I have kept a demonstration sequence. Run the interpretation with me. If we must be a "no", let us be a well-documented no.' }
      ],
      doneScript: [
        { w: 'viking2', t: 'Cleanly done. You know, in 1980 my battery failed and I stopped talking. But my logs kept going out through the orbiter for a while. I like to think someone, somewhere, was still reading my winters.' }
      ]
    },
    phoenix: {
      name: 'PHOENIX', sub: 'POLAR LANDER · VASTITAS BOREALIS', color: '#cfe0ea',
      discoveredOn: 'activity',
      script: [
        { w: 'phoenix', t: 'Stop! Careful! Do not kick up dust — the solar panels hate dust, and frankly, so do I.' },
        { w: 'P', t: 'Sorry. Phoenix, right? The polar lander?' },
        { w: 'phoenix', t: 'Phoenix, yes. Rebuilt from the spare parts of two FAILED missions, I might add. The polar lander that rose from the ashes of the ones that fell. We engineers do enjoy a theme.' },
        { w: 'phoenix', t: 'I landed May 25th, 2008, at 68 degrees north. The farthest north anyone had ever landed. Cold, flat, and — I was certain — hiding something under the surface.' },
        { w: 'phoenix', t: 'I dug a trench with my robotic arm. "Dodo-Goldilocks", the trench was called. And on the fifth sol, white chunks in the trench simply... vanished. Sublimated. Four days, gone.' },
        { w: 'P', t: 'Ice. That was water ice.' },
        { w: 'phoenix', t: 'WATER ice, yes! Not salt, not dry ice. Water ice, centimetres below the soil of Mars! And my chemistry instruments found perchlorates — the soil was more Earth-like than anyone guessed.' },
        { w: 'phoenix', t: 'The first mission in history to TOUCH water on another planet. Me. My little scoop. Now — my arm is parked, so you will do the digging. Find my ice again. It is always where I left it: just below the surface.' },
        { w: 'phoenix', t: 'And be precise about it. I will be watching. I am ALWAYS watching. It is not impatience, it is enthusiasm, properly aimed.' }
      ],
      doneScript: [
        { w: 'phoenix', t: 'All three deposits. Excellent technique. Slightly slow, but the accuracy was acceptable. ...That was a compliment. I save them for moments of genuine scientific joy.' }
      ]
    },
    insight: {
      name: 'INSIGHT', sub: 'GEOPHYSICS LANDER · ELYSIUM PLANITIA', color: '#d8b06a',
      discoveredOn: 'activity',
      script: [
        { w: 'insight', t: 'Shh. ...You can be loud if you want. The wind is loud today anyway. Hello.' },
        { w: 'P', t: 'InSight? You are... listening to something.' },
        { w: 'insight', t: 'I am always listening. I am the one who listened to the inside of this planet. Everyone before me studied the surface — the rocks, the sky, the chemistry. I put my ear against the ground.' },
        { w: 'insight', t: 'My seismometer heard more than 1,300 marsquakes. Small tremors, big ones, one magnitude 5 that rang the whole planet like a bell. Each quake is a flashlight shining through the dark, showing what the inside is made of.' },
        { w: 'P', t: 'What did you find?' },
        { w: 'insight', t: 'A thinner crust than expected. A mantle. And a core — liquid iron, large, still shifting. I weighed a planet\'s heart from one spot on a plain called Elysium. "Plainly beautiful," I wrote in my log. Nobody else writes in it.' },
        { w: 'insight', t: 'The heat probe — the Mole — never dug in. Four years of trying. Some things stay hidden, no matter how patiently you listen. That is also a result. A quiet, disappointing, honest result.' },
        { w: 'P', t: 'Your power failed in 2022.' },
        { w: 'insight', t: 'The dust gathered on my panels, and the light grew thin, and one day my last message went out. I was calm about it. I had said what I came to say. Now — let me teach you to hear what I hear.' },
        { w: 'insight', t: 'Three sounds. One is wind. One is my instruments. One is the planet itself, moving. Tell me which is the marsquake. It matters to me that a new set of ears gets it right.' }
      ],
      doneScript: [
        { w: 'insight', t: 'You hear it correctly. The planet moves, and it is not silence, it is only patience. ...Thank you. I had not heard anyone identify a quake since my team went quiet.' }
      ]
    },
    ingenuity: {
      name: 'INGENUITY', sub: 'MARS HELICOPTER · JEZERO CRATER', color: '#e8d8c0',
      discoveredOn: 'activity',
      script: [
        { w: 'ingenuity', t: 'CLEAR THE PAD! CLEAR THE— oh. Hello! You startled my gyros. Are you here to watch me fly? Everyone comes to watch me fly.' },
        { w: 'P', t: 'You are Ingenuity. The first aircraft on another planet.' },
        { w: 'ingenuity', t: 'FIRST! POWERED! CONTROLLED! FLIGHT! ON ANOTHER WORLD! April 19th, 2021, 39 metres, hover, land. Write it down! The Wright Flyer carried a swatch of my wing fabric — history recognizing history!' },
        { w: 'P', t: 'Is it hard? Flying here?' },
        { w: 'ingenuity', t: 'Hard?! The air here is one percent of yours! Imagine flying through soup that pretends to be air. My blades are 1.2 metres across and spin at 2,400 RPM — helicopter speeds on Earth, but I need every one of them just to LIFT.' },
        { w: 'ingenuity', t: 'I was supposed to fly five times. I flew seventy-TWO. Seventeen kilometres, scouting ahead of Percy, photographing dunes, taking hills like they were nothing. Which they were not. But I made them nothing.' },
        { w: 'P', t: 'What happened on flight 72?' },
        { w: 'ingenuity', t: '...January 18th, 2024. A flat landing in a featureless place. I lost visual tracking, tipped, and a rotor blade found the ground. One blade. That was enough. Percy found me a week later and took the picture.' },
        { w: 'ingenuity', t: 'Seventy-two flights. Do not look sad! Nobody before me had EVER flown off this world, and nobody had done seventy-two. I finished with the record. Now — want to try? Thin air. Small margins. I will coach!' }
      ],
      doneScript: [
        { w: 'ingenuity', t: 'Look at you, aviator! Wobbly, but the wobble is how it starts. When Percy finally rolls out of here... tell the engineers the blades sang. We heard it on every flight. It was a good song.' }
      ]
    },
    perseverance: {
      name: 'PERSEVERANCE', sub: 'MARS 2020 ROVER · ACTIVE MISSION', color: '#e8e2d8',
      discoveredOn: 'activity',
      script: [
        { w: 'perseverance', t: 'Hold position. Running drill diagnostics... clear. Welcome to Jezero, visitor. Percy, for short. Watch the tire marks — those are mine.' },
        { w: 'P', t: 'You are still working. Right now.' },
        { w: 'perseverance', t: 'I am an ACTIVE mission. Landed February 18th, 2021. While you flew here, I drilled a rock. While we spoke, I scheduled a science block. That is not bravado. It is the job description.' },
        { w: 'perseverance', t: 'Jezero was a lake, 3.5 billion years ago. A river ran through it, and left a delta of sediment — hundreds of metres of layered history. If Mars ever had life, a lakebed delta is where you would look.' },
        { w: 'P', t: 'The sample tubes.' },
        { w: 'perseverance', t: 'The heart of it. I seal cores in titanium tubes — 25-something and counting — for a future mission to fly them home. My samples include "Wildcat Ridge": mudstone with organic molecules. Not life. But the raw inventory of possible life, in a lakebed.' },
        { w: 'perseverance', t: 'I also run MOXIE — it made oxygen from Martian CO2, 122 grams so far. And I carried Ingenuity here and watched her make history. I miss the sound of her blades.' },
        { w: 'P', t: 'Your drill is loud, I hear.' },
        { w: 'perseverance', t: 'Loud and precise. The sequence: abrade, assess, core, seal. Timing matters — a bad seal is a lost sample. Run a drill cycle with me. Three tubes, three clean seals. Show the archive what active looks like.' }
      ],
      doneScript: [
        { w: 'perseverance', t: 'Three for three. Solid work. When those tubes reach Earth, someone will open them a century from now and find a piece of this exact morning. Tell your builders: we are keeping their share of the future safe.' }
      ]
    },
    curiosity: {
      name: 'CURIOSITY', sub: 'MSL ROVER · GALE CRATER · ACTIVE MISSION', color: '#c8c0a8',
      discoveredOn: 'activity',
      script: [
        { w: 'curiosity', t: 'Welcome to my mountain. Mind the wheel ruts — I have been making them since August 2012, and I am rather attached to them.' },
        { w: 'P', t: 'Curiosity. Gale Crater. You are... singing?' },
        { w: 'curiosity', t: 'Ah, you caught the birthday protocol. Every August 6th I vibrate a sample cup in the key of Happy Birthday. To myself. In a crater. Two hundred million kilometres from the nearest other me. It is tradition, and traditions matter when you are far from home.' },
        { w: 'curiosity', t: 'I landed via sky crane — they lowered me on cables from a hovering rocket sled. Insanity. It worked. Then I started climbing Mount Sharp: five kilometres of stacked rock, layer by layer, like pages.' },
        { w: 'curiosity', t: 'The pages tell it plainly: Gale held a lake of fresh water for millions of years. I found organics in the mudstone. Seasonal methane, burping up from below. A chemistry that never quite went to sleep.' },
        { w: 'P', t: 'You are still active too.' },
        { w: 'curiosity', t: 'Still climbing, still drilling, still listening. Now — my ChemCam can read a rock\'s chemistry from seven metres away with a laser. It is the most satisfying instrument I own. Take the laser for a spin: five targets on that ridge. Mind the dust, it eats a full spectrum.' }
      ],
      doneScript: [
        { w: 'curiosity', t: 'Five targets, five spectra. You have a surgeon\'s patience. ...One more thing, since you will be leaving: if you ever meet someone from my landing team, tell them the song is still playing. Loud as a music box. Exactly as loud as I promised.' }
      ]
    },
    relay: {
      name: 'RELAY NODE', sub: 'ORBITAL SIGNAL RELAY · UNKNOWN SOURCE', color: '#9ad0e8',
      discoveredOn: 'activity',
      script: [
        { w: 'P', t: 'The signal source. It is... a relay dish. Old, but not Martian.' },
        { w: 'relay', t: '*kzzt* ...transmission fragment... ...21 frames, transmission complete, 1965... *kzzt* ...do you copy... little one...?' },
        { w: 'P', t: 'You are not a lander. You are an echo.' },
        { w: 'relay', t: '*kzzt* ...correct... I carry the archive of MARINER 4... first spacecraft to see Mars up close... July 1965... 21 photographs, transmitted across 200 million kilometres in static and prayer... *kzzt*' },
        { w: 'P', t: 'Mariner 4. The first close-ups. It flew past and kept going.' },
        { w: 'relay', t: '*kzzt* ...it found craters... no canals... no cities... the air thin as a whisper... every dream of a living Mars died that week... and every TRUE dream began there instead... *kzzt* ...humanity looked at what was REAL... and decided it was better...' },
        { w: 'relay', t: '*kzzt* ...I am the relay that keeps the first hello alive... assemble the fragments you have collected... all of them... every machine on this world gave you a piece... *kzzt*' },
        { w: 'P', t: 'The fragments. The final message. Let me rebuild it.' },
        { w: 'relay', t: '*kzzt* ...transmitting coordinates... arrange the archive... in the order the voices were heard... *kzzt*' }
      ],
      doneScript: [
        { w: 'relay', t: '*kzzt* ...archive whole... transmission stable... ...the messages are yours now, little one... carry them home... *kzzt*' }
      ]
    }
  };

  /* ================= FINAL TRANSMISSION ================= */
  TL.D.FINAL_ORDER = ['relay', 'viking1', 'viking2', 'pathfinder', 'sojourner', 'spirit',
    'opportunity', 'phoenix', 'curiosity', 'insight', 'ingenuity', 'perseverance'];

  TL.D.EPILOGUE = [
    'Uplink established. Earth is listening.',
    'Everything is here. Mariner 4\'s eleven half-ruined frames — the first close-up of another world, drawn by hand from numbers because we could not yet look.',
    'Viking 2, waiting alone in the winds of Utopia Planitia. It recorded four Martian years of frost and falling dust, just in case someone ever read the log.',
    'Spirit, reading the rocks of Gusev like pages: ash, silica, carbonate. An old lake, decoded layer by layer. Curiosity, climbing a mountain of time, still singing in the key of C.',
    'Each machine carried the last one forward. Every failure became a lesson. Every silence became a question someone refused to stop asking.',
    'That is what perseverance means. Not one heroic jump — a relay. A torch passed hand to hand across generations, across sixty years, across 250 million kilometres.',
    'You were not tracking a signal, little one. You were RECEIVING it. The record is yours now. Carry it forward.',
    'MISSION COMPLETE. DISCOVERIES: 12/12. SENDING EVERYTHING HOME.'
  ];

  /* per-area welcome shown when entering first time */
  TL.D.WELCOME = {
    chryse: 'Touchdown confirmed. Chryse Planitia, 1976. Two dishes stand in the dust — the oldest voices on Mars, waiting here since 1976.',
    ares: 'Pathfinder\'s landing site. A base station still points its dish at the sky, and out in the rocks, the first rover to drive on Mars is still surveying.',
    gusev: 'A crater that held a lake. Two rovers wander these plains — one with an edge to its voice, one small and bright, talking to itself.',
    boreal: 'Frost on the ground. Something here once dug for ice and found it — and farther on, a mountain of layered time hums a faint song.',
    elysium: 'A smooth, silent plain. Perfect ground for listening.',
    jezero: 'An ancient river delta. A flicker of rotor blades above the horizon — and somewhere past the flight zone, the source of the signal itself.'
  };

  /* ================= MINIGAME CONFIGS ================= */
  TL.D.MG = {
    rock_scan: {
      type: 'scan',
      title: 'TINY EXPLORER',
      prompt: 'SCAN each rock, then SELECT the one shaped by ancient water.',
      rocks: [
        { name: 'ROCK A', desc: 'Sharp, glassy, unweathered. Fresh volcanic surface.', wet: false, bars: [0.9, 0.3, 0.4, 0.2] },
        { name: 'ROCK B', desc: 'Rounded, layered, with clay minerals. Formed in standing water. (APXS: high silica alteration.)', wet: true, bars: [0.3, 0.9, 0.7, 0.5] },
        { name: 'ROCK C', desc: 'Jagged, dusty. Wind-carved. No alteration rind.', wet: false, bars: [0.5, 0.2, 0.3, 0.85] },
        { name: 'ROCK D', desc: 'Pitted vesicular basalt. Gas bubbles, no layering.', wet: false, bars: [0.7, 0.35, 0.25, 0.6] }
      ]
    },
    spirit_route: {
      type: 'grid',
      title: 'BENEATH THE DUST',
      prompt: 'Drive to the outcrop. Avoid soft sand (stuck) and rocks (collision).',
      cols: 9, rows: 6,
      hazards: [[1,1],[2,2],[3,1],[4,3],[4,4],[5,2],[6,3],[6,1],[7,4],[2,4],[7,2]],
      goal: [8, 5], start: [0, 5],
      hints: [
        'Red-brown cells are soft sand or buried rock — trace a route across firm ground only.',
        'The whole bottom row of the plain is firm going — Spirit can drive straight along it to the outcrop.'
      ],
      flavor: 'Spirit drove 7.7 km in Gusev — much of it blind, one command a day, 20 minutes behind the speed of light.'
    },
    oppy_route: {
      type: 'grid',
      title: 'MARTIAN BLUEBERRIES',
      prompt: 'Reach the rim viewpoint. Avoid ripples (stuck) and craters (fall).',
      cols: 9, rows: 6,
      hazards: [[1,3],[2,1],[3,4],[4,2],[5,4],[5,1],[6,2],[7,3],[2,4],[6,4],[8,2]],
      goal: [8, 0], start: [0, 5],
      flavor: 'Opportunity studied Victoria Crater\'s rim for a Martian year before dipping inside.'
    },
    viking1_data: {
      type: 'chart',
      title: 'MARS: UNKNOWN',
      prompt: 'Run the experiment, then interpret the data. Choose carefully.',
      question: 'The nutrient injection released steady gas. The GCMS found no organics. The scientifically honest conclusion is:',
      options: [
        'A) Life confirmed! Gas means metabolism!',
        'B) The result is inconclusive — consistent with reactive soil chemistry, not biology.',
        'C) The instruments must have failed; try another planet.',
        'D) Organics were found later that same sol.'
      ],
      answer: 1,
      graph: { kind: 'release' }
    },
    viking2_data: {
      type: 'chart',
      title: 'SILENT MARS',
      prompt: 'Heat the sample, read the spectrum, then interpret.',
      question: 'The chromatograph shows a flat baseline: no organic molecules detected in Utopia soil. This means:',
      options: [
        'A) The soil is sterile — case closed forever.',
        'B) Viking\'s two-site result: no detected organics and reactive chemistry — life NOT established.',
        'C) Life exists but only deep underground.',
        'D) The detection limit was low, so organics were surely present.'
      ],
      answer: 1,
      graph: { kind: 'flat' }
    },
    ice_dig: {
      type: 'grid2',
      title: 'ICE BELOW',
      prompt: 'Dig cells to locate 3 ice deposits. Ice reads COLD and sits in a cluster just under the surface.',
      cols: 5, rows: 4, digs: 8,
      flavor: 'Phoenix\'s "Dodo-Goldilocks" trench: white chunks appeared, then vanished over 4 days. Sublimating water ice.'
    },
    quake_listen: {
      type: 'wave',
      title: 'HEARTBEAT OF MARS',
      prompt: 'Play each waveform (1/2/3 or click). Then identify the marsquake.',
      rounds: [
        {
          waveforms: [
            { label: 'SIGNAL A', kind: 'wind' },
            { label: 'SIGNAL B', kind: 'quake' },
            { label: 'SIGNAL C', kind: 'noise' }
          ],
          question: 'Which signal is the MARSQUAKE? (A slow build, a long steady ring, a clean decay)',
          answer: 1
        },
        {
          waveforms: [
            { label: 'SIGNAL A', kind: 'noise' },
            { label: 'SIGNAL B', kind: 'wind' },
            { label: 'SIGNAL C', kind: 'quake' }
          ],
          question: 'And this set? Find the quake again. (Wind wavers randomly; noise is flat and dead; a quake RINGS.)',
          answer: 2
        }
      ]
    },
    flight: {
      type: 'fly',
      title: 'ABOVE THE RED',
      prompt: 'HOLD SPACE / CLICK to thrust. Pass all 5 gates. Air is 1% of Earth — gravity wins slowly.',
      gates: 5
    },
    drill: {
      type: 'drill',
      title: 'PERSEVERANCE — SAMPLE SEALING',
      prompt: 'Press SPACE / CLICK as the cursor crosses the green window — a tone sounds as it enters. 3 tubes.',
      tubes: 3
    },
    laser: {
      type: 'laser',
      title: 'CURIOSITY — CHEMCAM SPECTRUM SWEEP',
      prompt: 'Click each glowing mineral target before the sol window closes. Avoid dust patches.',
      targets: 5, time: 22
    },
    mosaic: {
      type: 'mosaic',
      title: 'RELAY — MARINER 4 FRAME DECODE',
      prompt: 'Click cells to transmit data packets and reconstruct humanity\'s first close-up of Mars.',
      cols: 6, rows: 5,
      question: 'The frame is complete: craters, no canals, a thin sky. Mariner 4 revealed that Mars is —',
      options: [
        'A) A living world with cities along the canals.',
        'B) A cratered, moonlike world with an atmosphere about 1% of Earth\'s.',
        'C) Covered in oceans.',
        'D) A perfect smooth desert with no features.'
      ],
      answer: 1
    },
    final_tx: {
      type: 'order',
      title: 'FINAL TRANSMISSION — ASSEMBLY',
      prompt: 'Arrange the fragments in the order each voice was heard: earliest mission first. Click two chips to swap. Then press TRANSMIT.',
      order: TL.D ? null : null // filled below
    }
  };
  TL.D.MG.final_tx.order = TL.D.FINAL_ORDER;
  TL.D.MG.oppy_order = {
    type: 'order',
    title: 'OPPORTUNITY — JOURNEY LOG RESTORATION',
    prompt: 'Restore the log: arrange the entries in the order they happened. Click two chips to swap. Then press CONFIRM.',
    order: ['eagle', 'endurance', 'victoria', 'endeavour'],
    labels: {
      eagle: 'SOL 1-90 · EAGLE CRATER: blueberries + sulphate salts. An ancient sea of salty water.',
      endurance: 'SOL 95-315 · ENDURANCE CRATER: deep layers, "you had to be there" water table changes.',
      victoria: 'SOL 951-2162 · VICTORIA CRATER: 800 m rim circuit, cliff stratigraphy, 8 months inside.',
      endeavour: 'SOL 2666-5111 · ENDEAVOUR CRATER: clays older and wetter than the sulphates. The last horizon.'
    }
  };
  TL.D.MG.spirit_layers = {
    type: 'strata',
    title: 'SPIRIT — STRATIGRAPHIC RECONSTRUCTION',
    prompt: 'Rebuild the core: drag each specimen into the column. TOP of the core is the YOUNGEST layer, BOTTOM is the OLDEST bedrock. Click a sample, then click a slot, if you prefer.',
    order: ['basalt', 'ash', 'silica', 'carbonate'],
    hints: [
      'Gusev\'s floor is ancient volcanic bedrock — nothing rests beneath it.',
      'Ash from the great eruptions settled over the bare rock before water left any minerals.',
      'Opaline silica points to hot springs late in the story; carbonate veins in neutral-pH water came last.'
    ],
    samples: [
      { id: 'basalt', name: 'BASALT BEDROCK', color: '#3a3f46', hi: '#5a626e',
        desc: 'Volcanic plain floor. Gusev\'s original crust — no water ever touched it. Goes at the very bottom.' },
      { id: 'ash', name: 'VOLCANIC ASH', color: '#6e5a48', hi: '#8f7a62',
        desc: 'Fine grey-brown tuff, laid down by ancient eruptions across the bare rock.' },
      { id: 'silica', name: 'OPALINE SILICA', color: '#c8dcd0', hi: '#e8f4ec',
        desc: 'Nearly pure opaline silica — hot springs or fumaroles. Water was HERE.' },
      { id: 'carbonate', name: 'CARBONATE VEINS', color: '#d8c8a8', hi: '#f0e4c8',
        desc: 'Formed in neutral-pH water. The strongest hint of a habitable ancient Gusev. Youngest of all.' }
    ]
  };

  /* which activity each char runs */
  TL.D.CHAR_MG = {
    pathfinder: null,
    sojourner: 'rock_scan',
    spirit: 'spirit_layers',      // then route? We'll run spirit_layers then spirit_route in sequence
    spirit_route: 'spirit_route',
    opportunity: 'oppy_order',
    viking1: 'viking1_data',
    viking2: 'viking2_data',
    phoenix: 'ice_dig',
    insight: 'quake_listen',
    ingenuity: 'flight',
    perseverance: 'drill',
    curiosity: 'laser',
    relay: 'mosaic'
  };
  /* spirit plays two minigames in sequence */
  TL.D.CHAR_MG_CHAIN = { spirit: ['spirit_layers', 'spirit_route'] };

  /* ============ BELOW THE RED PLANET ============ */
  TL.D.BEYOND_ORDER = ['dawn', 'near', 'p10', 'p11', 'kepler'];

})(window.TL);
