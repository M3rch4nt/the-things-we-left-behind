/* ============================================================
   THE THINGS WE LEFT BEHIND — screens.js
   Title, cinematic intro, HUD, pause, map, archive,
   settings, epilogue, beyond-the-red-planet.
   ============================================================ */
'use strict';
(function (TL) {

  /* ================= TITLE ================= */
  var Title = { sel: 0, t: 0, items: [] };
  TL.Title = Title;

  Title.rebuild = function () {
    var hasSave = TL.S && (TL.S.seenIntro || TL.S.discoveries.length > 0 || TL.S.finaleDone);
    Title.items = [];
    if (hasSave) Title.items.push({ label: 'CONTINUE EXPEDITION', act: 'continue' });
    Title.items.push({ label: hasSave ? 'NEW EXPEDITION' : 'BEGIN EXPEDITION', act: 'new' });
    Title.items.push({ label: 'MISSION ARCHIVE', act: 'archive' });
    Title.items.push({ label: 'SETTINGS', act: 'settings' });
    Title.items.push({ label: 'ABOUT', act: 'about' });
  };

  Title.update = function (dt) {
    Title.t += dt;
    Title.rebuild();
    if (Title.confirmNew) { Title.confirmT += dt; return; }   /* hold menu input while the confirm dialog is open */
    if (TL.hit('arrowup') || TL.hit('w')) { Title.sel = (Title.sel + Title.items.length - 1) % Title.items.length; TL.audio.ui(); }
    if (TL.hit('arrowdown') || TL.hit('s')) { Title.sel = (Title.sel + 1) % Title.items.length; TL.audio.ui(); }
    for (var i = 0; i < Title.items.length; i++) {
      var y = 330 + i * 34;
      if (TL.mouse.x > 330 && TL.mouse.x < 630 && TL.mouse.y > y - 6 && TL.mouse.y < y + 20) {
        if (TL.mouse.clicked) { Title.sel = i; Title.choose(); }
      }
    }
    if (TL.hit('enter') || TL.hit('e') || TL.hit('space')) Title.choose();
  };
  Title.choose = function () {
    var it = Title.items[Title.sel];
    if (!it) return;
    TL.audio.confirm();
    if (it.act === 'continue') { TL.G.startGame(true); }
    else if (it.act === 'new') { Title.confirmNew = true; Title.confirmT = 0; }
    else if (it.act === 'archive') { TL.G.mode = 'archive'; TL.Archive.tab = 'hw'; }
    else if (it.act === 'settings') { TL.G.mode = 'settings'; TL.G.settingsBack = 'title'; }
    else if (it.act === 'about') { TL.G.mode = 'about'; }
  };

  Title.draw = function (ctx) {
    /* starfield */
    ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, TL.W, TL.H);
    var rr = TL.RNG(5);
    for (var i = 0; i < 120; i++) {
      var sx = rr() * TL.W, sy = rr() * TL.H * 0.7;
      var tw = 0.3 + 0.7 * Math.abs(Math.sin(Title.t * 0.8 + i));
      ctx.globalAlpha = tw * 0.8; ctx.fillStyle = rr() > 0.85 ? '#e8d0a0' : '#c8d8e8';
      ctx.fillRect(sx | 0, sy | 0, 2, 2);
    }
    ctx.globalAlpha = 1;
    /* Mars panorama */
    var g = ctx.createLinearGradient(0, 300, 0, TL.H);
    g.addColorStop(0, '#3a1c14'); g.addColorStop(1, '#160a08');
    ctx.fillStyle = g; ctx.fillRect(0, 340, TL.W, TL.H - 340);
    /* mesas */
    ctx.fillStyle = '#57281c';
    for (i = 0; i < 8; i++) {
      var mx = i * 150 + Math.sin(i * 2.4) * 40;
      ctx.beginPath();
      ctx.moveTo(mx, 380); ctx.lineTo(mx + 30, 330 - (i % 3) * 22); ctx.lineTo(mx + 110, 326 - (i % 3) * 22); ctx.lineTo(mx + 150, 380);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = '#6e3222'; ctx.fillRect(0, 380, TL.W, TL.H - 380);
    ctx.fillStyle = '#8a4228'; ctx.fillRect(0, 380, TL.W, 3);
    /* little robot silhouette */
    ctx.save();
    ctx.translate(700, 452);
    TL.drawRobot(ctx, 0, 0, -1, 'idle', Title.t * 0.4, {});
    ctx.restore();
    /* title */
    var title = 'THE THINGS WE LEFT BEHIND';
    ctx.font = TL.font(30);
    var tw = ctx.measureText(title).width;
    var pulse = 0.85 + 0.15 * Math.sin(Title.t * 2);
    ctx.save();
    ctx.shadowColor = 'rgba(126,240,200,0.6)'; ctx.shadowBlur = 18 * pulse;
    TL.text(ctx, title, TL.W / 2 - tw / 2 + 8, 118, 30, '#7ef0c8');
    ctx.restore();
    TL.text(ctx, title, TL.W / 2 - tw / 2 + 8, 118, 30, '#7ef0c8');
    TL.text(ctx, 'AN INTERACTIVE MARTIAN EXPLORATION · BY MAI TEAM', TL.W / 2, 168, 9, '#d8b25a', 'center');
    TL.text(ctx, '"You travelled millions of kilometres to discover', TL.W / 2, 196, 8, '#8a9aa8', 'center');
    TL.text(ctx, 'you were not the first one here."', TL.W / 2, 212, 8, '#8a9aa8', 'center');
    /* menu */
    for (i = 0; i < Title.items.length; i++) {
      var y = 330 + i * 34;
      var hov = TL.mouse.x > 330 && TL.mouse.x < 630 && TL.mouse.y > y - 6 && TL.mouse.y < y + 20;
      var selected = Title.sel === i || hov;
      if (selected) {
        TL.text(ctx, '▶', 300, y, 10, '#7ef0c8');
        TL.text(ctx, Title.items[i].label, 324, y, 10, '#aef0dd');
      } else {
        TL.text(ctx, Title.items[i].label, 324, y, 10, '#5a7a70');
      }
    }
    /* confirm new game */
    if (Title.confirmNew) {
      var cx5 = TL.W / 2;
      TL.panel(ctx, cx5 - 235, 240, 470, 104, { corner: '#f0a050' });
      TL.text(ctx, 'ERASE EXISTING EXPEDITION DATA?', cx5, 260, 9, '#f0c090', 'center');
      TL.text(ctx, 'THIS CANNOT BE UNDONE.', cx5, 282, 7, '#8a9aa8', 'center');
      /* arm the dialog briefly so a held ENTER / E / SPACE from the menu cannot fire twice */
      var armed = Title.confirmT > 0.45;
      var yes = button(cx5 - 220, 302, 190, 26, armed ? 'YES, ERASE [ENTER]' : 'YES, ERASE ...');
      var no = button(cx5 + 70, 302, 150, 26, 'CANCEL [ESC]');
      if (no || TL.hit('escape')) { Title.confirmNew = false; TL.audio.uiBack(); return; }
      if ((yes || TL.hit('enter') || TL.hit('e') || TL.hit('space')) && armed) {
        TL.wipeSave();
        Title.confirmNew = false;
        TL.G.startGame(false);
        return;
      }
      return;
    }
    TL.text(ctx, '↑↓ SELECT · ENTER CONFIRM · MOUSE OK', TL.W / 2, TL.H - 40, 7, '#3a5a52', 'center');
    TL.crt(ctx, Title.t);
    TL.staticOverlay(ctx, 0.05);
  };
  function button(x, y, w, h, label) {
    var hov = TL.mouse.x >= x && TL.mouse.x <= x + w && TL.mouse.y >= y && TL.mouse.y <= y + h;
    TL.panel(TL.ctx, x, y, w, h, { bg: 'rgba(20,40,44,0.9)', corner: hov ? '#7ef0c8' : '#3a7a6a' });
    TL.text(TL.ctx, label, x + w / 2, y + h / 2 - 5, 8, hov ? '#aef0dd' : '#7ab8a8', 'center');
    return hov && TL.mouse.clicked;
  }
  TL._button = button;

  /* ================= ABOUT ================= */
  TL.About = {
    draw: function (ctx) {
      ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, TL.W, TL.H);
      TL.panel(ctx, 100, 60, TL.W - 200, TL.H - 120, {});
      TL.text(ctx, 'ABOUT THIS EXPEDITION', TL.W / 2, 84, 12, '#7ef0c8', 'center');
      var lines = [
        'THE THINGS WE LEFT BEHIND is a fictional story about real machines.',
        '',
        'Every spacecraft you meet in this game actually exists — Pathfinder and',
        'Sojourner, Spirit, Opportunity, Viking 1 and 2, Phoenix, InSight,',
        'Ingenuity, Perseverance and Curiosity are on Mars right now (or resting',
        'there, still holding every byte of their missions). Mariner 4 made the',
        'first flyby in 1965. The conversations are invented; the discoveries,',
        'dates and fates are historically accurate.',
        '',
        'BEYOND THE RED PLANET (unlocked after the finale) honours hardware left',
        'on asteroids, in orbit, and on the road out of the solar system.',
        '',
        'Built with vanilla JavaScript + Canvas. No engines, no libraries,',
        'no images — every pixel and every sound is generated by code.',
        '',
        'For the mission teams who never stopped listening.'
      ];
      for (var i = 0; i < lines.length; i++) {
        TL.text(ctx, lines[i], TL.W / 2, 120 + i * 19, 8, i === 0 ? '#d8b25a' : '#9fd8c8', 'center');
      }
      TL.text(ctx, 'ESC / E TO RETURN', TL.W / 2, TL.H - 90, 8, '#5a8a7a', 'center');
      if (TL.hit('escape') || TL.hit('e') || TL.mouse.clicked) { TL.G.mode = 'title'; TL.audio.uiBack(); }
    }
  };

  /* ================= LOADING =================
     Preloads the imported cinematic images before the intro runs,
     so slides appear instantaneously with zero flicker and no
     code-art placeholder is ever exposed. */
  TL.Loading = {
    cb: null, doneN: 0, total: 0, t: 0,
    begin: function (cb) {
      var self = TL.Loading;
      self.cb = cb; self.doneN = 0; self.total = 0; self.t = 0;
      var list = [];
      for (var i = 0; i < 4; i++) list.push({ key: 'sc:' + i, base: 'assets/cinematic/', file: 'scene' + (i + 1) });
      self.total = list.length;
      TL.Images.warm(list, function () { self.doneN = self.total; });
    },
    update: function (dt) {
      var self = TL.Loading;
      self.t += dt;
      if (self.doneN >= self.total && self.t > 0.5 && self.cb) {
        var c = self.cb; self.cb = null; c();
      }
    },
    draw: function (ctx) {
      var self = TL.Loading;
      ctx.fillStyle = '#04070c'; ctx.fillRect(0, 0, TL.W, TL.H);
      var rr = TL.RNG(5);
      for (var i = 0; i < 90; i++) {
        ctx.globalAlpha = 0.15 + rr() * 0.5;
        ctx.fillStyle = '#c8d8e8';
        ctx.fillRect(rr() * TL.W | 0, rr() * TL.H | 0, 2, 2);
      }
      ctx.globalAlpha = 1;
      TL.text(ctx, 'PREPARING TRANSMISSION', TL.W / 2, 240, 11, '#7ef0c8', 'center');
      var pct = self.total ? self.doneN / self.total : 0;
      TL.rect(ctx, TL.W / 2 - 130, 280, 260, 8, 'rgba(20,40,44,0.8)');
      TL.rect(ctx, TL.W / 2 - 130, 280, 260 * pct, 8, '#7ef0c8');
      TL.text(ctx, 'LOADING MISSION IMAGERY · ' + self.doneN + '/' + self.total, TL.W / 2, 300, 7, '#5a8a7a', 'center');
      TL.crt(ctx, self.t);
    }
  };

  /* ================= CINEMATIC =================
     Photo-driven intro. Imported NASA backdrops only — the procedural
     code-art scenes are fully stripped out so nothing placeholder-like
     can ever flash between state changes. All four images are preloaded
     before the sequence starts; consecutive slides crossfade smoothly
     and each slide carries a slow Ken Burns zoom (100% -> 105%). */
  var Cin = { t: 0, scene: 0, sceneT: 0, done: false };
  TL.Cinematic = Cin;

  Cin.SCENES = [
    { dur: 12.5, lines: [
      { at: 0.8, text: 'There\'s a world out there we\'ve spent centuries looking at.' },
      { at: 4.6, text: 'Red skies. Endless deserts.' },
      { at: 7.6, text: 'A place we know surprisingly little about.' }
    ] },
    { dur: 13, lines: [
      { at: 1.0, text: 'We built something that could go where we couldn\'t.' },
      { at: 5.2, text: 'Something small enough to fit inside a spacecraft —' },
      { at: 8.6, text: 'but brave enough to explore an entire planet.' }
    ] },
    { dur: 13, lines: [
      { at: 2.2, text: 'All systems nominal.' },
      { at: 6.4, text: 'Destination: Mars.' }
    ] },
    { dur: 14, lines: [
      { at: 1.2, text: 'Touchdown confirmed.' },
      { at: 5.4, text: 'Well... you\'re on your own now, little explorer.' }
    ] }
  ];
  var CIN_FADE = 0.9;   /* crossfade duration between slides (s) */

  /* cover-draw with a slow, subtle Ken Burns zoom (p: 0..1 -> 100%..105%) */
  function drawCoverZoom(ctx, img, p, alpha) {
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;
    var s = Math.max(TL.W / iw, TL.H / ih) * (1 + 0.05 * TL.clamp(p, 0, 1));
    var dw = iw * s, dh = ih * s;
    ctx.save();
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, Math.round((TL.W - dw) / 2), Math.round((TL.H - dh) / 2), dw, dh);
    ctx.restore();
  }

  Cin.update = function (dt) {
    Cin.t += dt;
    Cin.sceneT += dt;
    var sc = Cin.SCENES[Cin.scene];
    if (Cin.sceneT >= sc.dur) {
      Cin.scene++;
      Cin.sceneT = 0;
      if (Cin.scene >= Cin.SCENES.length) { TL.G.finishIntro(); return; }
    }
    /* light typing ticks alongside the dialogue text */
    var shown2 = null;
    for (var i = 0; i < sc.lines.length; i++) if (Cin.sceneT >= sc.lines[i].at) shown2 = sc.lines[i];
    if (shown2) {
      if (Cin._typeLine !== shown2.at) { Cin._typeLine = shown2.at; Cin._typeN = 0; }
      var chars2 = Math.floor((Cin.sceneT - shown2.at) * 34);
      if (chars2 > Cin._typeN && chars2 < shown2.text.length && chars2 - Cin._typeN >= 2) {
        TL.audio.blip(1100 + Math.random() * 300, 0.016, 0.03, 'square');
        Cin._typeN = chars2;
      }
    }
    if (TL.hit('escape')) { TL.G.finishIntro(); }
  };
  Cin.draw = function (ctx) {
    var sc = Cin.SCENES[Cin.scene];
    var d = Cin.sceneT / sc.dur;
    /* --- backdrops: preloaded photos, crossfaded, Ken Burns zoom --- */
    var img = TL.Images ? TL.Images.scene(Cin.scene) : null;
    var prev = (Cin.scene > 0 && Cin.sceneT < CIN_FADE && TL.Images) ? TL.Images.scene(Cin.scene - 1) : null;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, TL.W, TL.H);
    if (prev && prev !== 'fail') {
      /* outgoing slide holds its final zoom level and dissolves away */
      drawCoverZoom(ctx, prev, 1, 1 - Cin.sceneT / CIN_FADE);
    }
    var hasImg = !!(img && img !== 'fail');
    if (hasImg) {
      drawCoverZoom(ctx, img, d, prev ? Math.min(1, Cin.sceneT / CIN_FADE) : 1);
      /* soft cinematic vignette */
      var vg = ctx.createRadialGradient(TL.W / 2, TL.H / 2, TL.H * 0.34, TL.W / 2, TL.H / 2, TL.H * 0.92);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(4,8,14,0.5)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, TL.W, TL.H);
    }
    /* letterbox */
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, TL.W, 34); ctx.fillRect(0, TL.H - 34, TL.W, 34);
    /* dialogue lines: bottom subtitle bar over the imagery */
    var shown = null, shownIdx = -1;
    for (var i = 0; i < sc.lines.length; i++) {
      if (Cin.sceneT >= sc.lines[i].at) { shown = sc.lines[i]; shownIdx = i; }
    }
    if (shown) {
      var el = Cin.sceneT - shown.at;
      var chars = Math.floor(el * 34);
      var text = shown.text.slice(0, chars);
      var bx = 60, bw2 = TL.W - 120;
      TL.BIG_TEXT = true;
      ctx.font = TL.font(11);
      var lines = TL.wrap(ctx, text, bw2 - 40, 11);
      var bh2 = 48 + lines.length * 20;
      var py = TL.H - 34 - 14 - bh2;   /* bottom-anchored above the letterbox */
      /* single clean semi-transparent container */
      ctx.fillStyle = 'rgba(6,14,20,0.82)';
      ctx.fillRect(bx, py, bw2, bh2);
      ctx.strokeStyle = 'rgba(216,178,90,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx + 0.5, py + 0.5, bw2 - 1, bh2 - 1);
      TL.text(ctx, 'MISSION CONTROL', TL.W / 2, py + 10, 8, '#d8b25a', 'center');
      for (var L = 0; L < lines.length; L++) {
        TL.text(ctx, lines[L], TL.W / 2, py + 34 + L * 20, 11, '#e8e0d0', 'center');
      }
      /* typing tick */
      if (chars < shown.text.length && Math.floor(el * 10) % 2 === 0) {
        ctx.font = TL.font(11);
        var wtxt = lines[lines.length - 1] || '';
        var tw = ctx.measureText(wtxt).width;
        TL.text(ctx, '▌', TL.W / 2 + tw / 2 + 4, py + 34 + (lines.length - 1) * 20, 11, '#7ef0c8');
      }
      TL.BIG_TEXT = false;
    }
    TL.text(ctx, 'SCENE ' + (Cin.scene + 1) + '/4 · ESC TO SKIP', TL.W - 20, TL.H - 24, 7, '#4a5a66', 'right');
    TL.crt(ctx, Cin.t);
  };

  /* ================= HUD =================
     Calm, low-stimulus: ONE compact status line (top-left),
     ONE objective strip (bottom). No radar, no blinking, no
     duplicated location plates — locations announce themselves
     once, centered, via the story notification zone. */
  TL.HUD = {
    card: null,
    collect: [],
    /* status-zone routing: pickups and counters are top-right mini-cards */
    showCollect: function (title, name) {
      TL.Notify.status(name, '#d8b25a');
    },
    showLocation: function (def) {
      TL.Notify.loc(def);
    },
    drawCollect: function () { /* handled by TL.Notify.drawStatus */ },
    drawCard: function () { /* handled by TL.Notify.drawStory */ },
    draw: function (ctx, p) {
      var a = TL.World.area, def = a.def;
      var discovered = TL.discCount();
      /* single static status line — battery + hardware count in one bar */
      ctx.fillStyle = 'rgba(4,16,20,0.62)';
      ctx.fillRect(10, 10, 292, 26);
      ctx.strokeStyle = 'rgba(110,220,200,0.22)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10.5, 10.5, 291, 25);
      TL.text(ctx, 'PWR', 20, 18, 6, '#6a9a8a');
      TL.bar(ctx, 46, 17, 56, 11, p.battery / 100, p.battery < 20 ? '#f0a050' : '#7ef0c8');
      TL.text(ctx, Math.round(p.battery) + '%', 108, 18, 6, '#6a9a8a');
      /* hardware counter chip (drawn diamond — glyph may be missing from the font) */
      ctx.fillStyle = '#d8b25a';
      ctx.beginPath();
      ctx.moveTo(146, 28);
      ctx.lineTo(151, 23);
      ctx.lineTo(156, 28);
      ctx.lineTo(151, 33);
      ctx.closePath();
      ctx.fill();
      TL.text(ctx, String(discovered).padStart(2, '0') + '/' + TL.TOTAL_HW, 162, 18, 7, '#8fc0b0');
      TL.text(ctx, 'ESC · SYSTEMS', 292, 18, 6, 'rgba(140,180,170,0.4)', 'right');
      /* slim objective strip */
      var obj = TL.G.objective();
      ctx.save();
      ctx.font = TL.font(TL.effSize(8));
      var objectiveWidth = Math.max(470, Math.ceil(ctx.measureText(obj).width) + 54);
      ctx.restore();
      ctx.fillStyle = 'rgba(4,16,20,0.5)';
      ctx.fillRect(10, TL.H - 36, objectiveWidth, 26);
      ctx.strokeStyle = 'rgba(110,220,200,0.18)';
      ctx.strokeRect(10.5, TL.H - 35.5, objectiveWidth - 1, 25);
      TL.text(ctx, 'OBJ', 20, TL.H - 29, 7, '#59c8f0');
      TL.text(ctx, obj, 52, TL.H - 29, 8, '#c8e8dc');
      /* low battery: calm static advisory, no flashing */
      if (p.battery < 18) {
        TL.text(ctx, 'LOW POWER — RECHARGE AT A SOLAR STATION', TL.W / 2, 52, 7, 'rgba(240,160,80,0.75)', 'center');
      }
    }
  };

  /* ================= PAUSE ================= */
  TL.Pause = {
    sel: 0,
    items: ['RESUME', 'NAVIGATION MAP', 'MISSION ARCHIVE', 'SETTINGS', 'QUIT TO TITLE'],
    update: function (dt) {
      if (TL.hit('escape')) { TL.G.resume(); return; }
      if (TL.hit('arrowup') || TL.hit('w')) { TL.Pause.sel = (TL.Pause.sel + 4) % 5; TL.audio.ui(); }
      if (TL.hit('arrowdown') || TL.hit('s')) { TL.Pause.sel = (TL.Pause.sel + 1) % 5; TL.audio.ui(); }
      for (var i = 0; i < 5; i++) {
        var y = 220 + i * 40;
        if (TL.mouse.x > 380 && TL.mouse.x < 580 && TL.mouse.y > y - 8 && TL.mouse.y < y + 18) {
          if (TL.mouse.clicked) { TL.Pause.sel = i; TL.Pause.choose(); }
        }
      }
      if (TL.hit('enter') || TL.hit('e')) TL.Pause.choose();
    },
    choose: function () {
      TL.audio.confirm();
      switch (TL.Pause.sel) {
        case 0: TL.G.resume(); break;
        case 1: TL.G.mode = 'map'; break;
        case 2: TL.G.mode = 'archive'; TL.Archive.tab = 'hw'; break;
        case 3: TL.G.mode = 'settings'; TL.G.settingsBack = 'pause'; break;
        case 4:
          TL.save();
          TL.G.mode = 'title';
          TL.Title.sel = 0;
          break;
      }
    },
    draw: function (ctx) {
      TL.G.drawWorldFrame(ctx);
      ctx.fillStyle = 'rgba(3,8,12,0.72)';
      ctx.fillRect(0, 0, TL.W, TL.H);
      TL.panel(ctx, TL.W / 2 - 200, 150, 400, 300, { corner: '#7ef0c8' });
      TL.text(ctx, '— SYSTEMS PAUSED —', TL.W / 2, 175, 11, '#7ef0c8', 'center');
      for (var i = 0; i < 5; i++) {
        var y = 220 + i * 40;
        var sel = TL.Pause.sel === i;
        var hov = TL.mouse.x > 380 && TL.mouse.x < 580 && TL.mouse.y > y - 8 && TL.mouse.y < y + 18;
        if (sel || hov) {
          TL.text(ctx, '▶', 396, y, 10, '#7ef0c8');
          TL.text(ctx, TL.Pause.items[i], 420, y, 10, '#aef0dd');
        } else {
          TL.text(ctx, TL.Pause.items[i], 420, y, 10, '#5a7a70');
        }
      }
      TL.text(ctx, 'PROGRESS SAVED AUTOMATICALLY', TL.W / 2, 428, 7, '#4a6a60', 'center');
      TL.staticOverlay(ctx, 0.08);
    }
  };

  /* ================= MAP ================= */
  TL.Map = {
    update: function (dt) {
      if (TL.hit('escape') || TL.hit('e')) { TL.G.mode = 'pause'; TL.audio.uiBack(); }
      var a = TL.World.area;
      for (var i = 0; i < TL.D.AREAS.length; i++) {
        var ar = TL.D.AREAS[i];
        var pos = TL.Map.nodePos(i);
        if (TL.dist(TL.mouse.x, TL.mouse.y, pos.x, pos.y) < 26 && TL.mouse.clicked) {
          if (TL.has(TL.S.visited, ar.id) && ar.id !== a.def.id) {
            TL.audio.confirm();
            TL.G.travelTo(ar.id);
          } else if (ar.id !== a.def.id) {
            TL.audio.deny();
            TL.toast('REGION NOT YET CHARTED', '#f0a050');
          }
        }
      }
    },
    nodePos: function (i) {
      var ang = -Math.PI / 2 + i * (Math.PI * 2 / TL.D.AREAS.length) * 0.92;
      return { x: TL.W / 2 + Math.cos(ang) * 190, y: 290 + Math.sin(ang) * 150 };
    },
    draw: function (ctx) {
      ctx.fillStyle = '#04070c'; ctx.fillRect(0, 0, TL.W, TL.H);
      var rr5 = TL.RNG(9);
      for (var i = 0; i < 90; i++) { ctx.globalAlpha = rr5() * 0.6; ctx.fillStyle = '#c8d8e8'; ctx.fillRect(rr5() * TL.W | 0, rr5() * TL.H | 0, 2, 2); }
      ctx.globalAlpha = 1;
      /* Mars disc */
      ctx.fillStyle = '#8a3f28';
      ctx.beginPath(); ctx.arc(TL.W / 2, 290, 110, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#a85230';
      ctx.beginPath(); ctx.arc(TL.W / 2 - 20, 270, 40, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6a2f20';
      ctx.beginPath(); ctx.arc(TL.W / 2 + 30, 320, 30, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c87848';
      ctx.beginPath(); ctx.arc(TL.W / 2, 250, 12, 0, Math.PI * 2); ctx.fill();
      TL.text(ctx, 'MARS', TL.W / 2, 282, 10, 'rgba(20,10,8,0.7)', 'center');
      /* nodes */
      var a = TL.World.area;
      for (i = 0; i < TL.D.AREAS.length; i++) {
        var ar = TL.D.AREAS[i];
        var pos = TL.Map.nodePos(i);
        var visited = TL.has(TL.S.visited, ar.id);
        var current = ar.id === a.def.id;
        var hov = TL.dist(TL.mouse.x, TL.mouse.y, pos.x, pos.y) < 26;
        /* line to Mars */
        ctx.strokeStyle = visited ? 'rgba(126,240,200,0.3)' : 'rgba(126,240,200,0.08)';
        ctx.beginPath(); ctx.moveTo(TL.W / 2, 290); ctx.lineTo(pos.x, pos.y); ctx.stroke();
        var col = current ? '#7ef0c8' : visited ? '#59c8f0' : '#3a4a52';
        if (current) {
          var p2 = 0.5 + 0.5 * Math.sin(performance.now() * 0.005);
          ctx.strokeStyle = 'rgba(126,240,200,' + p2 * 0.8 + ')';
          ctx.beginPath(); ctx.arc(pos.x, pos.y, 14 + p2 * 6, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, hov ? 8 : 6, 0, Math.PI * 2); ctx.fill();
        TL.text(ctx, visited ? ar.region : 'UNCHARTED', pos.x, pos.y + 14, 7, visited ? '#9fd8c8' : '#3a4a52', 'center');
        TL.text(ctx, visited ? ar.year : '· · ·', pos.x, pos.y - 19, 8, visited ? '#d8b25a' : '#3a4a52', 'center');
      }
      TL.panel(ctx, 30, 30, TL.W - 60, 60, {});
      TL.text(ctx, 'NAVIGATION — CHARTED REGIONS', TL.W / 2, 44, 11, '#7ef0c8', 'center');
      TL.text(ctx, 'CLICK A CHARTED NODE TO TRAVEL · CURRENT: ' + a.def.region, TL.W / 2, 68, 8, '#9fd8c8', 'center');
      TL.text(ctx, 'ESC TO RETURN', TL.W / 2, TL.H - 30, 8, '#5a8a7a', 'center');
      TL.staticOverlay(ctx, 0.07);
      TL.crt(ctx, performance.now() * 0.001);
    }
  };

  /* ================= ARCHIVE ================= */
  TL.Archive = {
    tab: 'hw',
    sel: 0, itemSel: 0, beyondSel: 0,
    tabs: [['hw', 'HARDWARE'], ['items', 'RECOVERED'], ['beyond', 'DEEP SPACE']],
    update: function (dt) {
      if (TL.hit('escape')) {
        TL.audio.uiBack();
        TL.G.mode = (TL.G.prevMode === 'title' || !TL.World.area) ? 'title' : 'pause';
      }
      /* tabs */
      for (var t2 = 0; t2 < TL.Archive.tabs.length; t2++) {
        var tx = 40 + t2 * 180;
        if (TL.mouse.x > tx && TL.mouse.x < tx + 170 && TL.mouse.y > 24 && TL.mouse.y < 52 && TL.mouse.clicked) {
          if (TL.Archive.tabs[t2][0] === 'beyond' && !TL.S.finaleDone) { TL.audio.deny(); TL.toast('LOCKED — COMPLETE THE MAIN MISSION', '#f0a050'); }
          else { TL.Archive.tab = TL.Archive.tabs[t2][0]; TL.audio.ui(); }
        }
      }
      var entries = Object.keys(TL.D.ARCHIVE);
      if (TL.Archive.tab === 'hw') {
        /* arrows */
        var upDown = 0;
        if (TL.hit('arrowup') || TL.hit('w')) upDown = -1;
        if (TL.hit('arrowdown') || TL.hit('s')) upDown = 1;
        if (upDown) { TL.Archive.sel = TL.clamp(TL.Archive.sel + upDown, 0, entries.length - 1); TL.audio.ui(); }
        for (var e2 = 0; e2 < entries.length; e2++) {
          var y = 74 + e2 * 26;
          if (y > TL.H - 60) break;
          if (TL.mouse.x > 30 && TL.mouse.x < 250 && TL.mouse.y > y && TL.mouse.y < y + 24 && TL.mouse.clicked) { TL.Archive.sel = e2; TL.audio.ui(); }
        }
        /* ENTER opens the mission archive of the selected, discovered hardware */
        var hwId = entries[TL.Archive.sel];
        if (hwId && TL.discovered(hwId) && (TL.hit('enter') || TL.hit('e'))) {
          TL.audio.ui();
          TL.Slides.open(hwId, 'archive');
          return;
        }
      } else if (TL.Archive.tab === 'items') {
        var items = TL.S.items;
        for (var i3 = 0; i3 < items.length; i3++) {
          var col = i3 % 6, row = Math.floor(i3 / 6);
          var x = 60 + col * 140, y3 = 76 + row * 70;
          if (TL.mouse.x > x && TL.mouse.x < x + 120 && TL.mouse.y > y3 && TL.mouse.y < y3 + 64 && TL.mouse.clicked) { TL.Archive.itemSel = i3; TL.audio.ui(); }
        }
      } else {
        for (var b4 = 0; b4 < TL.D.BEYOND_ORDER.length; b4++) {
          var pos = { x: 200 + b4 * 150, y: 200 };
          if (TL.dist(TL.mouse.x, TL.mouse.y, pos.x, pos.y) < 34 && TL.mouse.clicked) {
            if (TL.Archive.beyondSel === b4) { TL.audio.ui(); TL.Slides.open(TL.D.BEYOND_ORDER[b4], 'archive'); return; }
            TL.Archive.beyondSel = b4; TL.audio.ui();
          }
        }
        /* ENTER opens the mission archive of the selected node */
        var bid = TL.D.BEYOND_ORDER[TL.Archive.beyondSel];
        if (bid && (TL.hit('enter') || TL.hit('e'))) {
          TL.audio.ui();
          TL.Slides.open(bid, 'archive');
          return;
        }
      }
    },
    draw: function (ctx) {
      ctx.fillStyle = '#04080c'; ctx.fillRect(0, 0, TL.W, TL.H);
      var rr6 = TL.RNG(3);
      for (var i = 0; i < 60; i++) { ctx.globalAlpha = rr6() * 0.4; ctx.fillStyle = '#c8d8e8'; ctx.fillRect(rr6() * TL.W | 0, rr6() * TL.H | 0, 2, 2); }
      ctx.globalAlpha = 1;
      /* tabs */
      for (var t3 = 0; t3 < TL.Archive.tabs.length; t3++) {
        var tx = 40 + t3 * 180;
        var active = TL.Archive.tab === TL.Archive.tabs[t3][0];
        var locked = TL.Archive.tabs[t3][0] === 'beyond' && !TL.S.finaleDone;
        TL.panel(ctx, tx, 24, 170, 30, { corner: active ? '#7ef0c8' : '#3a5a52' });
        TL.text(ctx, TL.Archive.tabs[t3][1] + (locked ? ' 🔒' : ''), tx + 12, 33, 8, active ? '#7ef0c8' : locked ? '#3a4a52' : '#6a8a7a');
      }
      if (TL.Archive.tab === 'hw') TL.Archive.drawHW(ctx);
      else if (TL.Archive.tab === 'items') TL.Archive.drawItems(ctx);
      else TL.Archive.drawBeyond(ctx);
      TL.staticOverlay(ctx, 0.07);
      TL.crt(ctx, performance.now() * 0.001);
    },
    drawHW: function (ctx) {
      var entries = Object.keys(TL.D.ARCHIVE);
      var selId = entries[TL.Archive.sel];
      var e = TL.D.ARCHIVE[selId];
      var found = TL.discovered(selId);
      /* list */
      for (var i2 = 0; i2 < entries.length; i2++) {
        var y = 74 + i2 * 26;
        if (y > TL.H - 40) break;
        var isSel = TL.Archive.sel === i2;
        var disc = TL.discovered(entries[i2]);
        TL.rect(ctx, 30, y, 240, 24, isSel ? 'rgba(20,50,46,0.9)' : 'rgba(10,20,26,0.7)');
        TL.text(ctx, (disc ? '' : '??? ') + (disc ? TL.D.ARCHIVE[entries[i2]].name : 'NO DATA'), 40, y + 8, 8, isSel ? '#aef0dd' : disc ? '#7ab8a8' : '#3a4a52');
      }
      /* detail */
      TL.panel(ctx, 290, 70, 640, TL.H - 120, { corner: found ? '#7ef0c8' : '#3a5a52' });
      if (!found) {
        TL.text(ctx, 'ENTRY LOCKED', TL.W / 2 + 80, 160, 12, '#3a5a52', 'center');
        TL.text(ctx, 'ESTABLISH CONTACT IN THE FIELD TO RECOVER THIS RECORD', TL.W / 2 + 80, 190, 8, '#2a3a44', 'center');
        return;
      }
      var px = 306, py = 86;
      TL.panel(ctx, px, py, 104, 104, { corner: '#59c8f0' });
      /* imported photo if available, hand-drawn portrait otherwise */
      var av2 = TL.Images ? TL.Images.avatar(selId) : null;
      if (av2) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(av2, px + 4, py + 4, 96, 96);
        ctx.imageSmoothingEnabled = false;
      } else {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(TL.portrait(selId), px + 4, py + 4, 96, 96);
      }
      TL.text(ctx, e.name, px + 120, py + 2, 13, '#d8b25a');
      TL.text(ctx, e.craft, px + 120, py + 24, 8, '#9fd8c8');
      TL.text(ctx, 'LAUNCHED: ' + e.launched, px + 120, py + 44, 7, '#6a9a8a');
      TL.text(ctx, 'ARRIVED: ' + e.landed, px + 120, py + 60, 7, '#6a9a8a');
      /* status */
      var active = e.status.indexOf('ACTIVE') === 0;
      TL.text(ctx, 'STATUS: ' + e.status, px + 120, py + 80, 7, active ? '#7ef0c8' : '#8a8a92');
      TL.text(ctx, 'CONVERSATION: LOGGED ✓', px + 120, py + 96, 7, '#7ef0c8');
      /* body */
      var by2 = py + 118;
      TL.text(ctx, 'MISSION PURPOSE', px + 4, by2, 8, '#59c8f0');
      var l1 = TL.wrap(ctx, e.purpose, 600, 8);
      for (var L = 0; L < l1.length; L++) TL.text(ctx, l1[L], px + 4, by2 + 14 + L * 13, 8, '#c8e8dc');
      var y4 = by2 + 14 + l1.length * 13 + 12;
      TL.text(ctx, 'KEY DISCOVERIES', px + 4, y4, 8, '#59c8f0');
      var l2 = TL.wrap(ctx, e.finds, 600, 8);
      for (L = 0; L < l2.length; L++) TL.text(ctx, l2[L], px + 4, y4 + 14 + L * 13, 8, '#c8e8dc');
      var y5 = y4 + 14 + l2.length * 13 + 12;
      var l3 = TL.wrap(ctx, '“' + e.quote + '”', 590, 8);
      for (L = 0; L < l3.length; L++) TL.text(ctx, l3[L], px + 4, y5 + L * 13, 8, '#d8b25a');
      /* open the full mission archive */
      TL._button(px + 4, 452, 260, 26, 'OPEN MISSION ARCHIVE [ENTER]');
      TL.text(ctx, 'THE FULL STORY: 4-5 RECOVERED FRAMES WITH NARRATION', px + 280, 460, 6, '#4a6a78');
    },
    drawItems: function (ctx) {
      var items = TL.S.items;
      TL.text(ctx, 'RECOVERED ITEMS: ' + items.length + ' / ' + Object.keys(TL.D.ITEMS).length, 40, 60, 10, '#7ef0c8');
      if (items.length === 0) {
        TL.text(ctx, 'NOTHING RECOVERED YET — LOOK FOR GLINTING OBJECTS IN EACH REGION', TL.W / 2, 200, 8, '#3a5a52', 'center');
        return;
      }
      for (var i = 0; i < items.length; i++) {
        var col = i % 6, row = Math.floor(i / 6);
        var x = 60 + col * 140, y = 76 + row * 70;
        var it = TL.D.ITEMS[items[i]];
        var sel = TL.Archive.itemSel === i;
        TL.panel(ctx, x, y, 120, 64, { corner: sel ? '#7ef0c8' : '#3a5a52' });
        ctx.save(); ctx.translate(x + 60, y + 20);
        var t = performance.now();
        ctx.scale(1.6, 1.6);
        TL.drawItem(ctx, it.type, 0, 0, t);
        ctx.restore();
        var lab = TL.wrap(ctx, it.label, 108, 6);
        for (var w = 0; w < Math.min(2, lab.length); w++) {
          TL.text(ctx, lab[w], x + 6, y + 38 + w * 9, 6, sel ? '#aef0dd' : '#7ab8a8');
        }
      }
      /* selected detail */
      if (items.length) {
        var it2 = TL.D.ITEMS[items[TL.clamp(TL.Archive.itemSel, 0, items.length - 1)]];
        var lines = TL.wrap(ctx, it2.text, TL.W - 120, 8);
        TL.text(ctx, '» ' + it2.label, 60, TL.H - 92, 8, '#d8b25a');
        for (var L2 = 0; L2 < lines.length; L2++) TL.text(ctx, lines[L2], 60, TL.H - 74 + L2 * 13, 8, '#9fd8c8');
      }
    },
    drawBeyond: function (ctx) {
      TL.text(ctx, 'BEYOND THE RED PLANET — THE WIDER RECORD', 40, 70, 11, '#7ef0c8');
      TL.text(ctx, 'HUMANITY DID NOT ONLY LEAVE THINGS ON MARS. SELECT A NODE.', 40, 92, 8, '#9fd8c8');
      TL.text(ctx, 'CLICK A NODE (AGAIN) OR PRESS ENTER — OPEN ITS MISSION ARCHIVE', 40, 110, 7, '#6a8a9a');
      var order = TL.D.BEYOND_ORDER;
      for (var b5 = 0; b5 < order.length; b5++) {
        var pos = { x: 200 + b5 * 150, y: 210 };
        var sel = TL.Archive.beyondSel === b5;
        var hov = TL.dist(TL.mouse.x, TL.mouse.y, pos.x, pos.y) < 34;
        var id = order[b5];
        var e = TL.D.BEYOND[id];
        /* orbit ring */
        ctx.strokeStyle = 'rgba(126,240,200,0.2)';
        ctx.beginPath(); ctx.arc(TL.W / 2, 380, 380 - b5 * 40, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
        /* node */
        var col = sel ? '#f0a050' : hov ? '#7ef0c8' : '#59c8f0';
        if (id === 'dawn' || id === 'kepler') ctx.fillStyle = col;
        else if (id === 'near') ctx.fillStyle = col;
        else ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2); ctx.fill();
        /* small craft icon */
        ctx.save(); ctx.translate(pos.x, pos.y); ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#c8ccd4'; ctx.fillRect(-7, -4, 14, 8);
        ctx.fillStyle = '#26365c'; ctx.fillRect(-16, -3, 7, 6); ctx.fillRect(9, -3, 7, 6);
        ctx.restore();
        TL.text(ctx, e.name, pos.x, pos.y + 22, 8, col, 'center');
      }
      /* dossier */
      var eid = order[TL.Archive.beyondSel];
      var e2 = TL.D.BEYOND[eid];
      TL.panel(ctx, 40, 280, TL.W - 80, TL.H - 330, { corner: '#7ef0c8' });
      TL.text(ctx, e2.name + ' — ' + e2.craft, 60, 296, 11, '#d8b25a');
      TL.text(ctx, 'LAUNCHED: ' + e2.launched + '   ·   STATUS: ' + e2.status, 60, 320, 7, '#6a9a8a');
      var l1 = TL.wrap(ctx, 'PURPOSE: ' + e2.purpose, TL.W - 140, 8);
      for (var L = 0; L < l1.length; L++) TL.text(ctx, l1[L], 60, 344 + L * 13, 8, '#c8e8dc');
      var y6 = 344 + l1.length * 13 + 8;
      var l2 = TL.wrap(ctx, 'RECORD: ' + e2.finds, TL.W - 140, 8);
      for (L = 0; L < l2.length; L++) TL.text(ctx, l2[L], 60, y6 + L * 13, 8, '#9fd8c8');
      var y7 = y6 + l2.length * 13 + 8;
      TL.text(ctx, '“' + e2.quote + '”', 60, y7, 8, '#d8b25a');
    }
  };

  /* ================= SETTINGS ================= */
  TL.Settings = {
    drag: null,
    SLX: 420, SLW: 240,           /* slider track: x 420..660 */
    TX0: 414, TX1: 666,           /* generous hit zone for both control types */
    update: function (dt) {
      if (TL.hit('escape') || TL.hit('e')) {
        TL.save();
        TL.audio.uiBack();
        TL.G.mode = TL.G.settingsBack || 'pause';
      }
      if (TL.hit('m')) { TL.S.settings.mute = !TL.S.settings.mute; TL.audio.applySettings(); TL.toast(TL.S.settings.mute ? 'AUDIO MUTED' : 'AUDIO ON'); }
      var rows = TL.Settings.rows();
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (r.type === 'slider') {
          var hovering = TL.mouse.y > r.y - 14 && TL.mouse.y < r.y + 14 && TL.mouse.x > TL.Settings.TX0 && TL.mouse.x < TL.Settings.TX1;
          if (hovering && TL.mouse.down) TL.Settings.drag = i;
          if (TL.Settings.drag === i) {
            var v = TL.clamp((TL.mouse.x - TL.Settings.SLX) / TL.Settings.SLW, 0, 1);
            TL.S.settings[r.key] = Math.round(v * 100) / 100;
            TL.audio.applySettings();
          }
        } else {
          if (TL.mouse.x > TL.Settings.TX0 && TL.mouse.x < TL.Settings.TX1 && TL.mouse.y > r.y - 15 && TL.mouse.y < r.y + 15 && TL.mouse.clicked) {
            if (r.key === 'mute') TL.S.settings.mute = !TL.S.settings.mute;
            if (r.key === 'shake') TL.S.settings.shake = !TL.S.settings.shake;
            if (r.key === 'reset') {
              if (TL.Settings.resetArm) { TL.wipeSave(); TL.Settings.resetArm = false; TL.toast('SAVE ERASED'); TL.G.mode = 'title'; TL.Title.rebuild(); }
              else { TL.Settings.resetArm = true; TL.toast('CLICK AGAIN TO CONFIRM ERASE', '#f0a050'); }
            }
            TL.audio.applySettings();
            TL.audio.ui();
          }
        }
      }
      if (!TL.mouse.down) TL.Settings.drag = null;
    },
    rows: function () {
      return [
        { type: 'slider', label: 'MASTER VOLUME', key: 'vol', y: 176 },
        { type: 'slider', label: 'MUSIC', key: 'music', y: 226 },
        { type: 'slider', label: 'EFFECTS', key: 'sfx', y: 276 },
        { type: 'toggle', label: 'MUTE ALL AUDIO', key: 'mute', y: 330 },
        { type: 'toggle', label: 'SCREEN SHAKE', key: 'shake', y: 402 },
        { type: 'toggle', label: 'ERASE SAVE DATA', key: 'reset', y: 474 }
      ];
    },
    heading: function (ctx, txt, x, y) {
      TL.text(ctx, txt, x, y, 8, '#59c8f0');
      var w = ctx.measureText(txt).width;
      ctx.font = TL.font(8);
      TL.rect(ctx, x + w + 14, y + 6, 720 - x - w - 14, 1, 'rgba(89,200,240,0.25)');
    },
    draw: function (ctx) {
      ctx.fillStyle = '#04080c'; ctx.fillRect(0, 0, TL.W, TL.H);
      TL.panel(ctx, 200, 80, 560, 440, { corner: '#7ef0c8' });
      /* heading block */
      TL.text(ctx, 'SYSTEM SETTINGS', 240, 100, 12, '#7ef0c8');
      TL.text(ctx, 'ONBOARD CONFIGURATION TERMINAL', 720, 106, 6, '#4a6a60', 'right');
      TL.rect(ctx, 240, 126, 480, 1, 'rgba(126,240,200,0.25)');
      ctx.font = TL.font(8);
      /* sections */
      TL.Settings.heading(ctx, 'AUDIO', 240, 142);
      TL.Settings.heading(ctx, 'SYSTEM', 240, 368);
      TL.Settings.heading(ctx, 'DATA', 240, 440);
      /* rows */
      var rows = TL.Settings.rows();
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        TL.text(ctx, r.label, 240, r.y - 4, 8, '#9fd8c8');
        if (r.type === 'slider') {
          /* track */
          TL.rect(ctx, TL.Settings.SLX, r.y - 5, TL.Settings.SLW, 10, '#0a1a20');
          TL.rect(ctx, TL.Settings.SLX, r.y - 5, TL.Settings.SLW * TL.S.settings[r.key], 10, '#7ef0c8');
          /* quarter ticks */
          for (var q = 1; q < 4; q++) {
            TL.rect(ctx, TL.Settings.SLX + TL.Settings.SLW * q / 4 - 1, r.y - 5, 1, 10, 'rgba(4,16,20,0.9)');
          }
          /* handle */
          var hx = TL.Settings.SLX + TL.Settings.SLW * TL.S.settings[r.key];
          TL.rect(ctx, TL.clamp(hx - 3, TL.Settings.SLX, TL.Settings.SLX + TL.Settings.SLW - 6), r.y - 9, 6, 18, '#d8b25a');
          TL.rect(ctx, TL.clamp(hx - 1, TL.Settings.SLX, TL.Settings.SLX + TL.Settings.SLW - 2), r.y - 9, 1, 18, 'rgba(255,240,200,0.5)');
          /* value readout */
          TL.text(ctx, String(Math.round(TL.S.settings[r.key] * 100)).padStart(3, '0'), 668, r.y - 3, 7, '#8fc0b0');
        } else {
          var on = r.key === 'mute' ? TL.S.settings.mute : r.key === 'shake' ? TL.S.settings.shake : false;
          var armed = r.key === 'reset' && TL.Settings.resetArm;
          TL.rect(ctx, 420, r.y - 13, 120, 26, armed ? 'rgba(60,26,10,0.9)' : on ? 'rgba(10,40,34,0.9)' : 'rgba(10,26,32,0.9)');
          ctx.strokeStyle = armed ? '#f0a050' : on ? 'rgba(126,240,200,0.7)' : 'rgba(90,140,128,0.45)';
          ctx.lineWidth = 1;
          ctx.strokeRect(420.5, r.y - 12.5, 119, 25);
          var lab = r.key === 'reset' ? (armed ? 'CONFIRM?' : 'CLICK ×2') : (on ? 'ON' : 'OFF');
          TL.text(ctx, lab, 480, r.y - 4, 8, armed ? '#f0a050' : on ? '#7ef0c8' : '#5a7a70', 'center');
        }
      }
      TL.text(ctx, 'M TOGGLES MUTE ANYWHERE · ESC TO RETURN', TL.W / 2, 500, 7, '#4a6a60', 'center');
      TL.staticOverlay(ctx, 0.06);
    }
  };

  /* ================= EPILOGUE =================
     Cinematic, reflective ending: the legacy of every mission,
     the lesson of perseverance, the passing of the torch —
     closing on a Martian twilight and the title credits. */
  TL.Epilogue = {
    idx: 0, t: 0, phase: 0,     /* phase 0 = narrative beats, 1 = twilight, 2 = credits */
    start: function () { TL.Epilogue.idx = 0; TL.Epilogue.t = 0; TL.Epilogue.phase = 0; },
    photos: ['earth', 'sunset'].map(function (name) {
      var img = new Image();
      img.src = 'assets/cinematic/outro-' + name + '.jpg';
      return img;
    }),
    update: function (dt) {
      TL.Epilogue.t += dt;
      var advance = (TL.actHit() || TL.hit('space') || TL.mouse.clicked) && TL.Epilogue.t > 1.4;
      if (TL.Epilogue.phase === 0) {
        if (advance) {
          TL.Epilogue.idx++;
          TL.Epilogue.t = 0;
          TL.audio.blip(520, 0.05, 0.1);
          if (TL.Epilogue.idx >= TL.D.EPILOGUE.length) { TL.Epilogue.phase = 1; TL.Epilogue.t = 0; TL.audio.chime(2.2); }
        }
      } else if (TL.Epilogue.phase === 1) {
        if ((advance && TL.Epilogue.t > 4) || TL.Epilogue.t > 6) { TL.Epilogue.phase = 2; TL.Epilogue.t = 0; }
      } else {
        if ((advance && TL.Epilogue.t > 4) || TL.Epilogue.t > 10) TL.G.finishFinale();
      }
      if (TL.hit('escape')) TL.G.finishFinale();
    },
    drawTextStage: function (ctx, alpha) {
      /* BIG_TEXT keeps the ending at full size (no small-text shrink) */
      TL.BIG_TEXT = true;
      var lines = TL.wrap(ctx, TL.D.EPILOGUE[TL.Epilogue.idx], 700, 12);
      var y0 = TL.H / 2 - (lines.length * 24) / 2 + 10;
      for (var L = 0; L < lines.length; L++) {
        TL.text(ctx, lines[L], TL.W / 2, y0 + L * 24, 12, TL.Epilogue.idx === 0 ? '#d8b25a' : '#cfeadd', 'center', alpha);
      }
      TL.BIG_TEXT = false;
    },
    drawPhoto: function (ctx, index, zoom, shade) {
      var img = TL.Epilogue.photos[index];
      if (img.naturalWidth) {
        var inset = zoom * 22;
        TL.Images.drawCover(ctx, img, -inset, -inset, TL.W + inset * 2, TL.H + inset * 2);
      }
      var vignette = ctx.createLinearGradient(0, 0, 0, TL.H);
      vignette.addColorStop(0, 'rgba(2,6,10,0.24)');
      vignette.addColorStop(0.52, 'rgba(2,6,10,' + shade + ')');
      vignette.addColorStop(1, 'rgba(2,6,10,0.88)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, TL.W, TL.H);
    },
    drawTwilight: function (ctx) {
      TL.Epilogue.drawPhoto(ctx, 1, Math.min(1, TL.Epilogue.t / 6), 0.45);
      var alpha = TL.clamp((TL.Epilogue.t - 0.8) / 1.2, 0, 1);
      TL.text(ctx, 'The torch is lit. Keep going.', TL.W / 2, TL.H - 110, 11, '#cfe2f0', 'center', alpha);
    },
    drawCredits: function (ctx) {
      TL.Epilogue.drawPhoto(ctx, 1, 1, 0.85);
      var a = Math.min(1, TL.Epilogue.t / 1.4);
      var pulse = 0.85 + 0.15 * Math.sin(TL.Epilogue.t * 1.2);
      TL.text(ctx, 'THE THINGS WE LEFT BEHIND', TL.W / 2, 168, 22, '#7ef0c8', 'center', a * pulse);
      TL.rect(ctx, TL.W / 2 - 150, 214, 300, 1, 'rgba(126,240,200,0.35)');
      var credits = [
        'AN INTERACTIVE EXPERIENCE BY MAI TEAM',
        '',
        'STARRING THE MACHINES OF MARS, 1965 – PRESENT',
        'MARINER 4 · VIKING 1 & 2 · PATHFINDER · SOJOURNER',
        'SPIRIT · OPPORTUNITY · PHOENIX · CURIOSITY',
        'INSIGHT · INGENUITY · PERSEVERANCE',
        '',
        'FOR THE MISSION TEAMS WHO NEVER STOPPED LISTENING',
        '',
        'THE ARCHIVE REMAINS OPEN. THANK YOU FOR LISTENING.'
      ];
      for (var i = 0; i < credits.length; i++) {
        TL.text(ctx, credits[i], TL.W / 2, 250 + i * 22, 9, i === 0 ? '#d8b25a' : '#9fd8c8', 'center', a);
      }
      TL.text(ctx, 'E TO OPEN DEEP SPACE', TL.W / 2, TL.H - 56, 7, '#3a5a52', 'center', a);
    },
    draw: function (ctx) {
      ctx.fillStyle = '#02060a'; ctx.fillRect(0, 0, TL.W, TL.H);
      if (TL.Epilogue.phase === 0) {
        TL.Epilogue.drawPhoto(ctx, 0, TL.clamp((TL.Epilogue.idx + TL.Epilogue.t / 7) / TL.D.EPILOGUE.length, 0, 1), 0.72);
        if (TL.Epilogue.idx < TL.D.EPILOGUE.length) {
          var alpha = Math.min(1, TL.Epilogue.t / 1.0);   /* slow, elegant fade */
          TL.Epilogue.drawTextStage(ctx, alpha);
        }
        TL.text(ctx, 'E / CLICK TO CONTINUE', TL.W / 2, TL.H - 60, 7, '#3a5a52', 'center');
      } else if (TL.Epilogue.phase === 1) {
        TL.Epilogue.drawTwilight(ctx);
      } else {
        TL.Epilogue.drawCredits(ctx);
      }
      TL.crt(ctx, TL.Epilogue.t);
    }
  };

})(window.TL);
