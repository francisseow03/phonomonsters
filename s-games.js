// Minigames: Sound Practice, Memory Matching, Blending Practice.
import { route, go, tpl, $, $$, h, box, onTap, shuffle, pick, animate } from './core.js';
import * as store from './store.js';
import { music, say, sayAll, sfx, preload, wait } from './audio.js';
import { lessonChrome, nextArrow, swapForImage, monsterSrc, picSrc, draggable, inside } from './ui.js';
import { praise, tryAgain } from './feedback.js';
import { LETTERS, BLEND_GAME_WORDS } from './data.js';
import { slug } from './voice.js';

const pool = () => { const u = store.progress().unlocked; return u.length >= 6 ? u : LETTERS; };
const back = () => go('minigames');

// ---------------- Sound Practice ----------------
const SOUND_ROUNDS = 8;
route('soundgame', (el, { round = 0, score = 0 } = {}) => {
  const t = tpl('soundgame');
  el.append(t);
  music('games');
  lessonChrome(t, { exit: ['312:268'], gear: ['312:282'], pause: ['312:285'] }, { exit: back });
  const L = pick(pool());
  preload(`snd_${L}`, `ph_${L}`);
  const mon = $(t, '312:305');
  swapForImage(mon, monsterSrc(L));
  mon.classList.remove('overflow-clip');
  const opts = shuffle([L, ...shuffle(LETTERS.filter(x => x !== L)).slice(0, 5)]);
  const tiles = ['313:336', '313:338', '313:339', '313:340', '313:341', '313:342'];
  const texts = ['313:343', '313:346', '313:347', '313:348', '313:349', '313:350'];
  let answered = false;
  const progress = box(500, 120, 194, 24, 'flex gap-[6px] items-center justify-center');
  for (let k = 0; k < SOUND_ROUNDS; k++) progress.append(h('div', `size-[16px] rounded-full ${k < round ? 'bg-[#ffc843]' : k === round ? 'bg-[#1fa7e1]' : 'bg-[#b3e8ff]'}`));
  t.append(progress);
  const play = () => { say(`snd_${L}`); animate(mon, 'wiggle'); };
  onTap($(t, '312:295'), play);
  onTap(mon, play, { sound: 'giggle' });
  tiles.forEach((id, k) => {
    const tile = $(t, id), txt = $(t, texts[k]);
    txt.querySelector('p').textContent = opts[k];
    txt.style.pointerEvents = 'none';
    onTap(tile, async () => {
      if (answered) return;
      if (opts[k] === L) {
        answered = true;
        store.recordAnswer(L, true);
        animate(tile, 'bounce'); animate(mon, 'bounce');
        await praise();
        await wait(300);
        if (round + 1 < SOUND_ROUNDS) go('soundgame', { round: round + 1, score: score + 1 });
        else { store.completeGame('sound'); go('reward', { replay: ['soundgame', {}], done: ['minigames', {}] }); }
      } else {
        store.recordAnswer(L, false);
        animate(tile, 'shake'); tryAgain();
        setTimeout(play, 1400);
      }
    }, { sound: null });
  });
  round === 0 ? sayAll(['ui_sound_game', `snd_${L}`]) : setTimeout(play, 400);
});

// ---------------- Memory Matching ----------------
const CARD_X = [91, 296, 501, 706, 911], CARD_Y = [197, 449];
route('memory', el => {
  const t = tpl('memory');
  el.append(t);
  music('games');
  const remove = ['3759', '3765', '3762', '3766', '3763', '3767', '3764', '3769', '3770', '3768', '3774', '3782', '3778', '3783', '3779', '3784', '3780', '3785', '3781', '3786', '3771', '3794', '3790', '3795', '3791', '3796', '3792', '3797', '3793', '3798'];
  remove.forEach(n => $(t, '332:' + n)?.remove());
  lessonChrome(t, { exit: ['332:3724'], gear: ['332:3735'], help: ['332:3741'] }, { exit: back, help: () => say('ui_memory') });
  onTap($(t, '332:3738'), () => go('memory'), { sound: 'flip' });
  onTap($(t, '332:3753'), () => go('memory'), { sound: 'nav' });
  const letters = shuffle(pool()).slice(0, 5);
  letters.forEach(L => preload(`ph_${L}`));
  const deck = shuffle(letters.flatMap(L => [{ L, face: 'letter' }, { L, face: 'monster' }]));
  let open = [], matched = 0, busy = false;
  const backHTML = `<div class="absolute left-[10px] top-[12px] w-[165px] h-[203px] overflow-hidden rounded-[2px]"><img src="img-59f2c243cafa.png" class="absolute max-w-none h-[410.84%] left-[-472.12%] top-[-89.16%] w-[723.64%]" alt=""><div class="absolute inset-0 bg-[#01a4db] opacity-30"></div></div>`;
  const faceHTML = c => c.face === 'letter'
    ? `<div class="absolute inset-0 flex items-center justify-center"><p class="m-0 font-['Cal_Sans'] text-[150px] text-[#109586] leading-none">${c.L}</p></div>`
    : `<img src="${monsterSrc(c.L)}" class="absolute inset-[16px] size-[calc(100%-32px)] object-contain" alt="">`;
  const flip = (c, up) => new Promise(res => {
    c.el.classList.add('flip-out');
    setTimeout(() => { c.el.innerHTML = up ? faceHTML(c) : backHTML; c.el.classList.remove('flip-out'); c.el.classList.add('flip-in'); setTimeout(() => { c.el.classList.remove('flip-in'); res(); }, 170); }, 160);
  });
  deck.forEach((c, k) => {
    c.el = box(CARD_X[k % 5], CARD_Y[Math.floor(k / 5)], 185, 228, 'bg-[#fbfdfe] rounded-[10px] shadow-[0px_6px_10px_0px_rgba(0,0,0,0.15)]', backHTML);
    t.append(c.el);
    onTap(c.el, async () => {
      if (busy || c.up || c.done) return;
      c.up = true; sfx('flip');
      await flip(c, true);
      say(`ph_${c.L}`);
      open.push(c);
      if (open.length < 2) return;
      busy = true;
      const [a, b] = open; open = [];
      if (a.L === b.L) {
        a.done = b.done = true; matched++;
        store.recordAnswer(a.L, true);
        await wait(500); sfx('match');
        [a, b].forEach(x => { x.el.classList.add('glow'); animate(x.el, 'bounce'); });
        busy = false;
        if (matched === letters.length) {
          await wait(600); await praise(true);
          store.completeGame('memory');
          go('reward', { replay: ['memory', {}], done: ['minigames', {}] });
        }
      } else {
        await wait(900); sfx('wrong', 0.5);
        await Promise.all([flip(a, false), flip(b, false)]);
        a.up = b.up = false; busy = false;
      }
    }, { sound: null });
  });
  say('ui_memory');
});

