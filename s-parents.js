// Parent area: Settings and Progress Reports (behind the "Parents Only" gate).
import { route, go, tpl, $, h, box, onTap, overlay, toast, stagePoint, stageRect } from './core.js';
import * as store from './store.js';
import { music, sfx, applySettings, say } from './audio.js';
import { avatarInner } from './ui.js';
import { addProfileDialog } from './s-auth.js';
import { LETTERS, VOWELS } from './data.js';

function fillBadge(t, nameId, avId) {
  const p = store.profile();
  if (!p) return;
  $(t, nameId).textContent = p.name;
  $(t, avId).innerHTML = avatarInner(p.avatar);
}

const CHILD_SLOTS = [
  { group: '616:639', img: '616:642', name: '616:643' },
  { group: '616:644', img: '616:647', name: '616:648' },
  { group: '616:649', img: '616:652', name: '616:653' },
];

route('settings', el => {
  const t = tpl('settings');
  el.append(t);
  music('menu');
  fillBadge(t, '616:661', '616:662');
  const s = store.settings();
  const kids = store.profiles();
  CHILD_SLOTS.forEach((slot, i) => {
    const p = kids[i];
    if (!p) { $(t, slot.group).remove(); return; }
    $(t, slot.img).innerHTML = avatarInner(p.avatar);
    const n = $(t, slot.name);
    n.textContent = p.name;
    const active = p.id === store.profile()?.id;
    n.className = n.className.replace(/text-\[#(188e81|333)\]/, active ? 'text-[#188e81]' : 'text-[#333]').replace(/font-semibold|font-bold/, active ? 'font-bold' : 'font-semibold');
    onTap($(t, slot.group), () => childMenu(p), { sound: 'pop' });
  });
  if (kids.length > 3) {
    const more = box(269 + 3 * 130, 330, 120, 30, "text-center font-['Nunito'] font-bold text-[16px] text-[#188e81]", `+${kids.length - 3} more`);
    t.append(more); onTap(more, () => go('profiles'));
  }
  onTap($(t, '616:654'), () => addProfileDialog(() => go('settings')), { sound: 'pop' });

  // toggles (replacing the static Figma switches)
  const toggle = (id, key, top) => {
    $(t, id).remove();
    const sw = h('div', 'switch' + (s[key] ? ' on' : ''));
    Object.assign(sw.style, { left: '517px', top: top + 'px' });
    t.append(sw);
    onTap(sw, () => { store.setSetting(key, !store.settings()[key]); sw.classList.toggle('on', store.settings()[key]); applySettings(); if (key === 'narrationOn' && store.settings()[key]) say('ui_kid_hello'); });
  };
  toggle('616:691', 'sfxOn', 558);
  toggle('616:692', 'musicOn', 618);
  toggle('616:695', 'narrationOn', 669);

  // volume sliders
  const slider = (fillId, key, y) => {
    const fill = $(t, fillId);
    const set = v => { v = Math.max(0, Math.min(1, v)); fill.style.width = 214 * v + 'px'; store.setSetting(key, v); applySettings(); };
    set(s[key]);
    const hit = box(262, y - 14, 228, 38, 'cursor-pointer z-10');
    t.append(hit);
    const move = e => set((stagePoint(e).x - 269) / 214);
    hit.addEventListener('pointerdown', e => { try { hit.setPointerCapture(e.pointerId); } catch {}; move(e); hit.onpointermove = move; });
    hit.addEventListener('pointerup', () => { hit.onpointermove = null; if (key === 'sfx') sfx('pop'); });
  };
  slider('616:687', 'sfx', 570);
  slider('616:701', 'music', 631);

  // child safety rows
  const val = (y, text) => { const v = box(830, y, 120, 28, "text-right font-['Nunito'] font-bold text-[16px] text-[#fa96ba]", text); t.append(v); return v; };
  const lockV = val(552, s.parentalLock ? 'On' : 'Off');
  const lockRow = box(705, 535, 330, 46, 'z-10'); t.append(lockRow);
  onTap(lockRow, () => { store.setSetting('parentalLock', !store.settings().parentalLock); lockV.textContent = store.settings().parentalLock ? 'On' : 'Off'; });
  const steps = [0, 15, 30, 45, 60];
  const stV = val(612, s.screentime ? `${s.screentime} min` : 'No limit');
  const stRow = box(705, 595, 330, 46, 'z-10'); t.append(stRow);
  onTap(stRow, () => {
    const next = steps[(steps.indexOf(store.settings().screentime) + 1) % steps.length];
    store.setSetting('screentime', next);
    stV.textContent = next ? `${next} min` : 'No limit';
  });

  onTap($(t, '616:634'), () => go('progress'), { sound: 'nav' });
  onTap($(t, '616:666'), () => go('progress'), { sound: 'nav' });
  onTap($(t, '616:663'), () => go('home'), { sound: 'nav' });
  const signOut = box(45, 700, 141, 50, "rounded-[10px] bg-[#f1fffd] flex items-center justify-center font-['Nunito'] font-bold text-[16px] text-[#1c9886] shadow-[0_3px_0_#57b8b6]", 'Sign out');
  t.append(signOut);
  onTap(signOut, () => { store.signOut(); go('login'); }, { sound: 'nav' });
  const credits = box(45, 760, 141, 30, "flex items-center justify-center font-['Nunito'] font-semibold text-[14px] text-[#1c9886] underline", 'Credits');
  t.append(credits);
  onTap(credits, () => {
    const card = h('div', "relative pop bg-[#eafbfe] border-[10px] border-[#b3e8ff] rounded-[20px] shadow-[0_6px_0_#78bddb] w-[700px] px-10 py-8 font-['Nunito'] text-[18px] text-[#333] leading-relaxed");
    card.innerHTML = `<p class="m-0 mb-3 font-['KitRounded'] text-[34px] text-[#109586]">Credits</p>
      <p class="m-0">PhonoMonsters concept, characters, illustrations &amp; UI design by <b>Tarika Pavana</b> (Final Major Project 2, 2026).</p>
      <p class="m-0 mt-2">Music &amp; sound effects: <b>Mixkit</b> (Mixkit free licence).</p>
      <p class="m-0 mt-2">Word pictures: <b>Twemoji</b> by Twitter, Inc. and contributors, CC-BY 4.0.</p>
      <p class="m-0 mt-2">Voices: Microsoft neural text-to-speech (prototype narration).</p>
      <p class="m-0 mt-2">Fonts: Nunito, Cal Sans, Fredoka (Google Fonts, OFL).</p>`;
    overlay(card, { closeOnDim: true });
  });
});

function childMenu(p) {
  const card = h('div', 'relative pop bg-[#eafbfe] border-[10px] border-[#b3e8ff] rounded-[20px] shadow-[0_6px_0_#78bddb] w-[520px] px-10 py-8 flex flex-col items-center gap-4');
  card.innerHTML = `<div class="relative size-[140px] rounded-full bg-white">${avatarInner(p.avatar)}</div><p class="m-0 font-['KitRounded'] text-[36px] text-[#109586]">${p.name}</p>`;
  const btn = (label, cls) => { const b = h('div', `w-[300px] h-[70px] rounded-[10px] flex items-center justify-center font-['Nunito'] font-extrabold text-[26px] ${cls}`, label); card.append(b); return b; };
  const play = btn(`Play as ${p.name}`, 'bg-[#fa96ba] text-white shadow-[0_6px_0_#e17b9f]');
  const rm = btn('Remove child', 'bg-[#f1fffd] text-[#1c9886] shadow-[0_6px_0_#57b8b6]');
  const o = overlay(card, { closeOnDim: true });
  onTap(play, () => { store.selectProfile(p.id); o.close(); go('home'); }, { sound: 'pop' });
  onTap(rm, () => {
    if (store.profiles().length <= 1) return toast('You need at least one child profile');
    if (rm.dataset.sure) { store.removeProfile(p.id); o.close(); go('settings'); }
    else { rm.dataset.sure = 1; rm.textContent = 'Tap again to remove'; rm.style.background = '#fb5063'; rm.style.color = '#fff'; }
  });
}

route('progress', el => {
  const t = tpl('progress');
  el.append(t);
  music('menu');
  fillBadge(t, '620:1770', '620:1771');
  const pr = store.progress();
  const bar = (id, frac) => { $(t, id).style.width = Math.max(4, 206 * Math.min(1, frac)) + 'px'; };

  const mins = pr.minutes[store.today()] || 0;
  $(t, '620:1804').textContent = `${Math.min(mins, 30)}/30 mins today`;
  bar('620:1817', mins / 30);
  const done = Object.keys(pr.letters).length;
  $(t, '620:1809').textContent = 'Complete Level 1';
  $(t, '620:1805').textContent = `${done}/26 alphabets`;
  bar('620:1818', done / 26);
  const vowels = VOWELS.filter(L => pr.unlocked.includes(L)).length;
  $(t, '620:1806').textContent = `${vowels}/5 vowel friends`;
  bar('620:1819', vowels / 5);

  // session review from game answers + mic attempts
  const stats = LETTERS.map(L => { const r = pr.results[L] || { right: 0, wrong: 0 }; return { L, n: r.right + r.wrong, rate: (r.right + 1) / (r.right + r.wrong + 2) }; }).filter(x => x.n > 0);
  const strong = [...stats].sort((a, b) => b.rate - a.rate).slice(0, 3);
  const weak = [...stats].sort((a, b) => a.rate - b.rate).filter(x => x.rate < 0.6 && !strong.slice(0, 1).includes(x)).slice(0, 2);
  const list = items => items.length ? items.map(x => `<li class="mb-0 ms-[24px]"><span class="leading-[normal]">Sound /${x.L.toLowerCase()}/</span></li>`).join('') : `<li class="ms-[24px] list-none"><span class="leading-[normal] text-[#888]">Play more games!</span></li>`;
  $(t, '620:1801').innerHTML = list(strong);
  $(t, '620:1802').innerHTML = list(weak);
  $(t, '620:1802').classList.remove('w-[99px]'); $(t, '620:1801').classList.remove('w-[99px]');
  if (!weak.length) $(t, '620:1808').innerHTML = `<p class="font-['Nunito'] font-bold leading-[normal] mb-0">Note:</p><p class="font-['Nunito'] leading-[normal] mb-0">No tricky sounds yet.</p><p class="font-['Nunito'] leading-[normal]">Keep exploring new monsters!</p>`;

  // AI accuracy donut
  const acc = pr.accuracy.slice(-30);
  const pct = acc.length ? Math.round(acc.reduce((a, b) => a + b.score, 0) / acc.length) : 0;
  const donut = $(t, '620:1779');
  donut.innerHTML = `<div class="absolute left-[44px] top-[12px] size-[170px] rounded-full" style="background:conic-gradient(#1fa7e1 ${pct * 3.6}deg,#b3e8ff 0)"></div>
    <div class="absolute left-[84px] top-[52px] size-[90px] rounded-full bg-[#fbfdfe] flex flex-col items-center justify-center font-['Nunito']"><b class="text-[28px] text-[#109586] leading-none">${pct}%</b><span class="text-[11px] text-[#555]">${acc.length} tries</span></div>`;

  // learned this week
  const week = Date.now() - 7 * 864e5;
  const recent = Object.entries(pr.letters).filter(([, v]) => v.at > week).sort((a, b) => b[1].at - a[1].at).map(([L]) => L).slice(0, 6);
  ['620:1826', '620:1828', '620:1830', '620:1827', '620:1829', '620:1831'].forEach((id, i) => {
    const L = recent[i];
    const tile = ['620:1820', '620:1822', '620:1824', '620:1821', '620:1823', '620:1825'][i];
    if (L) $(t, id).querySelector('p').textContent = L + L.toLowerCase();
    else { $(t, id).querySelector('p').textContent = '?'; $(t, tile).style.opacity = 0.25; }
  });

  onTap($(t, '620:1763'), () => go('settings'), { sound: 'nav' });
  onTap($(t, '620:1774'), () => go('settings'), { sound: 'nav' });
  onTap($(t, '620:1772'), () => go('home'), { sound: 'nav' });
});
