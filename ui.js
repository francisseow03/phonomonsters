// Shared UI pieces built from the Figma frames: header, nav, popups, parent gate, drag, avatars.
import { $, $$, h, box, onTap, go, overlay, frameCard, tpl, stagePoint, stageRect, animate, toast, getScale } from './core.js';
import * as store from './store.js';
import { sfx, say, stopVoice, applySettings } from './audio.js';
import { PICS } from './data.js';
import { coinPill, onAvatarChange } from './game.js';

export const monsterSrc = L => `m-${L.toUpperCase()}.png`;
export const picSrc = w => { const p = PICS[w]; return !p ? null : p.startsWith('art:') ? `art-${p.slice(4)}.png` : `pic-${p}.svg`; };

// ---------- avatars (crops taken from the Figma profile images) ----------
export const AVATARS = {
  jane: { src: 'img-60816d326aec.png', w: 144.3, h: 105.7, l: -22.36, t: -5.51 },
  victor: { src: 'img-304d88e9520a.png', w: 153.66, h: 103.3, l: -26.83, t: -0.01 },
  rebecca: { src: 'img-90b7fe905bac.png', w: 151.13, h: 109.02, l: -26.7, t: -6.14 },
  orange: { src: 'img-a0b4f488bca6.png', w: 152.4, h: 100, l: -26.2, t: 0 },
  mO: { monster: 'O' }, mK: { monster: 'K' }, mP: { monster: 'P' }, mE: { monster: 'E' },
};
export function avatarInner(key) {
  const a = AVATARS[key] || (/^m[A-Z]$/.test(key) ? { monster: key[1] } : AVATARS.jane);
  if (a.monster) return `<div class="absolute inset-0 overflow-hidden rounded-full bg-[#e6f5fb]"><img src="${monsterSrc(a.monster)}" class="absolute max-w-none w-[150%] left-[-25%] top-[-4%]" alt=""></div>`;
  return `<div class="absolute inset-0 overflow-hidden pointer-events-none"><img alt="" class="absolute max-w-none" src="${a.src}" style="width:${a.w}%;height:${a.h}%;left:${a.l}%;top:${a.t}%"></div>`;
}

// ---------- top bar: nav icons, star meter, profile badge ----------
const NAV = { 3.77: 'home', 3.85: 'home', 13.07: 'discover', 22.28: 'minigames', 31.49: 'phonodex', 40.7: 'shop' };
export function bindHeader(root) {
  for (const el of $$(root, '[data-name]')) {
    const name = el.dataset.name;
    if (!['HOME', 'PRACTICE GAMES', 'PHONODEX', 'SHOP'].includes(name)) continue;
    const m = el.className.match(/inset-\[5\.52%_[\d.]+%_85\.49%_([\d.]+)%\]/);
    const target = m && NAV[m[1]];
    if (target) onTap(el, () => go(target), { sound: 'nav' });
  }
  const p = store.profile();
  const stars = store.starsToday();
  for (const t of $$(root, 'p')) {
    if (/^\d+\/10$/.test(t.textContent.trim())) {
      t.textContent = `${stars}/10`;
      const fill = t.parentElement.querySelector(':scope > .bg-\\[\\#1fa7e1\\].h-\\[15px\\]');
      if (fill) fill.style.width = Math.max(8, 113 * stars / 10) + 'px';
    }
    if (t.textContent.trim() === 'Jane Doe' && t.classList.contains('text-[20px]') && p) t.textContent = p.name;
  }
  const av = $$(root, '[data-name="testpfp1-03-03 1"]')[0];
  const drawAvatar = () => { if (av && store.profile()) av.innerHTML = avatarInner(store.profile().avatar); };
  drawAvatar(); onAvatarChange(drawAvatar);
  const badge = $$(root, 'div').find(d => d.className.includes('w-[196px]') && d.className.includes('93.75%'));
  if (badge) onTap(badge, () => parentGate(() => go('settings')));
  if (p) coinPill(root);
}

// ---------- popups ----------
export function settingsPopup() {
  const { wrap, root } = frameCard('settingspop', 657, 547);
  const o = overlay(wrap, { closeOnDim: true });
  const s = store.settings();
  const slider = (fillId, knobId, trackId, key) => {
    const fill = $(root, fillId), knob = $(root, knobId), track = $(root, trackId);
    const set = v => {
      v = Math.max(0, Math.min(1, v));
      fill.style.width = 364 * v + 'px';
      knob.style.left = 193 + 364 * v - 15 + 'px';
      store.setSetting(key, v); applySettings();
    };
    set(s[key]);
    const hit = box(180, key === 'sfx' ? 178 : 314, 390, 50, 'cursor-pointer z-10');
    root.append(hit);
    const move = e => set((stagePoint(e).x - stageRect(root).x - 193) / 364);
    hit.addEventListener('pointerdown', e => { try { hit.setPointerCapture(e.pointerId); } catch {}; move(e); hit.onpointermove = move; });
    hit.addEventListener('pointerup', () => { hit.onpointermove = null; key === 'sfx' ? sfx('pop') : say('ui_kid_hello'); });
  };
  slider('631:826', '650:677', '631:825', 'sfx');
  slider('631:829', '650:678', '631:828', 'narration');
  onTap($(root, '631:822'), () => o.close());
  return o;
}

