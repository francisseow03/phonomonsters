// Levels 2-4: Middle & Last Sounds, Blending Sounds (train), Consonant Blends.
import { route, go, tpl, $, $$, h, box, onTap, shuffle, pick, animate } from './core.js';
import * as store from './store.js';
import { music, say, sayAll, sfx, preload, wait, stopVoice } from './audio.js';
import { lessonChrome, nextArrow, swapForImage, monsterSrc, picSrc, draggable, inside } from './ui.js';
import { praise, tryAgain, micAttempt } from './feedback.js';
import { L2_WORDS, L3_WORDS, L4_BLENDS, VOWELS, LETTERS } from './data.js';
import { slug } from './voice.js';

const ROUND = 5;
const CONSONANTS = LETTERS.filter(L => !VOWELS.includes(L));

// ---------------- Level 2 ----------------
route('level2', el => {
  const t = tpl('l2menu');
  el.append(t);
  music('learn');
  lessonChrome(t, { exit: ['303:244'], gear: ['303:250'], pause: ['303:249', '303:252'] }, { exit: () => go('discover') });
  const start = mode => go('l2', { mode, i: 0, words: shuffle(L2_WORDS).slice(0, ROUND), step: 'intro' });
  ['467:380', '467:385', '467:384'].forEach(id => onTap($(t, id), () => start('middle'), { sound: 'nav' }));
  ['467:378', '467:387', '467:379'].forEach(id => onTap($(t, id), () => start('last'), { sound: 'nav' }));
  say('ui_l2');
});

route('l2', (el, P) => {
  const { mode, i, words, step } = P;
  const word = words[i], W = word.toUpperCase().split('');
  const target = mode === 'middle' ? 1 : 2;
  const exit = () => go('level2');
  preload(`w_${slug(word)}`, ...W.map(L => `ph_${L}`));
  music('learn');
  if (step === 'intro') {
    const t = tpl('l2intro');
    el.append(t);
    t.classList.remove('cursor-pointer');
    swapForImage($(t, '420:677'), picSrc(word));
    const ids = ['420:720', '420:719', '420:721'];
    ids.forEach((id, k) => {
      const n = $(t, id); n.querySelector('p').textContent = W[k];
      onTap(n, () => { say(`ph_${W[k]}`); animate(n, 'bounce'); });
    });
    onTap($(t, '420:586'), () => say(`w_${slug(word)}`));
    lessonChrome(t, { exit: ['420:597'], gear: ['420:590'], pause: ['637:707'] }, { exit });
    onTap($(t, '420:606'), () => go('l2', { ...P, step: 'play' }), { sound: 'nav' });
    (async () => {
      if (!await say(`w_${slug(word)}`)) return;
      for (let k = 0; k < 3; k++) { await wait(200); animate($(t, ids[k]), 'bounce'); if (!await say(`ph_${W[k]}`)) return; }
      await wait(200); say(`w_${slug(word)}`);
    })();
    return;
  }
  const t = tpl('l2play');
  el.append(t);
  t.classList.remove('cursor-pointer');
  swapForImage($(t, '428:432'), picSrc(word));
  onTap($(t, '418:343'), () => say(`w_${slug(word)}`));
  const letterIds = ['419:482', '419:481', '419:483'];
  letterIds.forEach((id, k) => { const n = $(t, id); n.querySelector('p').textContent = W[k]; onTap(n, () => say(`ph_${W[k]}`)); });
  const boxes = [$(t, '418:344'), $(t, '418:345'), $(t, '418:346')];
  const boxPos = [448, 687, 927];
  if (target === 2) {
    boxes[1].classList.remove('border-10', 'border-[#f9c105]', 'border-solid');
    boxes[2].classList.add('border-10', 'border-[#f9c105]', 'border-solid');
  }
  boxes[target].classList.add('pulse');
  ['418:373', '418:374', '418:412'].forEach(id => $(t, id).remove());
  lessonChrome(t, { exit: ['418:354'], gear: ['418:347'], pause: ['637:717'] }, { exit });
  const answer = W[target];
  const pool = (target === 1 ? VOWELS : CONSONANTS).filter(L => L !== answer);
  const options = shuffle([answer, ...shuffle(pool).slice(0, 2)]);
  const arrow = nextArrow(t, () => {
    if (i + 1 < words.length) go('l2', { ...P, i: i + 1, step: 'intro' });
    else { store.completeLesson(2); go('reward', { replay: ['level2', {}], done: ['discover', {}] }); }
  }, { show: false });
  const targetRect = { x: boxPos[target], y: 299, w: 212, h: 212 };
  options.forEach((L, k) => {
    const m = box(190 + k * 280, 585, 220, 225, 'z-20');
    m.innerHTML = `<img src="${monsterSrc(L)}" class="absolute inset-0 size-full object-contain pointer-events-none" alt="">`;
    t.append(m);
    draggable(m, {
      onClick: () => { say(`ph_${L}`); animate(m, 'wiggle'); },
      onDrop: (el, p) => {
        if (!inside(p, targetRect, 40)) return false;
        if (L !== answer) { store.recordAnswer(answer, false); tryAgain(); animate(boxes[target], 'shake'); return false; }
        store.recordAnswer(answer, true);
        m.remove();
        boxes[target].classList.remove('pulse');
        boxes[target].innerHTML = `<img src="${monsterSrc(L)}" class="absolute inset-[14px] size-[calc(100%-28px)] object-contain pop" alt="">`;
        $$(t, '.cursor-grab').forEach(o => { o.dataset.locked = 1; o.style.opacity = 0.35; });
        (async () => { await say(`ph_${L}`); await praise(true); await say(`w_${slug(word)}`); arrow.style.display = ''; arrow.classList.add('pulse'); })();
        return true;
      },
    });
  });
  sayAll([mode === 'middle' ? 'ui_find_middle' : 'ui_find_last', `w_${slug(word)}`]);
});

