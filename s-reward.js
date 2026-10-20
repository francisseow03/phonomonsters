// "Lesson Complete" reward page (shared by every lesson and minigame).
// Rates the run 1-3 stars, pays out coins/XP, and announces level-ups and badges.
import { route, go, tpl, $, h, onTap, confetti, overlay } from './core.js';
import * as store from './store.js';
import { music, say, sfx, wait, speak } from './audio.js';
import { settingsPopup } from './ui.js';
import { coinSvg, checkBadges } from './game.js';

route('reward', (el, { replay, done, next, key = 'misc', stars: fixed, practice }) => {
  const t = tpl('reward');
  el.append(t);
  music('menu');
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
    if (lv.level > res.before.level) levelUp(lv.level);
    else checkBadges();
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

function levelUp(level) {
  const card = h('div', 'pm-card pop');
  card.style.width = '520px';
  card.innerHTML = `<div style="font-size:90px;line-height:1">🎉</div><h2>Level Up!</h2><p>You are now <b style="color:#fa96ba">Level ${level}</b>!</p>`;
  const ok = h('div', 'pm-btn', 'AWESOME!');
  card.append(ok);
  const o = overlay(card, { closeOnDim: true, onClose: () => checkBadges() });
  onTap(ok, () => o.close(), { sound: 'sparkle' });
  sfx('unlock'); confetti(120);
  speak(`Level up! You are now level ${level}!`);
}
