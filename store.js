// Local persistence (localStorage). Accounts, child profiles, progress, settings.
// Everything stays on the device; no server needed for the prototype.

const KEY = 'phonomonsters.v1';

const DEFAULT_SETTINGS = { sfx: 0.9, narration: 0.95, music: 0.35, sfxOn: true, musicOn: true, narrationOn: true, parentalLock: true, screentime: 0 };

const newProgress = () => ({
  letters: {},        // L -> { done: true, at }
  unlocked: [],       // monster letters unlocked
  levels: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }, // lessons completed per level
  games: { blend: 0, sound: 0, memory: 0, story: 0 },
  accuracy: [],       // { key, score, at }
  results: {},        // L -> { right, wrong }
  minutes: {},        // yyyy-mm-dd -> minutes played
  stars: {},          // yyyy-mm-dd -> stars earned that day
  stories: { 1: 0 },
  // gamification
  coins: 0,           // spendable
  xp: 0,              // lifetime coins earned, drives the player level
  best: {},           // activity key -> best star rating (1-3)
  perfect: 0,         // number of 3-star finishes
  badges: {},         // badge id -> earned at
  streak: { last: null, count: 0, best: 0 },
  avatars: [],        // monster avatars bought in the treasure shop
  allLevels: false,   // grown-up override: every level open
});

// older saves are missing the newer fields
function upgrade(p) {
  const fresh = newProgress();
  for (const k of Object.keys(fresh)) if (p[k] === undefined) p[k] = fresh[k];
  for (const k of Object.keys(fresh.levels)) p.levels[k] ??= 0;
  return p;
}

let db = load();

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && d.accounts) return d;
  } catch {}
  return { accounts: {}, session: null, settings: { ...DEFAULT_SETTINGS } };
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} }

async function hash(s) {
  try {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('pm::' + s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  } catch { return 'plain:' + s; }
}

const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// local calendar day (toISOString() is UTC, which rolls the day over mid-afternoon in Asia)
export const today = () => ymd(new Date());
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return ymd(d); };

// ---------- accounts ----------
export async function signUp(email, password) {
  email = email.trim().toLowerCase();
  if (db.accounts[email]) throw new Error('That email already has an account. Please sign in.');
  db.accounts[email] = {
    pass: await hash(password), created: Date.now(),
    profiles: [
      { id: 'p1', name: 'Jane Doe', avatar: 'jane', progress: newProgress() },
      { id: 'p2', name: 'Victor', avatar: 'victor', progress: newProgress() },
      { id: 'p3', name: 'Rebecca', avatar: 'rebecca', progress: newProgress() },
    ],
  };
  db.session = { email, profile: null };
  save();
}

export async function signIn(user, password) {
  user = user.trim().toLowerCase();
  const email = db.accounts[user] ? user : Object.keys(db.accounts).find(e => e.split('@')[0] === user);
  if (!email) throw new Error('No account found. Tap "Sign up" to make one.');
  if (db.accounts[email].pass !== await hash(password)) throw new Error('That password is not right. Try again!');
  db.session = { email, profile: null };
  save();
}

export function signOut() { db.session = null; save(); }
export const signedIn = () => !!(db.session && db.accounts[db.session.email]);
export const account = () => signedIn() ? db.accounts[db.session.email] : null;
export const hasAccounts = () => Object.keys(db.accounts).length > 0;

// ---------- profiles ----------
export const profiles = () => account()?.profiles || [];
export function selectProfile(id) { db.session.profile = id; save(); }
export const profile = () => profiles().find(p => p.id === db.session?.profile) || null;
export function addProfile(name, avatar) {
  const acc = account();
  const p = { id: 'p' + Date.now(), name: name.trim() || 'Friend', avatar, progress: newProgress() };
  acc.profiles.push(p);
  save();
  return p;
}
export function removeProfile(id) {
  const acc = account();
  acc.profiles = acc.profiles.filter(p => p.id !== id);
  if (db.session.profile === id) db.session.profile = acc.profiles[0]?.id || null;
  save();
}

// ---------- progress ----------
let scratch = null; // progress used when no child is selected (never saved)
export const progress = () => { const p = profile(); return p ? upgrade(p.progress) : (scratch ||= newProgress()); };

export function completeLetter(L) {
  const p = progress();
  const firstTime = !p.letters[L];
  p.letters[L] = { done: true, at: Date.now() };
  if (!p.unlocked.includes(L)) p.unlocked.push(L);
  addStar();
  save();
  return firstTime;
}
export function unlockAll() {
  const p = progress();
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(L => { if (!p.unlocked.includes(L)) p.unlocked.push(L); });
  p.allLevels = true;
  save();
}
export const isUnlocked = L => progress().unlocked.includes(L);

