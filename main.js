// PhonoMonsters entry point.
import { go, current, h, overlay, onTap } from './core.js';
import * as store from './store.js';
import { parentGate } from './ui.js';
import { stopVoice } from './audio.js';
import './s-auth.js';
import './s-tabs.js';
import './s-parents.js';
import './s-level1.js';
import './s-levels.js';
import './s-games.js';
import './s-reading.js';
import './s-reward.js';

go('splash');
import * as audio from './audio.js';
window.PM = { go, store, audio };

// warm the image cache so screens never flash in empty
import templates from './templates.js';
import { LETTERS } from './data.js';
setTimeout(() => {
  const srcs = new Set();
  for (const html of Object.values(templates)) for (const m of html.matchAll(/img-[\w.]+/g)) srcs.add(m[0]);
  LETTERS.forEach(L => srcs.add(`m-${L}.png`));
  [...srcs].forEach((s, i) => setTimeout(() => { const im = new Image(); im.src = s; }, i * 15));
}, 300);

// play-time tracking + optional screentime limit (set by parents)
const PLAYING = new Set(['splash', 'signup', 'login', 'profiles', 'settings', 'progress']);
let breakShown = false;
setInterval(() => {
  if (document.hidden || !store.profile() || PLAYING.has(current())) return;
  store.addMinute();
  const limit = store.settings().screentime;
  const mins = store.progress().minutes[store.today()] || 0;
  if (limit && mins >= limit && !breakShown) {
    breakShown = true;
    stopVoice();
    const card = h('div', 'relative pop bg-[#eafbfe] border-[10px] border-[#b3e8ff] rounded-[20px] shadow-[0_6px_0_#78bddb] w-[600px] px-10 py-8 flex flex-col items-center gap-4 text-center');
    card.innerHTML = `<img src="m-Z.png" class="h-[200px]" alt=""><p class="m-0 font-['KitRounded'] text-[42px] text-[#109586]">Time for a break!</p><p class="m-0 font-['Nunito'] text-[22px] text-[#333]">You played for ${mins} minutes today. Great learning!</p>`;
    const btn = h('div', "w-[300px] h-[70px] rounded-[10px] bg-[#fa96ba] shadow-[0_6px_0_#e17b9f] flex items-center justify-center font-['Nunito'] font-extrabold text-[24px] text-white", 'Grown-up: continue');
    card.append(btn);
    const o = overlay(card);
    onTap(btn, () => parentGate(() => { o.close(); }));
  }
}, 60000);
