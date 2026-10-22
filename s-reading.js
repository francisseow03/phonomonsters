// Reading Room: story picker (two shelves) + read-along storybooks with word-by-word highlighting.
import { route, go, tpl, $, h, box, onTap, stageRect } from './core.js';
import * as store from './store.js';
import { music, say, stopVoice, voiceTime, preload, isSpeaking } from './audio.js';
import { settingsPopup, avatarInner } from './ui.js';
import { STORIES, MORE_STORIES } from './data.js';
import { slug } from './voice.js';
import { sceneHtml, coverHtml } from './art.js';
import TIMINGS from './story_timings.js';

const lockedBadge = text => `<span style="background:rgba(0,0,0,.35);border-radius:20px;padding:6px 12px;display:inline-flex;gap:6px;align-items:center"><svg viewBox="0 0 64 64" width="18" height="18"><path d="M18 28v-8a14 14 0 0128 0v8" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><rect x="10" y="27" width="44" height="32" rx="8" fill="#fff"/></svg>${text}</span>`;
const readCount = (t, x, n) => n && t.append(box(x + 155, 170, 96, 34, "rounded-full bg-white text-[#ffb000] font-['Nunito'] font-extrabold text-[18px] flex items-center justify-center shadow-[0_3px_0_#e8a800] z-20", `★ ×${n}`));

/** Draw one story card (261 x 531 at x, 163) over the shelf. */
function storyCard(t, k, x, pr) {
  const st = MORE_STORIES[k];
  const card = box(x, 163, 261, 531, 'z-10');
  const open = pr.allLevels || st.gate.test(pr);
  // same layout as the Figma Story 1 card: title centred at y 85, level pill at 123, picture inset 16px from 169
  card.style.cssText += `border-radius:15px;background:${open ? st.color : '#9aa7ab'};cursor:pointer;font-family:Nunito,sans-serif;color:#fff`;
  card.innerHTML = `<div style="position:absolute;left:0;right:0;top:61px;text-align:center;font:700 36px/49px Nunito">Story ${k}</div>
    <div style="position:absolute;left:80px;top:123px;width:101px;height:23px;border-radius:50px;background:#fff;color:${open ? st.color : '#7a8a8e'};display:flex;align-items:center;justify-content:center;font:800 16px Nunito">Level ${st.level}</div>
    <div style="position:absolute;left:16px;top:169px;width:230px;height:332px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:16px;padding-top:10px;box-sizing:border-box;${open ? '' : 'filter:grayscale(1) opacity(.55)'}">
      <div style="width:210px">${coverHtml(st)}</div>
      <div style="font:800 21px Nunito;color:${open ? st.color : '#7a8a8e'};text-align:center;padding:0 12px;line-height:1.15">${st.title}</div></div>`;
  t.append(card);
  if (!open) {
    t.append(box(x + 20, 610, 221, 60, "flex items-center justify-center text-center font-['Nunito'] font-extrabold text-[15px] text-white z-20", lockedBadge(st.gate.text)));
    onTap(card, () => { say(`ui_lock_story_${k}`); card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 500); }, { sound: 'locked' });
    return;
  }
  onTap(card, () => go('tale', { s: k, p: 1 }), { sound: 'page' });
  readCount(t, x, pr.stories[k]);
}

route('reading', (el, { page = 1 } = {}) => {
  const t = tpl('reading');
  el.append(t);
  music('story');
  const p = store.profile();
  if (p) { $(t, '165:78').textContent = p.name; $(t, '165:79').innerHTML = avatarInner(p.avatar); }
  onTap($(t, '138:33'), () => go('minigames'), { sound: 'nav' });
  onTap($(t, '165:120'), () => settingsPopup());
  const pr = store.progress();
  // stories that opened since the last visit get a little "new" ribbon
  const opened = Object.keys(MORE_STORIES).filter(k => pr.allLevels || MORE_STORIES[k].gate.test(pr)).map(Number);
  const seen = pr.seenStories || (pr.seenStories = opened.slice());
  const fresh = opened.filter(k => !seen.includes(k));
  const ribbon = x => t.append(box(x - 8, 150, 96, 34, "rounded-full bg-[#fa96ba] text-white font-['Nunito'] font-black text-[17px] flex items-center justify-center shadow-[0_3px_0_#e17b9f] z-20 pulse", 'NEW!'));
  if (page === 1) {
    const s1 = box(45, 163, 261, 531, 'z-10 rounded-[15px]');
    t.append(s1);
    onTap(s1, () => go('story', { s: 1, p: 1 }), { sound: 'page' });
    readCount(t, 45, pr.stories[1]);
    [[2, 326], [3, 607], [4, 888]].forEach(([k, x]) => { storyCard(t, k, x, pr); if (fresh.includes(k)) ribbon(x); });
    const more = h('div', 'pm-arrowbtn', `More stories ➜${fresh.some(k => k > 4) ? ' <b style="background:#fa96ba;border-radius:20px;padding:2px 10px;font-size:15px">NEW</b>' : ''}`);
    Object.assign(more.style, { left: '597px', top: '722px', transform: 'translateX(-50%)' });
    t.append(more);
    onTap(more, () => go('reading', { page: 2 }), { sound: 'nav' });
  } else {
    // clear the Figma shelf (cards + their overflowing art) but keep the header, background and gear
    for (const c of [...t.querySelectorAll('[data-node-id]')]) {
      if (!c.isConnected) continue;
      const r = stageRect(c);
      if (r.h < 600 && r.y > 140 && r.y + r.h < 765) c.remove();
    }
    [[5, 45], [6, 326], [7, 607], [8, 888]].forEach(([k, x]) => { storyCard(t, k, x, pr); if (fresh.includes(k)) ribbon(x); });
    const back = h('div', 'pm-arrowbtn', '⬅ Stories 1 - 4');
    Object.assign(back.style, { left: '597px', top: '722px', transform: 'translateX(-50%)' });
    t.append(back);
    onTap(back, () => go('reading'), { sound: 'nav' });
  }
  const shown = fresh.filter(k => (k > 4) === (page === 2));
  if (shown.length) { pr.seenStories.push(...shown); store.save(); say('ui_story_open'); } else say('ui_reading');
});