// ---------------- Level 3 ----------------
route('level3', el => {
  const t = tpl('l3menu');
  el.append(t);
  music('learn');
  lessonChrome(t, { exit: ['303:204'], gear: ['303:235'], pause: ['303:234', '303:237'] }, { exit: () => go('discover') });
  const start = n => go('l3', { n, i: 0, words: shuffle(L3_WORDS[n]).slice(0, ROUND) });
  [['311:603', '311:605', '312:219'], ['311:601', '311:607', '312:221'], ['311:604', '311:608', '312:223']].forEach((ids, k) => ids.forEach(id => onTap($(t, id), () => start(k + 3), { sound: 'nav' })));
  onTap($(t, '311:611'), () => start(3), { sound: 'nav' });
  say('ui_l3');
});

route('l3', (el, P) => {
  const { n, i, words } = P;
  const word = words[i], W = word.toUpperCase().split('');
  preload(`w_${slug(word)}`, ...W.map(L => `ph_${L}`));
  music('learn');
  const t = tpl('l3train');
  el.append(t);
  ['309:210', '309:212', '309:213', '310:219', '310:221', '310:222'].forEach(id => $(t, id).remove());
  lessonChrome(t, { exit: ['307:224'], gear: ['312:279'], pause: ['312:280'] }, { exit: () => go('level3') });
  // letter cards, re-laid out for 3, 4 or 5 sounds
  const cw = Math.min(282, (1000 - (W.length - 1) * 24) / W.length), gap = 24;
  const x0 = (1194 - (W.length * cw + (W.length - 1) * gap)) / 2;
  const fs = Math.round(200 * cw / 282);
  const cards = W.map((L, k) => {
    const c = box(x0 + k * (cw + gap), 228, cw, 259, "bg-[#fbfdfe] rounded-[10px] shadow-[0px_6px_10px_0px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden");
    c.innerHTML = `<p class="m-0 font-['Cal_Sans'] text-[#109586] leading-none" style="font-size:${fs}px">${L}</p>`;
    t.append(c);
    onTap(c, () => { say(`ph_${L}`); animate(c, 'bounce'); });
    return c;
  });
  // the train (exported from the Figma TRAIN group)
  $(t, '308:421').remove();
  const train = h('img', 'absolute z-20 cursor-pointer');
  train.src = 'art-train.png'; train.alt = 'train';
  Object.assign(train.style, { left: '-190px', top: '544px', width: '386px', height: '138px' });
  t.append(train);
  let ran = false, running = false;
  const nextBtns = [$(t, '307:245'), $(t, '307:246')];
  const run = async () => {
    if (running) return;
    if (ran) {
      if (i + 1 < words.length) return go('l3', { ...P, i: i + 1 });
      store.completeLesson(3); return go('reward', { replay: ['level3', {}], done: ['discover', {}] });
    }
    running = true; stopVoice();
    sfx('whistle'); await wait(500); sfx('chug', 0.6);
    const startX = -190, endX = 1194 - 300;
    const dur = 1100 * W.length + 600;
    const t0 = performance.now();
    const flipped = new Set();
    await new Promise(res => {
      const tick = now => {
        const k = Math.min(1, (now - t0) / dur);
        const x = startX + (endX - startX) * k;
        train.style.left = x + 'px';
        const nose = x + 330;
        cards.forEach((c, j) => {
          const cx = parseFloat(c.style.left) + cw / 2;
          if (!flipped.has(j) && nose >= cx) {
            flipped.add(j);
            c.classList.add('flip-out');
            setTimeout(() => { c.classList.remove('flip-out'); c.innerHTML = `<img src="${monsterSrc(W[j])}" class="size-[86%] object-contain" alt="">`; c.classList.add('flip-in'); setTimeout(() => c.classList.remove('flip-in'), 200); }, 160);
            say(`ph_${W[j]}`);
          }
        });
        k < 1 ? requestAnimationFrame(tick) : res();
      };
      requestAnimationFrame(tick);
    });
    await wait(700);
    // blend: monsters squeeze together into the word
    cards.forEach((c, j) => { c.style.transition = 'transform .5s ease'; c.style.transform = `translateX(${(W.length - 1) / 2 * (cw + gap) - j * (cw + gap)}px) scale(.6)`; });
    await wait(550);
    cards.forEach((c, j) => { c.style.transform = ''; c.innerHTML = `<p class="m-0 font-['Cal_Sans'] text-[#1fa7e1] leading-none" style="font-size:${fs}px">${W[j]}</p>`; });
    await say(`w_${slug(word)}`);
    await praise(true);
    ran = true; running = false;
    nextBtns.forEach(b => b.classList.add('pulse'));
  };
  onTap(train, run, { sound: null });
  nextBtns.forEach(b => onTap(b, run, { sound: 'nav' }));
  say('ui_blend_go');
  train.classList.add('wiggle');
});

