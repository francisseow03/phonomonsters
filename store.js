// Local persistence (localStorage). Accounts, child profiles, progress, settings.
// Everything stays on the device; no server needed for the prototype.

const KEY = 'phonomonsters.v1';

const DEFAULT_SETTINGS = { sfx: 0.9, narration: 0.95, music: 0.35, sfxOn: true, musicOn: true, narrationOn: true, parentalLock: true, screentime: 0 };

const newProgress = () => ({
  letters: {},        // L -> { done: true, at }
  unlocked: [],       // monster letters unlocked
  levels: { 1: 0, 2: 0, 3: 0, 4: 0 }, // lessons completed per level
  games: { blend: 0, sound: 0, memory: 0, story: 0 },
  accuracy: [],       // { key, score, at }
  results: {},        // L -> { right, wrong }
  minutes: {},        // yyyy-mm-dd -> minutes played
  stars: {},          // yyyy-mm-dd -> stars earned that day
  stories: { 1: 0 },
});

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

export const today = () => new Date().toISOString().slice(0, 10);

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
export const progress = () => profile()?.progress || newProgress();

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
  save();
}
export function addMinute() {
  if (!profile()) return;
  const p = progress(); const d = today();
  p.minutes[d] = (p.minutes[d] || 0) + 1;
  save();
}

// ---------- settings ----------
export const settings = () => (db.settings ||= { ...DEFAULT_SETTINGS });
export function setSetting(k, v) { settings()[k] = v; save(); }
