// Later levels: Level 5 Digraphs, Level 6 Vowel Teams, Level 7 Tricky Words, Level 8 Boss Battle.
import { route, go, tpl, $, h, box, onTap, shuffle, pick, animate, overlay, confetti } from './core.js';
import * as store from './store.js';
import { music, say, sayAll, sfx, wait } from './audio.js';
import { lessonChrome, monsterSrc, picSrc, wordGrid } from './ui.js';
import { praise, tryAgain } from './feedback.js';
import { DIGRAPHS, VOWEL_TEAMS, TRICKY, BOSS_WORDS, VOWELS, LETTERS } from './data.js';
import { slug } from './voice.js';
import { bossSvg, ICON } from './art.js';

const SPEAKER = `<svg viewBox="0 0 140 140" width="140" height="140"><circle cx="70" cy="74" r="66" fill="#018cbc"/><circle cx="70" cy="68" r="66" fill="#1fa7e1"/><path d="M42 56h16l22-18v60L58 80H42z" fill="#fff"/><path d="M90 52q12 16 0 32M100 42q22 26 0 52" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
const starRow = n => `<span style="color:#ffc843;letter-spacing:2px">${'★'.repeat(n)}</span><span style="color:#d5dde0;letter-spacing:2px">${'★'.repeat(3 - n)}</span>`;
const CARD = ['427:411', '427:403', '428:580', '428:582', '621:620', '621:621'];
const tint = (w, d, color) => { const at = w.indexOf(d); return at < 0 ? w : `${w.slice(0, at)}<span style="color:${color}">${d}</span>${w.slice(at + d.length)}`; };
const progressDots = (t, q, Q) => {
  const dots = box(397, 190, 400, 24, 'flex items-center justify-center');
  dots.style.gap = '10px';
  for (let j = 0; j < Q; j++) dots.append(h('div', '', `<div style="width:18px;height:18px;border-radius:50%;background:${j < q ? '#ffc843' : j === q ? '#1fa7e1' : '#b3e8ff'}"></div>`));
  t.append(dots);
};
/** Lesson menu frame (the Level 4 menu from Figma) re-titled for this level. */
function menuFrame(el, n, title, color, exit) {
  const t = tpl('l4menu');
  el.append(t);
  music('learn');
  lessonChrome(t, { exit: ['303:259'], gear: ['303:265'], pause: ['303:264', '303:267'] }, { exit });
  $(t, '303:260').style.background = color;
  const pill = $(t, '303:263'); pill.textContent = `Level ${n}`; pill.style.color = color;
  $(t, '303:261').textContent = title;
  ['422:732', '422:733', '422:734', '425:354', '425:358', '425:359'].forEach(id => $(t, id)?.remove());
  return t;
}

// ---------------- Levels 5 + 6: letter teams (meet -> words -> quiz) ----------------
function teamLevel(n, title, color, groups, intro) {
  const all = [...DIGRAPHS, ...VOWEL_TEAMS];
  route(`level${n}`, el => {
    const t = menuFrame(el, n, title, color, () => go('discover', { page: 2 }));
    const best = store.progress().best;
    const k = groups.length, size = k > 5 ? 160 : 196, gap = k > 5 ? 22 : 28, x0 = (1194 - (k * size + (k - 1) * gap)) / 2;
    groups.forEach((g, i) => {
      const c = box(x0 + i * (size + gap), 370, size, size, '');
      c.style.cssText += `border-radius:50%;background:#fbfdfe;box-shadow:0 0 0 8px ${g.color},0 10px 16px rgba(0,0,0,.15);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer`;
      c.innerHTML = `<div style="font:400 ${g.d.length > 2 ? size * 0.36 : size * 0.43}px 'Cal Sans',Fredoka,sans-serif;color:${g.color};line-height:1">${g.d}</div><div style="font:800 ${size > 170 ? 22 : 19}px Nunito;color:#1c9886">${g.words[0]}</div>`;
      t.append(c);
      t.append(box(x0 + i * (size + gap), 370 + size + 22, size, 30, '', `<div style="text-align:center;font-size:28px">${starRow(best[`l${n}_${g.d}`] || 0)}</div>`));
      onTap(c, () => go(`l${n}`, { k: i, step: 'meet' }), { sound: 'nav' });
    });
    say(intro);
  });

  route(`l${n}`, (el, P) => {
    const { k, step } = P;
    const g = groups[k];
    const letters = g.d.toUpperCase().split('');
    const exit = () => go(`level${n}`);
    const next = s => go(`l${n}`, { ...P, step: s });
    music('learn');
    if (step === 'meet') {
      store.startRun();
      const t = tpl('l4blend');
      el.append(t);
      lessonChrome(t, { exit: ['427:416'], gear: ['427:413'], pause: ['427:412', '427:415'] }, { exit });
      CARD.slice(0, 4).forEach(id => $(t, id).remove());
      const c = letters.length, w = c === 2 ? 300 : 230, spacing = c === 2 ? 440 : 320;
      const mons = letters.map((L, i) => {
        const cx = 597 + (i - (c - 1) / 2) * spacing;
        const m = box(cx - w / 2, 215, w, 300, 'flex items-center justify-center');
        m.innerHTML = `<img src="${monsterSrc(L)}" class="float" style="height:${w === 300 ? 280 : 230}px;object-fit:contain" alt="">`;
        m.style.transition = 'transform .7s cubic-bezier(.34,1.56,.64,1)';
        m.dataset.dx = (597 - cx) * 0.55;
        t.append(m);
        onTap(m, () => { say(`ph_${L}`); animate(m, 'wiggle'); }, { sound: 'giggle' });
        return m;
      });
      const plus = [];
      for (let i = 0; i < c - 1; i++) {
        const px = 597 + (i + 0.5 - (c - 1) / 2) * spacing;
        const p = box(px - 40, 325, 80, 80, '', `<div style="font:400 80px 'Cal Sans',Fredoka;color:#fa96ba;line-height:80px;text-align:center;transition:opacity .4s">+</div>`);
        t.append(p); plus.push(p);
      }
      const big = box(347, 515, 500, 150, '', `<div style="font:400 140px 'Cal Sans',Fredoka;color:${g.color};line-height:150px;text-align:center">${g.d}</div>`);
      big.style.opacity = 0; big.style.transition = 'opacity .5s';
      t.append(big);
      onTap(big, () => say(`dg_${g.d}`));
      const arrow = [$(t, '621:620'), $(t, '621:621')];
      arrow.forEach(a => { a.style.opacity = 0.35; });
      let merged = false;
      const merge = async () => {
        if (merged) return;
        merged = true;
        mons.forEach(m => { m.style.transform = `translateX(${m.dataset.dx}px) scale(.8)`; });
        plus.forEach(p => { p.style.opacity = 0; });
        sfx('sparkle'); await wait(600);
        big.style.opacity = 1; animate(big, 'bounce');
        await say(`dg_${g.d}`); await wait(250); await say(`dg_${g.d}`);
        arrow.forEach(a => { a.style.opacity = 1; a.classList.add('pulse'); });
      };
      arrow.forEach(a => onTap(a, () => merged ? next('words') : merge(), { sound: 'nav' }));
      (async () => {
        if (!await say('ui_l5_meet')) return;
        for (const L of letters) { await wait(250); if (!await say(`ph_${L}`)) return; }
        merge();
      })();
      return;
    }
    if (step === 'words') {
      const t = tpl('l4words');
      el.append(t);
      t.classList.remove('cursor-pointer');
      lessonChrome(t, { exit: ['428:600'], gear: ['428:597'], pause: ['428:596', '428:599'] }, { exit });
      ['428:595', '428:625', '428:620', '428:626', '428:621', '428:627'].forEach(id => $(t, id).remove());
      wordGrid(t, g.words, w => tint(w, g.d, g.color)).forEach((node, j) => {
        if (g.words[j].length > 5) node.style.fontSize = '82px';
        onTap(node, () => { animate(node, 'bounce'); say(`w_${slug(g.words[j])}`); });
      });
      const go2 = () => next('quiz');
      onTap($(t, '428:590'), go2, { sound: 'nav' }); onTap($(t, '428:591'), go2, { sound: 'nav' });
      say('ui_word_list');
      return;
    }
    // quiz: hear a word, pick its sound team
    const Q = 4;
    const q = P.q || 0;
    const others = groups.filter(x => x !== g).flatMap(x => x.words.map(w => ({ w, d: x.d })));
    const pool = P.pool || shuffle([...shuffle(g.words).slice(0, 2).map(w => ({ w, d: g.d })), ...shuffle(others).slice(0, 2)]);
    const item = pool[q];
    const t = tpl('l4blend');
    el.append(t);
    el.dataset.answer = item.d; // lets automated play-throughs find the right tile
    lessonChrome(t, { exit: ['427:416'], gear: ['427:413'], pause: ['427:412', '427:415'] }, { exit });
    CARD.forEach(id => $(t, id).remove());
    progressDots(t, q, Q);
    const spk = box(527, 240, 140, 140, '', SPEAKER);
    spk.style.cursor = 'pointer';
    t.append(spk);
    const hear = () => { animate(spk, 'bounce'); say(`w_${slug(item.w)}`); };
    onTap(spk, hear);
    // never offer a second team that is also in the word (chick has ch and ck)
    const opts = shuffle([item.d, ...shuffle(groups.map(x => x.d).filter(d => d !== item.d && !item.w.includes(d))).slice(0, 2)]);
    const tw = 220, tg = 40, tx = (1194 - (3 * tw + 2 * tg)) / 2;
    let answered = false;
    opts.forEach((d, j) => {
      const tile = box(tx + j * (tw + tg), 440, tw, 170, 'pm-tile');
      tile.className = 'pm-tile';
      tile.style.fontSize = d.length > 2 ? '84px' : '100px';
      tile.textContent = d;
      t.append(tile);
      onTap(tile, async () => {
        if (answered) return;
        if (d === item.d) {
          answered = true;
          store.recordAnswer(item.d, true);
          tile.classList.add('good'); animate(tile, 'hop');
          spk.innerHTML = `<div style="width:400px;margin-left:-130px;text-align:center;font:400 96px 'Cal Sans',Fredoka;color:#109586;line-height:140px">${tint(item.w, d, all.find(x => x.d === d).color)}</div>`;
          await praise(q === Q - 1);
          await say(`w_${slug(item.w)}`);
          if (q + 1 < Q) go(`l${n}`, { ...P, q: q + 1, pool });
          else { store.completeLesson(n); go('reward', { key: `l${n}_${g.d}`, replay: [`l${n}`, { k, step: 'meet' }], done: [`level${n}`, {}], next: k + 1 < groups.length ? [`l${n}`, { k: k + 1, step: 'meet' }] : null }); }
        } else {
          store.recordAnswer(item.d, false);
          tile.classList.add('bad'); animate(tile, 'shake'); tryAgain();
          setTimeout(() => { tile.classList.remove('bad'); tile.classList.add('tried'); }, 700);
          setTimeout(hear, 1500);
        }
      }, { sound: null });
    });
    q === 0 ? sayAll(['ui_l5_quiz', `w_${slug(item.w)}`]) : setTimeout(hear, 350);
  });
}
teamLevel(5, 'Digraphs', '#a37fe8', DIGRAPHS, 'ui_l5');
teamLevel(6, 'Vowel Teams', '#ffb000', VOWEL_TEAMS, 'ui_l6');