export function completeLesson(level) { const p = progress(); p.levels[level] = (p.levels[level] || 0) + 1; addStar(); save(); }
export function completeGame(name) { const p = progress(); p.games[name] = (p.games[name] || 0) + 1; addStar(); save(); }
export function completeStory(n) { const p = progress(); p.stories[n] = (p.stories[n] || 0) + 1; p.games.story = (p.games.story || 0) + 1; addStar(); save(); }

export function addStar() { const p = progress(); const d = today(); p.stars[d] = (p.stars[d] || 0) + 1; }
export const starsToday = () => Math.min(10, progress().stars[today()] || 0);

export function recordAccuracy(key, score) {
  const p = progress();
  p.accuracy.push({ key, score, at: Date.now() });
  if (p.accuracy.length > 300) p.accuracy.splice(0, p.accuracy.length - 300);
  save();
}
export function recordAnswer(L, right) {
  const p = progress();
  const r = (p.results[L] ||= { right: 0, wrong: 0 });
  right ? r.right++ : r.wrong++;
  right ? run.right++ : run.wrong++;
  save();
}

// ---------- gamification ----------
// A "run" is one lesson / game from its first screen to the reward page.
const run = { right: 0, wrong: 0 };
export function startRun() { run.right = 0; run.wrong = 0; }
export const runMistakes = () => run.wrong;
export function mistake() { run.wrong++; }

/** Player level from lifetime XP: each level needs a little more than the last. */
export function levelInfo(xp = progress().xp) {
  let lv = 1, need = 40, base = 0;
  while (xp >= base + need) { base += need; lv++; need = 40 + (lv - 1) * 20; }
  return { level: lv, into: xp - base, need, frac: (xp - base) / need };
}
export function addCoins(n) {
  const p = progress();
  p.coins += n; if (n > 0) p.xp += n;
  save();
}
export function spendCoins(n) {
  const p = progress();
  if (p.coins < n) return false;
  p.coins -= n; save(); return true;
}

/**
 * Close the current run: rate it 1-3 stars from the mistakes made, pay out coins/XP.
 * @returns {{stars:number, coins:number, firstTime:boolean, before:object, after:object}}
 */
export function finishRun(key, { stars } = {}) {
  const p = progress();
  stars ??= run.wrong === 0 ? 3 : run.wrong <= 2 ? 2 : 1;
  const prev = p.best[key] || 0;
  const firstTime = !prev;
  const before = levelInfo(p.xp);
  let coins = 5 + stars * 5 + (firstTime ? 10 : 0) + Math.min(10, run.right);
  if (stars > prev) p.best[key] = stars;
  if (stars === 3) p.perfect++;
  p.coins += coins; p.xp += coins;
  startRun();
  save();
  return { stars, coins, firstTime, before, after: levelInfo(p.xp) };
}

/** Daily check-in: keeps the play streak and pays a daily bonus once per day. */
export function checkIn() {
  const p = progress(), d = today();
  if (p.streak.last === d) return null;
  p.streak.count = p.streak.last === yesterday() ? p.streak.count + 1 : 1;
  p.streak.best = Math.max(p.streak.best || 0, p.streak.count);
  p.streak.last = d;
  const bonus = 10 + Math.min(6, p.streak.count - 1) * 5;
  p.coins += bonus; p.xp += bonus;
  save();
  return { day: p.streak.count, bonus };
}

export function earnBadge(id) {
  const p = progress();
  if (p.badges[id]) return false;
  p.badges[id] = Date.now(); save(); return true;
}
export function ownAvatar(key) { const p = progress(); if (!p.avatars.includes(key)) p.avatars.push(key); save(); }
export function setAvatar(key) { const pr = profile(); if (pr) { pr.avatar = key; save(); } }

// Level gates: what has to be done before each level opens.
export const LEVEL_GATES = {
  1: null,
  2: { text: 'Learn 5 letters in Level 1', test: p => Object.keys(p.letters).length >= 5 },
  3: { text: 'Finish 2 lessons in Level 2', test: p => p.levels[2] >= 2 },
  4: { text: 'Finish 2 lessons in Level 3', test: p => p.levels[3] >= 2 },
  5: { text: 'Finish 2 lessons in Level 4', test: p => p.levels[4] >= 2 },
  6: { text: 'Finish 2 lessons in Level 5', test: p => p.levels[5] >= 2 },
};
export function levelOpen(n) { const p = progress(), g = LEVEL_GATES[n]; return !g || p.allLevels || g.test(p); }
export function addMinute() {
  if (!profile()) return;
  const p = progress(); const d = today();
  p.minutes[d] = (p.minutes[d] || 0) + 1;
  save();
}

// ---------- settings ----------
export const settings = () => (db.settings ||= { ...DEFAULT_SETTINGS });
export function setSetting(k, v) { settings()[k] = v; save(); }