// ---------------- Level 4 ----------------
route('level4', el => {
  const t = tpl('l4menu');
  el.append(t);
  music('learn');
  lessonChrome(t, { exit: ['303:259'], gear: ['303:265'], pause: ['303:264', '303:267'] }, { exit: () => go('discover') });
  const start = diff => go('l4', { diff, i: 0, step: 'meet' });
  ['422:733', '425:358'].forEach(id => onTap($(t, id), () => start('easy'), { sound: 'nav' }));
  ['422:732', '425:354'].forEach(id => onTap($(t, id), () => start('complex'), { sound: 'nav' }));
  ['422:734', '425:359'].forEach(id => onTap($(t, id), () => start('ending'), { sound: 'nav' }));
  say('ui_l4');
});

route('l4', (el, P) => {
  const { diff, i, step } = P;
  const set = L4_BLENDS[diff], blend = set[i];
  const [a, b] = blend.b.toUpperCase().split('');
  const exit = () => go('level4');
  const next = s => go('l4', { ...P, step: s });
  music('learn');
  preload(`blend_${blend.b}`, `ph_${a}`, `ph_${b}`, ...blend.words.map(w => `w_${slug(w)}`));
  if (step === 'meet' || step === 'blend') {
    const t = tpl('l4blend');
    el.append(t);
    lessonChrome(t, { exit: ['427:416'], gear: ['427:413'], pause: ['427:412', '427:415'] }, { exit });
    const go2 = () => step === 'meet' ? next('blend') : next('words');
    onTap($(t, '621:620'), go2, { sound: 'nav' }); onTap($(t, '621:621'), go2, { sound: 'nav' });
    if (step === 'meet') {
      ['427:411', '427:403', '428:580', '428:582'].forEach(id => $(t, id).remove());
      [a, b].forEach((L, k) => {
        const m = box(250 + k * 400, 210, 300, 330, 'flex flex-col items-center');
        m.innerHTML = `<img src="${monsterSrc(L)}" class="h-[300px] object-contain float" alt=""><p class="m-0 font-['Cal_Sans'] text-[64px] text-[#109586] leading-none">${L.toLowerCase()}</p>`;
        t.append(m);
        onTap(m, () => { say(`ph_${L}`); animate(m, 'wiggle'); }, { sound: 'giggle' });
      });
      t.append(box(560, 330, 80, 80, "flex items-center justify-center font-['Cal_Sans'] text-[80px] text-[#fa96ba]", '+'));
      sayAll(['ui_blend_meet', `ph_${a}`, `ph_${b}`, `blend_${blend.b}`]);
    } else {
      $(t, '427:411').querySelector('p').textContent = blend.b;
      onTap($(t, '427:403'), () => say(`blend_${blend.b}`));
      onTap($(t, '427:411'), () => say(`blend_${blend.b}`));
      const mic = () => micAttempt(t, { x: 733, y: 455, w: 110, h: 100 }, blend.b, [blend.words[0], blend.b, ...blend.words]);
      onTap($(t, '428:580'), mic, { sound: null }); onTap($(t, '428:582'), mic, { sound: null });
      sayAll([`blend_${blend.b}`, 'ui_say_it']);
    }
    return;
  }
  const t = tpl('l4words');
  el.append(t);
  t.classList.remove('cursor-pointer');
  lessonChrome(t, { exit: ['428:600'], gear: ['428:597'], pause: ['428:596', '428:599'] }, { exit });
  const ids = ['428:595', '428:625', '428:620', '428:626', '428:621', '428:627'];
  const heard = new Set();
  const nodes = ids.map((id, k) => {
    const n = $(t, id), p = n.querySelector('p');
    p.textContent = blend.words[k];
    p.style.color = '#57b8b6';
    onTap(n, () => {
      nodes.forEach(o => o.querySelector('p').style.color = '#57b8b6');
      p.style.color = '#1fa7e1'; animate(n, 'bounce'); heard.add(k);
      say(`w_${slug(blend.words[k])}`);
      if (heard.size === ids.length) setTimeout(() => sfx('star'), 700);
    });
    return n;
  });
  const done = () => {
    if (i + 1 < set.length) go('l4', { ...P, i: i + 1, step: 'meet' });
    else { store.completeLesson(4); go('reward', { replay: ['level4', {}], done: ['discover', {}] }); }
  };
  onTap($(t, '428:590'), done, { sound: 'nav' }); onTap($(t, '428:591'), done, { sound: 'nav' });
  say('ui_word_list');
});