export function infoPopup(L, text) {
  const { wrap, root } = frameCard('infopop', 658, 627);
  const t = $(root, '637:1585');
  t.innerHTML = `<p class="mb-0"><span class="font-['Nunito'] font-extrabold leading-[normal] text-[#109586] text-[36px]">Letter ${L}</span><br><span class="font-['Nunito'] font-normal leading-[normal] text-[#333] text-[30px]">${text}</span></p><p class="leading-[normal] mb-0 text-[30px]">&#8203;</p><p class="font-['Nunito'] leading-[normal] text-[#333] text-[30px]">${'AEIOU'.includes(L) ? `Letter ${L} is part of the Vowels;<br>A E I O U` : `Letter ${L} is one of the consonant friends.`}</p>`;
  const o = overlay(wrap, { closeOnDim: true, onClose: stopVoice });
  onTap(wrap, () => o.close(), { sound: 'pop', cls: 'cursor-pointer' });
  say(`info_${L}`);
  return o;
}

export function pauseOverlay(onResume) {
  stopVoice();
  const t = tpl('pause');
  t.style.position = 'absolute'; t.style.inset = '0';
  const o = overlay(t, { dim: false, onClose: onResume });
  onTap(t, () => o.close(), { sound: 'pop', cls: 'cursor-pointer' });
  return o;
}

/** "Parents Only" keypad (year of birth), from the home>parental lock frame. */
export function parentGate(onPass) {
  if (!store.settings().parentalLock) return onPass();
  const t = tpl('parentlock');
  for (const c of [...t.children]) if (!['620:1840', '667:677'].includes(c.dataset.nodeId)) c.remove();
  t.classList.remove('bg-[#fcfeff]', 'cursor-pointer');
  t.style.cssText = 'position:absolute;inset:0;background:transparent';
  const o = overlay(t, { dim: false });
  say('ui_parents');
  let digits = '';
  const slots = [681, 783, 885, 987].map(x => { const s = box(x - 10, 228, 95, 52, "text-center font-['Nunito'] font-extrabold text-[44px] text-[#424144] leading-[52px]"); t.append(s); return s; });
  const render = () => slots.forEach((s, i) => { s.textContent = digits[i] || ''; });
  const cols = [674, 818, 962], rows = [329, 451, 573];
  const keys = [];
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((d, i) => keys.push([d, cols[i % 3], rows[Math.floor(i / 3)]]));
  keys.push([0, 818, 700]);
  for (const [d, x, y] of keys) {
    const k = box(x, y, 104, 104, 'rounded-full');
    t.append(k);
    onTap(k, () => {
      if (digits.length >= 4) return;
      digits += d; render();
      if (digits.length === 4) setTimeout(check, 250);
    }, { sound: 'key' });
  }
  const close = $(t, '637:675');
  onTap(close, () => o.close(), { sound: 'nav' });
  function check() {
    const y = +digits, now = new Date().getFullYear();
    if (y >= 1900 && y <= now - 16) { sfx('unlock'); o.close(); onPass(); }
    else { sfx('wrong'); animate(t.querySelector('[data-node-id="620:1841"]') || t, 'shake'); toast('Grown-ups only! Please ask a parent.'); digits = ''; render(); }
  }
  return o;
}

/** Wire the lesson corner buttons. ids: { exit, gear, pause, help } arrays of node ids */
export function lessonChrome(root, ids, handlers = {}) {
  (ids.exit || []).forEach(id => onTap($(root, id), handlers.exit, { sound: 'nav' }));
  (ids.gear || []).forEach(id => onTap($(root, id), () => settingsPopup()));
  (ids.pause || []).forEach(id => onTap($(root, id), () => pauseOverlay(handlers.resume)));
  (ids.help || []).forEach(id => onTap($(root, id), handlers.help || (() => {})));
  // the gear glyph is an inline component (96:182) sitting on its button circle
  $$(root, '[data-node-id="96:182"]').forEach(g => { g.style.pointerEvents = 'none'; });
}

