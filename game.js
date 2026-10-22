// Gamification UI: coin/level pill, badges, daily streak, treasure shop (monsters + hats), level locks.
import { h, box, onTap, overlay, stage, confetti, toast, animate } from './core.js';
import * as store from './store.js';
import { sfx, say, isSpeaking, wait } from './audio.js';
import { LETTERS, BADGES, HATS } from './data.js';
import { medalSvg, hatSvg, ICON } from './art.js';

export { BADGES };
export const coinSvg = (s = 34) => `<svg class="pm-coin" viewBox="0 0 40 40" width="${s}" height="${s}"><circle cx="20" cy="22" r="17" fill="#e8a800"/><circle cx="20" cy="19" r="17" fill="#ffc843"/><circle cx="20" cy="19" r="12" fill="none" stroke="#fff3c4" stroke-width="3"/><path d="M20 11.5l2.3 4.8 5.2.6-3.9 3.6 1 5.2-4.6-2.6-4.6 2.6 1-5.2-3.9-3.6 5.2-.6z" fill="#fff"/></svg>`;
export const lockSvg = (s = 64) => `<svg viewBox="0 0 64 64" width="${s}" height="${s}"><path d="M18 28v-8a14 14 0 0128 0v8" fill="none" stroke="#6b6b6b" stroke-width="7" stroke-linecap="round"/><rect x="10" y="27" width="44" height="32" rx="8" fill="#f9c105"/><rect x="10" y="27" width="44" height="10" rx="5" fill="#ffd84a"/><circle cx="32" cy="42" r="5" fill="#3a3a3a"/><rect x="29.5" y="44" width="5" height="9" rx="2.5" fill="#3a3a3a"/></svg>`;

// ---------- badges ----------
const untilQuiet = async () => { for (let i = 0; i < 30 && isSpeaking(); i++) await wait(200); };

/** Award any badges whose conditions are now met; several at once share one announcement. */
export function checkBadges() {
  const p = store.progress();
  const fresh = BADGES.filter(b => !p.badges[b.id] && b.test(p) && store.earnBadge(b.id));
  if (fresh.length) setTimeout(() => announce(fresh), 600);
  return fresh;
}
async function announce(list) {
  await untilQuiet(); // let lesson-complete / level-up narration finish first
  const t = h('div', 'pm-toastbadge', `<div class="medals">${list.slice(0, 4).map(b => medalSvg(b, 58)).join('')}</div>
    <div><small>${list.length > 1 ? `${list.length} new badges!` : 'New badge!'}</small><b>${list.length > 1 ? list.map(b => b.name).slice(0, 2).join(' + ') + (list.length > 2 ? ' + more' : '') : list[0].name}</b></div>`);
  stage.append(t);
  sfx('unlock'); confetti(30 + list.length * 15);
  await say(list.length > 1 ? 'ui_badges_many' : `ui_badge_new_${list[0].id}`);
  await wait(900);
  t.classList.add('out'); setTimeout(() => t.remove(), 400);
}

export function badgeGrid(container) {
  const p = store.progress();
  for (const b of BADGES) {
    const got = !!p.badges[b.id];
    const el = h('div', 'pm-badge' + (got ? '' : ' locked'), `<div class="ic">${medalSvg(b, 92, !got)}</div><b>${b.name}</b><span>${b.desc}</span>`);
    container.append(el);
    onTap(el, () => { animate(el.querySelector('.ic'), 'wiggle'); say(got ? `ui_badge_${b.id}` : `ui_badge_lock_${b.id}`); }, { sound: got ? 'sparkle' : 'locked' });
  }
}

// ---------- header pill: coins + player level ----------
export function coinPill(root, x = 575, y = 46) {
  const p = store.progress();
  const lv = store.levelInfo(p.xp);
  const pill = h('div', 'pm-pill', `${coinSvg(40)}<div><b>${p.coins}</b><small>Level ${lv.level}</small><div class="pm-xp"><i style="width:${Math.round(lv.frac * 100)}%"></i></div></div>`);
  Object.assign(pill.style, { left: x + 'px', top: y + 'px', width: '150px', height: '77px', zIndex: 5 });
  root.append(pill);
  onTap(pill, () => treasureShop(() => {
    pill.querySelector('b').textContent = store.progress().coins;
  }), { sound: 'pop' });
  return pill;
}

// ---------- daily streak: paid out with the first finished activity of the day ----------
/** Resolves once the child has closed the streak card (or at once if today is already counted). */
export function dailyCheckIn() {
  const r = store.checkIn();
  if (!r) return Promise.resolve(false);
  return new Promise(resolve => {
    const card = h('div', 'pm-card pop');
    card.style.width = '560px';
    card.innerHTML = `<h2>Day ${r.day} streak!</h2><div class="pm-row" style="gap:6px">${Array.from({ length: Math.min(7, r.day) }, () => ICON.flame(58)).join('')}</div>
      <p>${r.day > 1 ? 'You learnt something new again today!' : 'You learnt something new today!'} Here is your daily treasure.</p>
      <div class="pm-chip" style="font-size:30px;height:62px">${coinSvg(44)} +${r.bonus} coins</div>`;
    const ok = h('div', 'pm-btn', 'YAY!');
    card.append(ok);
    const o = overlay(card, { closeOnDim: true, onClose: () => resolve(true) });
    onTap(ok, () => o.close(), { sound: 'sparkle' });
    sfx('complete');
    say(r.day === 1 ? 'ui_streak_1' : r.day <= 7 ? `ui_streak_${r.day}` : 'ui_streak_more');
  });
}

