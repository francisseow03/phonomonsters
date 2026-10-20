// Reading Room: story picker + read-along storybook with word highlighting.
import { route, go, tpl, $, h, box, onTap, toast } from './core.js';
import * as store from './store.js';
import { music, say, sfx, stopVoice, voiceTime, preload, isSpeaking, speak } from './audio.js';
import { settingsPopup, avatarInner, picSrc } from './ui.js';
import { STORIES, MORE_STORIES } from './data.js';
import { lockOver } from './game.js';
import { slug } from './voice.js';
import TIMINGS from './story_timings.js';

route('reading', el => {
  const t = tpl('reading');
  el.append(t);
  music('story');
  const p = store.profile();
  if (p) { $(t, '165:78').textContent = p.name; $(t, '165:79').innerHTML = avatarInner(p.avatar); }
  onTap($(t, '138:33'), () => go('minigames'), { sound: 'nav' });
  onTap($(t, '165:120'), () => settingsPopup());
  const s1 = box(45, 163, 261, 531, 'z-10 rounded-[15px]');
  t.append(s1);
  onTap(s1, () => go('story', { s: 1, p: 1 }), { sound: 'page' });
  const pr = store.progress();
  for (const [k, x] of [[2, 326], [3, 607], [4, 888]]) {
    const st = MORE_STORIES[k];
    if (!(pr.allLevels || st.gate.test(pr))) {
      // the Figma card already shows the locked look; add what opens it
      const need = box(x + 20, 610, 221, 60, "flex items-center justify-center text-center font-['Nunito'] font-extrabold text-[16px] text-white z-20");
      need.innerHTML = `<span style="background:rgba(0,0,0,.35);border-radius:20px;padding:6px 12px">🔒 ${st.gate.text}</span>`;
      t.append(need);
      const hit = box(x, 163, 261, 531, 'z-10 rounded-[15px]');
      t.append(hit);
      onTap(hit, () => { speak(`This story is locked. ${st.gate.text} to open it.`); hit.classList.add('shake'); setTimeout(() => hit.classList.remove('shake'), 500); }, { sound: 'locked' });
      continue;
    }
    // unlocked: draw a fresh cover over the locked Figma card
    const card = box(x, 163, 261, 531, 'z-10');
    card.style.cssText += `border-radius:15px;background:${st.color};display:flex;flex-direction:column;align-items:center;cursor:pointer;font-family:Nunito,sans-serif;color:#fff`;
    card.innerHTML = `<div style="margin-top:46px;font:700 36px Nunito">Story ${k}</div>
      <div style="margin-top:8px;background:#fff;color:${st.color};border-radius:30px;padding:1px 16px;font:800 16px Nunito">Level ${st.level}</div>
      <div style="margin-top:24px;width:230px;height:250px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center"><img src="${picSrc(st.cover)}" style="width:180px;height:180px" alt=""></div>
      <div style="margin-top:16px;font:800 20px Nunito;text-align:center;padding:0 14px;line-height:1.15">${st.title}</div>`;
    t.append(card);
    onTap(card, () => go('tale', { s: k, p: 1 }), { sound: 'page' });
    if (pr.stories[k]) t.append(box(x + 155, 170, 96, 34, "rounded-full bg-white text-[#ffb000] font-['Nunito'] font-extrabold text-[18px] flex items-center justify-center shadow-[0_3px_0_#e8a800] z-20", `★ ×${pr.stories[k]}`));
  }
  const read = pr.stories[1] || 0;
  if (read) t.append(box(200, 170, 96, 34, "rounded-full bg-white text-[#ffb000] font-['Nunito'] font-extrabold text-[18px] flex items-center justify-center shadow-[0_3px_0_#e8a800] z-20", `★ ×${read}`));
  say('ui_reading');
});

