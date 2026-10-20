// Gamification UI: coin/level pill, badges, daily streak, treasure (avatar) shop.
import { h, box, onTap, overlay, stage, confetti, toast } from './core.js';
import * as store from './store.js';
import { sfx, say, speak, isSpeaking } from './audio.js';
import { LETTERS, VOWELS } from './data.js';

export const coinSvg = (s = 34) => `<svg class="pm-coin" viewBox="0 0 40 40" width="${s}" height="${s}"><circle cx="20" cy="22" r="17" fill="#e8a800"/><circle cx="20" cy="19" r="17" fill="#ffc843"/><circle cx="20" cy="19" r="12" fill="none" stroke="#fff3c4" stroke-width="3"/><path d="M20 11.5l2.3 4.8 5.2.6-3.9 3.6 1 5.2-4.6-2.6-4.6 2.6 1-5.2-3.9-3.6 5.2-.6z" fill="#fff"/></svg>`;
export const lockSvg = (s = 64) => `<svg viewBox="0 0 64 64" width="${s}" height="${s}"><path d="M18 28v-8a14 14 0 0128 0v8" fill="none" stroke="#6b6b6b" stroke-width="7" stroke-linecap="round"/><rect x="10" y="27" width="44" height="32" rx="8" fill="#f9c105"/><rect x="10" y="27" width="44" height="10" rx="5" fill="#ffd84a"/><circle cx="32" cy="42" r="5" fill="#3a3a3a"/><rect x="29.5" y="44" width="5" height="9" rx="2.5" fill="#3a3a3a"/></svg>`;

// ---------- badges ----------
const lettersDone = p => Object.keys(p.letters).length;
export const BADGES = [
  { id: 'first_friend', icon: '🐣', name: 'First Friend', desc: 'Learn your first letter', test: p => lettersDone(p) >= 1 },
  { id: 'monster_pal', icon: '🤝', name: 'Monster Pal', desc: 'Learn 5 letters', test: p => lettersDone(p) >= 5 },
  { id: 'vowel_hero', icon: '🅰️', name: 'Vowel Hero', desc: 'Learn A, E, I, O and U', test: p => VOWELS.every(L => p.letters[L]) },
  { id: 'alphabet_ace', icon: '🔤', name: 'Alphabet Ace', desc: 'Learn all 26 letters', test: p => LETTERS.every(L => p.letters[L]) },
  { id: 'sound_sleuth', icon: '🔊', name: 'Sound Sleuth', desc: 'Finish Sound Practice 3 times', test: p => p.games.sound >= 3 },
  { id: 'memory_master', icon: '🧠', name: 'Memory Master', desc: 'Finish Memory Matching 3 times', test: p => p.games.memory >= 3 },
  { id: 'word_builder', icon: '🧱', name: 'Word Builder', desc: 'Finish Blending Practice 3 times', test: p => p.games.blend >= 3 },
  { id: 'bookworm', icon: '📚', name: 'Bookworm', desc: 'Read 3 stories', test: p => (p.games.story || 0) >= 3 },
  { id: 'train_driver', icon: '🚂', name: 'Train Driver', desc: 'Finish 3 Level 3 lessons', test: p => p.levels[3] >= 3 },
  { id: 'blend_boss', icon: '🌀', name: 'Blend Boss', desc: 'Finish 3 Level 4 lessons', test: p => p.levels[4] >= 3 },
  { id: 'digraph_detective', icon: '🔍', name: 'Digraph Detective', desc: 'Finish a Level 5 lesson', test: p => p.levels[5] >= 1 },
  { id: 'word_wizard', icon: '🧙', name: 'Word Wizard', desc: 'Beat the Level 6 boss', test: p => p.levels[6] >= 1 },
  { id: 'superstar', icon: '🌟', name: 'Superstar', desc: 'Get 3 stars 5 times', test: p => p.perfect >= 5 },
  { id: 'streak_3', icon: '🔥', name: 'On Fire', desc: 'Play 3 days in a row', test: p => (p.streak.best || 0) >= 3 },
  { id: 'streak_7', icon: '🏆', name: 'Super Streak', desc: 'Play 7 days in a row', test: p => (p.streak.best || 0) >= 7 },
  { id: 'treasure', icon: '💰', name: 'Treasure Hunter', desc: 'Earn 300 coins', test: p => p.xp >= 300 },
];

/** Award any badges whose conditions are now met, announcing each one. */
export function checkBadges() {
  const p = store.progress();
  const fresh = BADGES.filter(b => !p.badges[b.id] && b.test(p) && store.earnBadge(b.id));
  fresh.forEach((b, i) => setTimeout(() => announce(b), 600 + i * 2600));
  return fresh;
}
async function announce(b) {
  // let current narration (lesson complete, streak, level up) finish first; give up waiting after ~6s
  for (let i = 0; i < 30 && isSpeaking(); i++) await new Promise(r => setTimeout(r, 200));
  const t = h('div', 'pm-toastbadge', `<div class="ic">${b.icon}</div><div><small>New badge!</small><b>${b.name}</b></div>`);
  stage.append(t);
  sfx('unlock'); confetti(30);
  speak(`New badge! ${b.name}!`);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 2300);
}

