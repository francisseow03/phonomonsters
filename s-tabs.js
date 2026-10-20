// Main tabs: Home, Discover, Minigames, PhonoDex (+ monster page), Shop.
import { route, go, tpl, $, $$, h, box, onTap, overlay, toast, stagePoint, getScale } from './core.js';
import * as store from './store.js';
import { music, say, sfx, preload } from './audio.js';
import { bindHeader, settingsPopup, parentGate, monsterSrc } from './ui.js';
import { MONSTERS, LETTERS, VOWELS } from './data.js';
import { dailyCheckIn, checkBadges, badgeGrid, lockOver, lockSvg } from './game.js';

/** Horizontal drag-to-scroll for mouse users (touch scrolls natively). */
function dragScroll(el) {
  let down = null, moved = false;
  el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, s: el.scrollLeft }; moved = false; });
  el.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 6) moved = true; el.scrollLeft = down.s - dx; });
  const up = () => { down = null; };
  addEventListener('pointerup', up);
  el.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  return () => removeEventListener('pointerup', up);
}

route('home', el => {
  if (!store.profile()) return go('profiles');
  const t = tpl('home');
  el.append(t);
  music('menu');
  bindHeader(t);
  // the card strip scrolls sideways (as in the parental-lock frame of the same screen)
  const strip = $(t, '143:258');
  strip.className = 'absolute h-[468px] left-[35px] top-[calc(25%+7.5px)] w-[1125px] overflow-x-auto overflow-y-hidden no-scrollbar';
  const stopDrag = dragScroll(strip);
  const comp = strip.firstElementChild;
  // the rotated + masked card backgrounds bleed below their boxes; clip each to its light-blue panel
  const panels = [...comp.children].filter(b => b.className.includes('bg-[#e6f5fb]'));
  const k = getScale();
  for (const g of $$(comp, '[data-name="Mask group"] > div')) {
    const gr = g.getBoundingClientRect();
    const p = panels.map(b => b.getBoundingClientRect()).sort((a, b) => Math.abs(a.left - gr.left) - Math.abs(b.left - gr.left))[0];
    if (!p) continue;
    const ins = [p.top - gr.top, gr.right - p.right, gr.bottom - p.bottom, p.left - gr.left].map(v => Math.max(0, v / k) + 'px');
    g.style.clipPath = `inset(${ins.join(' ')} round 15px)`;
  }
  const targets = ['discover', 'minigames', 'phonodex', 'shop', 'parent'];
  comp.style.cursor = 'pointer';
  comp.addEventListener('click', e => {
    const x = (e.clientX - comp.getBoundingClientRect().left) / (comp.getBoundingClientRect().width / 1888);
    const i = Math.min(4, Math.floor(x / 382));
    if (x - i * 382 > 362) return;
    sfx('nav');
    const tg = targets[i];
    tg === 'parent' ? parentGate(() => go('settings')) : go(tg);
  });
  onTap($(t, '785:1108'), () => go('profiles'), { sound: 'nav' });
  say('ui_home');
  const welcome = setTimeout(() => { if (store.profile()) { dailyCheckIn(); checkBadges(); } }, 700);
  return () => { clearTimeout(welcome); stopDrag(); };
});

const CARD_NODES = ['85:23', '609:1613', '85:24', '85:25', '85:26', '609:1615', '609:1618', '609:1619', '85:35', '85:36', '85:37', '85:38', '85:46', '85:53', '85:57', '85:59', '75:68', '75:72', '75:70', '75:73', '60:103', '75:74', '75:71', '75:75', '96:482', '100:529', '102:38', '102:39', '101:32', '102:46', '106:104', '99:524', '100:528', '101:34', '101:35', '102:45', '106:103', '609:1620', '609:1621', '609:1622'];
const progressChip = (t, x, text) => t.append(box(x + 205, 280, 64, 34, "rounded-full bg-white text-[#1c9886] font-['Nunito'] font-extrabold text-[18px] flex items-center justify-center shadow-[0_3px_0_#57b8b6] z-20", text));

