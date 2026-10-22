// Praise / retry voice + the mic attempt flow used by lessons.
import { say, sfx, wait } from './audio.js';
import { toast, pick, confetti } from './core.js';
import { PRAISE, TRY_AGAIN } from './data.js';
import { listen } from './speech.js';
import { waveform } from './ui.js';

export async function praise(big = false) {
  sfx('correct');
  if (big) confetti(40);
  await wait(250);
  return say(`praise_${Math.floor(Math.random() * PRAISE.length)}`);
}
export async function tryAgain() {
  sfx('wrong');
  await wait(200);
  return say(`try_${Math.floor(Math.random() * TRY_AGAIN.length)}`);
}

let busy = false;
/** Show the pink waveform over the mic, listen, then react. */
export async function micAttempt(root, pos, key, expected) {
  if (busy) return null;
  busy = true;
  sfx('pop');
  const wv = waveform(pos.x, pos.y, pos.w || 120, pos.h || 96);
  root.append(wv);
  let r;
  try { r = await listen(key, expected); } finally { wv.remove(); busy = false; }
  if (r.verdict === 'great') { await praise(true); }
  else if (r.verdict === 'good') { sfx('star'); await say('ui_great_try'); }
  else if (r.verdict === 'denied') toast('Please allow the microphone to practise speaking', 3000);
  else toast('I could not hear you. Tap the mic and say it loud!', 2600);
  return r;
}
