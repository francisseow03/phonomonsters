// Level 1 "My First Sounds": letter grid -> letter card (hear/say) -> meet the monster -> trace -> unlock.
import { route, go, tpl, $, $$, h, box, onTap, overlay, confetti, stagePoint, animate } from './core.js';
import * as store from './store.js';
import { music, say, sayAll, sfx, preload, wait } from './audio.js';
import { lessonChrome, infoPopup, nextArrow, swapForImage, monsterSrc, fitText } from './ui.js';
import { micAttempt, praise } from './feedback.js';
import { MONSTERS } from './data.js';

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
    sayAll(['ui_listen', `snd_${L}`, 'ui_say_it']);
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
    sayAll(['ui_meet', `snd_${L}`]);
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
    const finish = () => { if (!ready) { sfx('locked'); say('ui_trace'); return; } complete(L); };
    nextBtns.forEach(b => onTap(b, finish, { sound: 'nav' }));
    tracer(t, `${L} ${l}`, () => { ready = true; nextBtns.forEach(b => { b.style.opacity = 1; b.classList.add('pulse'); }); });
    say('ui_trace');
  }
});

function animate281(t) { const n = $(t, '281:227'); n.classList.add('bounce'); setTimeout(() => n.classList.remove('bounce'), 600); }

/** Finger tracing over the outlined letters. Calls done() once enough of the glyphs are covered. */
function tracer(t, text, done) {
  const X = 116, Y = 161, W = 963, H = 553;
  const mk = z => { const c = h('canvas', 'absolute'); c.width = W; c.height = H; Object.assign(c.style, { left: X + 'px', top: Y + 'px', width: W + 'px', height: H + 'px', zIndex: z }); t.append(c); return c; };
  const guide = mk(5);
  guide.style.pointerEvents = 'none';
  const cv = mk(10);
  Object.assign(cv.style, { touchAction: 'none', cursor: 'crosshair' });
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
    // mark coverage cells along the segment
    const steps = Math.max(1, Math.hypot(p.x - last.x, p.y - last.y) / 6);
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(last.x + (p.x - last.x) * i / steps), y = Math.round(last.y + (p.y - last.y) * i / steps);
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const inGlyph = !maskData || maskData[(y * W + x) * 4 + 3] > 0;
      const c = (y >> 3) * Math.ceil(W / 8) + (x >> 3);
      if (inGlyph && !hit[c]) { hit[c] = 1; covered++; }
    }
    last = p;
    // ~ 64 mask pixels per 8x8 cell; sampling every 16th pixel above -> glyphPx*16/64 cells
    const need = maskData ? glyphPx * 16 / 64 * 0.32 : 220;
    if (!finished && covered > need) { finished = true; praise(true); done(); }
  });
  const up = () => { last = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
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
