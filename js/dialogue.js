/* ============================================================
   THE THINGS WE LEFT BEHIND — dialogue.js
   Script player: typewriter text, portraits, voices,
   minigame chaining, discovery registration.
   ============================================================ */
'use strict';
(function (TL) {

  var D = {
    active: false,
    charId: null, def: null,
    lines: [], li: 0,
    ci: 0, speed: 34,
    speaker: null,
    phase: 'lines',       // lines | mg | done
    mgQueue: [],
    postLines: [], postLi: 0, postCi: 0,
    finished: false,
    voiceT: 0
  };
  TL.Dialogue = D;

  D.start = function (charId) {
    var def = TL.D.CHARS[charId];
    if (!def) return;
    D.active = true;
    D.charId = charId;
    D.def = def;
    D.finished = false;
    TL.audio.voice(charId);
    TL.audio.static(0.25, 0.05);
    if (TL.discovered(charId) && def.doneScript) {
      D.phase = 'post';
      D.postLines = def.doneScript;
      D.postLi = 0; D.postCi = 0;
      D.li = -1;
    } else {
      D.phase = 'lines';
      D.lines = def.script;
      D.li = 0; D.ci = 0;
      D.mgQueue = (TL.D.CHAR_MG_CHAIN[charId] || (TL.D.CHAR_MG[charId] ? [TL.D.CHAR_MG[charId]] : [])).slice();
    }
    D.voiceT = 0;
    if (TL.Images) {
      var script = D.phase === 'post' ? D.postLines : D.lines;
      var portraits = {};
      script.forEach(function (line) {
        var id = speakerOf(line.w).portrait;
        if (!portraits[id]) TL.Images.avatar(id);
        portraits[id] = true;
      });
    }
  };

  function speakerOf(w) {
    if (w === 'P') return { name: 'SEEKER (YOU)', color: '#7ef0c8', portrait: 'player' };
    var def = TL.D.CHARS[w];
    return { name: def.name, color: def.color, portrait: w };
  }

  D.curLine = function () {
    if (D.phase === 'lines') return D.li < D.lines.length ? D.lines[D.li] : null;
    return D.postLi < D.postLines.length ? D.postLines[D.postLi] : null;
  };
  D.curPos = function () { return D.phase === 'lines' ? D.ci : D.postCi; };
  D.setCurPos = function (v) { if (D.phase === 'lines') D.ci = v; else D.postCi = v; };

  D.update = function (dt) {
    if (!D.active) return;
    var line = D.curLine();
    if (!line) {
      /* nothing left to show: an abandoned chain (e.g. traveled mid-activity)
         must never strand the player on a '...' box */
      if (D.phase !== 'mg' || TL.G.mode === 'play') D.finish(false);
      return;
    }
    if (line) {
      if (D.curPos() < line.t.length) {
        D.setCurPos(Math.min(line.t.length, D.curPos() + D.speed * dt));
        D.voiceT -= dt;
        if (D.voiceT <= 0) {
          D.voiceT = 0.16;
          if (line.w !== 'P') TL.audio.voice(D.charId);
          else TL.audio.blip(700 + Math.random() * 120, 0.02, 0.04);
        }
      }
      /* advance input */
      if (TL.actHit() || TL.hit('space') || TL.mouse.clicked) {
        if (D.curPos() < line.t.length) {
          D.setCurPos(line.t.length);
        } else {
          TL.audio.ui();
          if (D.phase === 'lines') {
            D.li++;
            D.voiceT = 0;
            if (D.li >= D.lines.length) D.afterLines();
          } else {
            D.postLi++;
            D.voiceT = 0;
            if (D.postLi >= D.postLines.length) D.afterPost();
          }
        }
      }
    }
  };

  D.afterLines = function () {
    /* pathfinder-type: conversation completes discovery */
    if (D.mgQueue.length === 0) {
      D.finish(true);
      return;
    }
    D.phase = 'mg';
    var mgId = D.mgQueue.shift();
    TL.MG.start(mgId, function () {
      /* minigame complete → post (doneScript) */
      D.phase = 'post';
      D.postLines = D.def.doneScript || [];
      D.postLi = 0; D.postCi = 0;
      if (D.postLines.length === 0) D.afterPost();
    });
  };

  D.afterPost = function () {
    if (D.phase === 'lines') { D.finish(true); return; }
    /* first completion happens after activity: register */
    D.finish(true);
  };

  D.finish = function (register) {
    D.active = false;
    D.finished = true;
    if (register && !TL.discovered(D.charId)) {
      TL.G.registerDiscovery(D.charId);
    }
    /* relay: after dialogue ends with 12/12, start finale */
    TL.G.afterDialogue(D.charId);
  };

  /* ---------- drawing ---------- */
  D.draw = function (ctx) {
    if (!D.active) return;
    TL.BIG_TEXT = true;   /* dialogue is a book page: keep its text large */
    /* dim world */
    ctx.fillStyle = 'rgba(4,10,14,0.55)';
    ctx.fillRect(0, 0, TL.W, TL.H);

    var line = D.curLine();
    var bx = 60, bw = TL.W - 120;
    /* box height grows with the FULL passage (stable during the typewriter
       reveal) so long lines never overlap; bottom-anchored so it stays put */
    var textLines = line ? TL.wrap(ctx, line.t, bw - 150, 11) : ['...'];
    var bh = Math.max(150, 52 + textLines.length * 19 + 14);
    var by = TL.H - 40 - bh;
    /* Opaque backing stays in place as speakers change. */
    ctx.fillStyle = '#051016';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(110,220,200,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);

    if (line) {
      var sp = speakerOf(line.w);
      /* portrait: user-imported avatar if provided, pixel art otherwise */
      var px = bx + 16, py = by + 16;
      TL.rect(ctx, px, py, 96, 96, '#03090e');
      ctx.strokeStyle = sp.color;
      ctx.strokeRect(px - 4.5, py - 4.5, 103, 103);
      var av = TL.Images ? TL.Images.avatar(sp.portrait) : null;
      ctx.imageSmoothingEnabled = !!av;
      if (av) ctx.drawImage(av, px, py, 96, 96);
      else if (!TL.Images || TL.Images.cache['av:' + sp.portrait] === 'fail') {
        ctx.drawImage(TL.portrait(sp.portrait), px, py, 96, 96);
      }
      ctx.imageSmoothingEnabled = false;
      /* name */
      TL.text(ctx, sp.name, px + 112, by + 15, 10, sp.color);
      ctx.fillStyle = 'rgba(110,220,200,0.18)';
      ctx.fillRect(px + 112, by + 32, 180, 1);
      /* text with typewriter — pre-wrapped above, roomy 19px leading.
         Word-wrapped full text is revealed across lines, so the layout
         never reflows while typing. */
      var shown = Math.floor(D.curPos());
      var cnt = 0;
      var ty = by + 44;
      for (var i = 0; i < textLines.length; i++) {
        var ln = textLines[i];
        if (cnt >= shown) break;
        var part = ln.slice(0, Math.max(0, shown - cnt));
        TL.text(ctx, part, px + 112, ty + i * 19, 11, '#c8e8dc');
        cnt += ln.length + 1;
      }
      /* continue indicator */
      if (D.curPos() >= line.t.length) {
        var bob = Math.sin(performance.now() * 0.005) > 0 ? 0 : 2;
        TL.text(ctx, '▼ E', bx + bw - 44, by + bh - 22 + bob, 9, '#6ee6c8', 'left', 0.7 + 0.3 * Math.sin(performance.now() * 0.005));
      }
    } else {
      TL.text(ctx, '...', bx + bw / 2, by + bh / 2, 12, '#6ee6c8', 'center');
    }
    /* interference while talking */
    TL.staticOverlay(ctx, 0.12 + 0.08 * Math.sin(performance.now() * 0.002));
    TL.BIG_TEXT = false;
  };

})(window.TL);