// ---------------- Level 7: tricky words (learn each word, then find it) ----------------
route('level7', el => {
  const t = menuFrame(el, 7, 'Tricky Words', '#1fa7e1', () => go('discover', { page: 2 }));
  const best = store.progress().best;
  const w = 220, gap = 26, x0 = (1194 - (TRICKY.length * w + (TRICKY.length - 1) * gap)) / 2;
  TRICKY.forEach((s, i) => {
    const c = box(x0 + i * (w + gap), 350, w, 230, '');
    c.style.cssText += `border-radius:22px;background:#fbfdfe;box-shadow:0 0 0 8px ${s.color},0 10px 16px rgba(0,0,0,.15);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer`;
    c.innerHTML = `<div style="font:900 20px Nunito;color:${s.color}">${s.name}</div>${s.words.slice(0, 3).map(x => `<div style="font:400 44px/1.1 'Cal Sans',Fredoka;color:#109586">${x}</div>`).join('')}<div style="font:800 18px Nunito;color:#8aa">+ ${s.words.length - 3} more</div>`;
    t.append(c);
    t.append(box(x0 + i * (w + gap), 600, w, 30, '', `<div style="text-align:center;font-size:28px">${starRow(best[`l7_${i}`] || 0)}</div>`));
    onTap(c, () => go('l7', { k: i, step: 'learn', i: 0 }), { sound: 'nav' });
  });
  say('ui_l7');
});