export function badgeGrid(container) {
  const p = store.progress();
  for (const b of BADGES) {
    const got = !!p.badges[b.id];
    const el = h('div', 'pm-badge' + (got ? '' : ' locked'), `<div class="ic">${b.icon}</div><b>${b.name}</b><span>${b.desc}</span>`);
    container.append(el);
    onTap(el, () => speak(got ? `${b.name}! ${b.desc}.` : `To earn this badge: ${b.desc}.`), { sound: got ? 'sparkle' : 'locked' });
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
    const fresh = store.progress();
    pill.querySelector('b').textContent = fresh.coins;
  }), { sound: 'pop' });
  return pill;
}

// ---------- daily check-in ----------
export function dailyCheckIn() {
  const r = store.checkIn();
  if (!r) return;
  const card = h('div', 'pm-card pop');
  card.style.width = '560px';
  const flames = Array.from({ length: Math.min(7, r.day) }, () => '🔥').join('');
  card.innerHTML = `<h2>Day ${r.day} streak!</h2><div style="font-size:54px;line-height:1">${flames}</div>
    <p>${r.day > 1 ? "Welcome back!" : "Hello, friend!"} Here is your daily treasure.</p>
    <div class="pm-chip" style="font-size:30px;height:62px">${coinSvg(44)} +${r.bonus} coins</div>`;
  const ok = h('div', 'pm-btn', 'YAY!');
  card.append(ok);
  const o = overlay(card, { closeOnDim: true });
  onTap(ok, () => { o.close(); checkBadges(); }, { sound: 'sparkle' });
  sfx('complete');
  speak(r.day > 1 ? `Day ${r.day}! You are on a streak! Here are ${r.bonus} coins.` : `Welcome! Here are ${r.bonus} coins to start your day.`);
}

// ---------- treasure shop: spend coins on monster avatars ----------
const AVATAR_PRICE = 30;
export function treasureShop(onChange) {
  const p = store.progress();
  const me = store.profile();
  const card = h('div', 'pm-card pop');
  card.style.width = '900px';
  card.innerHTML = `<h2>Treasure Shop</h2><p style="font-size:19px">Spend your coins on monster friends to use as your picture! Learn letters to find more.</p>`;
  const bal = h('div', 'pm-chip', `${coinSvg(34)} <span>${p.coins}</span> coins`);
  card.append(bal);
  const grid = h('div', 'pm-row');
  grid.style.cssText = 'gap:14px;max-height:330px;overflow-y:auto;padding:6px 4px 10px';
  const unlocked = LETTERS.filter(L => p.unlocked.includes(L));
  if (!unlocked.length) grid.innerHTML = `<p style="font-size:20px;color:#1c9886;padding:30px 0">Learn letters in Level 1 to meet monsters for the shop!</p>`;
  for (const L of unlocked) {
    const key = 'm' + L;
    const owned = p.avatars.includes(key);
    const using = me?.avatar === key;
    const cell = h('div', '', '');
    cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;width:104px;cursor:pointer';
    cell.innerHTML = `<div style="position:relative;width:92px;height:92px;border-radius:50%;background:#fff;box-shadow:${using ? '0 0 0 5px #fa96ba' : '0 4px 0 #b3e8ff'};overflow:hidden"><img src="m-${L}.png" alt="" style="position:absolute;width:150%;left:-25%;top:-4%;max-width:none"></div>
      <div style="font:900 16px Nunito;color:${owned ? '#1c9886' : '#7a4b00'};display:flex;align-items:center;gap:4px">${using ? 'Using' : owned ? 'Use' : coinSvg(20) + AVATAR_PRICE}</div>`;
    grid.append(cell);
    onTap(cell, () => {
      if (owned || using) { store.setAvatar(key); sfx('sparkle'); o.close(); onChange && onChange(); refreshAvatars(); return; }
      if (!store.spendCoins(AVATAR_PRICE)) { sfx('locked'); toast(`You need ${AVATAR_PRICE} coins. Keep playing!`); return; }
      store.ownAvatar(key); store.setAvatar(key);
      sfx('unlock'); confetti(40); speak(`You got monster ${L}!`);
      o.close(); onChange && onChange(); refreshAvatars();
    }, { sound: null });
  }
  card.append(grid);
  const close = h('div', 'pm-btn alt', 'CLOSE');
  card.append(close);
  const o = overlay(card, { closeOnDim: true });
  onTap(close, () => o.close(), { sound: 'nav' });
  say('ui_shop');
}
// avatars in the header badge are drawn once per screen; redraw after a purchase
let avatarRenderer = null;
export function onAvatarChange(fn) { avatarRenderer = fn; }
function refreshAvatars() { avatarRenderer && avatarRenderer(); }

/** Grey lock panel over a level/story card. */
export function lockOver(root, x, y, w, hh, need, onTap_) {
  const l = box(x, y, w, hh, 'pm-lock', `${lockSvg(70)}<div>Locked</div><div class="need">${need}</div>`);
  l.className = 'pm-lock';
  root.append(l);
  onTap(l, () => { onTap_ && onTap_(); l.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }], { duration: 350 }); speak(`This level is locked. ${need} to open it.`); }, { sound: 'locked' });
  return l;
}
