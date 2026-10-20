// Web Audio engine: background music (looping, ducked under narration), SFX and voice lines.
import { settings } from './store.js';

const Ctx = window.AudioContext || window.webkitAudioContext;
const ctx = new Ctx();
const master = ctx.createGain(); master.connect(ctx.destination);
const musicBus = ctx.createGain(); musicBus.connect(master);
const sfxBus = ctx.createGain(); sfxBus.connect(master);
const voiceBus = ctx.createGain(); voiceBus.connect(master);

const cache = new Map();
const missing = new Set(); // files that 404 (newer content is voiced by speech synthesis instead)
function load(url) {
  if (missing.has(url)) return Promise.resolve(null);
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(r => { if (!r.ok) { if (r.status === 404) missing.add(url); throw new Error(url); } return r.arrayBuffer(); })
      .then(b => new Promise((res, rej) => ctx.decodeAudioData(b, res, rej)))
      .catch(e => { cache.delete(url); if (!missing.has(url)) console.warn('audio', e); return null; }));
  }
  return cache.get(url);
}

export function unlock() {
  if (ctx.state !== 'running') ctx.resume();
  // iOS: play a silent buffer inside the gesture
  const b = ctx.createBuffer(1, 1, 22050); const s = ctx.createBufferSource(); s.buffer = b; s.connect(master); s.start(0);
}
document.addEventListener('pointerdown', () => { if (ctx.state !== 'running') ctx.resume(); }, { capture: true });
document.addEventListener('visibilitychange', () => { document.hidden ? ctx.suspend() : ctx.resume(); });

export function applySettings() {
  const s = settings();
  const t = ctx.currentTime;
  musicBus.gain.setTargetAtTime(s.musicOn ? s.music * (speaking ? 0.35 : 1) : 0, t, 0.15);
  sfxBus.gain.setTargetAtTime(s.sfxOn ? s.sfx : 0, t, 0.05);
  voiceBus.gain.setTargetAtTime(s.narrationOn ? s.narration : 0, t, 0.05);
}

// ---------- SFX ----------
export const SFX = ['tap', 'pop', 'nav', 'correct', 'wrong', 'complete', 'cheer', 'star', 'unlock', 'flip', 'page', 'whistle', 'chug', 'drop', 'sparkle', 'key', 'giggle', 'match', 'locked'];
SFX.forEach(n => load(`sfx-${n}.mp3`));
export async function sfx(name, gain = 1) {
  const buf = await load(`sfx-${name}.mp3`);
  if (!buf) return;
  const s = ctx.createBufferSource(); s.buffer = buf;
  const g = ctx.createGain(); g.gain.value = gain;
  s.connect(g); g.connect(sfxBus); s.start();
}

// ---------- voice ----------
let current = null, currentRes = null;
let speaking = false;
let seq = 0;
let startedAt = 0;
export const isSpeaking = () => speaking;

export function preload(...keys) { keys.forEach(k => { if (!ttsOnly.has(k)) load(`v-${k}.mp3`); }); }