route('discover', (el, { page = 1 } = {}) => {
  const t = tpl('discover');
  el.append(t);
  music('menu');
  bindHeader(t);
  const pr = store.progress(), lv = pr.levels;
  const open = n => store.levelOpen(n);
  const lock = (n, x) => lockOver(t, x, 293, 261, 330, store.LEVEL_GATES[n].text);
  if (page === 1) {
    [45, 326, 607, 888].forEach((x, i) => {
      const n = i + 1;
      const hit = box(x, 293, 261, 320, 'z-10');
      t.append(hit);
      onTap(hit, () => go(`level${n}`), { sound: 'nav' });
      // tiny progress badge on each level card
      const done = i === 0 ? Object.keys(pr.letters).length : lv[n] || 0;
      if (done) progressChip(t, x, `★ ${i === 0 ? done + '/26' : done}`);
      if (!open(n)) lock(n, x);
    });
    const more = h('div', 'pm-arrowbtn', 'More levels ➜');
    Object.assign(more.style, { left: '597px', top: '660px', transform: 'translateX(-50%)' });
    t.append(more);
    onTap(more, () => go('discover', { page: 2 }), { sound: 'nav' });
  } else {
    CARD_NODES.forEach(id => $(t, id)?.remove());
    const cards = [
      { n: 5, x: 326, color: '#a37fe8', dark: '#8a63d6', sub: 'Digraphs', art: `<img src="m-S.png" style="position:absolute;left:14px;bottom:8px;height:96px" alt=""><img src="m-H.png" style="position:absolute;right:14px;bottom:8px;height:96px" alt=""><div style="position:absolute;top:6px;left:0;right:0;text-align:center;font:400 80px 'Cal Sans',Fredoka;color:#a37fe8;line-height:1">sh</div>` },
      { n: 6, x: 607, color: '#5b4a9b', dark: '#46397a', sub: 'Boss Battle', art: `<img src="m-N.png" style="height:160px;filter:hue-rotate(200deg) saturate(1.3)" alt=""><div style="position:absolute;top:2px;left:50%;transform:translateX(-50%) rotate(-8deg);font-size:46px">👑</div><div style="position:absolute;left:12px;top:12px;font:900 30px Nunito;color:#fb5063">VS</div>` },
    ];
    for (const c of cards) {
      const card = box(c.x, 293, 261, 275, 'pm-level');
      card.className = 'pm-level';
      Object.assign(card.style, { background: c.color, boxShadow: `0 6px 0 ${c.dark}` });
      card.innerHTML = `<h3>Level ${c.n}</h3><small>${c.sub}</small><div class="art">${c.art}</div>`;
      t.append(card);
      const play = box(c.x + 70, 554, 121, 65, '', `<div style="width:121px;height:59px;border-radius:10px;background:#fa96ba;box-shadow:0 6px 0 #e17b9f;display:flex;align-items:center;justify-content:center;font:700 32px Nunito;color:#fff">Play</div>`);
      t.append(play);
      const hit = box(c.x, 293, 261, 330, 'z-10');
      t.append(hit);
      onTap(hit, () => go(`level${c.n}`), { sound: 'nav' });
      if (lv[c.n]) progressChip(t, c.x, `★ ${lv[c.n]}`);
      if (!open(c.n)) lock(c.n, c.x);
    }
    const back = h('div', 'pm-arrowbtn', '⬅ Levels 1 - 4');
    Object.assign(back.style, { left: '597px', top: '660px', transform: 'translateX(-50%)' });
    t.append(back);
    onTap(back, () => go('discover'), { sound: 'nav' });
  }
  onTap($(t, '96:182'), () => settingsPopup());
  say('ui_discover');
});

route('minigames', el => {
  const t = tpl('minigames');
  el.append(t);
  music('games');
  bindHeader(t);
  ['blendgame', 'soundgame', 'reading', 'memory'].forEach((g, i) => {
    const hit = box(20 + i * 301, 285, 253, 330, 'z-10 rounded-full');
    t.append(hit);
    onTap(hit, () => go(g), { sound: 'nav' });
  });
  say('ui_minigames');
});