// ---------------- Blending Practice ----------------
const BLEND_ROUNDS = 6;
route('blendgame', (el, { i = 0, words } = {}) => {
  words ||= shuffle(BLEND_GAME_WORDS).slice(0, BLEND_ROUNDS);
  const word = words[i], W = word.toUpperCase().split('');
  preload(`w_${slug(word)}`, ...W.map(L => `ph_${L}`));
  const t = tpl('blendgame');
  el.append(t);
  music('games');
  ['598:4598', '598:4599', '598:4601', '598:4602', '598:4604', '603:1017', '314:474', '314:476', '314:477', '314:478', '322:629'].forEach(id => $(t, id)?.remove());
  lessonChrome(t, { exit: ['314:494'], gear: ['314:456'] }, { exit: back });
  const hint = () => sayAll([`w_${slug(word)}`, ...W.map(L => `ph_${L}`)], 150);
  onTap($(t, '314:472'), hint);
  // picture
  const pic = $(t, '322:617');
  pic.innerHTML = `<img src="${picSrc(word)}" class="absolute inset-[22px] size-[calc(100%-44px)] object-contain pointer-events-none" alt="${word}">`;
  onTap(pic, () => say(`w_${slug(word)}`));
  // answer boxes
  const size = W.length > 4 ? 165 : 185, gap = 30;
  const bx0 = (1194 - (W.length * size + (W.length - 1) * gap)) / 2;
  const slots = W.map((L, k) => {
    const s = box(bx0 + k * (size + gap), 366 + (185 - size) / 2, size, size, 'bg-[#fbfdfe] rounded-[10px] shadow-[0px_6px_10px_0px_rgba(0,0,0,0.15)]');
    t.append(s);
    return { L, el: s, filled: false };
  });
  // monster tray: the word's letters plus distractors
  const extra = shuffle(LETTERS.filter(x => !W.includes(x))).slice(0, Math.max(1, 6 - W.length));
  const tray = shuffle([...W, ...extra]);
  const step = 1194 / tray.length;
  let filled = 0;
  tray.forEach((L, k) => {
    const m = box(k * step + (step - 165) / 2, 640, 165, 175, 'z-20');
    m.innerHTML = `<img src="${monsterSrc(L)}" class="absolute inset-0 size-full object-contain pointer-events-none" alt="">
      <div class="absolute left-1/2 -translate-x-1/2 bottom-[18px] size-[36px] rounded-full bg-white border-[3px] border-[#109586] flex items-center justify-center font-['Cal_Sans'] text-[20px] text-[#424144] pointer-events-none">${L}</div>`;
    t.append(m);
    draggable(m, {
      onClick: () => { say(`ph_${L}`); animate(m, 'wiggle'); },
      onDrop: (el, p) => {
        const s = slots.find(s => !s.filled && inside(p, { x: parseFloat(s.el.style.left), y: parseFloat(s.el.style.top), w: size, h: size }, 30));
        if (!s) return false;
        if (s.L !== L) { store.recordAnswer(s.L, false); tryAgain(); animate(s.el, 'shake'); return false; }
        store.recordAnswer(L, true);
        s.filled = true; filled++;
        m.remove();
        s.el.innerHTML = `<img src="${monsterSrc(L)}" class="absolute inset-[10px] size-[calc(100%-20px)] object-contain pop" alt="">`;
        sfx('drop'); say(`ph_${L}`);
        if (filled === W.length) finish();
        return true;
      },
    });
  });
  async function finish() {
    $$(t, '.cursor-grab').forEach(o => { o.dataset.locked = 1; o.style.opacity = 0.35; });
    await wait(700);
    for (const s of slots) { s.el.innerHTML = `<div class="absolute inset-0 flex items-center justify-center"><p class="m-0 font-['Cal_Sans'] text-[#109586] leading-none pop" style="font-size:${size * 0.7}px">${s.L}</p></div>`; sfx('pop', 0.5); await wait(120); }
    await say(`w_${slug(word)}`);
    await praise(true);
    nextArrow(t, () => {
      if (i + 1 < words.length) go('blendgame', { i: i + 1, words });
      else { store.completeGame('blend'); go('reward', { replay: ['blendgame', {}], done: ['minigames', {}] }); }
    }).classList.add('pulse');
  }
  i === 0 ? sayAll(['ui_drag_spell', `w_${slug(word)}`]) : say(`w_${slug(word)}`);
});
