// Later levels: Level 5 Digraphs (sh, ch, th, wh, ck) and Level 6 Boss Battle.
import { route, go, tpl, $, $$, h, box, onTap, shuffle, pick, animate, overlay, confetti } from './core.js';
import * as store from './store.js';
import { music, say, sayAll, sfx, wait, speak, stopVoice, registerLines } from './audio.js';
import { lessonChrome, nextArrow, monsterSrc, picSrc, wordGrid } from './ui.js';
import { praise, tryAgain } from './feedback.js';
import { DIGRAPHS, BOSS_WORDS, VOWELS, LETTERS } from './data.js';
import { slug } from './voice.js';

// voice lines for the new levels (spoken by the device voice until clips are recorded)
registerLines({
  ui_l5: 'Two letters can team up to make one new sound! Pick a sound team.',
  ui_l5_meet: 'When these two letters stand together, they make one sound.',
  ui_l5_quiz: 'Listen to the word. Which sound team do you hear?',
  ui_l6: 'Boss battle! Answer the questions to beat the Word Wizard!',
  ui_l6_pic: 'Which word matches the picture?',
  ui_l6_sound: 'Which letter makes this sound?',
  ui_l6_mid: 'Which letter is missing?',
  ui_boss_win: 'You beat the Word Wizard! You are a reading hero!',
  ui_boss_lose: 'Oh no! The Word Wizard won this time. Let us try again!',
});
DIGRAPHS.forEach(g => registerLines({ [`dg_${g.d}`]: g.say }));

const SPEAKER = `<svg viewBox="0 0 140 140" width="140" height="140"><circle cx="70" cy="74" r="66" fill="#018cbc"/><circle cx="70" cy="68" r="66" fill="#1fa7e1"/><path d="M42 56h16l22-18v60L58 80H42z" fill="#fff"/><path d="M90 52q12 16 0 32M100 42q22 26 0 52" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
const starRow = n => `<span style="color:#ffc843;letter-spacing:2px">${'★'.repeat(n)}</span><span style="color:#d5dde0;letter-spacing:2px">${'★'.repeat(3 - n)}</span>`;

// ---------------- Level 5 menu ----------------
route('level5', el => {
  const t = tpl('l4menu');
  el.append(t);
  music('learn');
  lessonChrome(t, { exit: ['303:259'], gear: ['303:265'], pause: ['303:264', '303:267'] }, { exit: () => go('discover', { page: 2 }) });
  $(t, '303:260').style.background = '#a37fe8';
  const pill = $(t, '303:263'); pill.textContent = 'Level 5'; pill.style.color = '#a37fe8';
  $(t, '303:261').textContent = 'Digraphs';
  ['422:732', '422:733', '422:734', '425:354', '425:358', '425:359'].forEach(id => $(t, id)?.remove());
  const best = store.progress().best;
  const size = 196, gap = 28, x0 = (1194 - (DIGRAPHS.length * size + (DIGRAPHS.length - 1) * gap)) / 2;
  DIGRAPHS.forEach((g, k) => {
    const c = box(x0 + k * (size + gap), 360, size, size, '');
    c.style.cssText += `border-radius:50%;background:#fbfdfe;box-shadow:0 0 0 8px ${g.color},0 10px 16px rgba(0,0,0,.15);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer`;
    c.innerHTML = `<div style="font:400 84px 'Cal Sans',Fredoka,sans-serif;color:${g.color};line-height:1">${g.d}</div><div style="font:800 22px Nunito;color:#1c9886">${g.words[0]}</div>`;
    t.append(c);
    const st = box(x0 + k * (size + gap), 580, size, 30, '', `<div style="text-align:center;font-size:28px">${starRow(best[`l5_${g.d}`] || 0)}</div>`);
    t.append(st);
    onTap(c, () => go('l5', { k, step: 'meet' }), { sound: 'nav' });
  });
  say('ui_l5');
});

