/* ============================================================
   THE THINGS WE LEFT BEHIND — images.js
   User-import image system.

   Drop your own pictures into the assets/ folders and the game
   picks them up automatically (no code changes needed):

     assets/avatars/<character>.jpg|png|jpeg|webp
       -> portrait faces, auto-cropped to a square by this code
     assets/cinematic/scene1..4.jpg|png|...
       -> intro cinematic backdrops (replaces programmatic scene)
     assets/archives/<archive>/frame1..N.jpg|png|...
       -> Mission Archive slide photos (replaces drawn scene)

   Anything missing falls back to the built-in pixel art, so the
   game always works, hosted or local.
   ============================================================ */
'use strict';
(function (TL) {

  var IM = TL.Images = {
    cache: {},     // key -> canvas | img | 'fail'
    probing: {},   // key -> true while loading
    EXT: ['jpg', 'png', 'jpeg', 'webp'],
    MAN: null      // optional manifest (flat key -> path); null until checked
  };

  /* optional manifest: if assets/manifest.json exists it lists every
     available image (see tools/genmanifest.js) and probing becomes
     exact — zero 404 console noise. Without it, extension probing
     is used, which can log harmless 404s for missing optional files. */
  if (typeof fetch === 'function' && location.protocol !== 'file:') {
    fetch('assets/manifest.json').then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { IM.MAN = (j && typeof j === 'object') ? j : {}; })
      .catch(function () { IM.MAN = {}; });
  } else {
    IM.MAN = {};
  }

  /* try candidate paths in order, first success wins.
     Uses fetch-HEAD existence checks so missing optional assets do not
     spam the console with 404s; falls back to direct Image probing
     when fetch is unavailable (file://).
     Multiple callers may wait on the same key: every callback is
     queued and flushed when the probe resolves. */
  var waiters = {};   // key -> [cb, ...]

  function probe(paths, key, done) {
    if (IM.cache[key]) { done(IM.cache[key]); return; }
    if (IM.MAN === null) {                    // manifest still loading: try again shortly
      setTimeout(function () { probe(paths, key, done); }, 60);
      return;
    }
    if (!waiters[key]) waiters[key] = [];
    waiters[key].push(done);
    if (IM.probing[key]) return;              // already in flight; it will flush the queue
    IM.probing[key] = true;
    var i = 0;
    function resolve() {
      delete IM.probing[key];
      var ws = waiters[key] || [];
      delete waiters[key];
      for (var w = 0; w < ws.length; w++) ws[w](IM.cache[key]);
    }
    function headCheck() {
      /* manifest is authoritative: exact path or confirmed absence.
         (Browsers log every probed 404 in the console, so silent
         network probing is not possible; the manifest keeps the
         console clean once your images are indexed.) */
      if (IM.MAN) {
        var mp = IM.MAN[key];
        if (mp) { loadImg(mp); return; }
        IM.cache[key] = 'fail'; resolve(); return;
      }
      if (i >= paths.length) { IM.cache[key] = 'fail'; resolve(); return; }
      var url = paths[i];
      if (typeof fetch === 'function' && location.protocol !== 'file:') {
        fetch(url, { method: 'HEAD' }).then(function (res) {
          if (res.ok) loadImg(url); else { i++; headCheck(); }
        }).catch(function () { loadImg(url); });   // fetch blocked -> try img anyway
      } else {
        loadImg(url);
      }
    }
    function loadImg(url) {
      var img = new Image();
      img.onload = function () {
        IM.cache[key] = img;
        resolve();
      };
      img.onerror = function () { i++; headCheck(); };
      img.src = url;
    }
    headCheck();
  }

  function pathsFor(base, file) {
    var out = [];
    for (var i = 0; i < IM.EXT.length; i++) out.push(base + file + '.' + IM.EXT[i]);
    return out;
  }

  /* ---- avatar auto-crop ----
     1. find the bounding box of pixels that differ from the corner colour
     2. crop it, then centre-crop to a square
     3. downscale to <= 240px */
  IM._autocrop = function (img) {
    var cv = document.createElement('canvas');
    cv.width = img.naturalWidth; cv.height = img.naturalHeight;
    var c = cv.getContext('2d');
    c.drawImage(img, 0, 0);
    var w = cv.width, h = cv.height, box;
    try {
      var d = c.getImageData(0, 0, w, h).data;
      function px(x, y) { var o = (y * w + x) * 4; return [d[o], d[o + 1], d[o + 2]]; }
      /* background = most common of the four corners */
      var corners = [px(0, 0), px(w - 1, 0), px(0, h - 1), px(w - 1, h - 1)];
      var bg = corners[0], best = -1;
      for (var a = 0; a < 4; a++) {
        var score = 0;
        for (var b = 0; b < 4; b++) {
          if (Math.abs(corners[a][0] - corners[b][0]) < 30 &&
              Math.abs(corners[a][1] - corners[b][1]) < 30 &&
              Math.abs(corners[a][2] - corners[b][2]) < 30) score++;
        }
        if (score > best) { best = score; bg = corners[a]; }
      }
      function diff(p) {
        return Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]) > 96;
      }
      var minX = w, minY = h, maxX = -1, maxY = -1;
      var step = Math.max(1, Math.floor(Math.min(w, h) / 200));
      for (var y = 0; y < h; y += step) {
        for (var x = 0; x < w; x += step) {
          if (diff(px(x, y))) {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < 0 || (maxX - minX) < w * 0.25 || (maxY - minY) < h * 0.25) box = null;
      else box = { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    } catch (e) { box = null; }   // tainted canvas (cross-origin) -> skip trim
    var sx, sy, sw, sh;
    if (box) { sx = box.x; sy = box.y; sw = box.w; sh = box.h; }
    else { sx = 0; sy = 0; sw = w; sh = h; }
    /* centre square */
    var side = Math.min(sw, sh);
    sx += (sw - side) / 2; sy += (sh - side) / 2; sw = sh = side;
    var out = document.createElement('canvas');
    var scale = Math.min(1, 240 / side);
    out.width = Math.max(8, Math.round(sw * scale));
    out.height = out.width;
    var c2 = out.getContext('2d');
    c2.imageSmoothingEnabled = true;
    try { c2.drawImage(cv, sx, sy, sw, sh, 0, 0, out.width, out.height); }
    catch (e) { c2.drawImage(img, 0, 0, out.width, out.height); }
    return out;
  };

  /* ---------- public API ---------- */

  /* preload a list of {key, base, file} probes; done() fires when every
     image has resolved (loaded or confirmed absent). onEach fires with
     the running count for progress display. */
  IM.warm = function (list, done, onEach) {
    var left = list.length;
    if (!left) { if (done) done(); return; }
    var cb = function () {
      left--;
      if (onEach) onEach(list.length - left);
      if (left === 0 && done) done();
    };
    for (var i = 0; i < list.length; i++) {
      probe(pathsFor(list[i].base, list[i].file), list[i].key, cb);
    }
  };

  /* portrait for dialogue boxes / archive header — auto-cropped square */
  IM.avatar = function (id) {
    var key = 'av:' + id;
    var v = IM.cache[key];
    if (v === 'fail') return null;
    if (v) return v;
    probe(pathsFor('assets/avatars/', id), key, function (img) {
      if (img) IM.cache[key] = IM._autocrop(img);
    });
    return null;   // first call(s) load async; pixel portrait shows meanwhile
  };

  /* intro cinematic scene backdrop (n = 0..3) */
  IM.scene = function (n) {
    var key = 'sc:' + n, v = IM.cache[key];
    if (v === 'fail') return null;
    if (v) return v;
    probe(pathsFor('assets/cinematic/', 'scene' + (n + 1)), key, function () {});
    return null;
  };

  /* mission archive slide photo (n = 0-based slide index) */
  IM.slide = function (id, n) {
    var key = 'sl:' + id + ':' + n, v = IM.cache[key];
    if (v === 'fail') return null;
    if (v) return v;
    probe(pathsFor('assets/archives/' + id + '/', 'frame' + (n + 1)), key, function () {});
    return null;
  };

  /* draw an image covering a rect (cropped, centred) */
  IM.drawCover = function (ctx, img, x, y, w, h) {
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    if (!iw || !ih) return false;
    var s = Math.max(w / iw, h / ih);
    var dw = iw * s, dh = ih * s;
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
    return true;
  };

  /* draw an image fully INSIDE a rect, aspect preserved, centred.
     The presentation-stage equivalent of KEEP_ASPECT_CENTERED: the whole
     frame stays visible — never cropped, never stretched. Empty margins
     show the caller's backdrop fill (letterboxing). */
  IM.drawContain = function (ctx, img, x, y, w, h) {
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    if (!iw || !ih) return false;
    var s = Math.min(w / iw, h / ih);
    var dw = iw * s, dh = ih * s;
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
    return true;
  };

})(window.TL);
