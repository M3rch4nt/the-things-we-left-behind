/* ============================================================
   THE THINGS WE LEFT BEHIND — world.js
   Terrain generation, parallax rendering, props, entities.
   ============================================================ */
'use strict';
(function (TL) {

  var World = {};
  TL.World = World;
  function P(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }

  var STEP = 16;
  var PIT_FLOOR = TL.FLOOR + 64;   /* pits are shallow trenches — you land inside, never fall through */

  function hashId(id) {
    var h = 2166136261;
    for (var i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }

  /* ---------- build an area ---------- */
  World.build = function (areaId) {
    var def = null;
    for (var i = 0; i < TL.D.AREAS.length; i++) if (TL.D.AREAS[i].id === areaId) def = TL.D.AREAS[i];
    if (!def) def = TL.D.AREAS[0];
    var seed = hashId(areaId);
    var rnd = TL.RNG(seed);
    var n1 = TL.noise1(seed + 7), n2 = TL.noise1(seed + 13), n3 = TL.noise1(seed + 29);

    var n = Math.ceil(def.w / STEP) + 1;
    var heights = new Array(n);
    for (var i = 0; i < n; i++) {
      var x = i * STEP;
      var h = TL.FLOOR - 10
        + (n1(x * 0.0038) - 0.5) * 90 * def.rugged
        + (n2(x * 0.011) - 0.5) * 36 * def.rugged
        + (n3(x * 0.03) - 0.5) * 10;
      heights[i] = h;
    }
    /* flatten near spawn & exits */
    function flatten(x0, x1) {
      var i0 = Math.max(0, Math.floor(x0 / STEP)), i1 = Math.min(n - 1, Math.ceil(x1 / STEP));
      var avg = 0, c = 0;
      for (var j = i0; j <= i1; j++) { avg += heights[j]; c++; }
      avg /= c;
      for (j = i0; j <= i1; j++) heights[j] = TL.lerp(heights[j], TL.FLOOR - 10, 0.85);
    }
    flatten(0, 380);
    flatten(def.w - 300, def.w);

    var pits = [], chars = [], stations = [], exits = [];
    var ents = def.ents.slice();
    /* sort a copy so we can mark pit ranges in heights */
    ents.forEach(function (e) {
      if (e.type === 'char') chars.push({ id: e.id, x: e.x, done: TL.discovered(e.id), t: rnd() * 1000, tag: e.tag || null });
      if (e.type === 'station') stations.push({ x: e.x });
      if (e.type === 'exit') exits.push({ x: e.x, dir: e.dir, to: e.to });
    });
    /* pits: carve a walkable trench floor with ramp lips (snapped to columns so the hole matches the visual chasm) */
    ents.forEach(function (e) {
      if (e.type === 'pit') {
        var i0 = Math.round(e.x / STEP), i1 = Math.round((e.x + e.w) / STEP);
        for (var j = i0 + 1; j < i1 - 1; j++) heights[j] = PIT_FLOOR;
        /* blend one ramp column on each lip so you can walk in and out */
        heights[i0] = TL.lerp(heights[i0], PIT_FLOOR, 0.5);
        heights[i1 - 1] = TL.lerp(heights[i1 - 1], PIT_FLOOR, 0.5);
        pits.push({ x: i0 * STEP, w: (i1 - i0) * STEP });
      }
    });

    /* blocking rocks (solid) */
    var rocks = [];
    var rockCount = 2 + Math.floor(def.rugged * 4);
    var tries = 0;
    while (rocks.length < rockCount && tries < 80) {
      tries++;
      var rx = 500 + rnd() * (def.w - 1100);
      var ok = true;
      var blocked = chars.map(function (c) { return Math.abs(c.x - rx) < 220; })
        .concat(stations.map(function (s) { return Math.abs(s.x - rx) < 180; }))
        .concat(pits.map(function (p) { return rx > p.x - 200 && rx < p.x + p.w + 200; }))
        .concat(exits.map(function (e) { return Math.abs(e.x - rx) < 200; }));
      for (var b = 0; b < blocked.length; b++) if (blocked[b]) ok = false;
      if (TL.S.spawnX !== null && Math.abs(TL.S.spawnX - rx) < 150) ok = false;
      if (ok) rocks.push({ x: rx, w: 26 + rnd() * 18, h: 20 + rnd() * 10 });
    }

    /* decor rocks */
    var decor = [];
    for (i = 0; i < 34; i++) {
      var dx2 = rnd() * def.w;
      var near = false;
      for (var k = 0; k < chars.length; k++) if (Math.abs(chars[k].x - dx2) < 120) near = true;
      if (near) continue;
      decor.push({ x: dx2, w: 8 + rnd() * 22, h: 5 + rnd() * 12, v: rnd() });
    }

    /* parallax silhouette layers */
    var far = [], mid = [];
    var fN = Math.ceil(def.w * 0.25 / 40);
    for (i = 0; i <= fN; i++) {
      far.push(TL.FLOOR - 130 - (n1(i * 0.35 + 3) * 110 + Math.sin(i * 0.8) * 18));
    }
    var mN = Math.ceil(def.w * 0.55 / 40);
    for (i = 0; i <= mN; i++) {
      mid.push(TL.FLOOR - 60 - (n2(i * 0.5 + 11) * 62 + Math.sin(i * 1.3) * 10));
    }

    /* items */
    var items = [];
    def.items.forEach(function (iid) {
      var it = TL.D.ITEMS[iid];
      if (!it) return;
      if (TL.has(TL.S.items, iid)) return;
      items.push({ id: iid, x: it.x, type: it.type, label: it.label, text: it.text });
    });

    World.area = {
      def: def, w: def.w, heights: heights, STEP: STEP,
      chars: chars, stations: stations, exits: exits, pits: pits,
      rocks: rocks, decor: decor, far: far, mid: mid, items: items,
      t: 0
    };
    /* particles */
    World.dust = [];
    for (i = 0; i < 40; i++) World.dust.push({ x: rnd() * def.w, y: TL.FLOOR - 120 - rnd() * 260, v: 0.4 + rnd() * 1.2, a: 0.2 + rnd() * 0.5 });
    World.devils = [];
    var dn = rnd() < 0.7 ? 1 : 0;
    for (i = 0; i < dn; i++) World.devils.push({ x: 800 + rnd() * (def.w - 1600), t: rnd() * 4000 });
    /* cloud wisps + (night areas) meteor timing */
    World.clouds = [];
    var cn = 5 + Math.floor(rnd() * 4);
    for (i = 0; i < cn; i++) World.clouds.push({ x: rnd() * (TL.W + 400), y: 36 + rnd() * 130, w: 70 + rnd() * 130, v: 2 + rnd() * 5, a: 0.07 + rnd() * 0.08 });
    World.meteors = [];
    if (def.theme.stars) {
      var mn = 3;
      for (i = 0; i < mn; i++) World.meteors.push({ phase: rnd() * 11000, y: 34 + rnd() * 120 });
    }

    return World.area;
  };

  World.groundY = function (x) {
    var a = World.area;
    x = TL.clamp(x, 0, a.w);
    var fi = x / STEP, i = Math.floor(fi), f = fi - i;
    var h0 = a.heights[TL.clamp(i, 0, a.heights.length - 1)];
    var h1 = a.heights[TL.clamp(i + 1, 0, a.heights.length - 1)];
    return TL.lerp(h0, h1, f);
  };
  World.overPit = function (x) {
    return World.groundY(x) > TL.FLOOR + 30;
  };

  /* ---------- camera ---------- */
  World.cam = { x: 0, y: 0, shake: 0 };

  /* ---------- update ---------- */
  World.update = function (dt) {
    var a = World.area;
    a.t += dt * 1000;
    for (var i = 0; i < World.dust.length; i++) {
      var d = World.dust[i];
      d.x -= d.v * dt * 30;
      if (d.x < World.cam.x - 60) d.x += a.w + 120;
      d.y += Math.sin(a.t * 0.001 + i) * 0.15;
    }
    for (i = 0; i < World.devils.length; i++) {
      var dv = World.devils[i];
      dv.x += 12 * dt;
      if (dv.x > a.w - 200) dv.x = 400;
    }
    for (i = 0; i < World.clouds.length; i++) {
      World.clouds[i].x -= World.clouds[i].v * dt * 3;
    }
    if (World.cam.shake > 0) World.cam.shake = Math.max(0, World.cam.shake - dt * 30);
  };

  /* ---------- drawing ---------- */
  function polyLine(ctx, arr, scroll, base, scale) {
    var stepX = 40;
    ctx.beginPath();
    for (var i = 0; i < arr.length; i++) {
      var x = i * stepX - scroll;
      var y = arr[i];
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
  }

  World.drawBackground = function (ctx, camX) {
    var a = World.area, th = a.def.theme;
    /* sky */
    var g = ctx.createLinearGradient(0, 0, 0, TL.FLOOR + 60);
    g.addColorStop(0, th.skyA); g.addColorStop(1, th.skyB);
    ctx.fillStyle = g; ctx.fillRect(0, 0, TL.W, TL.H);
    /* stars */
    if (th.stars) {
      var rr = TL.RNG(99);
      for (var i = 0; i < 70; i++) {
        var sx = (rr() * TL.W * 2 + camX * 0.05) % TL.W;
        var sy = rr() * (TL.FLOOR - 160);
        var tw = 0.4 + 0.6 * Math.abs(Math.sin(a.t * 0.001 + i));
        ctx.globalAlpha = tw * 0.8;
        ctx.fillStyle = '#d8d0f0';
        ctx.fillRect(sx | 0, sy | 0, 2, 2);
      }
      ctx.globalAlpha = 1;
      /* meteors: rare slow streaks */
      for (i = 0; i < World.meteors.length; i++) {
        var mt = World.meteors[i];
        var cyc = (a.t + mt.phase) % 11000;
        if (cyc < 1100) {
          var pr = cyc / 1100;
          var mx = TL.W * 0.15 + mt.phase * 0.07 + pr * 300;
          var my2 = mt.y + pr * 60;
          ctx.globalAlpha = Math.sin(pr * Math.PI) * 0.75;
          ctx.strokeStyle = '#e8e0ff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(mx, my2);
          ctx.lineTo(mx + 30, my2 - 13);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    /* sun */
    var sunX = TL.W * 0.72 - camX * 0.02, sunY = 90;
    ctx.fillStyle = th.sun;
    ctx.globalAlpha = 0.95;
    ctx.beginPath(); ctx.arc(sunX, sunY, 26, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(sunX, sunY, 44, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    /* haze band */
    ctx.globalAlpha = 0.14; ctx.fillStyle = th.dust;
    ctx.fillRect(0, TL.FLOOR - 150, TL.W, 90);
    ctx.globalAlpha = 1;

    /* cloud wisps (slow, thin, high) */
    for (i = 0; i < World.clouds.length; i++) {
      var cw = World.clouds[i];
      var cxw = (cw.x - camX * 0.12) % (TL.W + 400);
      if (cxw < -220) cxw += TL.W + 400;
      ctx.globalAlpha = cw.a * (0.8 + 0.2 * Math.sin(a.t * 0.0004 + i * 1.7));
      ctx.fillStyle = th.dust;
      var cyw = cw.y + Math.sin(a.t * 0.0002 + i * 2) * 4;
      ctx.fillRect((cxw + 20) | 0, cyw | 0, cw.w * 0.55, 3);
      ctx.fillRect(cxw | 0, (cyw + 3) | 0, cw.w, 3);
      ctx.fillRect((cxw + 34) | 0, (cyw + 6) | 0, cw.w * 0.6, 2);
    }
    ctx.globalAlpha = 1;

    /* feature silhouettes */
    var scrollF = camX * 0.18, scrollM = camX * 0.42;
    ctx.fillStyle = th.far;
    polyLine(ctx, a.far, scrollF);
    var stepX = 40;
    ctx.lineTo(a.far.length * stepX - scrollF, TL.H); ctx.lineTo(-scrollF, TL.H); ctx.closePath(); ctx.fill();
    /* volcano / delta / mountain decorations on far layer */
    if (th.volcano) {
      var vx = 900 - scrollF, vy = TL.FLOOR - 200;
      ctx.beginPath(); ctx.moveTo(vx - 120, vy + 60); ctx.lineTo(vx - 16, vy - 55); ctx.lineTo(vx + 10, vy - 40); ctx.lineTo(vx + 130, vy + 60); ctx.closePath(); ctx.fill();
      ctx.fillStyle = th.mid; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(vx - 30, vy - 30); ctx.lineTo(vx - 8, vy - 60); ctx.lineTo(vx + 8, vy - 48); ctx.lineTo(vx + 40, vy - 18); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (th.mountain) {
      var mx = 1500 - scrollF, my = TL.FLOOR - 150;
      ctx.beginPath(); ctx.moveTo(mx - 190, my + 80); ctx.lineTo(mx - 30, my - 160); ctx.lineTo(mx + 26, my - 130); ctx.lineTo(mx + 210, my + 80); ctx.closePath(); ctx.fill();
      ctx.fillStyle = th.skyA; ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.moveTo(mx - 34, my - 120); ctx.lineTo(mx - 30, my - 160); ctx.lineTo(mx + 26, my - 130); ctx.lineTo(mx + 12, my - 96); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (th.delta) {
      var dx2 = 1900 - scrollF, dy2 = TL.FLOOR - 120;
      ctx.beginPath();
      ctx.moveTo(dx2 - 200, dy2 + 80); ctx.lineTo(dx2 - 170, dy2 - 40);
      ctx.lineTo(dx2 - 60, dy2 - 60); ctx.lineTo(dx2 - 40, dy2 - 110);
      ctx.lineTo(dx2 + 60, dy2 - 120); ctx.lineTo(dx2 + 90, dy2 - 60);
      ctx.lineTo(dx2 + 150, dy2 - 40); ctx.lineTo(dx2 + 200, dy2 + 80);
      ctx.closePath(); ctx.fill();
    }

    /* per-area landmark silhouettes (far layer) */
    World.drawLandmarks(ctx, a, th, scrollF);

    /* mid layer */
    ctx.fillStyle = th.mid;
    polyLine(ctx, a.mid, scrollM);
    ctx.lineTo(a.mid.length * stepX - scrollM, TL.H); ctx.lineTo(-scrollM, TL.H); ctx.closePath(); ctx.fill();

    /* dust devils */
    for (var d = 0; d < World.devils.length; d++) {
      var dv = World.devils[d];
      var dvx = dv.x - camX;
      if (dvx < -80 || dvx > TL.W + 80) continue;
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = th.dust;
      var sway = Math.sin(a.t * 0.002 + dv.t) * 14;
      ctx.beginPath();
      ctx.moveTo(dvx - 8, World.groundY(dv.x));
      ctx.quadraticCurveTo(dvx - 18 + sway, World.groundY(dv.x) - 90, dvx - 6 + sway, World.groundY(dv.x) - 170);
      ctx.lineTo(dvx + 8 + sway, World.groundY(dv.x) - 170);
      ctx.quadraticCurveTo(dvx + 22 + sway, World.groundY(dv.x) - 80, dvx + 12, World.groundY(dv.x));
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    /* floating dust */
    ctx.save();
    for (i = 0; i < World.dust.length; i++) {
      var dd = World.dust[i];
      var px2 = dd.x - camX;
      if (px2 < -10 || px2 > TL.W + 10) continue;
      ctx.globalAlpha = dd.a * 0.5;
      ctx.fillStyle = th.dust;
      ctx.fillRect(px2 | 0, (dd.y + Math.sin(a.t * 0.0012 + i) * 8) | 0, 2, 2);
    }
    ctx.restore();
  };

  World.drawGround = function (ctx, camX) {
    var a = World.area, th = a.def.theme;
    var step = a.STEP;
    var i0 = Math.max(0, Math.floor(camX / step) - 1);
    var i1 = Math.min(a.heights.length - 1, Math.ceil((camX + TL.W) / step) + 1);
    /* ground fill */
    ctx.beginPath();
    ctx.moveTo(i0 * step - camX, a.heights[i0]);
    for (var i = i0 + 1; i <= i1; i++) ctx.lineTo(i * step - camX, a.heights[i]);
    ctx.lineTo(i1 * step - camX, TL.H + 10);
    ctx.lineTo(i0 * step - camX, TL.H + 10);
    ctx.closePath();
    ctx.fillStyle = th.ground;
    ctx.fill();
    /* top edge highlight */
    ctx.beginPath();
    ctx.moveTo(i0 * step - camX, a.heights[i0]);
    for (i = i0 + 1; i <= i1; i++) ctx.lineTo(i * step - camX, a.heights[i]);
    ctx.strokeStyle = 'rgba(255,220,180,0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();
    /* darker underlayer */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(i0 * step - camX, a.heights[i0] + 14);
    for (i = i0 + 1; i <= i1; i++) ctx.lineTo(i * step - camX, a.heights[i] + 14);
    ctx.lineTo(i1 * step - camX, TL.H + 10);
    ctx.lineTo(i0 * step - camX, TL.H + 10);
    ctx.closePath();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = th.groundDark;
    ctx.fill();
    ctx.restore();
    /* pits visual: shaded interior that follows the carved trench exactly */
    for (var p = 0; p < a.pits.length; p++) {
      var pt = a.pits[p];
      var px3 = pt.x - camX;
      if (px3 < -pt.w - 60 || px3 > TL.W + 60) continue;
      var iL = TL.clamp(Math.round(pt.x / a.STEP) - 1, 0, a.heights.length - 1);
      var iR = TL.clamp(Math.round((pt.x + pt.w) / a.STEP), 0, a.heights.length - 1);
      var rimY = Math.min(a.heights[iL], a.heights[iR]);
      var flY = rimY;
      for (var q = Math.round(pt.x / a.STEP); q < Math.round((pt.x + pt.w) / a.STEP); q++) {
        flY = Math.max(flY, a.heights[TL.clamp(q, 0, a.heights.length - 1)]);
      }
      var pg = ctx.createLinearGradient(0, rimY, 0, flY + 6);
      pg.addColorStop(0, 'rgba(8,3,2,0.30)');
      pg.addColorStop(1, 'rgba(5,2,1,0.90)');
      ctx.fillStyle = pg;
      ctx.fillRect(px3, rimY - 2, pt.w, flY - rimY + 10);
      /* faint sun catch on the trench floor */
      ctx.fillStyle = 'rgba(255,205,150,0.14)';
      ctx.fillRect(px3, flY - 2, pt.w, 2);
    }
    /* decor rocks */
    for (i = 0; i < a.decor.length; i++) {
      var dr = a.decor[i];
      var dx3 = dr.x - camX;
      if (dx3 < -30 || dx3 > TL.W + 30) continue;
      var gy = World.groundY(dr.x);
      ctx.fillStyle = th.rock;
      ctx.beginPath();
      ctx.moveTo(dx3 - dr.w / 2, gy);
      ctx.lineTo(dx3 - dr.w * 0.3, gy - dr.h);
      ctx.lineTo(dx3 + dr.w * 0.25, gy - dr.h * 0.85);
      ctx.lineTo(dx3 + dr.w / 2, gy);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = th.rockHi;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(dx3 - dr.w * 0.28, gy - dr.h, dr.w * 0.4, Math.max(1, dr.h * 0.28));
      ctx.globalAlpha = 1;
    }
    /* frost patches */
    if (th.frost) {
      var rnd = TL.RNG(77);
      ctx.save();
      for (i = 0; i < 30; i++) {
        var fx = rnd() * a.w, fw = 30 + rnd() * 50;
        var fpx = fx - camX;
        if (fpx < -60 || fpx > TL.W + 60) continue;
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#cfe4ea';
        ctx.beginPath(); ctx.ellipse(fpx, World.groundY(fx) + 2, fw / 2, 5, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  };

  World.drawRocks = function (ctx, camX) {
    var a = World.area, th = a.def.theme;
    for (var i = 0; i < a.rocks.length; i++) {
      var r = a.rocks[i];
      var rx = r.x - camX;
      if (rx < -60 || rx > TL.W + 60) continue;
      var gy = World.groundY(r.x + r.w / 2);
      ctx.fillStyle = th.rock;
      ctx.beginPath();
      ctx.moveTo(rx, gy);
      ctx.lineTo(rx + r.w * 0.15, gy - r.h * 0.8);
      ctx.lineTo(rx + r.w * 0.5, gy - r.h);
      ctx.lineTo(rx + r.w * 0.85, gy - r.h * 0.7);
      ctx.lineTo(rx + r.w, gy);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = th.rockHi;
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.moveTo(rx + r.w * 0.2, gy - r.h * 0.75);
      ctx.lineTo(rx + r.w * 0.5, gy - r.h);
      ctx.lineTo(rx + r.w * 0.6, gy - r.h * 0.6);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
  };

  World.drawEntities = function (ctx, camX, playerX) {
    var a = World.area;
    /* expedition doors: labeled gateways to the destination year */
    for (var i = 0; i < a.exits.length; i++) {
      var e = a.exits[i];
      var ex = e.x - camX;
      if (ex < -140 || ex > TL.W + 140) continue;
      var dest = null;
      for (var j = 0; j < TL.D.AREAS.length; j++) if (TL.D.AREAS[j].id === e.to) dest = TL.D.AREAS[j];
      World.drawDoor(ctx, ex, World.groundY(e.x), a.t, e.dir, dest);
    }
    /* capsule prop in ares at start */
    if (a.def.id === 'ares') TL.drawCapsule(ctx, 200 - camX, World.groundY(200));
    /* hidden landmarks: abandoned landers + the relay tracking dish */
    if (a.def.id === 'chryse') World.drawLander(ctx, 3900 - camX, World.groundY(3900), a.t);
    if (a.def.id === 'utopia') World.drawLander(ctx, 4100 - camX, World.groundY(4100), a.t);
    if (a.def.id === 'relay') World.drawDish(ctx, 3600 - camX, World.groundY(3600), a.t);
    /* stations */
    for (var i = 0; i < a.stations.length; i++) {
      var s = a.stations[i];
      var sx = s.x - camX;
      if (sx < -60 || sx > TL.W + 60) continue;
      var gy = World.groundY(s.x);
      var charge = TL.Player && TL.dist(playerX, 0, s.x, 0) < 60;
      P(ctx, sx - 1, gy - 34, 2, 34, '#6a6a72');
      P(ctx, sx - 14, gy - 40, 28, 7, '#26365c');
      P(ctx, sx - 14, gy - 40, 28, 2, '#3c5484');
      var pulse = 0.5 + 0.5 * Math.sin(a.t * 0.004);
      ctx.globalAlpha = charge ? 0.9 : 0.35 + pulse * 0.4;
      P(ctx, sx - 10, gy - 5, 20, 5, charge ? '#7ef0c8' : '#3a8a7a');
      ctx.globalAlpha = 1;
      P(ctx, sx - 3, gy - 44, 6, 4, pulse > 0.5 ? '#7ef0c8' : '#1a3a34');
    }
    /* items */
    for (i = 0; i < a.items.length; i++) {
      var it = a.items[i];
      var ix = it.x - camX;
      if (ix < -40 || ix > TL.W + 40) continue;
      TL.drawItem(ctx, it.type, ix, World.groundY(it.x) - 8, a.t + it.x);
    }
    /* chars */
    for (i = 0; i < a.chars.length; i++) {
      var c = a.chars[i];
      var cx = c.x - camX;
      if (cx < -120 || cx > TL.W + 120) continue;
      var cy = World.groundY(c.x);
      var fn = TL.CHAR_DRAW[c.id];
      if (fn) {
        ctx.save();
        ctx.translate(cx, cy);
        fn(ctx, a.t + c.t, { beacon: !c.done });
        ctx.restore();
      }
      if (!c.done) TL.drawBeaconRing(ctx, cx, cy - 30, a.t + c.t);
      /* era flag: a small year plate beside characters from another era
         (e.g. Curiosity 2012 inside the 2008 Phoenix world, the 1965 relay) */
      if (c.tag) {
        var tw2 = c.tag.length * 7 + 14;
        var fx = cx - tw2 / 2, fy = cy - 96;
        ctx.fillStyle = 'rgba(6,14,18,0.82)';
        ctx.fillRect(fx, fy, tw2, 16);
        ctx.strokeStyle = 'rgba(216,178,90,0.7)';
        ctx.strokeRect(fx + 0.5, fy + 0.5, tw2 - 1, 15);
        TL.text(ctx, c.tag, cx, fy + 5, 6, '#d8b25a', 'center');
        /* little flagpole down to the beacon */
        ctx.fillStyle = 'rgba(216,178,90,0.45)';
        ctx.fillRect(cx - 1, fy + 16, 2, 18);
      }
    }
  };

  /* ---------- per-area far-layer landmarks ---------- */
  World.drawLandmarks = function (ctx, a, th, scrollF) {
    var list = {
      ares:      [{ f: 0.35, k: 'mesa' }, { f: 0.82, k: 'crater' }],
      gusev:     [{ f: 0.22, k: 'hills' }, { f: 0.72, k: 'mesa' }],
      chryse:    [{ f: 0.4, k: 'mesa' }, { f: 0.82, k: 'dune' }],
      boreal:    [{ f: 0.35, k: 'mesa' }, { f: 0.8, k: 'bowl' }],
      elysium:   [{ f: 0.45, k: 'mesa' }],
      jezero:    [{ f: 0.3, k: 'mesa' }, { f: 0.9, k: 'spire' }]
    }[a.def.id] || [];
    var span = a.w * 0.25 + TL.W - 460;
    for (var i = 0; i < list.length; i++) {
      var L = list[i];
      var x = 220 + L.f * span - scrollF;
      if (x < -320 || x > TL.W + 320) continue;
      var base = TL.FLOOR - 142;
      ctx.fillStyle = th.far;
      switch (L.k) {
        case 'mesa':
          ctx.beginPath();
          ctx.moveTo(x - 150, base + 30); ctx.lineTo(x - 70, base - 66);
          ctx.lineTo(x + 58, base - 66); ctx.lineTo(x + 128, base + 30);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(x + 90, base + 30); ctx.lineTo(x + 140, base - 26);
          ctx.lineTo(x + 236, base + 30); ctx.closePath(); ctx.fill();
          break;
        case 'hills':
          for (var h = 0; h < 3; h++) {
            var hw = 90 + h * 46, hh = 46 + h * 26, hx = x + (h - 1) * 105;
            ctx.beginPath();
            ctx.moveTo(hx - hw / 2, base + 30);
            ctx.quadraticCurveTo(hx - hw * 0.18, base - hh, hx, base - hh - 10);
            ctx.quadraticCurveTo(hx + hw * 0.2, base - hh * 0.7, hx + hw / 2, base + 30);
            ctx.closePath(); ctx.fill();
          }
          break;
        case 'crater':
          ctx.beginPath();
          ctx.moveTo(x - 170, base + 30);
          ctx.quadraticCurveTo(x - 90, base - 34, x, base - 40);
          ctx.quadraticCurveTo(x + 90, base - 34, x + 170, base + 30);
          ctx.closePath(); ctx.fill();
          ctx.globalAlpha = 0.55;
          ctx.beginPath();
          ctx.ellipse(x, base - 6, 92, 16, 0, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          break;
        case 'dune':
          for (var d = 0; d < 4; d++) {
            var dwx = x + (d - 1.5) * 120;
            ctx.beginPath();
            ctx.moveTo(dwx - 70, base + 30);
            ctx.quadraticCurveTo(dwx, base - 22 - (d % 2) * 10, dwx + 70, base + 30);
            ctx.closePath(); ctx.fill();
          }
          break;
        case 'bowl':
          ctx.beginPath();
          ctx.moveTo(x - 210, base - 20);
          ctx.quadraticCurveTo(x, base + 34, x + 210, base - 20);
          ctx.lineTo(x + 210, base + 30); ctx.lineTo(x - 210, base + 30);
          ctx.closePath(); ctx.fill();
          break;
        case 'spire':
          ctx.beginPath();
          ctx.moveTo(x - 26, base + 40);
          ctx.quadraticCurveTo(x - 12, base - 70, x - 4, base - 128);
          ctx.lineTo(x + 6, base - 128);
          ctx.quadraticCurveTo(x + 18, base - 50, x + 34, base + 40);
          ctx.closePath(); ctx.fill();
          break;
      }
    }
  };

  /* ---------- expedition door: gateway to a mission year ---------- */
  World.drawDoor = function (ctx, sx, gy, t, dir, dest) {
    if (!dest || !dest.year) return;
    var px = Math.round(sx), base = Math.round(gy) + 4;
    var x0 = px - 58, x1 = px + 58;
    var opL = px - 40, opR = px + 40;
    /* dark opening */
    P(ctx, opL, base - 62, opR - opL, 62, '#170e0a');
    /* interior destination sign (wrapped mission name) */
    var sub = dest.sub || dest.region || '';
    var lines = TL.wrap(ctx, sub, 74, 6);
    for (var s = 0; s < lines.length && s < 3; s++) {
      TL.text(ctx, lines[s], px, base - 50 + s * 9, 6, '#7ec8b4', 'center', 0.75);
    }
    /* pylons */
    P(ctx, x0, base - 74, 14, 74, '#3c4048');
    P(ctx, x1 - 14, base - 74, 14, 74, '#3c4048');
    P(ctx, x0 + 2, base - 74, 3, 74, '#5a5e68');
    P(ctx, x1 - 11, base - 74, 3, 74, '#26282e');
    P(ctx, x0 - 3, base - 6, 20, 6, '#2b2d33');
    P(ctx, x1 - 17, base - 6, 20, 6, '#2b2d33');
    /* beam */
    P(ctx, x0 - 6, base - 90, (x1 - x0) + 12, 14, '#33363e');
    P(ctx, x0 - 6, base - 90, (x1 - x0) + 12, 3, '#4a4e58');
    /* threshold shimmer */
    var sh = 0.22 + 0.16 * Math.sin(t * 0.003);
    ctx.globalAlpha = sh;
    P(ctx, opL, base - 62, 2, 62, '#7ef0c8');
    P(ctx, opR - 2, base - 62, 2, 62, '#7ef0c8');
    P(ctx, opL, base - 3, opR - opL, 2, '#7ef0c8');
    ctx.globalAlpha = 1;
    /* year plate on the beam */
    var yw = dest.year.length * 10 + 18;
    P(ctx, px - yw / 2, base - 93, yw, 17, '#d99a4e');
    P(ctx, px - yw / 2, base - 93, yw, 2, '#f0c488');
    TL.text(ctx, dest.year, px, base - 88, 8, '#241203', 'center');
    /* blinking beacons */
    var bl = Math.sin(t * 0.006) > 0.2;
    P(ctx, x0 + 5, base - 94, 4, 4, bl ? '#e8a050' : '#5a3418');
    P(ctx, x1 - 9, base - 94, 4, 4, !bl ? '#e8a050' : '#5a3418');
  };

  /* ---------- abandoned Viking lander silhouette ---------- */
  World.drawLander = function (ctx, sx, gy, t) {
    var x = Math.round(sx), base = Math.round(gy);
    if (x < -80 || x > TL.W + 80) return;
    /* shadow */
    ctx.globalAlpha = 0.3; ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(x, base + 2, 26, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    /* legs */
    ctx.strokeStyle = '#5a5248'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 14, base - 16); ctx.lineTo(x - 26, base); ctx.moveTo(x + 14, base - 16); ctx.lineTo(x + 26, base);
    ctx.moveTo(x, base - 12); ctx.lineTo(x, base); ctx.stroke();
    P(ctx, x - 29, base - 2, 7, 2, '#6a6156'); P(ctx, x + 22, base - 2, 7, 2, '#6a6156');
    /* body */
    P(ctx, x - 13, base - 34, 26, 19, '#7a7268');
    P(ctx, x - 13, base - 34, 26, 3, '#96897a');
    P(ctx, x - 9, base - 29, 6, 4, '#43403a'); P(ctx, x + 3, base - 29, 6, 4, '#43403a');
    /* foot pads to soil */
    P(ctx, x - 13, base - 34, 26, 2, '#a89a88');
    /* mast + wind sensor boom */
    P(ctx, x + 16, base - 52, 2, 20, '#5a5248');
    var sway = Math.sin(t * 0.0018) * 2;
    ctx.strokeStyle = '#5a5248'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x + 17, base - 50); ctx.lineTo(x + 27 + sway, base - 46); ctx.stroke();
    /* small dish */
    ctx.strokeStyle = '#8a7f70'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x - 8, base - 40, 7, Math.PI * 0.15, Math.PI * 1.05); ctx.stroke();
  };

  /* ---------- deep-space tracking dish (relay world) ---------- */
  World.drawDish = function (ctx, sx, gy, t) {
    var x = Math.round(sx), base = Math.round(gy);
    if (x < -100 || x > TL.W + 100) return;
    ctx.globalAlpha = 0.3; ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(x, base + 2, 30, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    /* mount legs */
    ctx.strokeStyle = '#3e3a46'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 16, base); ctx.lineTo(x, base - 30);
    ctx.moveTo(x + 16, base); ctx.lineTo(x, base - 30);
    ctx.stroke();
    P(ctx, x - 4, base - 32, 8, 6, '#4a4552');
    /* dish (slight slow sway) */
    var ang = -0.5 + Math.sin(t * 0.0004) * 0.06;
    ctx.save();
    ctx.translate(x, base - 36);
    ctx.rotate(ang);
    ctx.fillStyle = '#5c5668';
    ctx.beginPath(); ctx.ellipse(0, 0, 24, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#746e84';
    ctx.beginPath(); ctx.ellipse(-2, -2, 20, 6, 0, 0, Math.PI * 2); ctx.fill();
    P(ctx, -2, -10, 2, 9, '#8a84a0');
    ctx.restore();
    /* blinking status light */
    var bl = Math.sin(t * 0.004) > 0.4;
    P(ctx, x + 14, base - 40, 3, 3, bl ? '#7ef0c8' : '#1a3a34');
  };

  /* radar blips */
  World.radarBlips = function (px) {
    var a = World.area, out = [];
    a.chars.forEach(function (c) { out.push({ dx: c.x - px, kind: c.done ? 'char-done' : 'char' }); });
    a.stations.forEach(function (s) { out.push({ dx: s.x - px, kind: 'station' }); });
    a.exits.forEach(function (e) { out.push({ dx: e.x - px, kind: 'exit' }); });
    a.items.forEach(function (it) { out.push({ dx: it.x - px, kind: 'item' }); });
    return out;
  };

})(window.TL);