// ---------------- Level 5 lesson: meet -> words -> quiz ----------------
route('l5', (el, P) => {
  const { k, step } = P;
  const g = DIGRAPHS[k];
  const [a, b] = g.d.toUpperCase().split('');
  const exit = () => go('level5');
  const next = s => go('l5', { ...P, step: s });
  music('learn');
  if (step === 'meet') {
    store.startRun();
    const t = tpl('l4blend');
    el.append(t);
    lessonChrome(t, { exit: ['427:416'], gear: ['427:413'], pause: ['427:412', '427:415'] }, { exit });
    ['427:411', '427:403', '428:580', '428:582'].forEach(id => $(t, id).remove());
    const mons = [a, b].map((L, i) => {
      const m = box(230 + i * 440, 215, 300, 300, 'flex items-center justify-center');
      m.innerHTML = `<img src="${monsterSrc(L)}" class="float" style="height:280px;object-fit:contain" alt="">`;
      m.style.transition = 'transform .7s cubic-bezier(.34,1.56,.64,1)';
      t.append(m);
      onTap(m, () => { say(`ph_${L}`); animate(m, 'wiggle'); }, { sound: 'giggle' });
      return m;
    });
    const plus = box(557, 325, 80, 80, '', `<div style="font:400 80px 'Cal Sans',Fredoka;color:#fa96ba;line-height:80px;text-align:center">+</div>`);
    t.append(plus);
    const big = box(397, 515, 400, 150, '', `<div style="font:400 140px 'Cal Sans',Fredoka;color:${g.color};line-height:150px;text-align:center">${g.d}</div>`);
    big.style.opacity = 0; big.style.transition = 'opacity .5s';
    t.append(big);
    onTap(big, () => say(`dg_${g.d}`));
    const arrow = [$(t, '621:620'), $(t, '621:621')];
    arrow.forEach(n => { n.style.opacity = 0.35; });
    let merged = false;
    const merge = async () => {
      if (merged) return;
      merged = true;
      mons[0].style.transform = 'translateX(150px) scale(.8)';
      mons[1].style.transform = 'translateX(-150px) scale(.8)';
      plus.style.opacity = 0;
      sfx('sparkle'); await wait(600);
      big.style.opacity = 1; animate(big, 'bounce');
      await say(`dg_${g.d}`); await wait(200); await say(`dg_${g.d}`);
      arrow.forEach(n => { n.style.opacity = 1; n.classList.add('pulse'); });
    };
    arrow.forEach(n => onTap(n, () => merged ? next('words') : merge(), { sound: 'nav' }));
    (async () => {
      if (!await say('ui_l5_meet')) return;
      await wait(300);
      if (!await say(`ph_${a}`)) return;
      await wait(250);
      if (!await say(`ph_${b}`)) return;
      merge();
    })();
    return;
  }
  if (step === 'words') {
    const t = tpl('l4words');
    el.append(t);
    t.classList.remove('cursor-pointer');
    lessonChrome(t, { exit: ['428:600'], gear: ['428:597'], pause: ['428:596', '428:599'] }, { exit });
    // the Figma word slots are uneven; lay the six words out on an even 2 x 3 grid in the card
    ['428:595', '428:625', '428:620', '428:626', '428:621', '428:627'].forEach(id => $(t, id).remove());
    const tint = w => { const at = w.indexOf(g.d); return `${w.slice(0, at)}<span style="color:${g.color}">${g.d}</span>${w.slice(at + 2)}`; };
    wordGrid(t, g.words, tint).forEach((n, j) => onTap(n, () => { animate(n, 'bounce'); say(`w_${slug(g.words[j])}`); }));
    const go2 = () => next('quiz');
    onTap($(t, '428:590'), go2, { sound: 'nav' }); onTap($(t, '428:591'), go2, { sound: 'nav' });
    say('ui_word_list');
    return;
  }
  // quiz: hear a word, pick its sound team
  const Q = 4;
  const q = P.q || 0;
  const pool = P.pool || shuffle([...shuffle(g.words).slice(0, 2), ...shuffle(DIGRAPHS.filter(x => x !== g).flatMap(x => x.words.map(w => ({ w, d: x.d })))).slice(0, 2)].map(x => typeof x === 'string' ? { w: x, d: g.d } : x));
  const item = pool[q];
  const t = tpl('l4blend');
  el.append(t);
  el.dataset.answer = item.d; // lets automated play-throughs find the right tile
  lessonChrome(t, { exit: ['427:416'], gear: ['427:413'], pause: ['427:412', '427:415'] }, { exit });
  ['427:411', '427:403', '428:580', '428:582', '621:620', '621:621'].forEach(id => $(t, id).remove());
  const dots = box(497, 190, 200, 24, 'flex items-center justify-center');
  dots.style.gap = '10px';
  for (let j = 0; j < Q; j++) dots.append(h('div', '', `<div style="width:18px;height:18px;border-radius:50%;background:${j < q ? '#ffc843' : j === q ? '#1fa7e1' : '#b3e8ff'}"></div>`));
  t.append(dots);
  const spk = box(527, 240, 140, 140, '', SPEAKER);
  spk.style.cursor = 'pointer';
  t.append(spk);
  const hear = () => { animate(spk, 'bounce'); say(`w_${slug(item.w)}`); };
  onTap(spk, hear);
  // never offer a second team that is also in the word (chick has ch and ck)
  const opts = shuffle([item.d, ...shuffle(DIGRAPHS.map(x => x.d).filter(d => d !== item.d && !item.w.includes(d))).slice(0, 2)]);
  const tw = 220, tg = 40, tx = (1194 - (3 * tw + 2 * tg)) / 2;
  let answered = false;
  opts.forEach((d, j) => {
    const tile = box(tx + j * (tw + tg), 440, tw, 170, 'pm-tile');
    tile.className = 'pm-tile';
    tile.style.fontSize = '100px';
    tile.textContent = d;
    t.append(tile);
    onTap(tile, async () => {
      if (answered) return;
      if (d === item.d) {
        answered = true;
        store.recordAnswer(item.d, true);
        tile.classList.add('good'); animate(tile, 'hop');
        const w = item.w, at = w.indexOf(d);
        spk.innerHTML = `<div style="width:340px;margin-left:-100px;text-align:center;font:400 96px 'Cal Sans',Fredoka;color:#109586;line-height:140px">${w.slice(0, at)}<span style="color:${DIGRAPHS.find(x => x.d === d).color}">${d}</span>${w.slice(at + 2)}</div>`;
        await praise(q === Q - 1);
        await say(`w_${slug(item.w)}`);
        if (q + 1 < Q) go('l5', { ...P, q: q + 1, pool });
        else { store.completeLesson(5); go('reward', { key: `l5_${g.d}`, replay: ['l5', { k, step: 'meet' }], done: ['level5', {}], next: k + 1 < DIGRAPHS.length ? ['l5', { k: k + 1, step: 'meet' }] : null }); }
      } else {
        store.recordAnswer(item.d, false);
        tile.classList.add('bad'); animate(tile, 'shake'); tryAgain();
        setTimeout(() => tile.classList.remove('bad'), 700);
        setTimeout(hear, 1500);
      }
    }, { sound: null });
  });
  q === 0 ? sayAll(['ui_l5_quiz', `w_${slug(item.w)}`]) : setTimeout(hear, 350);
});

