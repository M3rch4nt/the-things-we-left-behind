/* ============================================================
   THE THINGS WE LEFT BEHIND — main.js
   Game state machine, play loop, travel, discovery, finale.
   ============================================================ */
'use strict';
(function (TL) {

  var G = {
    mode: 'title',
    prevMode: 'title',
    pauseReturn: 'play',
    settingsBack: 'pause',
    t: 0,
    fade: null,
    welcomeShown: {}
  };
  TL.G = G;

  /* ---------- audio mood per mode ---------- */
  function moodFor(mode) {
    if (mode === 'title' || mode === 'about') return 'title';
    if (mode === 'cinematic') return 'calm';
    if (mode === 'epilogue') return 'finale';
    return 'explore';
  }
  G.setMode = function (m) {
    if (G.mode === m) return;
    G.prevMode = G.mode;
    G.mode = m;
    TL.audio.mood = moodFor(m);
  };

  /* ---------- start / intro ---------- */
  G.startGame = function (cont) {
    TL.loadSave();
    if (!cont) { TL.wipeSave(); }
    if (TL.S.seenIntro && cont) {
      G.enterArea(TL.S.current, TL.S.spawnX !== null ? TL.S.spawnX : undefined);
      G.setMode('play');
    } else {
      /* preload the imported cinematic images BEFORE the sequence starts:
         zero flicker, zero code-art placeholders */
      Cin_reset();
      TL.Loading.begin(function () { G.setMode('cinematic'); });
      G.setMode('loading');
    }
  };
  function Cin_reset() { TL.Cinematic.t = 0; TL.Cinematic.scene = 0; TL.Cinematic.sceneT = 0; }

  G.finishIntro = function () {
    TL.S.seenIntro = true;
    TL.save();
    G.enterArea('chryse', 120);
    G.setMode('play');
    TL.toast('SIGNAL DETECTED — SOURCE UNKNOWN', '#f0a050');
    TL.toast(TL.D.WELCOME.chryse, '#9fd8c8', true);
  };

  /* ---------- areas & travel ---------- */
  G.enterArea = function (id, x) {
    /* old saves may name worlds consolidated in the 6-world layout */
    var REMAP = { utopia: 'chryse', meridiani: 'gusev', gale: 'boreal', relay: 'jezero' };
    id = REMAP[id] || id;
    /* arriving somewhere new ends any open conversation / abandoned activity */
    if (TL.Dialogue.active) { TL.Dialogue.active = false; TL.Dialogue.finished = false; }
    if (TL.MG.game && !TL.MG.success) { TL.MG.game = null; TL.MG.id = null; TL.MG.cb = null; }
    G.pauseReturn = 'play';
    var a = TL.World.build(id);
    var entryX = x;
    if (entryX === undefined || entryX === null) entryX = 300;
    entryX = TL.clamp(entryX, 30, a.w - 30);
    /* avoid spawning inside pit */
    if (TL.World.overPit(entryX)) entryX = 300;
    TL.Player.createAt(TL.World.groundY(entryX) - 1, entryX);
    TL.S.current = id;
    TL.S.spawnX = entryX;
    if (!TL.has(TL.S.visited, id)) TL.S.visited.push(id);
    TL.save();
    var first = !G.welcomeShown[id];
    G.welcomeShown[id] = true;
    if (TL.HUD.showLocation) TL.HUD.showLocation(a.def);
    if (first && TL.D.WELCOME[id]) TL.toast(TL.D.WELCOME[id], '#9fd8c8', true);
    var led = document.getElementById('led-sig');
    if (led) {
      led.classList.add('on');
      if (TL.discCount() >= TL.TOTAL_HW) led.classList.add('blink'); else led.classList.remove('blink');
    }
  };

  G.travel = function (to, dir) {
    if (G.fade) return;
    TL.audio.static(0.4, 0.06);
    G.fade = {
      t: 0, phase: 'out',
      cb: function () {
        var entry;
        if (dir > 0) entry = 90;
        else {
          var def = null;
          for (var i = 0; i < TL.D.AREAS.length; i++) if (TL.D.AREAS[i].id === to) def = TL.D.AREAS[i];
          entry = def ? def.w - 90 : 300;
        }
        G.enterArea(to, entry);
      }
    };
  };

  G.travelTo = function (id) {
    if (G.fade) return;
    G.fade = { t: 0, phase: 'out', cb: function () { G.enterArea(id, 300); G.setMode('play'); } };
  };

  /* ---------- discovery ---------- */
  G.registerDiscovery = function (id) {
    if (TL.discovered(id)) return;
    TL.S.discoveries.push(id);
    var def = TL.D.CHARS[id];
    /* slide-in collect cards (top right) instead of toast spam */
    if (TL.HUD.showCollect) TL.HUD.showCollect('ARTIFACT RECOVERED', def ? def.name : id);
    if (!TL.has(TL.S.frags, id)) {
      TL.S.frags.push(id);
      if (TL.HUD.showCollect) TL.HUD.showCollect('SIGNAL FRAGMENT', TL.D.FRAGS[id] ? TL.D.FRAGS[id].label : id);
    }
    TL.audio.sting();
    TL.save();
    var led = document.getElementById('led-sig');
    if (led && TL.discCount() >= TL.TOTAL_HW) led.classList.add('blink');
    if (TL.discCount() >= TL.TOTAL_HW) {
      TL.toast('ALL HARDWARE FOUND — RETURN TO THE SIGNAL SOURCE', '#7ef0c8', true);
    }
  };

  /* ---------- dialogue hook ---------- */
  G.afterDialogue = function (charId) {
    if (charId === 'relay' && TL.discCount() >= TL.TOTAL_HW && !TL.S.finaleDone) {
      /* final transmission minigame */
      setTimeout(function () {
        TL.MG.start('final_tx', function () {
          G.setMode('epilogue');
          TL.Epilogue.start();
        });
      }, 600);
      return;
    }
    /* completed a conversation -> open that machine's mission archive */
    var aid = TL.D.ARCHIVE_OF && TL.D.ARCHIVE_OF[charId];
    if (aid && TL.Slides && TL.Slides.id === null && (TL.G.mode === 'play' || TL.G.mode === 'minigame')) {
      TL.Slides.open(aid, 'play');
    }
  };

  G.finishFinale = function () {
    TL.S.finaleDone = true;
    TL.save();
    G.setMode('play');
    TL.toast('BEYOND THE RED PLANET — UNLOCKED IN ARCHIVE', '#59c8f0', true);
    TL.toast('FREE EXPLORATION — THE ARCHIVE REMAINS OPEN', '#7ef0c8');
  };

  /* ---------- objective ---------- */
  G.objective = function () {
    if (!TL.World.area) return 'AWAITING DEPLOYMENT';
    var disc = TL.discCount();
    if (TL.S.finaleDone) return 'FREE EXPLORATION — ARCHIVE COMPLETE';
    if (disc >= TL.TOTAL_HW) return 'RETURN TO THE SIGNAL SOURCE';
    var id = TL.World.area.def.id;
    if (id === 'jezero') return 'REACH THE SIGNAL SOURCE — FAR END OF JEZERO (' + disc + '/12 FRAGMENTS)';
    return TL.World.area.def.objective + ' (' + disc + '/12)';
  };

  /* ---------- pause ---------- */
  G.openPause = function () {
    G.pauseReturn = TL.Dialogue.active ? 'dialogue' : 'play';
    G.setMode('pause');
    TL.audio.uiBack();
  };
  G.resume = function () {
    G.setMode(G.pauseReturn === 'minigame' ? 'minigame' : 'play');
    TL.audio.ui();
  };

  G.drawWorldFrame = function (ctx) {
    var p = TL.Player.p;
    if (!TL.World.area || !p) return;
    var camX = TL.World.cam.x;
    TL.World.drawBackground(ctx, camX);
    TL.World.drawGround(ctx, camX);
    TL.World.drawEntities(ctx, camX, p.x);
    TL.Player.draw(ctx, p, camX, 0);
    /* rocks draw in front of the rover: they are scenery it drives behind */
    TL.World.drawRocks(ctx, camX);
    TL.HUD.draw(ctx, p);
  };

  /* ---------- notifications (two dedicated zones, see core.js) ---------- */

  /* ---------- fade ---------- */
  function updateFade(dt) {
    if (!G.fade) return;
    G.fade.t += dt;
    if (G.fade.phase === 'out' && G.fade.t > 0.45) {
      G.fade.phase = 'in';
      G.fade.t = 0;
      if (G.fade.cb) { var cb = G.fade.cb; G.fade.cb = null; cb(); }
    } else if (G.fade.phase === 'in' && G.fade.t > 0.45) {
      G.fade = null;
    }
  }
  function drawFade(ctx) {
    if (!G.fade) return;
    var a = G.fade.phase === 'out' ? Math.min(1, G.fade.t / 0.45) : Math.max(0, 1 - G.fade.t / 0.45);
    ctx.fillStyle = 'rgba(2,4,8,' + a + ')';
    ctx.fillRect(0, 0, TL.W, TL.H);
  }

  /* ---------- per-frame update ---------- */
  G.update = function (dt) {
    G.t += dt;
    TL.S.playtime = (TL.S.playtime || 0) + dt;
    TL.Notify.update(dt);
    /* global mute key */
    if (TL.hit('m') && G.mode !== 'settings') {
      TL.S.settings.mute = !TL.S.settings.mute;
      TL.audio.applySettings();
      TL.toast(TL.S.settings.mute ? 'AUDIO MUTED [M]' : 'AUDIO ON [M]');
    }
    updateFade(dt);
    if (TL.World.area) TL.World.update(dt);
    switch (G.mode) {
      case 'title': TL.Title.update(dt); break;
      case 'about': break;
      case 'loading': TL.Loading.update(dt); break;
      case 'cinematic': TL.Cinematic.update(dt); break;
      case 'slides': TL.Slides.update(dt); break;
      case 'play':
        if (TL.hit('escape') && !TL.Dialogue.active) { G.openPause(); break; }
        if (TL.Dialogue.active) {
          TL.Dialogue.update(dt);
        } else if (TL.Player.p) {
          TL.Player.update(TL.Player.p, dt);
          /* interact */
          if (TL.actHit() && !TL.fade) TL.Player.interact(TL.Player.p);
        }
        break;
      case 'minigame': TL.MG.update(dt); break;
      case 'pause': TL.Pause.update(dt); break;
      case 'map': TL.Map.update(dt); break;
      case 'archive': TL.Archive.update(dt); break;
      case 'settings': TL.Settings.update(dt); break;
      case 'epilogue': TL.Epilogue.update(dt); break;
    }
  };

  /* ---------- per-frame draw ---------- */
  G.draw = function (ctx) {
    ctx.fillStyle = '#02060a';
    ctx.fillRect(0, 0, TL.W, TL.H);
    switch (G.mode) {
      case 'title': TL.Title.draw(ctx); break;
      case 'about': TL.About.draw(ctx); break;
      case 'loading': TL.Loading.draw(ctx); break;
      case 'cinematic': TL.Cinematic.draw(ctx); break;
      case 'play':
        G.drawWorldFrame(ctx);
        if (TL.Dialogue.active) TL.Dialogue.draw(ctx);
        TL.Notify.draw(ctx);
        TL.crt(ctx, G.t);
        break;
      case 'minigame':
        TL.MG.draw(ctx);
        TL.Notify.draw(ctx);
        break;
      case 'pause': TL.Pause.draw(ctx); TL.Notify.drawStatus(ctx); break;
      case 'map': TL.Map.draw(ctx); break;
      case 'archive': TL.Archive.draw(ctx); break;
      case 'slides': TL.Slides.draw(ctx); break;
      case 'settings': TL.Settings.draw(ctx); break;
      case 'epilogue': TL.Epilogue.draw(ctx); break;
    }
    drawFade(ctx);
  };

  /* ---------- boot ---------- */
  TL.loadSave();
  TL.Title.rebuild();
  /* start paused at title until user gesture (audio unlock) */

  var last = performance.now();
  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    try {
      G.update(dt);
      G.draw(TL.ctx);
    } catch (e) {
      /* fail loud in console but keep loop */
      console.error(e);
    }
    TL.endFrame();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

})(window.TL);
