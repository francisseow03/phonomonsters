// Screen router + small DOM helpers shared by every screen.
import templates from './templates.js';
import { sfx, stopVoice } from './audio.js';

export const stage = document.getElementById('stage');
const routes = {};
let active = null; // { name, el, cleanup }
export const current = () => active?.name;

export function route(name, fn) { routes[name] = fn; }

let navSeq = 0;
/** Resolves once the images inside root have decoded (or after ms, whichever is first). */
function imagesReady(root, ms) {
  const imgs = [...root.querySelectorAll('img')].filter(i => i.src && !i.complete);
  if (!imgs.length) return Promise.resolve();
  return Promise.race([
    Promise.all(imgs.map(i => (i.decode ? i.decode() : Promise.resolve()).catch(() => {}))),
    new Promise(r => setTimeout(r, ms)),
  ]);
}

/**
 * Show a screen. Controllers get (el, params) and may return a cleanup fn.
 * The new screen is built hidden on top of the old one, waits for its images,
 * then fades in over it, so there is never a blank frame between screens.
 */
export async function go(name, params = {}) {
  const my = ++navSeq;
  stopVoice();
  closeOverlays();
  if (active?.cleanup) try { active.cleanup(); } catch (e) { console.error(e); }
  const old = [...stage.querySelectorAll(':scope > .screen')];
  old.forEach(s => s.classList.add('leaving'));
  const el = document.createElement('div');
  el.className = 'screen pending';
  const last = old[old.length - 1];
  last ? last.after(el) : stage.prepend(el);
  active = { name, el, params, cleanup: null };
  let cleanup = null;
  try { cleanup = await routes[name](el, params); } catch (e) { console.error(e); }
  // a controller that redirected (or a newer tap) has already replaced this screen
  if (my !== navSeq) { el.remove(); if (typeof cleanup === 'function') try { cleanup(); } catch {} return; }
  active.cleanup = typeof cleanup === 'function' ? cleanup : null;
  passThroughIcons(el);
  await imagesReady(el, 700);
  if (my !== navSeq) return;
  el.classList.remove('pending');
  el.classList.add('enter');
  setTimeout(() => old.forEach(s => s.remove()), 400);
  window.scrollTo(0, 0);
}

/**
 * Figma often draws a button's icon as a separate layer on top of the button, so a tap in the
 * middle of the icon never reached the button. Let taps fall through such decorations.
 */
function passThroughIcons(root) {
  const btns = [...root.querySelectorAll('[role=button]')];
  if (!btns.length) return;
  const rects = btns.map(b => b.getBoundingClientRect());
  const holders = new Set(); // buttons and everything that contains one
  for (const b of btns) for (let x = b; x && x !== root; x = x.parentElement) holders.add(x);
  for (const e of root.querySelectorAll('div,img,svg,p')) {
    if (holders.has(e) || e.closest('[role=button]')) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const i = rects.findIndex(b => r.left >= b.left - 6 && r.right <= b.right + 6 && r.top >= b.top - 6 && r.bottom <= b.bottom + 6);
    if (i >= 0 && btns[i].compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING) e.style.pointerEvents = 'none';
  }
}

/** Fresh DOM copy of a converted Figma screen. */
export function tpl(name) {
  const t = document.createElement('template');
  t.innerHTML = templates[name];
  return t.content.firstElementChild;
}
export const $ = (root, id) => root.querySelector(`[data-node-id="${id}"]`);
export const $$ = (root, sel) => [...root.querySelectorAll(sel)];
export function hide(root, ...ids) { ids.forEach(id => $(root, id)?.classList.add('hidden-node')); }
export function remove(root, ...ids) { ids.forEach(id => $(root, id)?.remove()); }

export function h(tag, cls = '', html = '') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}
/** Absolutely positioned element in stage coordinates. */
export function box(x, y, w, hgt, cls = '', html = '') {
  const e = h('div', 'absolute ' + cls, html);
  Object.assign(e.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hgt + 'px' });
  return e;
}

/** Make something tappable (pointer + keyboard), with a click sound. */
export function onTap(el, fn, { sound = 'tap', cls = 'tap' } = {}) {
  if (!el) return;
  el.classList.add(cls);
  el.style.pointerEvents = 'auto';
  el.setAttribute('role', 'button');
  el.tabIndex = 0;
  const run = e => { e.stopPropagation(); e.preventDefault(); if (sound) sfx(sound); fn(e); };
  el.addEventListener('click', run);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') run(e); });
}

// Stage scaling: the design is a fixed 1194x834 iPad canvas.
let scale = 1;
export const getScale = () => scale;
function fit() {
  const vw = window.innerWidth, vh = window.innerHeight;
  scale = Math.min(vw / 1194, vh / 834);
  stage.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', fit);
fit();

/** Convert a pointer event to stage coordinates. */
export function stagePoint(e) {
  const r = stage.getBoundingClientRect();
  return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
}
/** Element rect in stage coordinates. */
export function stageRect(el) {
  const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
  return { x: (r.left - s.left) / scale, y: (r.top - s.top) / scale, w: r.width / scale, h: r.height / scale };
}

// ---------- overlays ----------
const overlays = new Set();
export function overlay(content, { dim = true, onClose, closeOnDim = false } = {}) {
  const o = h('div', 'overlay');
  if (dim) { const d = h('div', 'dim'); o.append(d); if (closeOnDim) d.addEventListener('click', () => close()); }
  o.append(content);
  stage.append(o);
  overlays.add(o);
  function close() { if (!overlays.has(o)) return; overlays.delete(o); o.remove(); onClose && onClose(); }
  return { el: o, close };
}
export function closeOverlays() { [...overlays].forEach(o => { overlays.delete(o); o.remove(); }); }

/** A Figma frame (popup sized) as a centered card. */
export function frameCard(name, w, hgt) {
  const wrap = h('div', 'relative pop');
  Object.assign(wrap.style, { width: w + 'px', height: hgt + 'px' });
  const t = tpl(name);
  t.style.width = w + 'px'; t.style.height = hgt + 'px';
  t.removeAttribute('data-screen');
  wrap.append(t);
  return { wrap, root: t };
}

let toastTimer;
export function toast(msg, ms = 2200) {
  stage.querySelectorAll('.toast').forEach(t => t.remove());
  const t = h('div', 'toast', msg);
  stage.append(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), ms);
}

export function confetti(n = 70) {
  const colors = ['#ffc843', '#fa96ba', '#1fa7e1', '#75d069', '#fb5063', '#a37fe8'];
  for (let i = 0; i < n; i++) {
    const c = h('div', 'confetti');
    c.style.left = Math.random() * 1194 + 'px';
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    c.style.animationDelay = Math.random() * 0.5 + 's';
    stage.append(c);
    setTimeout(() => c.remove(), 4000);
  }
}

export const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const pick = a => a[Math.floor(Math.random() * a.length)];
export function animate(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); el.addEventListener('animationend', () => el.classList.remove(cls), { once: true }); }
