/* ============================================================
   THE THINGS WE LEFT BEHIND — core.js
   Namespace, canvas, input, save system, math + drawing utils
   ============================================================ */
'use strict';
window.TL = window.TL || {};

(function (TL) {

  /* ---------- constants ---------- */
  TL.W = 960; TL.H = 540;
  TL.FLOOR = 470;              // default ground baseline y
  TL.TOTAL_HW = 12;            // total discoverable hardware

  /* ---------- canvas ---------- */
  TL.canvas = document.getElementById('game');
  TL.ctx = TL.canvas.getContext('2d');
  TL.ctx.imageSmoothingEnabled = false;

  /* fit whole chassis to viewport via CSS scale */
  TL.fitLayout = function () {
    var mon = document.getElementById('monitor');
    var need = 1060 / window.innerWidth;
    var needH = 720 / window.innerHeight;
    var s = Math.min(1, 1 / Math.max(need, needH));
    mon.style.setProperty('--s', s.toFixed(3));
    document.body.classList.toggle('touch', ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
  };
  window.addEventListener('resize', TL.fitLayout);
  TL.fitLayout();

  /* pointer position mapped into canvas space */
  TL.mouse = { x: 0, y: 0, down: false, clicked: false, released: false };
  TL._mapPointer = function (e) {
    var r = TL.canvas.getBoundingClientRect();
    TL.mouse.x = (e.clientX - r.left) * (TL.W / r.width);
    TL.mouse.y = (e.clientY - r.top) * (TL.H / r.height);
  };
  TL.canvas.addEventListener('mousemove', function (e) { TL._mapPointer(e); });
  TL.canvas.addEventListener('mousedown', function (e) { TL._mapPointer(e); TL.mouse.down = true; TL.mouse.clicked = true; });
  TL.canvas.addEventListener('mouseup', function (e) { TL._mapPointer(e); TL.mouse.down = false; TL.mouse.released = true; });
  TL.canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* ---------- input ---------- */
  TL.keys = {};        // held
  TL.pressed = {};     // pressed this frame
  TL.keyName = function (e) {
    var k = e.key;
    if (k === ' ') return 'space';
    return k.toLowerCase();
  };
  window.addEventListener('keydown', function (e) {
    var k = TL.keyName(e);
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].indexOf(e.key.toLowerCase()) >= 0 || e.key === ' ') e.preventDefault();
    if (!TL.keys[k]) TL.pressed[k] = true;
    TL.keys[k] = true;
    TL.anyKey = true;
    TL.audio.unlock();
  });
  window.addEventListener('keyup', function (e) {
    TL.keys[TL.keyName(e)] = false;
  });

  TL.key = function (k) { return !!TL.keys[k]; };
  TL.hit = function (k) { return !!TL.pressed[k]; };
  /* virtual keys from touch buttons */
  TL.virt = { left: false, right: false, jump: false, act: false };
  TL.left = function () { return TL.key('arrowleft') || TL.key('a') || TL.virt.left; };
  TL.right = function () { return TL.key('arrowright') || TL.key('d') || TL.virt.right; };
  TL.jumpHit = function () { return TL.hit('space') || TL.hit('w') || TL.hit('arrowup') || TL.virt.jumpHit; };
  TL.actHit = function () { return TL.hit('e') || TL.hit('enter') || TL.virt.actHit; };

  (function bindTouch() {
    function hold(id, down, up) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', function (e) { e.preventDefault(); down(); }, { passive: false });
      el.addEventListener('touchend', function (e) { e.preventDefault(); up(); }, { passive: false });
      el.addEventListener('touchcancel', up);
      el.addEventListener('mousedown', down);
      el.addEventListener('mouseup', up);
    }
    hold('t-left', function () { TL.virt.left = true; }, function () { TL.virt.left = false; });
    hold('t-right', function () { TL.virt.right = true; }, function () { TL.virt.right = false; });
    hold('t-jump', function () { TL.virt.jump = true; TL.virt.jumpHit = true; }, function () { TL.virt.jump = false; TL.virt.jumpHit = false; });
    hold('t-act', function () { TL.virt.act = true; TL.virt.actHit = true; }, function () { TL.virt.act = false; TL.virt.actHit = false; });
  })();

  TL.endFrame = function () { TL.pressed = {}; TL.mouse.clicked = false; TL.mouse.released = false; TL.virt.jumpHit = false; TL.virt.actHit = false; TL.anyKey = false; };

  /* ---------- math ---------- */
  TL.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  TL.lerp = function (a, b, t) { return a + (b - a) * t; };
  TL.dist = function (x1, y1, x2, y2) { var dx = x2 - x1, dy = y2 - y1; return Math.sqrt(dx * dx + dy * dy); };
  TL.ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

  /* seeded RNG */
  TL.RNG = function (seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };
  /* value noise 1D */
  TL.noise1 = function (seed) {
    var rnd = TL.RNG(seed), vals = [], i;
    for (i = 0; i < 512; i++) vals.push(rnd());
    return function (x) {
      var xi = Math.floor(x), f = x - xi;
      var a = vals[((xi % 512) + 512) % 512], b = vals[(((xi + 1) % 512) + 512) % 512];
      var t = f * f * (3 - 2 * f);
      return TL.lerp(a, b, t);
    };
  };

  /* ---------- save system ---------- */
  TL.S = null;         // live save state
  TL._saveKey = 'ttlb_save_v1';
  TL.defaults = function () {
    return {
      seenIntro: false,
      discoveries: [],        // char ids
      activities: [],         // completed minigame instance ids
      frags: [],              // signal fragment texts acquired (ids)
      items: [],              // collectible ids
      visited: [],            // area ids
      current: 'ares',
      spawnX: null,           // checkpoint x in area
      archPos: {},            // mission archive: last slide per archive id
      finaleDone: false,
      battery: 100,
      settings: { vol: 0.8, music: 0.6, sfx: 0.9, mute: false, shake: true },
      playtime: 0
    };
  };
  TL.loadSave = function () {
    try {
      var raw = localStorage.getItem(TL._saveKey);
      if (raw) { TL.S = Object.assign(TL.defaults(), JSON.parse(raw)); TL.S.settings = Object.assign(TL.defaults().settings, TL.S.settings); return true; }
    } catch (e) { }
    TL.S = TL.defaults();
    return false;
  };
  TL.save = function () {
    try { localStorage.setItem(TL._saveKey, JSON.stringify(TL.S)); } catch (e) { }
  };
  TL.wipeSave = function () {
    try { localStorage.removeItem(TL._saveKey); } catch (e) { }
    TL.S = TL.defaults();
  };
  TL.has = function (arr, id) { return arr.indexOf(id) >= 0; };
  TL.discovered = function (id) { return TL.has(TL.S.discoveries, id); };
  TL.discCount = function () { return TL.S.discoveries.length; };

  /* ---------- notification system ----------
     Two strictly separated UI zones so popups never overlap:
       STATUS zone — compact mini-cards tucked into the TOP-RIGHT corner.
                     Minor updates, pickups, meter changes. Short-lived.
       STORY zone  — centered, slow, elegant narrative beats and
                     location markers. One at a time, queued, never stacked.
     Each zone owns its own screen region exclusively; a dialogue box
     (bottom strip) is the third zone and is exclusive by itself. */
  TL.Notify = {
    statusQ: [],   /* {text, color, t} */
    storyQ: [],    /* {text?, def?, t} */
    cur: null,     /* current story item (one at a time) */
    STATUS_LIFE: 3.2,
    STORY_LIFE: 5.2,
    LOC_LIFE: 3.6,
    status: function (text, color) {
      var q = TL.Notify.statusQ;
      q.push({ text: text, color: color || '#7ef0c8', t: 0 });
      if (q.length > 4) q.shift();
    },
    story: function (text) {
      TL.Notify.storyQ.push({ text: text });
    },
    loc: function (def) {
      TL.Notify.storyQ.push({ def: def });
    },
    update: function (dt) {
      var N = TL.Notify, i;
      for (i = 0; i < N.statusQ.length; i++) {
        N.statusQ[i].t += dt;
        if (N.statusQ[i].t > N.STATUS_LIFE) { N.statusQ.splice(i, 1); i--; }
      }
      if (!N.cur && N.storyQ.length) { N.cur = N.storyQ.shift(); N.cur.t = 0; }
      if (N.cur) {
        N.cur.t += dt;
        var life = N.cur.def ? N.LOC_LIFE : N.STORY_LIFE;
        if (N.cur.t > life) N.cur = null;
      }
    },
    drawStatus: function (ctx) {
      var N = TL.Notify, y = 14;
      for (var i = 0; i < N.statusQ.length; i++) {
        var s = N.statusQ[i];
        /* slide in from the right edge, ease-out */
        var e = Math.min(1, s.t / 0.35);
        e = 1 - Math.pow(1 - e, 3);
        var out = s.t > N.STATUS_LIFE - 0.4 ? (s.t - (N.STATUS_LIFE - 0.4)) / 0.4 : 0;
        var alpha = (1 - out) * Math.min(1, s.t / 0.2);
        if (alpha <= 0) continue;
        var lines = TL.wrap(ctx, s.text, 216, 7);
        var h = lines.length * 13 + 14;
        var x = TL.W - 12 - 244 + (1 - e) * 260;
        ctx.save();
        ctx.globalAlpha = alpha;
        /* sleek semi-transparent card, one clean border */
        ctx.fillStyle = 'rgba(6,16,20,0.86)';
        ctx.fillRect(x, y, 244, h);
        ctx.strokeStyle = 'rgba(110,220,200,0.28)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, 243, h - 1);
        ctx.fillStyle = s.color;
        ctx.fillRect(x, y, 3, h);
        for (var L = 0; L < lines.length; L++) {
          TL.text(ctx, lines[L], x + 12, y + 8 + L * 13, 7, s.color, 'left', 0.95);
        }
        ctx.restore();
        y += h + 6;
      }
    },
    drawStory: function (ctx) {
      var N = TL.Notify, it = N.cur;
      if (!it) return;
      var fadeIn = Math.min(1, it.t / 0.8);          /* slow, elegant */
      var life = it.def ? N.LOC_LIFE : N.STORY_LIFE;
      var fadeOut = it.t > life - 0.7 ? Math.max(0, 1 - (it.t - (life - 0.7)) / 0.7) : 1;
      var alpha = fadeIn * fadeOut;
      if (alpha <= 0) return;
      var y = 132 + (1 - Math.min(1, it.t / 0.8)) * 10;  /* gentle rise */
      ctx.save();
      ctx.globalAlpha = alpha;
      if (it.def) {
        /* location marker: year, rule, region, sub */
        TL.text(ctx, it.def.year, TL.W / 2, y, 17, '#d8b25a', 'center');
        ctx.fillStyle = 'rgba(216,178,90,0.4)';
        ctx.fillRect(TL.W / 2 - 70, y + 24, 140, 1);
        TL.text(ctx, it.def.region, TL.W / 2, y + 34, 9, '#9fe8d8', 'center');
        if (it.def.sub) TL.text(ctx, it.def.sub, TL.W / 2, y + 54, 7, '#7ab8a8', 'center', 0.85);
      } else {
        var lines = TL.wrap(ctx, it.text, 580, 9);
        var h = lines.length * 18 + 22;
        ctx.fillStyle = 'rgba(4,14,18,0.82)';
        ctx.fillRect(TL.W / 2 - 310, y - 14, 620, h);
        ctx.strokeStyle = 'rgba(216,178,90,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(TL.W / 2 - 309.5, y - 13.5, 619, h - 1);
        for (var L = 0; L < lines.length; L++) {
          TL.text(ctx, lines[L], TL.W / 2, y - 4 + L * 18, 9, '#cfeadd', 'center');
        }
      }
      ctx.restore();
    },
    draw: function (ctx) { TL.Notify.drawStory(ctx); TL.Notify.drawStatus(ctx); }
  };
  /* legacy entry point: big=true routes important beats to the story zone */
  TL.toast = function (text, color, big) {
    if (big) TL.Notify.story(text);
    else TL.Notify.status(text, color);
  };

  /* ---------- text helpers ---------- */
  /* UI text stays small; dialogues / book pages / slides set TL.BIG_TEXT
     to render at full size while a large passage is on screen.
     TL.TS is a global legibility multiplier: every size that goes through
     effSize (TL.text, TL.wrap) is scaled by it, everywhere. */
  TL.BIG_TEXT = false;
  TL.TS = 1.12;
  TL.effSize = function (s) {
    if (!s) return s;
    var scaled = Math.round(s * TL.TS * 2) / 2;
    if (TL.BIG_TEXT) return scaled;
    return s <= 8 ? scaled : Math.max(8, Math.round(s * 0.8 * TL.TS * 2) / 2);
  };
  TL.font = function (px) { return px + 'px "Press Start 2P", monospace'; };
  TL.text = function (ctx, str, x, y, size, color, align, alpha) {
    size = TL.effSize(size || 10);
    ctx.save();
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    ctx.font = TL.font(size);
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = color || '#9fe8d8';
    ctx.fillText(str, Math.round(x), Math.round(y));
    ctx.restore();
  };
  /* word-wrap into lines array */
  TL.wrap = function (ctx, str, maxW, size) {
    ctx.save(); ctx.font = TL.font(TL.effSize(size));
    var words = str.split(' '), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var test = cur ? cur + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = words[i]; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    ctx.restore();
    return lines;
  };
  TL.rect = function (ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

  /* panel: dark technical box with cyan corner brackets */
  TL.panel = function (ctx, x, y, w, h, opts) {
    opts = opts || {};
    ctx.save();
    ctx.fillStyle = opts.bg || 'rgba(4,16,20,0.88)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = opts.border || 'rgba(110,220,200,0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    var L = 10, c = opts.corner || '#6ee6c8';
    ctx.fillStyle = c;
    ctx.fillRect(x - 1, y - 1, L, 2); ctx.fillRect(x - 1, y - 1, 2, L);
    ctx.fillRect(x + w - L + 1, y - 1, L, 2); ctx.fillRect(x + w - 1, y - 1, 2, L);
    ctx.fillRect(x - 1, y + h - 1, L, 2); ctx.fillRect(x - 1, y + h - L + 1, 2, L);
    ctx.fillRect(x + w - L + 1, y + h - 1, L, 2); ctx.fillRect(x + w - 1, y + h - L + 1, 2, L);
    ctx.restore();
  };

  /* pixel-art sprite renderer
     def = { w, h, pal: {sym:'#hex'}, rows: ['..ab..', ...] }  */
  TL.drawSprite = function (ctx, def, x, y, scale, flip) {
    scale = scale || 1;
    var px = scale;
    for (var r = 0; r < def.rows.length; r++) {
      var row = def.rows[r];
      for (var c = 0; c < row.length; c++) {
        var ch = row[c];
        if (ch === '.' || ch === ' ') continue;
        var col = def.pal[ch];
        if (!col) continue;
        ctx.fillStyle = col;
        var dx = flip ? x + (def.w - 1 - c) * px : x + c * px;
        ctx.fillRect(Math.round(dx), Math.round(y + r * px), px, px);
      }
    }
  };

  /* progress bar with segments */
  TL.bar = function (ctx, x, y, w, h, pct, col, back) {
    ctx.fillStyle = back || 'rgba(20,40,44,0.8)';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = col;
    ctx.fillRect(x, y, Math.max(0, Math.round(w * TL.clamp(pct, 0, 1))), h);
  };

  /* interference / static sweep on full screen (a=amount 0..1) */
  TL.staticOverlay = function (ctx, a) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a * 0.25;
    var r = TL.RNG((performance.now() * 0.06) | 0);
    for (var i = 0; i < 40; i++) {
      var y = (r() * TL.H) | 0, x = (r() * TL.W) | 0, w = 20 + r() * 120;
      ctx.fillStyle = r() > 0.5 ? '#8fffe0' : '#1b4a44';
      ctx.fillRect(x, y, w, 1 + (r() * 2) | 0);
    }
    ctx.restore();
    /* rolling band */
    var band = ((performance.now() * 0.08) % (TL.H + 120)) - 60;
    ctx.save(); ctx.globalAlpha = a * 0.12;
    var g = ctx.createLinearGradient(0, band - 30, 0, band + 30);
    g.addColorStop(0, 'rgba(140,255,220,0)'); g.addColorStop(0.5, 'rgba(140,255,220,1)'); g.addColorStop(1, 'rgba(140,255,220,0)');
    ctx.fillStyle = g; ctx.fillRect(0, band - 30, TL.W, 60);
    ctx.restore();
  };

  /* vignette for CRT feel (steady — no flicker) */
  TL.crt = function (ctx, t) {
    /* subtle corner darkening */
    ctx.save();
    var g = ctx.createRadialGradient(TL.W / 2, TL.H / 2, TL.H * 0.45, TL.W / 2, TL.H / 2, TL.H * 0.95);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.34)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, TL.W, TL.H);
    ctx.restore();
  };

})(window.TL);