const POS = { 1: [166, 97, 354], 2: [166, 97, 354], 3: [166, 97, 532], 4: [166, 97, 532], 5: [446, 67, 532], 6: [166, 97, 532], 7: [166, 97, 688] };
const norm = w => w.toLowerCase().replace(/[^a-z']/g, '');

/** Wire the karaoke highlight: words light up as the narrator reaches them (Kokoro word timings). */
function karaoke(key, spans) {
  const timing = (TIMINGS[key] || []).filter(([, w]) => norm(w));
  const map = [];
  let si = 0;
  for (const [at, wd] of timing) {
    let j = si;
    while (j < spans.length && spans[j].dataset.w !== norm(wd)) j++;
    if (j < spans.length) { map.push([at, spans[j]]); si = j + 1; }
  }
  let raf = 0;
  const clearHL = () => { cancelAnimationFrame(raf); spans.forEach(sp => sp.classList.remove('on')); };
  const read = async () => {
    clearHL();
    const ended = say(key);
    const tick = () => {
      const now = voiceTime();
      let cur = null;
      for (const [at, sp] of map) if (now >= at - 0.05) cur = sp;
      spans.forEach(sp => sp.classList.toggle('on', sp === cur));
      if (isSpeaking()) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    await ended;
    clearHL();
  };
  return { read, clearHL, stop: () => cancelAnimationFrame(raf) };
}
const wordSpans = (txt, lines, tapCls = '') => {
  txt.innerHTML = lines.map(line => `<p class="m-0 leading-[normal]">${line.split(' ').map(tok => {
    const bold = /\*\*/.test(tok), clean = tok.replace(/\*\*/g, '');
    return `<span class="story-word${bold ? ' bold font-bold ' + tapCls : ''}" data-w="${norm(clean)}">${clean}</span>`;
  }).join(' ')}</p>`).join('');
  return [...txt.querySelectorAll('.story-word')];
};

route('story', (el, { s = 1, p = 1 }) => {
  const story = STORIES[s - 1];
  const page = story.pages[p - 1];
  const key = `story${s}_${p}`;
  if (p === 1) store.startRun();
  preload(key, ...(p < story.pages.length ? [`story${s}_${p + 1}`] : []));
  const t = tpl('story');
  el.append(t);
  music('story');
  $(t, '443:387').querySelector('img').src = `story-p${p}.png`;
  // text with per-word spans (bold words are tappable)
  const txt = $(t, '300:183');
  const [x, y, w] = POS[p] || POS[1];
  Object.assign(txt.style, { left: x + 'px', top: y + 'px', width: w + 'px' });
  txt.className = txt.className.replace(/left-\[[^\]]+\]/, '').replace(/top-\[[^\]]+\]/, '').replace(/w-\[[^\]]+\]/, '');
  const spans = wordSpans(txt, page.lines);
  const k = karaoke(key, spans);
  txt.querySelectorAll('.story-word.bold').forEach(sp => onTap(sp, () => { stopVoice(); k.clearHL(); sp.classList.add('on'); say(`w_${slug(sp.dataset.w)}`).then(() => sp.classList.remove('on')); }, { sound: null, cls: 'tap' }));

  const toReading = () => go('reading');
  onTap($(t, '287:1067'), toReading, { sound: 'nav' }); onTap($(t, '287:1074'), toReading, { sound: 'nav' });
  [$(t, '300:154'), $(t, '300:162'), $(t, '300:155'), $(t, '300:165')].forEach(b => onTap(b, k.read));
  const pause = () => { if (isSpeaking()) { stopVoice(); k.clearHL(); } else k.read(); };
  onTap($(t, '300:167'), pause); onTap($(t, '300:168'), pause);
  onTap($(t, '300:178'), () => settingsPopup());
  $(t, '96:182') && ($(t, '96:182').style.pointerEvents = 'none');
  const next = () => {
    if (p < story.pages.length) go('story', { s, p: p + 1 });
    else { store.completeStory(s); go('reward', { key: `story_${s}`, practice: true, replay: ['story', { s, p: 1 }], done: ['reading', {}] }); }
  };
  onTap($(t, '300:171'), next, { sound: 'page' }); onTap($(t, '300:172'), next, { sound: 'page' });
  if (p > 1) {
    const prev = box(889, 713, 75, 79, 'cursor-pointer');
    prev.innerHTML = `<svg viewBox="0 0 75 79" width="75" height="79"><circle cx="37.5" cy="41.5" r="37.5" fill="#e17b9f"/><circle cx="37.5" cy="37.5" r="37.5" fill="#fa96ba"/><path d="M53 37.5H23M35 24L21.5 37.5 35 51" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
    t.append(prev);
    onTap(prev, () => go('story', { s, p: p - 1 }), { sound: 'page' });
  }
  const timer = setTimeout(k.read, 450);
  return () => { clearTimeout(timer); k.stop(); };
});

// ---------- Stories 2-8: illustrated monster storybooks ----------
const BTN = {
  back: `<svg viewBox="0 0 75 79" width="75" height="79"><circle cx="37.5" cy="41.5" r="37.5" fill="#57b8b6"/><circle cx="37.5" cy="37.5" r="37.5" fill="#6ed0cf"/><path d="M50 37.5H25M35 26L23.5 37.5 35 49" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  read: `<svg viewBox="0 0 75 79" width="75" height="79"><circle cx="37.5" cy="41.5" r="37.5" fill="#e17b9f"/><circle cx="37.5" cy="37.5" r="37.5" fill="#fa96ba"/><path d="M22 31h9l12-10v33L31 44h-9z" fill="#fff"/><path d="M49 29q7 8.5 0 17" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
  arrow: d => `<svg viewBox="0 0 75 79" width="75" height="79"><circle cx="37.5" cy="41.5" r="37.5" fill="#e17b9f"/><circle cx="37.5" cy="37.5" r="37.5" fill="#fa96ba"/><path d="${d}" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
};
route('tale', (el, { s = 2, p = 1 }) => {
  const st = MORE_STORIES[s], page = st.pages[p - 1];
  const key = `story${s}_${p}`;
  if (p === 1) store.startRun();
  preload(key, ...(p < st.pages.length ? [`story${s}_${p + 1}`] : []));
  music('story');
  const t = h('div', 'relative size-full overflow-hidden pm-tale');
  t.innerHTML = sceneHtml(page);
  el.append(t);
  // the words sit on a soft card at the top, like the text on the Story 1 pages
  const card = box(170, 34, 854, 0, 'pm-tale-text');
  card.className = 'pm-tale-text';
  t.append(card);
  const spans = wordSpans(card, page.lines);
  const k = karaoke(key, spans);
  card.querySelectorAll('.story-word.bold').forEach(sp => onTap(sp, () => { stopVoice(); k.clearHL(); sp.classList.add('on'); say(`w_${slug(sp.dataset.w)}`).then(() => sp.classList.remove('on')); }, { sound: null }));
  // tap a monster to hear it giggle its sound
  t.querySelectorAll('.pm-char').forEach((c, i) => onTap(c, () => { c.classList.remove('wiggle'); void c.offsetWidth; c.classList.add('wiggle'); say(`ph_${page.chars[i][0]}`); }, { sound: 'giggle' }));
  // page dots
  const dots = box(397, 800, 400, 20, 'flex items-center justify-center');
  dots.style.gap = '10px';
  st.pages.forEach((_, i) => dots.append(h('div', '', `<div style="width:14px;height:14px;border-radius:50%;background:${i === p - 1 ? '#fa96ba' : '#fff'};box-shadow:0 2px 0 rgba(0,0,0,.15)"></div>`)));
  t.append(dots);
  const btn = (x, y, html, fn, sound = 'nav') => { const b = box(x, y, 75, 79, '', html); b.style.cursor = 'pointer'; b.style.zIndex = 30; t.append(b); onTap(b, fn, { sound }); return b; };
  btn(45, 42, BTN.back, () => go('reading', { page: s > 4 ? 2 : 1 }));
  btn(1074, 42, BTN.read, () => { if (isSpeaking()) { stopVoice(); k.clearHL(); } else k.read(); }, 'pop');
  if (p > 1) btn(889, 713, BTN.arrow('M53 37.5H23M35 24L21.5 37.5 35 51'), () => go('tale', { s, p: p - 1 }), 'page');
  btn(1074, 713, BTN.arrow('M22 37.5h30M40 24l13.5 13.5L40 51'), () => {
    if (p < st.pages.length) go('tale', { s, p: p + 1 });
    else { store.completeStory(s); go('reward', { key: `story_${s}`, practice: true, replay: ['tale', { s, p: 1 }], done: ['reading', { page: s > 4 ? 2 : 1 }] }); }
  }, 'page');
  const timer = setTimeout(k.read, 500);
  return () => { clearTimeout(timer); k.stop(); };
});