route('l7', (el, P) => {
  const { k, step } = P;
  const set = TRICKY[k];
  const exit = () => go('level7');
  music('learn');
  const t = tpl('l4blend');
  el.append(t);
  lessonChrome(t, { exit: ['427:416'], gear: ['427:413'], pause: ['427:412', '427:415'] }, { exit });
  if (step === 'learn') {
    const i = P.i || 0;
    if (i === 0) store.startRun();
    const word = set.words[i];
    CARD.slice(0, 4).forEach(id => $(t, id).remove());
    progressDots(t, i, set.words.length);
    const card = box(297, 245, 600, 230, 'flex items-center justify-center');
    card.style.cssText += `border-radius:26px;background:#f1fffd;box-shadow:0 0 0 6px ${set.color};cursor:pointer`;
    card.innerHTML = `<span style="font:400 170px 'Cal Sans',Fredoka;color:#109586;line-height:1">${word}</span>`;
    t.append(card);
    const helper = box(80, 330, 190, 220, '', `<img src="${monsterSrc(pick(['Q', 'T', 'Y', 'K']))}" class="float" style="height:210px" alt="">`);
    t.append(helper);
    const hear = () => { animate(card, 'bounce'); say(`w_${slug(word)}`); };
    onTap(card, hear);
    const spk = box(527, 510, 140, 140, '', SPEAKER);
    spk.style.cursor = 'pointer'; spk.style.transform = 'scale(.8)';
    t.append(spk); onTap(spk, hear);
    const arrow = [$(t, '621:620'), $(t, '621:621')];
    arrow.forEach(a => onTap(a, () => go('l7', i + 1 < set.words.length ? { k, step: 'learn', i: i + 1 } : { k, step: 'quiz' }), { sound: 'nav' }));
    i === 0 ? sayAll(['ui_l7_look', `w_${slug(word)}`]) : setTimeout(hear, 350);
    return;
  }
  // quiz: hear a tricky word, tap it among three
  const Q = set.words.length;
  const q = P.q || 0;
  const order = P.order || shuffle(set.words);
  const word = order[q];
  el.dataset.answer = word;
  CARD.forEach(id => $(t, id).remove());
  progressDots(t, q, Q);
  const spk = box(527, 240, 140, 140, '', SPEAKER);
  spk.style.cursor = 'pointer';
  t.append(spk);
  const hear = () => { animate(spk, 'bounce'); say(`w_${slug(word)}`); };
  onTap(spk, hear);
  const pool = TRICKY.flatMap(s => s.words);
  const opts = shuffle([word, ...shuffle(set.words.filter(x => x !== word)).slice(0, 1), ...shuffle(pool.filter(x => x !== word && !set.words.includes(x))).slice(0, 1)]);
  const tw = 250, tg = 36, tx = (1194 - (3 * tw + 2 * tg)) / 2;
  let answered = false;
  opts.forEach((o, j) => {
    const tile = box(tx + j * (tw + tg), 440, tw, 170, 'pm-tile');
    tile.className = 'pm-tile';
    tile.style.fontSize = '78px';
    tile.textContent = o;
    t.append(tile);
    onTap(tile, async () => {
      if (answered) return;
      if (o === word) {
        answered = true;
        store.recordAnswer(`tw_${word}`, true);
        tile.classList.add('good'); animate(tile, 'hop');
        await praise(q === Q - 1);
        if (q + 1 < Q) go('l7', { k, step: 'quiz', q: q + 1, order });
        else { store.completeLesson(7); go('reward', { key: `l7_${k}`, replay: ['l7', { k, step: 'learn', i: 0 }], done: ['level7', {}], next: k + 1 < TRICKY.length ? ['l7', { k: k + 1, step: 'learn', i: 0 }] : null }); }
      } else {
        store.recordAnswer(`tw_${word}`, false);
        tile.classList.add('bad'); animate(tile, 'shake'); tryAgain();
        setTimeout(() => { tile.classList.remove('bad'); tile.classList.add('tried'); }, 700);
        setTimeout(hear, 1500);
      }
    }, { sound: null });
  });
  q === 0 ? sayAll(['ui_l7_find', `w_${slug(word)}`]) : setTimeout(hear, 350);
});