const POS = { 1: [166, 97, 354], 2: [166, 97, 354], 3: [166, 97, 532], 4: [166, 97, 532], 5: [446, 67, 532], 6: [166, 97, 532], 7: [166, 97, 688] };
const norm = w => w.toLowerCase().replace(/[^a-z']/g, '');

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
  const spans = [];
  txt.innerHTML = page.lines.map(line => `<p class="m-0 leading-[normal]">${line.split(' ').map(tok => {
    const bold = /\*\*/.test(tok);
    const clean = tok.replace(/\*\*/g, '');
    return `<span class="story-word${bold ? ' bold font-bold' : ''}" data-w="${norm(clean)}">${clean}</span>`;
  }).join(' ')}</p>`).join('');
  txt.querySelectorAll('.story-word').forEach(sp => spans.push(sp));
  txt.querySelectorAll('.story-word.bold').forEach(sp => onTap(sp, () => { stopVoice(); clearHL(); sp.classList.add('on'); say(`w_${slug(sp.dataset.w)}`).then(() => sp.classList.remove('on')); }, { sound: null, cls: 'tap' }));

  // karaoke highlight driven by the TTS word timings
  const timing = (TIMINGS[key] || []).filter(([, w]) => norm(w));
  const map = [];
  let si = 0;
  for (const [at, wd] of timing) {
    while (si < spans.length && spans[si].dataset.w !== norm(wd)) si++;
    if (si < spans.length) map.push([at, spans[si++]]);
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

  const toReading = () => go('reading');
  onTap($(t, '287:1067'), toReading, { sound: 'nav' }); onTap($(t, '287:1074'), toReading, { sound: 'nav' });
  [$(t, '300:154'), $(t, '300:162'), $(t, '300:155'), $(t, '300:165')].forEach(b => onTap(b, read));
  const pause = () => { if (isSpeaking()) { stopVoice(); clearHL(); } else read(); };
  onTap($(t, '300:167'), pause); onTap($(t, '300:168'), pause);
  onTap($(t, '300:178'), () => settingsPopup());
  $(t, '96:182') && ($(t, '96:182').style.pointerEvents = 'none');
  const next = () => {
    if (p < story.pages.length) go('story', { s, p: p + 1 });
    else { store.completeStory(s); go('reward', { key: `story_${s}`, stars: 3, replay: ['story', { s, p: 1 }], done: ['reading', {}] }); }
  };
  onTap($(t, '300:171'), next, { sound: 'page' }); onTap($(t, '300:172'), next, { sound: 'page' });
  if (p > 1) {
    const prev = box(889, 713, 75, 79, 'cursor-pointer');
    prev.innerHTML = `<svg viewBox="0 0 75 79" width="75" height="79"><circle cx="37.5" cy="41.5" r="37.5" fill="#e17b9f"/><circle cx="37.5" cy="37.5" r="37.5" fill="#fa96ba"/><path d="M53 37.5H23M35 24L21.5 37.5 35 51" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
    t.append(prev);
    onTap(prev, () => go('story', { s, p: p - 1 }), { sound: 'page' });
  }
  setTimeout(read, 450);
  return () => cancelAnimationFrame(raf);
});

// ---------- Stories 2-4: picture read-alongs voiced by the device voice ----------
const ARROW = d => `<svg viewBox="0 0 75 79" width="75" height="79"><circle cx="37.5" cy="41.5" r="37.5" fill="#e17b9f"/><circle cx="37.5" cy="37.5" r="37.5" fill="#fa96ba"/><path d="${d}" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
route('tale', (el, { s = 2, p = 1 }) => {
  const st = MORE_STORIES[s], page = st.pages[p - 1];
  if (p === 1) store.startRun();
  music('story');
  const t = h('div', 'relative size-full overflow-hidden');
  t.style.background = `linear-gradient(180deg, #fdf6e8 0%, #fdf6e8 84%, ${st.color} 84%)`;
  el.append(t);
  // book page: picture on the right, text on the left, both vertically centred
  t.append(box(0, 0, 1194, 120, '', `<div style="text-align:center;padding-top:40px;font:700 34px Fredoka,Nunito;color:#1c9886">${st.title}</div>`));
  const pic = box(690, 160, 420, 420, '');
  pic.style.cssText += 'border-radius:24px;background:#fff;box-shadow:0 8px 0 rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center';
  pic.innerHTML = `<img src="${picSrc(page.pic)}" class="float" style="width:300px;height:300px" alt="">`;
  t.append(pic);
  const txt = box(84, 160, 570, 420, 'pm-story-text');
  txt.className = 'pm-story-text';
  txt.style.cssText += 'display:flex;flex-direction:column;justify-content:center';
  t.append(txt);
  const spans = [];
  let plain = '';
  txt.innerHTML = page.lines.map(line => `<p style="margin:0">${line.split(' ').map(tok => {
    const bold = /\*\*/.test(tok), clean = tok.replace(/\*\*/g, '');
    return `<span class="story-word${bold ? ' bold' : ''}" style="${bold ? 'font-weight:800;cursor:pointer' : ''}" data-w="${norm(clean)}">${clean}</span>`;
  }).join(' ')}</p>`).join('');
  txt.querySelectorAll('.story-word').forEach(sp => { sp.dataset.at = plain.length; plain += sp.textContent + ' '; spans.push(sp); });
  const clearHL = () => spans.forEach(sp => sp.classList.remove('on'));
  txt.querySelectorAll('.story-word.bold').forEach(sp => onTap(sp, () => { stopVoice(); clearHL(); sp.classList.add('on'); say(`w_${slug(sp.dataset.w)}`).then(() => sp.classList.remove('on')); }, { sound: null }));
  const read = async () => {
    clearHL();
    let guessed = false;
    // highlight word by word: real boundary events where the voice supports them, a timed guess otherwise
    const timer = setInterval(() => {
      if (!guessed) return;
      const cur = spans.findIndex(sp => sp.classList.contains('on'));
      if (cur < spans.length - 1) { clearHL(); spans[cur + 1].classList.add('on'); }
    }, 420);
    setTimeout(() => { if (!spans.some(sp => sp.classList.contains('on'))) { guessed = true; spans[0].classList.add('on'); } }, 600);
    await speak(plain.trim(), ci => { guessed = false; clearHL(); const sp = [...spans].reverse().find(x => +x.dataset.at <= ci); sp && sp.classList.add('on'); });
    clearInterval(timer); clearHL();
  };
  // page dots
  const dots = box(397, 632, 400, 20, 'flex items-center justify-center');
  dots.style.gap = '10px';
  st.pages.forEach((_, i) => dots.append(h('div', '', `<div style="width:14px;height:14px;border-radius:50%;background:${i === p - 1 ? '#fa96ba' : '#fff'}"></div>`)));
  t.append(dots);
  // controls
  const btn = (x, y, html, fn, sound = 'nav') => { const b = box(x, y, 75, 79, '', html); b.style.cursor = 'pointer'; t.append(b); onTap(b, fn, { sound }); return b; };
  btn(45, 42, `<svg viewBox="0 0 75 79" width="75" height="79"><circle cx="37.5" cy="41.5" r="37.5" fill="#57b8b6"/><circle cx="37.5" cy="37.5" r="37.5" fill="#6ed0cf"/><path d="M50 37.5H25M35 26L23.5 37.5 35 49" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`, () => go('reading'));
  btn(1074, 42, `<svg viewBox="0 0 75 79" width="75" height="79"><circle cx="37.5" cy="41.5" r="37.5" fill="#018cbc"/><circle cx="37.5" cy="37.5" r="37.5" fill="#1fa7e1"/><path d="M22 31h9l12-10v33L31 44h-9z" fill="#fff"/><path d="M49 29q7 8.5 0 17" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`, read, 'pop');
  if (p > 1) btn(889, 713, ARROW('M53 37.5H23M35 24L21.5 37.5 35 51'), () => go('tale', { s, p: p - 1 }), 'page');
  btn(1074, 713, ARROW('M22 37.5h30M40 24l13.5 13.5L40 51'), () => {
    if (p < st.pages.length) go('tale', { s, p: p + 1 });
    else { store.completeStory(s); go('reward', { key: `story_${s}`, stars: 3, replay: ['tale', { s, p: 1 }], done: ['reading', {}] }); }
  }, 'page');
  const timer = setTimeout(read, 500);
  return () => clearTimeout(timer);
});