route('phonodex', (el, { filter = 'all' } = {}) => {
  const t = tpl('home');
  el.append(t);
  music('menu');
  $(t, '143:258').remove(); $(t, '785:1108').remove();
  // nav state: home off, trophy on
  const homeImg = $(t, '633:2141').querySelector('img'); homeImg.src = 'data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9Ijc1IiBoZWlnaHQ9Ijc1IiB2aWV3Qm94PSIwIDAgNzUgNzUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJIT01FIj4KPGNpcmNsZSBpZD0iRWxsaXBzZSA2IiBjeD0iMzcuNSIgY3k9IjM3LjUiIHI9IjM3LjUiIGZpbGw9IiM1N0I4QjYiLz4KPGcgaWQ9Ik1hc2sgZ3JvdXAiPgo8bWFzayBpZD0ibWFzazBfMF80MSIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9Ijc1IiBoZWlnaHQ9Ijc1Ij4KPGNpcmNsZSBpZD0iRWxsaXBzZSA3IiBjeD0iMzcuNSIgY3k9IjM3LjUiIHI9IjM3LjUiIGZpbGw9IiM2RUQwQ0YiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzBfNDEpIj4KPHBhdGggaWQ9IkVsbGlwc2UgOCIgZD0iTTc1IDM0LjQ5OTlDNzUgNTUuMjEwNiA1OC4yMTA3IDcxLjk5OTkgMzcuNSA3MS45OTk5QzE2Ljc4OTMgNzEuOTk5OSAwIDU1LjIxMDYgMCAzNC40OTk5QzAgMTMuNzg5MiAxNi43ODkzIC0zLjAwMDEyIDM3LjUgLTMuMDAwMTJDNTguMjEwNyAtMy4wMDAxMiA3NSAxMy43ODkyIDc1IDM0LjQ5OTlaIiBmaWxsPSIjNkVEMENGIi8+CjwvZz4KPC9nPgo8cGF0aCBpZD0iVmVjdG9yIDQiIGQ9Ik0yMi45MTk1IDYuMjYyMjZDMTMuOTM5MiAxMC43MjU3IDkuODk4MDMgMTkuMjgwNSA5IDIzQzI0LjI2NjYgMTUuMjczOSAzOC42OTA5IDguNTI3MDMgMzYuODM5IDQuNTQ0MzNDMzUuMDQyOSAwLjY4MTY3MSAyNS4xNjQ2IDUuMTQ2MzQgMjIuOTE5NSA2LjI2MjI2WiIgZmlsbD0iI0ZDRkVGRiIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPGcgaWQ9InR5cGNuOmhvbWUiPgo8cGF0aCBpZD0iVmVjdG9yIiBkPSJNMzggMTkuMjVDMzggMTkuMjUgMjUuMTEyNSAzMC4zNzUgMTcuOTEwNCAzNi40QzE3LjY4MTEgMzYuNTk5NiAxNy40OTY0IDM2Ljg0NTIgMTcuMzY4MyAzNy4xMjA5QzE3LjI0MDIgMzcuMzk2NSAxNy4xNzE1IDM3LjY5NjEgMTcuMTY2NyAzOEMxNy4xNjY3IDM4LjU1MjUgMTcuMzg2MiAzOS4wODI0IDE3Ljc3NjkgMzkuNDczMUMxOC4xNjc2IDM5Ljg2MzggMTguNjk3NSA0MC4wODMzIDE5LjI1IDQwLjA4MzNIMjMuNDE2N1Y1NC42NjY3QzIzLjQxNjcgNTUuMjE5MiAyMy42MzYyIDU1Ljc0OTEgMjQuMDI2OSA1Ni4xMzk4QzI0LjQxNzYgNTYuNTMwNSAyNC45NDc1IDU2Ljc1IDI1LjUgNTYuNzVIMzEuNzVDMzIuMzAyNSA1Ni43NSAzMi44MzI0IDU2LjUzMDUgMzMuMjIzMSA1Ni4xMzk4QzMzLjYxMzggNTUuNzQ5MSAzMy44MzMzIDU1LjIxOTIgMzMuODMzMyA1NC42NjY3VjQ2LjMzMzNINDIuMTY2N1Y1NC42NjY3QzQyLjE2NjcgNTUuMjE5MiA0Mi4zODYyIDU1Ljc0OTEgNDIuNzc2OSA1Ni4xMzk4QzQzLjE2NzYgNTYuNTMwNSA0My42OTc1IDU2Ljc1IDQ0LjI1IDU2Ljc1SDUwLjVDNTEuMDUyNSA1Ni43NSA1MS41ODI0IDU2LjUzMDUgNTEuOTczMSA1Ni4xMzk4QzUyLjM2MzggNTUuNzQ5MSA1Mi41ODMzIDU1LjIxOTIgNTIuNTgzMyA1NC42NjY3VjQwLjA4MzNINTYuNzVDNTcuMzAyNSA0MC4wODMzIDU3LjgzMjQgMzkuODYzOCA1OC4yMjMxIDM5LjQ3MzFDNTguNjEzOCAzOS4wODI0IDU4LjgzMzMgMzguNTUyNSA1OC44MzMzIDM4QzU4LjgzMDQgMzcuNjkwMiA1OC43NTcxIDM3LjM4NTIgNTguNjE4OCAzNy4xMDhDNTguNDgwNiAzNi44MzA4IDU4LjI4MTEgMzYuNTg4NyA1OC4wMzU0IDM2LjRDNTAuODgzMyAzMC4zNzUgMzggMTkuMjUgMzggMTkuMjVaIiBmaWxsPSIjRkNGRUZGIi8+CjwvZz4KPC9nPgo8L3N2Zz4K';
  const dexImg = $(t, '633:2162').querySelector('img'); dexImg.src = 'img-nav-phonodex-on.png';
  bindHeader(t);
  $(t, '143:197').style.opacity = '0.28';
  // title pill
  t.append(box(463, 157, 268, 67, "rounded-[50px] bg-[#1fa7e1] shadow-[0px_4px_0px_0px_#149dd3] flex items-center justify-center font-['KitRounded'] text-[36px] text-[#fbfdfe]", 'PhonoDex'));
  // side tabs
  const tabs = [['all', 'All Monsters'], ['vowels', 'Vowels'], ['consonants', 'Consonants'], ['badges', 'Badges']];
  tabs.forEach(([k, label], i) => {
    const on = k === filter;
    const tab = box(49, 256 + i * 96, 141, 76, `rounded-l-[10px] flex items-center justify-center font-['Nunito'] text-[20px] ${on ? 'bg-[#fa96ba] text-[#fbfdfe] font-bold' : 'bg-[#f1fffd] text-[#1c9886] font-semibold'}`, label);
    t.append(tab);
    if (!on) onTap(tab, () => go('phonodex', { filter: k }));
  });
  const panel = box(189, 242, 963, 540, 'bg-[#fcfeff] rounded-tr-[10px] rounded-br-[10px] overflow-hidden');
  const scroller = h('div', 'absolute inset-0 overflow-y-auto scroll-teal');
  scroller.style.padding = '33px 0';
  const grid = h('div', 'grid grid-cols-[256px_256px_256px] gap-x-[25px] gap-y-[20px]');
  grid.style.justifyContent = 'center';
  scroller.append(grid); panel.append(scroller); t.append(panel);
  if (filter === 'badges') {
    grid.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:26px 22px;padding:0 20px';
    badgeGrid(grid);
  }
  const letters = filter === 'badges' ? [] : LETTERS.filter(L => filter === 'all' || (filter === 'vowels') === VOWELS.includes(L));
  for (const L of letters) {
    const open = store.isUnlocked(L);
    const tile = h('div', `relative h-[149px] rounded-[10px] overflow-hidden ${open ? 'bg-[#e6f5fb]' : 'bg-[#393d40]'}`);
    // monster centred in the left half of the tile, letters centred in the right half
    tile.innerHTML = `<img src="${monsterSrc(L)}" alt="" style="position:absolute;left:8px;top:8px;width:132px;height:133px;object-fit:contain;pointer-events:none;${open ? '' : 'filter:brightness(0) opacity(.85)'}">
      <p style="position:absolute;left:140px;right:8px;top:0;bottom:0;margin:0;display:flex;align-items:center;justify-content:center;font-family:'Cal Sans',Fredoka,sans-serif;font-size:56px;color:${open ? '#1d6b62' : '#5d6a6c'}">${L}${L.toLowerCase()}</p>`;
    if (!open) tile.append(h('div', '', `<div style="position:absolute;left:42px;top:42px;pointer-events:none">${lockSvg(64)}</div>`));
    grid.append(tile);
    onTap(tile, () => {
      if (open) go('monster', { L, filter });
      else { sfx('locked'); say('ui_locked'); tile.classList.add('shake'); setTimeout(() => tile.classList.remove('shake'), 500); }
    }, { sound: open ? 'pop' : null });
  }
  const count = store.progress().unlocked.length;
  t.append(box(49, 640, 141, 60, "flex flex-col items-center justify-center font-['Nunito'] font-extrabold text-[#1c9886] text-[18px] leading-tight", `<span class="text-[28px]">${count}/26</span>collected`));
  say('ui_phonodex');
});