// ---------------- Level 6: Boss Battle ----------------
const BOSS = { name: 'Word Wizard', letter: 'N' };
function question() {
  const type = pick(['pic', 'pic', 'sound', 'mid']);
  if (type === 'sound') {
    const L = pick(LETTERS);
    return { type, prompt: `ph_${L}`, answer: L, options: shuffle([L, ...shuffle(LETTERS.filter(x => x !== L)).slice(0, 3)]) };
  }
  const word = pick(type === 'mid' ? BOSS_WORDS.filter(w => w.length === 3 && VOWELS.includes(w[1].toUpperCase())) : BOSS_WORDS);
  if (type === 'mid') {
    const v = word[1].toUpperCase();
    return { type, word, answer: v, options: shuffle([v, ...shuffle(VOWELS.filter(x => x !== v)).slice(0, 2)]) };
  }
  const same = BOSS_WORDS.filter(w => w !== word && (w.length === word.length || w[0] === word[0]));
  return { type, word, answer: word, options: shuffle([word, ...shuffle(same.length >= 2 ? same : BOSS_WORDS.filter(w => w !== word)).slice(0, 2)]) };
}

route('level6', (el, P = {}) => {
  const wins = store.progress().levels[6] || 0;
  const maxHp = P.maxHp || Math.min(12, 8 + wins * 2);
  const S = P.S || { hp: maxHp, hearts: 3, n: 0 };
  if (!P.S) store.startRun();
  const q = question();
  const t = tpl('l4blend');
  el.append(t);
  el.dataset.answer = q.answer; // lets automated play-throughs find the right tile
  music('games');
  const exit = () => go('discover', { page: 2 });
  lessonChrome(t, { exit: ['427:416'], gear: ['427:413'], pause: ['427:412', '427:415'] }, { exit });
  ['427:411', '427:403', '428:580', '428:582', '621:620', '621:621'].forEach(id => $(t, id).remove());
  // boss on the right of the arena card
  const boss = box(790, 230, 260, 300, '');
  boss.style.cssText += 'display:flex;align-items:flex-end;justify-content:center';
  boss.innerHTML = `<img src="${monsterSrc(BOSS.letter)}" style="height:270px;object-fit:contain;filter:hue-rotate(200deg) saturate(1.3)" alt=""><div style="position:absolute;top:-6px;left:50%;transform:translateX(-50%) rotate(-8deg);font-size:64px">👑</div>`;
  boss.classList.add('float');
  t.append(boss);
  t.append(box(790, 190, 260, 30, '', `<div style="text-align:center;font:900 22px Nunito;color:#5b4a9b">${BOSS.name}</div>`));
  const hp = box(800, 545, 240, 26, 'pm-hp');
  hp.className = 'pm-hp';
  hp.innerHTML = `<i style="width:${100 * S.hp / maxHp}%"></i>`;
  t.append(hp);
  t.append(box(800, 578, 240, 24, '', `<div style="text-align:center;font:800 16px Nunito;color:#5b4a9b">${S.hp} / ${maxHp}</div>`));
  const hearts = box(160, 190, 200, 44, 'pm-hearts');
  hearts.className = 'pm-hearts';
  hearts.innerHTML = Array.from({ length: 3 }, (_, i) => `<span style="${i < S.hearts ? '' : 'filter:grayscale(1);opacity:.3'}">❤️</span>`).join('');
  t.append(hearts);
  // question area: centred in the left part of the card (116..760)
  const cx = 438;
  let prompt;
  if (q.type === 'sound') {
    prompt = box(cx - 70, 240, 140, 140, '', SPEAKER);
  } else {
    prompt = box(cx - 100, 215, 200, 200, '', `<img src="${picSrc(q.word)}" style="width:100%;height:100%;object-fit:contain" alt="">`);
    if (q.type === 'mid') t.append(box(cx - 150, 412, 300, 70, '', `<div style="text-align:center;font:400 64px 'Cal Sans',Fredoka;color:#109586;letter-spacing:12px;line-height:70px">${q.word[0]}<span style="color:#fa96ba">_</span>${q.word[2]}</div>`));
  }
  prompt.style.cursor = 'pointer';
  t.append(prompt);
  const hear = () => { animate(prompt, 'bounce'); q.type === 'sound' ? say(q.prompt) : q.type === 'mid' ? say(`w_${slug(q.word)}`) : say('ui_l6_pic'); };
  onTap(prompt, hear);
  const n = q.options.length;
  const tw = q.type === 'pic' ? 170 : 120, tg = 22, tx = cx - (n * tw + (n - 1) * tg) / 2;
  let answered = false;
  q.options.forEach((o, j) => {
    const tile = box(tx + j * (tw + tg), 500, tw, 120, 'pm-tile');
    tile.className = 'pm-tile';
    tile.style.fontSize = q.type === 'pic' ? '46px' : '80px';
    tile.textContent = o;
    t.append(tile);
    onTap(tile, async () => {
      if (answered) return;
      answered = true;
      const right = o === q.answer;
      store.recordAnswer(q.type === 'sound' || q.type === 'mid' ? q.answer : q.word[0].toUpperCase(), right);
      if (right) {
        tile.classList.add('good'); animate(tile, 'hop');
        S.hp--; S.n++;
        sfx('correct'); boss.classList.remove('float'); animate(boss, 'pm-hit');
        hp.querySelector('i').style.width = `${100 * S.hp / maxHp}%`;
        if (q.type !== 'sound') await say(`w_${slug(q.word)}`); else await wait(500);
        await wait(250);
        if (S.hp <= 0) return victory(t, boss);
        go('level6', { S, maxHp });
      } else {
        tile.classList.add('bad');
        S.hearts--;
        animate(t, 'shake'); sfx('wrong');
        hearts.children[S.hearts]?.setAttribute('style', 'filter:grayscale(1);opacity:.3');
        // show the right answer before moving on
        [...t.querySelectorAll('.pm-tile')].find(x => x.textContent === q.answer)?.classList.add('good');
        await tryAgain(); await wait(400);
        if (S.hearts <= 0) return defeat();
        go('level6', { S, maxHp });
      }
    }, { sound: null });
  });
  const lines = { sound: ['ui_l6_sound', q.prompt], mid: ['ui_l6_mid', `w_${slug(q.word)}`], pic: ['ui_l6_pic'] }[q.type];
  sayAll(P.S ? lines : ['ui_l6', ...lines]);

  async function victory(t, boss) {
    boss.style.transition = 'transform 1s ease, opacity 1s ease';
    boss.style.transform = 'rotate(540deg) scale(.1)'; boss.style.opacity = 0;
    sfx('cheer'); confetti(140);
    await say('ui_boss_win');
    store.completeLesson(6);
    go('reward', { key: 'boss', stars: S.hearts, replay: ['level6', {}], done: ['discover', { page: 2 }] });
  }
  function defeat() {
    const card = h('div', 'pm-card pop');
    card.style.width = '560px';
    card.innerHTML = `<img src="${monsterSrc(BOSS.letter)}" style="height:170px;filter:hue-rotate(200deg) saturate(1.3)" alt=""><h2>So close!</h2><p>You knocked the ${BOSS.name} down to ${S.hp} hit points. Try again?</p>`;
    const row = h('div', 'pm-row');
    const again = h('div', 'pm-btn', 'TRY AGAIN'), quit = h('div', 'pm-btn alt', 'EXIT');
    row.append(quit, again); card.append(row);
    overlay(card);
    onTap(again, () => go('level6', {}), { sound: 'pop' });
    onTap(quit, exit, { sound: 'nav' });
    say('ui_boss_lose');
  }
});