// ---------------- Level 8: Boss Battle against Mumble the Word Wizard ----------------
const BOSS = { name: 'Mumble the Word Wizard' };
const TEAMS = [...DIGRAPHS, ...VOWEL_TEAMS];
function question() {
  const type = pick(['pic', 'pic', 'sound', 'mid', 'team', 'tricky']);
  if (type === 'sound') {
    const L = pick(LETTERS);
    return { type, prompt: `ph_${L}`, answer: L, options: shuffle([L, ...shuffle(LETTERS.filter(x => x !== L)).slice(0, 3)]) };
  }
  if (type === 'team') {
    const g = pick(TEAMS), w = pick(g.words);
    return { type, word: w, answer: g.d, options: shuffle([g.d, ...shuffle(TEAMS.map(x => x.d).filter(d => d !== g.d && !w.includes(d))).slice(0, 2)]) };
  }
  if (type === 'tricky') {
    const pool = TRICKY.flatMap(s => s.words), w = pick(pool);
    return { type, word: w, answer: w, options: shuffle([w, ...shuffle(pool.filter(x => x !== w)).slice(0, 2)]) };
  }
  const word = pick(type === 'mid' ? BOSS_WORDS.filter(w => w.length === 3 && VOWELS.includes(w[1].toUpperCase())) : BOSS_WORDS);
  if (type === 'mid') {
    const v = word[1].toUpperCase();
    return { type, word, answer: v, options: shuffle([v, ...shuffle(VOWELS.filter(x => x !== v)).slice(0, 2)]) };
  }
  const same = BOSS_WORDS.filter(w => w !== word && (w.length === word.length || w[0] === word[0]));
  return { type, word, answer: word, options: shuffle([word, ...shuffle(same.length >= 2 ? same : BOSS_WORDS.filter(w => w !== word)).slice(0, 2)]) };
}