route('monster', (el, { L = 'A', filter = 'all' }) => {
  const m = MONSTERS[L];
  const t = tpl('monster');
  el.append(t);
  music('menu');
  bindHeader(t);
  preload(`snd_${L}`, `desc_${L}`);
  $(t, '81:238').textContent = `Monster ${L}`;
  $(t, '81:239').textContent = `Play the ${L} Sound`;
  $(t, '81:241').innerHTML = `<p class="mb-0"><span class="font-['Nunito'] font-extrabold leading-[normal] text-[#109586] text-[28px]">Letter ${L} Monster</span><br><span class="font-['Nunito'] font-normal leading-[normal] text-[#333] text-[24px]">${m.desc}</span></p><p class="leading-[normal] mb-0 text-[24px]">&#8203;</p><p class="font-['Nunito'] leading-[normal] text-[#333] text-[24px]">${m.why}</p>`;
  $(t, '81:242').innerHTML = `<p class="font-['Nunito'] font-extrabold leading-[normal] mb-0">Category </p><p class="font-['Nunito'] leading-[normal] text-[#333]">${VOWELS.includes(L) ? `Letter ${L} is part of the vowel friends including (A,E,I,O,U)` : `Letter ${L} is part of the consonant friends.`}</p>`;
  const art = $(t, '97:495');
  art.innerHTML = `<img src="${monsterSrc(L)}" alt="Monster ${L}" class="absolute inset-0 size-full object-contain pointer-events-none">`;
  art.classList.add('float');
  onTap(art, () => { sfx('giggle'); art.classList.remove('float'); art.classList.add('wiggle'); setTimeout(() => { art.classList.remove('wiggle'); art.classList.add('float'); }, 600); say(`snd_${L}`); }, { sound: null });
  const playSound = () => { say(`snd_${L}`); };
  [$(t, '498:413'), $(t, '81:239')].forEach(n => onTap(n, playSound));
  [$(t, '81:244'), $(t, '81:246'), $(t, '81:240')].forEach(n => onTap(n, () => say(`desc_${L}`)));
  onTap($(t, '97:488'), () => go('phonodex', { filter }), { sound: 'nav' });
  // swipe between unlocked monsters
  const list = LETTERS.filter(store.isUnlocked);
  const i = list.indexOf(L);
  const arrow = (x, dir, target) => {
    const a = box(x, 680, 60, 60, "rounded-full bg-[#f1fffd] shadow-[0_3px_0_#57b8b6] flex items-center justify-center text-[#1c9886] text-[34px] font-['Nunito'] font-extrabold", dir);
    t.append(a); onTap(a, () => go('monster', { L: target, filter }), { sound: 'nav' });
  };
  if (i > 0) arrow(48, '‹', list[i - 1]);
  if (i >= 0 && i < list.length - 1) arrow(380, '›', list[i + 1]);
});