/** Pink round "next" arrow in the bottom-right, as in the lesson frames. */
export function nextArrow(root, onNext, { show = true } = {}) {
  const b = box(1073, 733, 75, 79, 'cursor-pointer');
  b.style.zIndex = 45; // above any monsters left in the tray
  b.innerHTML = `<svg viewBox="0 0 75 79" width="75" height="79"><circle cx="37.5" cy="41.5" r="37.5" fill="#e17b9f"/><circle cx="37.5" cy="37.5" r="37.5" fill="#fa96ba"/><path d="M22 37.5h30M40 24l13.5 13.5L40 51" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  root.append(b);
  onTap(b, onNext, { sound: 'nav' });
  b.style.display = show ? '' : 'none';
  return b;
}

/**
 * Keep a big centred letter/blend on one line: widen its (centred) box to maxW and shrink the
 * font until the text fits. Figma's boxes are 531px wide, so "Mm", "Ww" or "mp" used to wrap.
 */
export function fitText(node, maxW, minPx = 80) {
  if (!node) return;
  Object.assign(node.style, { whiteSpace: 'nowrap', wordBreak: 'normal', width: maxW + 'px' });
  node.querySelectorAll('p').forEach(p => { p.style.whiteSpace = 'nowrap'; p.style.wordBreak = 'normal'; });
  const fit = () => {
    node.style.fontSize = '';
    let fs = parseFloat(getComputedStyle(node).fontSize);
    // measure the text itself (its <p> is a full-width block)
    const txt = document.createTreeWalker(node, NodeFilter.SHOW_TEXT).nextNode();
    if (!txt) return;
    const r = document.createRange(); r.selectNodeContents(txt);
    while (fs > minPx && r.getBoundingClientRect().width / getScale() > maxW - 16) { fs *= 0.92; node.style.fontSize = fs + 'px'; }
  };
  fit();
  document.fonts?.ready.then(fit);
}

/** Six words on an even 2 x 3 grid centred in the white lesson card (the Figma slots were uneven). */
export function wordGrid(t, words, html = w => w) {
  return words.map((w, j) => {
    const n = box(j % 2 ? 617 : 237, 206 + Math.floor(j / 2) * 160, 340, 140, '');
    n.style.cssText += "display:flex;align-items:center;justify-content:center;cursor:pointer;white-space:nowrap;font:400 100px 'Cal Sans',Fredoka,sans-serif;color:#57b8b6";
    n.innerHTML = `<span>${html(w)}</span>`;
    t.append(n);
    return n;
  });
}

// ---------- drag & drop (stage-scaled) ----------
export function draggable(el, { onStart, onDrop, onClick }) {
  el.style.touchAction = 'none';
  el.classList.add('cursor-grab');
  el.addEventListener('pointerdown', e => {
    if (el.dataset.locked) return;
    e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch {};
    const start = stagePoint(e);
    const ox = parseFloat(el.style.left) || 0, oy = parseFloat(el.style.top) || 0;
    let moved = false;
    el.style.zIndex = 40; el.style.transition = 'none';
    el.style.transform = 'scale(1.08)';
    onStart && onStart(el);
    const move = ev => { const p = stagePoint(ev); if (Math.hypot(p.x - start.x, p.y - start.y) > 8) moved = true; el.style.left = ox + p.x - start.x + 'px'; el.style.top = oy + p.y - start.y + 'px'; };
    const up = ev => {
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      el.style.transform = '';
      if (!moved) { el.style.left = ox + 'px'; el.style.top = oy + 'px'; el.style.zIndex = ''; onClick && onClick(el); return; }
      const ok = onDrop(el, stagePoint(ev));
      if (!ok) { el.style.transition = 'left .3s ease, top .3s ease'; el.style.left = ox + 'px'; el.style.top = oy + 'px'; }
      el.style.zIndex = '';
    };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
}
export const inside = (p, r, pad = 0) => p.x >= r.x - pad && p.x <= r.x + r.w + pad && p.y >= r.y - pad && p.y <= r.y + r.h + pad;

/** Replace a Figma vector group with an <img> filling the same box. */
export function swapForImage(node, src, fit = 'contain') {
  if (!node) return null;
  node.innerHTML = '';
  node.classList.remove('contents');
  const img = h('img', `absolute inset-0 size-full object-${fit} pointer-events-none`);
  img.src = src; img.alt = '';
  node.append(img);
  return img;
}

/** Hand drawn style waveform shown while the mic is listening. */
export function waveform(x, y, w = 110, hgt = 90) {
  const wv = box(x, y, w, hgt, 'wave rounded-full bg-white/90 z-30', '<i></i><i></i><i></i><i></i><i></i><i></i><i></i>');
  return wv;
}
