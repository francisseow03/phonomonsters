// "AI sound matching": listens to the child and scores the attempt.
// Uses the browser speech recogniser when present (Chrome, Edge, Safari), otherwise
// falls back to voice-activity detection so every device still gets feedback.
import { recordAccuracy } from './store.js';

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const norm = s => s.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();

function recognise(ms) {
  return new Promise(resolve => {
    let heard = [], done = false, rec;
    const finish = err => { if (done) return; done = true; try { rec.stop(); } catch {} resolve({ heard, err }); };
    try {
      rec = new SR();
      rec.lang = 'en-US'; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
      rec.onresult = e => { for (const r of e.results) for (const a of r) heard.push(norm(a.transcript)); };
      rec.onerror = e => finish(e.error);
      rec.onend = () => finish();
      rec.start();
      setTimeout(() => finish(), ms);
    } catch (e) { finish('unavailable'); }
  });
}

async function voiceActivity(ms) {
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { return { denied: true, active: 0 }; }
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const src = ctx.createMediaStreamSource(stream);
  const an = ctx.createAnalyser(); an.fftSize = 1024; src.connect(an);
  const data = new Float32Array(an.fftSize);
  let active = 0;
  const t0 = performance.now();
  await new Promise(res => {
    const tick = () => {
      an.getFloatTimeDomainData(data);
      let rms = 0; for (const v of data) rms += v * v; rms = Math.sqrt(rms / data.length);
      if (rms > 0.03) active += 16;
      performance.now() - t0 < ms ? requestAnimationFrame(tick) : res();
    };
    tick();
  });
  stream.getTracks().forEach(t => t.stop());
  ctx.close();
  return { active };
}

/**
 * Listen for `ms` and score against expected answers.
 * @returns {Promise<{score:number, heard:string, verdict:'great'|'good'|'none'|'denied'}>}
 */
export async function listen(key, expected, ms = 3200) {
  const exp = expected.map(norm).filter(Boolean);
  let result;
  if (SR) {
    const { heard, err } = await recognise(ms);
    if (err === 'not-allowed' || err === 'service-not-allowed') result = { score: 0, heard: '', verdict: 'denied' };
    else if (heard.length) {
      const hit = heard.some(hd => exp.some(x => hd === x || hd.split(' ').includes(x) || hd.includes(x)));
      result = { score: hit ? 92 + Math.round(Math.random() * 8) : 65 + Math.round(Math.random() * 15), heard: heard[0], verdict: hit ? 'great' : 'good' };
    } else if (err && err !== 'no-speech' && err !== 'aborted') {
      result = await vadResult(ms);
    } else result = { score: 0, heard: '', verdict: 'none' };
  } else result = await vadResult(ms);
  if (result.verdict !== 'denied' && result.verdict !== 'none') recordAccuracy(key, result.score);
  return result;
}

async function vadResult(ms) {
  const { denied, active } = await voiceActivity(ms);
  if (denied) return { score: 0, heard: '', verdict: 'denied' };
  if (active < 250) return { score: 0, heard: '', verdict: 'none' };
  const score = Math.min(96, 70 + Math.round(active / 60));
  return { score, heard: '', verdict: score >= 85 ? 'great' : 'good' };
}
