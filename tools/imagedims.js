/* Image dimension audit: parses image headers (no decoding) and reports
   the aspect ratio of every asset, flagging frames whose native aspect
   differs a lot from their presentation container (they will letterbox
   inside drawContain — never stretch or clip, but tall/narrow sources
   show big margins and deserve a reshoot or re-crop). */
const fs = require('fs');
const path = require('path');

function dims(file) {
  const b = fs.readFileSync(file);
  /* PNG: IHDR at offset 16 (big-endian width/height) */
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), type: 'png' };
  }
  /* JPEG: scan segment markers for SOF0..SOF15 except DHT/RST */
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5), type: 'jpeg' };
      }
      const len = b.readUInt16BE(i + 2);
      i += 2 + len;
    }
  }
  /* WebP: RIFF + VP8/VP8L/VP8X headers */
  if (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') {
    const four = b.slice(12, 16).toString();
    if (four === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff, type: 'webp' };
    if (four === 'VP8L') {
      const n = b.readUInt32LE(21);
      return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1, type: 'webp' };
    }
    if (four === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3), type: 'webp' };
  }
  /* GIF */
  if (b.slice(0, 3).toString() === 'GIF') return { w: b.readUInt16LE(6), h: b.readUInt16LE(8), type: 'gif' };
  return null;
}

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jpe?g|png|webp|gif)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const roots = process.argv.slice(2);
const files = roots.flatMap(r => walk(r, []));
const rows = [];
for (const f of files) {
  const d = dims(f);
  if (!d) { rows.push({ f, bad: true }); continue; }
  const ar = d.w / d.h;
  rows.push({ f: path.relative(process.cwd(), f).replace(/\\/g, '/'), w: d.w, h: d.h, ar: +ar.toFixed(2), bytes: fs.statSync(f).size });
}
/* sort by aspect ratio descending — odd frames stand out at the extremes */
rows.sort((a, b2) => (b2.ar || 0) - (a.ar || 0));
for (const r of rows) {
  if (r.bad) console.log('UNREADABLE  ' + r.f);
  else console.log(String(r.w).padStart(5) + 'x' + String(r.h).padStart(-5) + '  ar ' + String(r.ar).padStart(6) + '  ' + (r.bytes / 1024).toFixed(0).padStart(6) + 'KB  ' + r.f);
}
console.log('\n' + rows.filter(r => !r.bad).length + ' images audited');
