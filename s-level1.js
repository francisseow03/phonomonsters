// Level 1 "My First Sounds": letter grid -> letter card (hear/say) -> meet the monster -> trace -> unlock.
import { route, go, tpl, $, $$, h, box, onTap, overlay, confetti, stagePoint, animate } from './core.js';
import * as store from './store.js';
import { music, say, sayAll, sfx, preload, wait } from './audio.js';
import { lessonChrome, infoPopup, nextArrow, swapForImage, monsterSrc, fitText } from './ui.js';
import { micAttempt, praise, tryAgain } from './feedback.js';
import { MONSTERS, LETTERS } from './data.js';

const px = (cls, key) => { const m = cls.match(new RegExp(`(?:^|\\s)${key}-\\[(-?[\\d.]+)px\\]`)); return m ? +m[1] : null; };

route('level1', el => {
  const t = tpl('l1grid');
  el.append(t);
  music('learn');
  lessonChrome(t, { exit: ['322:705'], gear: ['322:736'], pause: ['322:735', '322:738'] }, { exit: () => go('discover') });
  const strip = $(t, '322:902');
  strip.classList.add('no-scrollbar');
  strip.style.overflowY = 'hidden';
  const group = $(t, '322:901');
  const rects = $$(group, ':scope > div,:scope > a').filter(d => /bg-\[#/.test(d.className) && px(d.className, 'w'));
  const letters = $$(group, ':scope > p').filter(p => /^[A-Z]$/.test(p.textContent.trim()));
  const done = store.progress().letters;
  for (const p of letters) {
    const L = p.textContent.trim();
    const fs = px(p.className, 'text'), cx = px(p.className, 'left') + fs * 0.3, cy = px(p.className, 'top') + fs * 0.62;
    const r = rects.find(d => { const x = px(d.className, 'left'), y = px(d.className, 'top'), w = px(d.className, 'w'), hh = px(d.className, 'h'); return cx >= x && cx <= x + w && cy >= y && cy <= y + hh; });
    if (!r) continue;
    p.style.pointerEvents = 'none';
    onTap(r, () => go('letter', { L, step: 1 }), { sound: 'pop' });
    if (done[L]) {
      const star = h('div', 'absolute size-[44px] pointer-events-none', `<svg viewBox="0 0 24 24" width="44" height="44"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z" fill="#ffd76b" stroke="#fff" stroke-width="1.5"/></svg>`);
      star.style.left = px(r.className, 'left') + px(r.className, 'w') - 52 + 'px';
      star.style.top = px(r.className, 'top') + 8 + 'px';
      group.append(star);
    }
  }
  const all = Object.keys(done).length;
  const msg = $(t, '322:900');
  if (all < 26) msg.innerHTML = `${all}/26<br>Learned!`;
  // continue where the child left off
  const next = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').find(L => !done[L]);
  if (next && next > 'H') setTimeout(() => { const i = next.charCodeAt(0) - 65; strip.scrollLeft = Math.max(0, i * 85 - 200); }, 50);
  // mouse drag scrolling
  let d = null;
  strip.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') d = { x: e.clientX, s: strip.scrollLeft, moved: false }; });
  strip.addEventListener('pointermove', e => { if (!d) return; if (Math.abs(e.clientX - d.x) > 6) d.moved = true; strip.scrollLeft = d.s - (e.clientX - d.x); });
  strip.addEventListener('click', e => { if (d?.moved) { e.stopPropagation(); e.preventDefault(); } d = null; }, true);
  const up = () => { if (d && !d.moved) d = null; };
  addEventListener('pointerup', up);
  say('ui_l1');
  return () => removeEventListener('pointerup', up);
});

route('letter', (el, { L, step = 1 }) => {
  const l = L.toLowerCase();
  preload(`snd_${L}`, `info_${L}`, `ph_${L}`);
  music('learn');
  const exit = () => go('level1');
  if (step === 1) {
    store.startRun();
    const t = tpl('l1card');
    el.append(t);
    t.classList.remove('cursor-pointer');
    $(t, '281:227').querySelector('p').textContent = L + l;
    fitText($(t, '281:227'), 860); // "Mm" and "Ww" used to wrap onto two lines
    lessonChrome(t, { exit: ['307:212'], gear: ['282:128'], pause: ['637:706'] }, { exit });
    onTap($(t, '275:189'), () => { say(`snd_${L}`); animate281(t); });
    const mic = () => micAttempt(t, { x: 624, y: 560, w: 100, h: 96 }, L, [MONSTERS[L].word, l, L, MONSTERS[L].say, `letter ${l}`]);
    onTap($(t, '275:192'), mic, { sound: null }); onTap($(t, '275:194'), mic, { sound: null });
    onTap($(t, '281:227'), () => { say(`snd_${L}`); animate281(t); });
    const next = () => go('letter', { L, step: 2 });
    onTap($(t, '282:139'), next, { sound: 'nav' }); onTap($(t, '282:140'), next, { sound: 'nav' });
    // once the narrator has finished, the way forward bounces so a pre-reader can find it
    sayAll(['ui_listen', `snd_${L}`, 'ui_say_it']).then(() => pulseNext(t, ['282:139', '282:140']));
  }
  if (step === 2) {
    const t = tpl('l1monster');
    el.append(t);
    t.classList.remove('cursor-pointer');
    $(t, '286:165').querySelector('p').textContent = L + l;
    fitText($(t, '286:165'), 540);
    $(t, '286:162').remove();
    const art = swapForImage($(t, '286:183'), monsterSrc(L));
    const mon = $(t, '286:183');
    mon.classList.remove('overflow-clip');
    mon.classList.add('float');
    // the Figma frame sits the pair high in the card; centre them vertically
    [mon, $(t, '286:165')].forEach(n => { n.style.marginTop = '36px'; });
    onTap(mon, () => { sfx('giggle'); animate(art, 'wiggle'); say(`snd_${L}`); }, { sound: null }); // art = the picture inside the floating box
    onTap($(t, '286:165'), () => say(`snd_${L}`));
    lessonChrome(t, { exit: ['307:210'], gear: ['286:167'], pause: ['286:166', '286:169'], help: ['303:272', '303:278'] }, { exit, help: () => infoPopup(L, MONSTERS[L].fact) });
    const next = () => go('letter', { L, step: 3 });
    onTap($(t, '286:155'), next, { sound: 'nav' }); onTap($(t, '286:156'), next, { sound: 'nav' });
    sfx('sparkle');
    sayAll(['ui_meet', `snd_${L}`]).then(() => pulseNext(t, ['286:155', '286:156']));
  }
  if (step === 3) {
    const t = tpl('l1trace');
    el.append(t);
    // the guide letters are drawn by the tracer canvas so they line up exactly with its hit mask
    $(t, '287:309').style.visibility = 'hidden';
    lessonChrome(t, { exit: ['307:211'], gear: ['287:311'], pause: ['287:310', '287:313'], help: ['303:273', '303:276'] }, { exit, help: () => infoPopup(L, MONSTERS[L].fact) });
    const nextBtns = [$(t, '287:304'), $(t, '287:305')];
    nextBtns.forEach(b => { b.style.opacity = 0.35; });
    let ready = false;
    const finish = () => { if (!ready) { sfx('locked'); say('ui_trace'); return; } go('letter', { L, step: 4 }); };
    nextBtns.forEach(b => onTap(b, finish, { sound: 'nav' }));
    tracer(t, `${L} ${l}`, () => { ready = true; nextBtns.forEach(b => { b.style.opacity = 1; b.classList.add('pulse'); }); });
    say('ui_trace');
  }
  if (step === 4) {
    // quick check: hear the sound, tap the monster that makes it
    const t = tpl('l4blend');
    el.append(t);
    lessonChrome(t, { exit: ['427:416'], gear: ['427:413'], pause: ['427:412', '427:415'] }, { exit });
    ['427:411', '427:403', '428:580', '428:582', '621:620', '621:621'].forEach(id => $(t, id)?.remove());
    const others = LETTERS.filter(x => x !== L && MONSTERS[x].say !== MONSTERS[L].say);
    const opts = [L, ...others.sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5);
    el.dataset.answer = L;
    const hear = () => say(`ph_${L}`);
    const spk = box(527, 196, 140, 140, '', `<svg viewBox="0 0 140 140" width="140" height="140"><circle cx="70" cy="74" r="66" fill="#018cbc"/><circle cx="70" cy="68" r="66" fill="#1fa7e1"/><path d="M42 56h16l22-18v60L58 80H42z" fill="#fff"/><path d="M90 52q12 16 0 32M100 42q22 26 0 52" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`);
    spk.style.cursor = 'pointer';
    t.append(spk);
    onTap(spk, () => { animate(spk, 'bounce'); hear(); });
    let done = false;
    opts.forEach((X, i) => {
      const m = box(196 + i * 280, 370, 240, 300, 'pm-pick');
      m.innerHTML = `<img src="${monsterSrc(X)}" alt="">`;
      m.dataset.letter = X;
      t.append(m);
      onTap(m, async () => {
        if (done || m.classList.contains('nope')) return;
        if (X === L) {
          done = true; m.classList.add('yes'); animate(m, 'hop');
          store.recordAnswer(L, true);
          await praise(true); await say(`ph_${L}`);
          complete(L);
        } else {
          m.classList.add('nope'); animate(m, 'shake'); tryAgain();
          store.recordAnswer(L, false);
          setTimeout(hear, 1400);
        }
      }, { sound: 'pop' });
    });
    sayAll(['ui_find_monster', `ph_${L}`]);
  }
});

/** Make a step's Next arrow bounce once the child is free to move on. */
function pulseNext(t, ids) { ids.forEach(id => { const n = $(t, id); if (n && n.isConnected) n.classList.add('pulse'); }); }

function animate281(t) { const n = $(t, '281:227'); n.classList.add('bounce'); setTimeout(() => n.classList.remove('bounce'), 600); }

/** Finger tracing over the outlined letters. Calls done() once enough of the glyphs are covered. */
function tracer(t, text, done) {
  const X = 116, Y = 161, W = 963, H = 553;
  const mk = z => { const c = h('canvas', 'absolute'); c.width = W; c.height = H; Object.assign(c.style, { left: X + 'px', top: Y + 'px', width: W + 'px', height: H + 'px', zIndex: z }); t.append(c); return c; };
  const guide = mk(5);
  guide.style.pointerEvents = 'none';
  const cv = mk(10);
  Object.assign(cv.style, { touchAction: 'none', cursor: 'crosshair' });
  // the letter outline stays on top of the paint so a child never loses the letter under their scribbles
  const outline = mk(11);
  outline.style.pointerEvents = 'none';
  const g = cv.getContext('2d');
  g.lineCap = g.lineJoin = 'round'; g.lineWidth = 34; g.strokeStyle = '#109586';
  // guide glyphs and the coverage mask come from the same text metrics, so they always line up
  const mask = document.createElement('canvas'); mask.width = W; mask.height = H;
  const mg = mask.getContext('2d');
  let maskData = null, glyphPx = 1;
  document.fonts.load('500px "Cal Sans"').catch(() => {}).then(() => {
    const gg = guide.getContext('2d');
    let size = 500;
    const font = () => `${size}px "Cal Sans", Fredoka, sans-serif`;
    gg.font = font();
    while (size > 260 && gg.measureText(text).width > W - 80) { size -= 20; gg.font = font(); }
    const m = gg.measureText(text);
    // centre the glyph box (not the em box) in the card
    const cy = H / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
    for (const c of [gg, mg]) { c.font = font(); c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round'; }
    gg.fillStyle = '#aee3e3'; gg.strokeStyle = '#109586'; gg.lineWidth = 4;
    gg.fillText(text, W / 2, cy); gg.strokeText(text, W / 2, cy);
    const og = outline.getContext('2d');
    og.font = font(); og.textAlign = 'center'; og.textBaseline = 'alphabetic'; og.lineJoin = 'round';
    og.setLineDash([14, 12]); og.lineWidth = 5; og.strokeStyle = '#fbfdfe'; og.strokeText(text, W / 2, cy);
    mg.lineWidth = 40; mg.strokeText(text, W / 2, cy); mg.fillText(text, W / 2, cy);
    maskData = mg.getImageData(0, 0, W, H).data;
    for (let i = 3; i < maskData.length; i += 4 * 16) if (maskData[i] > 0) glyphPx++;
  });
  const hit = new Uint8Array(Math.ceil(W / 8) * Math.ceil(H / 8));
  let covered = 0, finished = false, last = null;
  const pt = e => { const p = stagePoint(e); return { x: p.x - X, y: p.y - Y }; };
  cv.addEventListener('pointerdown', e => { try { cv.setPointerCapture(e.pointerId); } catch {}; last = pt(e); sfx('pop', 0.4); });
  cv.addEventListener('pointermove', e => {
    if (!last) return;
    const p = pt(e);
    g.beginPath(); g.moveTo(last.x, last.y); g.lineTo(p.x, p.y); g.stroke();
    // mark every coverage cell under the visible brush (34px wide), not just its centre line
    const steps = Math.max(1, Math.hypot(p.x - last.x, p.y - last.y) / 6), R = 17;
    for (let i = 0; i <= steps; i++) {
      const cx = last.x + (p.x - last.x) * i / steps, cy2 = last.y + (p.y - last.y) * i / steps;
      for (let dy = -R; dy <= R; dy += 8) for (let dx = -R; dx <= R; dx += 8) {
        if (dx * dx + dy * dy > R * R) continue;
        const x = Math.round(cx + dx), y = Math.round(cy2 + dy);
        if (x < 0 || y < 0 || x >= W || y >= H) continue;
        const inGlyph = !maskData || maskData[(y * W + x) * 4 + 3] > 0;
        const c = (y >> 3) * Math.ceil(W / 8) + (x >> 3);
        if (inGlyph && !hit[c]) { hit[c] = 1; covered++; }
      }
    }
    last = p;
    // ~ 64 mask pixels per 8x8 cell; sampling every 16th pixel above -> glyphPx*16/64 cells
    const need = maskData ? glyphPx * 16 / 64 * 0.32 : 220;
    if (!finished && covered > need) { finished = true; praise(true); done(); }
  });
  const up = () => { last = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  // a "try again" button wipes the paint
  const clear = box(X + W - 92, Y + 16, 72, 72, '');
  clear.style.cssText += 'z-index:12;border-radius:50%;background:#fa96ba;box-shadow:0 5px 0 #e17b9f;display:flex;align-items:center;justify-content:center;cursor:pointer';
  clear.innerHTML = '<svg viewBox="0 0 40 40" width="40" height="40"><path d="M30 14a12 12 0 1 0 2 9" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M33 6v10H23" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  t.append(clear);
  onTap(clear, () => { g.clearRect(0, 0, W, H); if (!finished) { hit.fill(0); covered = 0; } }, { sound: 'pop' });
  // never a dead end: after three strokes or 15 seconds of trying, the arrow opens anyway
  let strokes = 0, firstAt = 0;
  const leniency = () => { if (!finished && covered > 0 && (strokes >= 3 || Date.now() - firstAt > 15000)) { finished = true; praise(true); done(); } };
  cv.addEventListener('pointerup', () => { strokes++; firstAt ||= Date.now(); leniency(); });
  const iv = setInterval(() => cv.isConnected ? leniency() : clearInterval(iv), 1000);
}

function complete(L) {
  const first = store.completeLetter(L);
  const card = h('div', 'relative pop flex flex-col items-center');
  card.innerHTML = `<div class="absolute -inset-[60px] rounded-full bg-[radial-gradient(circle,#fff7c2_0%,rgba(255,247,194,0)_70%)]"></div>
    <img src="${monsterSrc(L)}" class="relative h-[400px] object-contain bounce" alt="">
    <p class="relative m-0 mt-4 font-['KitRounded'] text-[56px] text-white [text-shadow:0_4px_0_#109586]">${first ? 'New friend unlocked!' : 'Great tracing!'}</p>
    <p class="relative m-0 font-['Nunito'] font-extrabold text-[30px] text-white">Monster ${L} is in your PhonoDex</p>`;
  const o = overlay(card, { closeOnDim: false });
  sfx('unlock'); confetti(90);
  say(first ? 'ui_unlocked' : 'praise_0');
  const nextL = String.fromCharCode(L.charCodeAt(0) + 1);
  let gone = false;
  const goReward = () => { if (gone) return; gone = true; o.close(); go('reward', { key: `l1_${L}`, replay: ['letter', { L, step: 1 }], done: ['level1', {}], next: nextL <= 'Z' ? ['letter', { L: nextL, step: 1 }] : null }); };
  setTimeout(goReward, 3200);
  onTap(o.el, goReward, { sound: null, cls: 'cursor-pointer' });
}
