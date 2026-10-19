// Main tabs: Home, Discover, Minigames, PhonoDex (+ monster page), Shop.
import { route, go, tpl, $, $$, h, box, onTap, overlay, toast, stagePoint } from './core.js';
import * as store from './store.js';
import { music, say, sfx, preload } from './audio.js';
import { bindHeader, settingsPopup, parentGate, monsterSrc } from './ui.js';
import { MONSTERS, LETTERS, VOWELS } from './data.js';

/** Horizontal drag-to-scroll for mouse users (touch scrolls natively). */
function dragScroll(el) {
  let down = null, moved = false;
  el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, s: el.scrollLeft }; moved = false; });
  el.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 6) moved = true; el.scrollLeft = down.s - dx; });
  addEventListener('pointerup', () => { down = null; });
  el.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
}
const LOCK_IMG = (w, hgt) => `<div class="absolute overflow-hidden pointer-events-none" style="width:${w}px;height:${hgt}px;transform:scaleX(-1)"><img src="img-ff72a7ab2f1b.png" class="absolute max-w-none h-full left-[-105.81%] top-0 w-[330.32%]" alt=""></div>`;

route('home', el => {
  if (!store.profile()) return go('profiles');
  const t = tpl('home');
  el.append(t);
  music('menu');
  bindHeader(t);
  // the card strip scrolls sideways (as in the parental-lock frame of the same screen)
  const strip = $(t, '143:258');
  strip.className = 'absolute h-[468px] left-[35px] top-[calc(25%+7.5px)] w-[1125px] overflow-x-auto overflow-y-hidden no-scrollbar';
  dragScroll(strip);
  const comp = strip.firstElementChild;
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
});

route('discover', el => {
  const t = tpl('discover');
  el.append(t);
  music('menu');
  bindHeader(t);
  [326 - 281, 326, 607, 888].forEach((x, i) => {
    const hit = box(x, 293, 261, 320, 'z-10');
    t.append(hit);
    onTap(hit, () => go(`level${i + 1}`), { sound: 'nav' });
  });
  const lv = store.progress().levels;
  // tiny progress badge on each level card
  [45, 326, 607, 888].forEach((x, i) => {
    const n = i === 0 ? Object.keys(store.progress().letters).length : lv[i + 1] || 0;
    if (!n) return;
    t.append(box(x + 205, 280, 64, 34, "rounded-full bg-white text-[#1c9886] font-['Nunito'] font-extrabold text-[18px] flex items-center justify-center shadow-[0_3px_0_#57b8b6] z-20", `★ ${i === 0 ? n + '/26' : n}`));
  });
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
  const tabs = [['all', 'All Monsters'], ['vowels', 'Vowels'], ['consonants', 'Consonants']];
  tabs.forEach(([k, label], i) => {
    const on = k === filter;
    const tab = box(49, 256 + i * 96, 141, 76, `rounded-l-[10px] flex items-center justify-center font-['Nunito'] text-[20px] ${on ? 'bg-[#fa96ba] text-[#fbfdfe] font-bold' : 'bg-[#f1fffd] text-[#1c9886] font-semibold'}`, label);
    t.append(tab);
    if (!on) onTap(tab, () => go('phonodex', { filter: k }));
  });
  const panel = box(189, 242, 963, 540, 'bg-[#fcfeff] rounded-tr-[10px] rounded-br-[10px] overflow-hidden');
  const scroller = h('div', 'absolute inset-0 overflow-y-auto scroll-teal pt-[33px] pb-[33px] pl-[48px] pr-[24px]');
  const grid = h('div', 'grid grid-cols-[256px_256px_256px] gap-x-[25px] gap-y-[20px]');
  scroller.append(grid); panel.append(scroller); t.append(panel);
  const letters = LETTERS.filter(L => filter === 'all' || (filter === 'vowels') === VOWELS.includes(L));
  for (const L of letters) {
    const open = store.isUnlocked(L);
    const tile = h('div', `relative h-[149px] rounded-[10px] overflow-hidden ${open ? 'bg-[#e6f5fb]' : 'bg-[#393d40]'}`);
    tile.innerHTML = `<img src="${monsterSrc(L)}" alt="" class="absolute max-w-none h-[250px] left-[-6px] top-[-18px] pointer-events-none" style="${open ? '' : 'filter:brightness(0)'}">
      <p class="absolute right-[18px] bottom-[6px] m-0 font-['Cal_Sans'] text-[52px] leading-[normal] ${open ? 'text-[#1d6b62]' : 'text-[#1b2526]'}">${L}${L.toLowerCase()}</p>`;
    if (!open) { const lk = h('div', 'absolute left-[104px] top-[42px]', LOCK_IMG(58, 69)); tile.append(lk); }
    grid.append(tile);
    onTap(tile, () => {
      if (open) go('monster', { L, filter });
      else { sfx('locked'); say('ui_locked'); tile.classList.add('shake'); setTimeout(() => tile.classList.remove('shake'), 500); }
    }, { sound: open ? 'pop' : null });
  }
  if (!letters.length) grid.append(h('p', "col-span-3 font-['Nunito'] text-[24px] text-[#1c9886]", 'No monsters here yet!'));
  const count = store.progress().unlocked.length;
  t.append(box(49, 560, 141, 60, "flex flex-col items-center justify-center font-['Nunito'] font-extrabold text-[#1c9886] text-[18px] leading-tight", `<span class="text-[28px]">${count}/26</span>collected`));
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
    card.innerHTML = `<p class="m-0 font-['KitRounded'] text-[38px] text-[#109586]">Unlock All Monsters</p><p class="m-0 font-['Nunito'] text-[22px] text-[#333]">This preview version unlocks all 26 PhonoMonsters for free. In the full app this will be an in-app purchase.</p>`;
    const row = h('div', 'flex gap-6 mt-2');
    const yes = h('div', "w-[220px] h-[76px] rounded-[10px] bg-[#fa96ba] shadow-[0_6px_0_#e17b9f] flex items-center justify-center font-['Nunito'] font-extrabold text-[30px] text-white", 'UNLOCK');
    const no = h('div', "w-[220px] h-[76px] rounded-[10px] bg-[#f1fffd] shadow-[0_6px_0_#57b8b6] flex items-center justify-center font-['Nunito'] font-extrabold text-[30px] text-[#1c9886]", 'CANCEL');
    row.append(no, yes); card.append(row);
    const o = overlay(card, { closeOnDim: true });
    onTap(no, () => o.close());
    onTap(yes, () => { store.unlockAll(); o.close(); sfx('unlock'); say('ui_unlocked'); toast('All 26 monsters unlocked! 🎉'); }, { sound: 'sparkle' });
  }
});