// ---------- treasure shop: monster avatars and hats ----------
const AVATAR_PRICE = 30;
export function treasureShop(onChange, tab = 'monsters') {
  const p = store.progress();
  const me = store.profile();
  const card = h('div', 'pm-card pop');
  card.style.width = '940px';
  card.innerHTML = `<h2>Treasure Shop</h2>`;
  const top = h('div', 'pm-row');
  top.style.alignItems = 'center';
  const bal = h('div', 'pm-chip', `${coinSvg(34)} <span>${p.coins}</span> coins`);
  const tabs = ['monsters', 'hats'].map(k => {
    const b = h('div', `pm-tab${k === tab ? ' on' : ''}`, k === 'monsters' ? 'Monster friends' : 'Hats');
    onTap(b, () => { o.close(); treasureShop(onChange, k); }, { sound: 'nav' });
    return b;
  });
  top.append(...tabs, bal);
  card.append(top);
  const grid = h('div', 'pm-row');
  grid.style.cssText = 'gap:14px;max-height:340px;overflow-y:auto;padding:6px 4px 10px';
  const done = () => { o.close(); onChange && onChange(); refreshAvatars(); };
  const buy = (price, give, line) => {
    if (!store.spendCoins(price)) { sfx('locked'); say('ui_need_coins'); toast(`You need ${price} coins. Keep playing!`); return; }
    give(); sfx('unlock'); confetti(40); say(line); done();
  };
  const priceTag = (owned, using, price) => using ? 'Using' : owned ? 'Use' : coinSvg(20) + price;
  if (tab === 'monsters') {
    const unlocked = LETTERS.filter(L => p.unlocked.includes(L));
    if (!unlocked.length) grid.innerHTML = `<p style="font-size:20px;color:#1c9886;padding:30px 0">Learn letters in Level 1 to meet monsters for the shop!</p>`;
    for (const L of unlocked) {
      const key = 'm' + L, owned = p.avatars.includes(key), using = me?.avatar === key;
      const cell = h('div', 'pm-shopcell', `<div class="pic${using ? ' using' : ''}"><img src="m-${L}.png" alt="" style="position:absolute;width:150%;left:-25%;top:-4%;max-width:none"></div><div class="price${owned ? ' owned' : ''}">${priceTag(owned, using, AVATAR_PRICE)}</div>`);
      grid.append(cell);
      onTap(cell, () => (owned || using) ? (store.setAvatar(key), sfx('sparkle'), done()) : buy(AVATAR_PRICE, () => { store.ownAvatar(key); store.setAvatar(key); }, 'ui_got_friend'), { sound: null });
    }
  } else {
    const off = h('div', 'pm-shopcell', `<div class="pic${!me?.hat ? ' using' : ''}" style="display:flex;align-items:center;justify-content:center;font:900 18px Nunito;color:#8aa">None</div><div class="price owned">${me?.hat ? 'Take off' : 'Using'}</div>`);
    grid.append(off);
    onTap(off, () => { store.setHat(null); sfx('pop'); done(); }, { sound: null });
    for (const hat of HATS) {
      const owned = p.hats.includes(hat.id), using = me?.hat === hat.id;
      const cell = h('div', 'pm-shopcell', `<div class="pic${using ? ' using' : ''}" style="display:flex;align-items:center;justify-content:center">${hatSvg(hat.id, 80)}</div><div class="price${owned ? ' owned' : ''}">${priceTag(owned, using, hat.price)}</div>`);
      cell.title = hat.name;
      grid.append(cell);
      onTap(cell, () => owned ? (store.setHat(hat.id), sfx('sparkle'), say('ui_got_hat'), done()) : buy(hat.price, () => { store.ownHat(hat.id); store.setHat(hat.id); }, 'ui_got_hat'), { sound: null });
    }
  }
  card.append(grid);
  const close = h('div', 'pm-btn alt', 'CLOSE');
  card.append(close);
  const o = overlay(card, { closeOnDim: true });
  onTap(close, () => o.close(), { sound: 'nav' });
  say('ui_treasure');
}
// avatars in the header badge are drawn once per screen; redraw after a purchase
let avatarRenderer = null;
export function onAvatarChange(fn) { avatarRenderer = fn; }
function refreshAvatars() { avatarRenderer && avatarRenderer(); }

/**
 * Lock a level card (261 x 275 at x, 293): the lock sits in the card's picture box with the
 * same 20px inset as the artwork, and the card's Play button is greyed out.
 */
export function lockLevel(root, x, need, playEls = [], n) {
  const panel = box(x + 19, 372, 223, 182, '');
  panel.className = 'pm-lockpanel';
  panel.innerHTML = `${lockSvg(58)}<b>Locked</b><div>${need}</div>`;
  root.append(panel);
  playEls.forEach(e => e && e.classList.add('pm-locked-play'));
  // the whole card (and its Play button) explains what opens it
  const hit = box(x, 293, 261, 330, '');
  hit.style.zIndex = 16;
  root.append(hit);
  onTap(hit, () => { animate(panel, 'shake'); say(`ui_lock_level_${n}`); }, { sound: 'locked', cls: 'cursor-pointer' });
  return panel;
}