route('level8', (el, P = {}) => {
  const wins = store.progress().levels[8] || 0;
  const maxHp = P.maxHp || Math.min(14, 10 + wins * 2);
  const S = P.S || { hp: maxHp, hearts: 3, n: 0 };
  if (!P.S) store.startRun();
  const q = question();
  const t = tpl('l4blend');
  el.append(t);
  el.dataset.answer = q.answer; // lets automated play-throughs find the right tile
  music('games');
  const exit = () => go('discover', { page: 2 });
  lessonChrome(t, { exit: ['427:416'], gear: ['427:413'], pause: ['427:412', '427:415'] }, { exit });
  CARD.forEach(id => $(t, id).remove());
  // Mumble on the right of the arena card, getting grumpier as his hit points drop
  const boss = box(790, 220, 260, 310, '');
  boss.style.cssText += 'display:flex;align-items:flex-end;justify-content:center';
  boss.innerHTML = bossSvg(240, S.hp <= maxHp / 3 ? 'sad' : 'cheeky');
  boss.classList.add('float');
  t.append(boss);
  t.append(box(760, 186, 320, 30, '', `<div style="text-align:center;font:900 21px Nunito;color:#5b4a9b">${BOSS.name}</div>`));
  const hp = box(800, 545, 240, 26, 'pm-hp');
  hp.className = 'pm-hp';
  hp.innerHTML = `<i style="width:${100 * S.hp / maxHp}%"></i>`;
  t.append(hp);
  t.append(box(800, 578, 240, 24, '', `<div style="text-align:center;font:800 16px Nunito;color:#5b4a9b">${S.hp} / ${maxHp}</div>`));
  const hearts = box(160, 190, 200, 44, 'pm-hearts');
  hearts.className = 'pm-hearts';
  const drawHearts = () => { hearts.innerHTML = Array.from({ length: 3 }, (_, i) => ICON.heart(40, i < S.hearts)).join(''); };
  drawHearts();
  t.append(hearts);
  // question area: centred in the left part of the card (116..760)
  const cx = 438;
  let prompt;
  if (q.type === 'sound' || q.type === 'team' || q.type === 'tricky') {
    prompt = box(cx - 70, 250, 140, 140, '', SPEAKER);
  } else {
    prompt = box(cx - 100, 215, 200, 200, '', `<img src="${picSrc(q.word)}" style="width:100%;height:100%;object-fit:contain" alt="">`);
    if (q.type === 'mid') t.append(box(cx - 150, 412, 300, 70, '', `<div style="text-align:center;font:400 64px 'Cal Sans',Fredoka;color:#109586;letter-spacing:12px;line-height:70px">${q.word[0]}<span style="color:#fa96ba">_</span>${q.word[2]}</div>`));
  }
  prompt.style.cursor = 'pointer';
  t.append(prompt);
  const clip = { sound: q.prompt, pic: 'ui_boss_pic', mid: q.word && `w_${slug(q.word)}`, team: q.word && `w_${slug(q.word)}`, tricky: q.word && `w_${slug(q.word)}` }[q.type];
  const hear = () => { animate(prompt, 'bounce'); say(clip); };
  onTap(prompt, hear);
  const n = q.options.length;
  const tw = q.type === 'pic' || q.type === 'tricky' ? 170 : 120, tg = 22, tx = cx - (n * tw + (n - 1) * tg) / 2;
  let answered = false;
  q.options.forEach((o, j) => {
    const tile = box(tx + j * (tw + tg), 500, tw, 120, 'pm-tile');
    tile.className = 'pm-tile';
    tile.style.fontSize = q.type === 'pic' || q.type === 'tricky' ? '46px' : q.type === 'team' ? '62px' : '80px';
    tile.textContent = o;
    t.append(tile);
    onTap(tile, async () => {
      if (answered) return;
      answered = true;
      const right = o === q.answer;
      store.recordAnswer(q.type === 'sound' || q.type === 'mid' || q.type === 'team' ? q.answer : q.type === 'tricky' ? `tw_${q.word}` : q.word[0].toUpperCase(), right);
      if (right) {
        tile.classList.add('good'); animate(tile, 'hop');
        S.hp--; S.n++;
        sfx('correct'); boss.classList.remove('float'); animate(boss, 'pm-hit');
        hp.querySelector('i').style.width = `${100 * S.hp / maxHp}%`;
        if (q.type === 'pic' || q.type === 'mid') await say(`w_${slug(q.word)}`); else await say('ui_boss_hit');
        await wait(250);
        if (S.hp <= 0) return victory();
        go('level8', { S, maxHp });
      } else {
        tile.classList.add('bad');
        S.hearts--;
        animate(t, 'shake'); sfx('wrong');
        drawHearts();
        // show the right answer before moving on
        [...t.querySelectorAll('.pm-tile')].find(x => x.textContent === q.answer)?.classList.add('good');
        await tryAgain(); await wait(400);
        if (S.hearts <= 0) return defeat();
        go('level8', { S, maxHp });
      }
    }, { sound: null });
  });
  // build only the chosen question's lines ('sound' questions have no word)
  const ask = { sound: ['ui_boss_sound', q.prompt], pic: ['ui_boss_pic'], mid: ['ui_boss_mid', clip], team: ['ui_boss_team', clip], tricky: ['ui_boss_tricky', clip] }[q.type];
  sayAll(P.S ? ask : ['ui_l8', ...ask]);

  async function victory() {
    boss.style.transition = 'transform 1s ease, opacity 1s ease';
    boss.style.transform = 'rotate(540deg) scale(.1)'; boss.style.opacity = 0;
    sfx('cheer'); confetti(140);
    await say('ui_boss_win');
    store.completeLesson(8);
    go('reward', { key: 'boss', stars: S.hearts, replay: ['level8', {}], done: ['discover', { page: 2 }] });
  }
  function defeat() {
    const card = h('div', 'pm-card pop');
    card.style.width = '560px';
    card.innerHTML = `${bossSvg(150)}<h2>So close!</h2><p>You knocked Mumble down to ${S.hp} hit points. Try again?</p>`;
    const row = h('div', 'pm-row');
    const again = h('div', 'pm-btn', 'TRY AGAIN'), quit = h('div', 'pm-btn alt', 'EXIT');
    row.append(quit, again); card.append(row);
    overlay(card);
    onTap(again, () => go('level8', {}), { sound: 'pop' });
    onTap(quit, exit, { sound: 'nav' });
    say('ui_boss_lose');
  }
});
