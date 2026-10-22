// "Lesson Complete" reward page (shared by every lesson and minigame).
// Rates the run 1-3 stars, pays out coins/XP, and announces level-ups and badges.
import { route, go, tpl, $, h, onTap, confetti, overlay } from './core.js';
import * as store from './store.js';
import { music, say, sfx, wait } from './audio.js';
import { settingsPopup } from './ui.js';
import { coinSvg, checkBadges, dailyCheckIn } from './game.js';
import { ICON } from './art.js';
import { monsterSrc } from './ui.js';

route('reward', (el, { replay, done, next, key = 'misc', stars: fixed, practice }) => {
  const t = tpl('reward');
  el.append(t);
  music('menu');
  const prevBest = store.progress().best[key] || 0;
  const res = store.finishRun(key, { stars: fixed, practice });
  const stars = ['430:374', '429:385', '430:368'].map(id => $(t, id)); // left, middle, right
  stars.forEach(s => { s.style.opacity = 0; });
  // coins + player level under the banner
  const info = h('div', 'pm-reward-info');
  info.style.top = '740px';
  const coinChip = h('div', 'pm-chip', `${coinSvg(34)} +<span>0</span>`);
  const lv = res.after;
  const lvChip = h('div', 'pm-chip', `Level ${lv.level} <span style="display:inline-block;width:120px;height:12px;border-radius:9px;background:#b3e8ff;overflow:hidden"><i style="display:block;height:100%;width:${Math.round(res.before.level === lv.level ? res.before.frac * 100 : 0)}%;background:#ffc843;transition:width 1s ease"></i></span>`);
  info.append(coinChip, lvChip);
  t.append(info);
  let cancelled = false;
  (async () => {
    sfx('complete');
    confetti(res.stars === 3 ? 110 : 60);
    for (let i = 0; i < 3; i++) {
      await wait(260);
      if (cancelled) return;
      stars[i].style.opacity = 1;
      if (i < res.stars) { stars[i].classList.add('pop'); sfx('star', 0.7); } else stars[i].classList.add('star-dim');
    }
    sfx('cheer', 0.6);
    say('ui_lesson_complete');
    // count the coins up
    const span = coinChip.querySelector('span');
    for (let c = 0; c <= res.coins; c += Math.max(1, Math.round(res.coins / 15))) { span.textContent = c; await wait(40); }
    span.textContent = res.coins;
    lvChip.querySelector('i').style.width = Math.round(lv.frac * 100) + '%';
    await wait(900);
    if (cancelled) return;
    // the day's streak is counted with the first finished activity, then shiny monsters and level-ups
    await dailyCheckIn();
    if (cancelled) return;
    const L = key.startsWith('l1_') && key.slice(3);
    if (L && res.stars === 3 && prevBest < 3) await shiny(L);
    if (cancelled) return;
    if (lv.level > res.before.level) await levelUp(lv.level);
    if (!cancelled) checkBadges();
  })();
  const doReplay = () => go(...replay);
  const doDone = () => go(...done);
  onTap($(t, '430:377'), doReplay, { sound: 'pop' }); onTap($(t, '430:378'), doReplay, { sound: 'pop' });
  onTap($(t, '428:779'), doDone, { sound: 'pop' }); onTap($(t, '428:782'), doDone, { sound: 'pop' });
  onTap($(t, '428:638'), doDone, { sound: 'nav' });
  onTap($(t, '428:634'), () => settingsPopup());
  $(t, '96:182') && ($(t, '96:182').style.pointerEvents = 'none');
  if (next) {
    // "next" goes straight on to the following lesson (e.g. the next letter)
    const n = h('div', 'pm-arrowbtn', 'Next ➜');
    Object.assign(n.style, { right: '45px', bottom: '40px', zIndex: 20 });
    t.append(n);
    onTap(n, () => go(...next), { sound: 'nav' });
  }
  return () => { cancelled = true; };
});

const popup = (html, btn, voice, sound = 'unlock') => new Promise(resolve => {
  const card = h('div', 'pm-card pop');
  card.style.width = '540px';
  card.innerHTML = html;
  const ok = h('div', 'pm-btn', btn);
  card.append(ok);
  const o = overlay(card, { closeOnDim: true, onClose: resolve });
  onTap(ok, () => o.close(), { sound: 'sparkle' });
  sfx(sound); confetti(120);
  say(voice);
});
const levelUp = level => popup(`${ICON.party(96)}<h2>Level Up!</h2><p>You are now <b style="color:#fa96ba">Level ${level}</b>!</p>`, 'AWESOME!', `ui_levelup_${Math.min(40, level)}`);
const shiny = L => popup(`<div class="pm-shiny" style="position:relative;width:220px;height:220px;border-radius:50%;display:flex;align-items:center;justify-content:center"><img src="${monsterSrc(L)}" style="height:190px" alt=""><div class="pm-sparkles">${ICON.sparkle(30)}${ICON.sparkle(20, '#fff')}${ICON.sparkle(26)}</div></div>
  <h2>Monster ${L} is shiny!</h2><p>Three stars! Find your shiny monster in the PhonoDex.</p>`, 'WOW!', 'ui_shiny');