route('shop', el => {
  const t = tpl('shop');
  el.append(t);
  music('menu');
  bindHeader(t);
  say('ui_shop');
  const soon = (title, img) => {
    const card = h('div', 'relative pop bg-[#eafbfe] border-[10px] border-[#b3e8ff] rounded-[20px] shadow-[0_6px_0_#78bddb] w-[560px] px-10 py-8 flex flex-col items-center gap-4 text-center');
    card.innerHTML = `<img src="${img}" class="h-[180px] object-contain" alt=""><p class="m-0 font-['KitRounded'] text-[38px] text-[#109586]">${title}</p><p class="m-0 font-['Nunito'] text-[22px] text-[#333]">Coming soon to the PhonoMonsters shop!<br>Ask a grown-up to check back later.</p>`;
    const ok = h('div', "mt-2 w-[220px] h-[76px] rounded-[10px] bg-[#fa96ba] shadow-[0_6px_0_#e17b9f] flex items-center justify-center font-['Nunito'] font-extrabold text-[34px] text-white", 'OK');
    card.append(ok);
    const o = overlay(card, { closeOnDim: true });
    onTap(ok, () => o.close());
    say('ui_coming_soon');
  };
  const items = [
    [46, 276, 403, 521, () => parentGate(unlockAll)],
    [467, 276, 401, 330, () => soon('Physical Books', 'img-17503c5cad2f.png')],
    [891, 276, 261, 330, () => soon('Soft Toys', 'img-fed0abbabfba.png')],
    [467, 563, 402, 231, () => soon('Worksheets', 'img-9f8515ace2bb.png')],
    [891, 563, 261, 231, () => soon('Merchandise', 'img-83fd85e6a8ee.png')],
  ];
  for (const [x, y, w, hh, fn] of items) { const b = box(x, y, w, hh, 'z-10 rounded-[10px]'); t.append(b); onTap(b, fn, { sound: 'pop' }); }
  function unlockAll() {
    const card = h('div', 'relative pop bg-[#eafbfe] border-[10px] border-[#b3e8ff] rounded-[20px] shadow-[0_6px_0_#78bddb] w-[600px] px-10 py-8 flex flex-col items-center gap-4 text-center');
    card.innerHTML = `<p class="m-0 font-['KitRounded'] text-[38px] text-[#109586]">Unlock All Monsters</p><p class="m-0 font-['Nunito'] text-[22px] text-[#333]">This preview version unlocks all 26 PhonoMonsters and opens every level for free. In the full app this will be an in-app purchase.</p>`;
    const row = h('div', 'flex gap-6 mt-2');
    const yes = h('div', "w-[220px] h-[76px] rounded-[10px] bg-[#fa96ba] shadow-[0_6px_0_#e17b9f] flex items-center justify-center font-['Nunito'] font-extrabold text-[30px] text-white", 'UNLOCK');
    const no = h('div', "w-[220px] h-[76px] rounded-[10px] bg-[#f1fffd] shadow-[0_6px_0_#57b8b6] flex items-center justify-center font-['Nunito'] font-extrabold text-[30px] text-[#1c9886]", 'CANCEL');
    row.append(no, yes); card.append(row);
    const o = overlay(card, { closeOnDim: true });
    onTap(no, () => o.close());
    onTap(yes, () => { store.unlockAll(); o.close(); sfx('unlock'); say('ui_unlocked'); toast('All monsters and levels unlocked! 🎉'); }, { sound: 'sparkle' });
  }
});