// ---------- speech synthesis fallback ----------
// Lines without a recorded mp3 are spoken by the device voice. Text comes from
// registerLines(), or is derived from the key (w_<word>, tts:<text>).
const LINES = {};
const ttsOnly = new Set(); // registered lines have no recording, so skip the fetch
export function registerLines(map) { Object.assign(LINES, map); Object.keys(map).forEach(k => ttsOnly.add(k)); }
function textFor(key) {
  if (key.startsWith('tts:')) return key.slice(4);
  if (LINES[key]) return LINES[key];
  if (key.startsWith('w_')) return key.slice(2).replace(/-/g, ' ');
  return null;
}
const synth = window.speechSynthesis;
let ttsVoice = null;
function pickVoice() {
  if (!synth || ttsVoice) return ttsVoice;
  const vs = synth.getVoices().filter(v => /^en(-|_|$)/i.test(v.lang));
  ttsVoice = vs.find(v => /samantha|aria|jenny|female|zira|karen|google us/i.test(v.name)) || vs.find(v => /en-us/i.test(v.lang)) || vs[0] || null;
  return ttsVoice;
}
synth?.addEventListener?.('voiceschanged', () => { ttsVoice = null; pickVoice(); });
let ttsActive = false;
function tts(text, my, onWord) {
  return new Promise(res => {
    if (my !== seq) return res(false);
    const s = settings();
    let done = false, timer = 0;
    const finish = ok => {
      if (done) return; done = true; clearTimeout(timer);
      if (currentRes === finish) currentRes = null;
      ttsActive = false; speaking = false; applySettings();
      res(ok && my === seq);
    };
    currentRes = finish; speaking = true; ttsActive = true; applySettings();
    startedAt = ctx.currentTime;
    // engines without voices never fire onstart/onend: give up if speech has not started in 2.5s;
    // once it starts, only a generous reading-time cap applies so slow voices are not cut off
    timer = setTimeout(() => finish(true), !synth || !s.narrationOn ? 1200 + text.length * 95 : 2500);
    if (!synth || !s.narrationOn) return;
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.82; u.pitch = 1.15; u.volume = Math.max(0, Math.min(1, s.narration));
      const v = pickVoice(); if (v) u.voice = v;
      u.onstart = () => { clearTimeout(timer); timer = setTimeout(() => finish(true), 5000 + text.length * 200); };
      u.onend = () => finish(true);
      u.onerror = () => finish(true);
      if (onWord) u.onboundary = e => { if (!e.name || e.name === 'word') onWord(e.charIndex); };
      synth.speak(u);
    } catch { finish(true); }
  });
}
/** Speak arbitrary text with the device voice; onWord(charIndex) fires per word where supported. */
export function speak(text, onWord) { stopVoice(); return tts(text, seq, onWord); }

function play(key, my) {
  if (key.startsWith('tts:')) return tts(key.slice(4), my);
  if (ttsOnly.has(key)) return tts(LINES[key], my);
  return load(`v-${key}.mp3`).then(buf => {
    if (buf || my !== seq) return buf;
    const text = textFor(key);
    return text ? tts(text, my) : null;
  }).then(buf => typeof buf === 'boolean' ? buf : new Promise(res => {
    if (!buf || my !== seq) return res(false);
    const s = ctx.createBufferSource(); s.buffer = buf; s.connect(voiceBus);
    current = s; currentRes = res; speaking = true; applySettings();
    s.onended = () => { if (current === s) { current = null; currentRes = null; speaking = false; applySettings(); } res(my === seq); };
    s.start();
    startedAt = ctx.currentTime;
  }));
}

/** Plays a voice line (stopping any other); resolves true when it finishes, false if interrupted. */
export function say(key) { stopVoice(); return play(key, seq); }

/** Plays several lines back to back; any later say()/stopVoice() cancels the rest. */
export async function sayAll(keys, gap = 250) {
  stopVoice();
  const my = seq;
  for (const k of keys) {
    const ok = await play(k, my);
    if (!ok || my !== seq) return false;
    await wait(gap);
  }
  return true;
}
export const voiceTime = () => ctx.currentTime - startedAt;
export function stopVoice() {
  seq++;
  if (current) { try { current.onended = null; current.stop(); } catch {} current = null; }
  if (ttsActive) { try { synth.cancel(); } catch {} }
  if (currentRes) { const r = currentRes; currentRes = null; r(false); }
  speaking = false; applySettings();
}
export const wait = ms => new Promise(r => setTimeout(r, ms));

// ---------- music ----------
let musicSrc = null, musicName = null, musicGain = null;
export async function music(name) {
  if (name === musicName) return;
  musicName = name;
  if (musicSrc) {
    const old = musicSrc, og = musicGain;
    og.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    setTimeout(() => { try { old.stop(); } catch {} }, 1500);
    musicSrc = null;
  }
  if (!name) return;
  const buf = await load(`music-${name}.mp3`);
  if (!buf || musicName !== name) return;
  const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
  const g = ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(1, ctx.currentTime, 0.6);
  s.connect(g); g.connect(musicBus); s.start();
  musicSrc = s; musicGain = g;
}

applySettings();
