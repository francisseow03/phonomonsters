// Shop items: printable tracing worksheets and the PhonoMonsters product pages (with a wish list).
import { h, onTap, overlay, toast } from './core.js';
import * as store from './store.js';
import { say, sfx } from './audio.js';
import { parentGate } from './ui.js';
import { LETTERS, MONSTERS, TRICKY } from './data.js';

const PRODUCTS = {
  books: { img: 'img-17503c5cad2f.png', title: 'PhonoMonsters Storybooks', text: 'Picture books starring the monsters. Each book matches a level in the app, so children only meet words they can already sound out.', points: ['8 books, one for each level', 'Big, clear letters', 'Tap-to-hear words in the app'] },
  toys: { img: 'img-fed0abbabfba.png', title: 'Monster Soft Toys', text: 'Cuddly plush monsters. Give one a squeeze and say its sound together!', points: ['All 26 letter monsters', 'Soft and machine washable', 'Ages 3 and up'] },
  merch: { img: 'img-83fd85e6a8ee.png', title: 'Keychains & Stickers', text: 'Monster keychains, sticker sheets and flash cards for school bags and fridges.', points: ['Sticker sheet with every monster', 'Keychains for school bags', 'Sound flash cards'] },
};

export function productCard(kind) {
  const pr = PRODUCTS[kind];
  const wish = store.settings().wishlist || [];
  const card = h('div', 'pm-card pop pm-product');
  card.style.width = '820px';
  card.innerHTML = `<div class="pm-row" style="flex-wrap:nowrap;align-items:center;gap:28px;text-align:left">
      <img src="${pr.img}" alt="" style="width:300px;height:240px;object-fit:contain;flex:none">
      <div style="display:flex;flex-direction:column;gap:12px"><h2 style="text-align:left">${pr.title}</h2><p style="font-size:20px">${pr.text}</p>
      <ul style="margin:0;padding-left:22px;font:700 18px Nunito;color:#1c9886;display:flex;flex-direction:column;gap:4px">${pr.points.map(p => `<li>${p}</li>`).join('')}</ul>
      <p style="font-size:15px;color:#7a8f8c">Available with the full release of PhonoMonsters.</p></div></div>`;
  const row = h('div', 'pm-row');
  const add = h('div', `pm-btn${wish.includes(kind) ? ' alt' : ''}`, wish.includes(kind) ? 'ON WISH LIST ✓' : 'ADD TO WISH LIST');
  const close = h('div', 'pm-btn alt', 'CLOSE');
  row.append(close, add); card.append(row);
  const o = overlay(card, { closeOnDim: true });
  onTap(close, () => o.close(), { sound: 'nav' });
  onTap(add, () => parentGate(() => {
    const list = new Set(store.settings().wishlist || []);
    list.has(kind) ? list.delete(kind) : list.add(kind);
    store.setSetting('wishlist', [...list]);
    o.close();
    if (list.has(kind)) { sfx('sparkle'); say('ui_wishlist'); toast('Added to your wish list'); }
  }), { sound: 'pop' });
  say('ui_product');
}

// ---------- printable tracing worksheets ----------
const dashed = (txt, x, y, size, anchor = 'start') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" class="dash">${txt}</text>`;
function letterPage(L, origin) {
  const m = MONSTERS[L];
  const row = (txt, y) => `<text x="40" y="${y}" font-size="110" class="solid">${txt}</text>${[1, 2, 3, 4].map(i => dashed(txt, 40 + i * 150, y, 110)).join('')}<line x1="30" x2="770" y1="${y + 6}" y2="${y + 6}" class="base"/><line x1="30" x2="770" y1="${y - 40}" y2="${y - 40}" class="mid"/>`;
  return `<section class="page"><header><img src="${origin}m-${L}.png" alt=""><div><h1>${L}${L.toLowerCase()} is for ${m.word}</h1><p>Say the sound <b>/${MONSTERS[L].say}/</b> as you trace. Start at the dot!</p></div></header>
    <svg viewBox="0 0 800 820" width="100%">${dashed(L + L.toLowerCase(), 400, 300, 300, 'middle')}<circle cx="${L === 'I' ? 300 : 280}" cy="70" r="10" class="dot"/>
    ${row(L, 470)}${row(L.toLowerCase(), 640)}<text x="40" y="790" font-size="70" class="solid">${m.word}</text>${dashed(m.word, 420, 790, 70)}</svg>
    <footer>PhonoMonsters · Letter ${L}</footer></section>`;
}
function trickyPage(set) {
  return `<section class="page"><header><div><h1>Tricky words: ${set.name}</h1><p>Read each word, then trace it. Tricky words are learnt by heart!</p></div></header>
    <svg viewBox="0 0 800 900" width="100%">${set.words.map((w, i) => `<text x="40" y="${130 + i * 170}" font-size="96" class="solid">${w}</text>${dashed(w, 330, 130 + i * 170, 96)}${dashed(w, 580, 130 + i * 170, 96)}<line x1="30" x2="770" y1="${136 + i * 170}" y2="${136 + i * 170}" class="base"/>`).join('')}</svg>
    <footer>PhonoMonsters · Tricky words</footer></section>`;
}
function printSheets(pages, title) {
  const w = window.open('', '_blank');
  if (!w) { toast('Please allow pop-ups to print the worksheets', 3000); return; }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600&family=Nunito:wght@600;800&display=swap">
    <style>@page{size:A4;margin:12mm}body{margin:0;font-family:Nunito,sans-serif;color:#1d3b37;background:#eef7f6}
    .bar{position:sticky;top:0;display:flex;gap:12px;align-items:center;justify-content:center;padding:12px;background:#1c9886;color:#fff;font-weight:800}
    .bar button{font:800 18px Nunito;padding:10px 26px;border:0;border-radius:10px;background:#fa96ba;color:#fff;cursor:pointer}
    .page{background:#fff;width:190mm;min-height:270mm;margin:16px auto;padding:10mm;box-sizing:border-box;display:flex;flex-direction:column;page-break-after:always;box-shadow:0 4px 18px rgba(0,0,0,.12)}
    header{display:flex;gap:18px;align-items:center;border-bottom:4px solid #b3e8ff;padding-bottom:10px}header img{height:110px}
    h1{margin:0;font:600 40px Fredoka,Nunito;color:#109586}header p{margin:6px 0 0;font-size:18px}
    text{font-family:Fredoka,Nunito,sans-serif;font-weight:600}.dash{fill:none;stroke:#7fbfd6;stroke-width:2.5;stroke-dasharray:7 7}.solid{fill:#1c9886}
    .base{stroke:#b3e8ff;stroke-width:3}.mid{stroke:#dfeff5;stroke-width:2;stroke-dasharray:10 8}.dot{fill:#fa96ba}
    footer{margin-top:auto;font-size:13px;color:#7a8f8c;text-align:right}
    @media print{body{background:#fff}.bar{display:none}.page{margin:0;box-shadow:none;width:auto;min-height:auto;height:270mm}}</style></head>
    <body><div class="bar">${pages.length} page${pages.length > 1 ? 's' : ''} ready <button onclick="print()">Print</button></div>${pages.join('')}</body></html>`);
  w.document.close();
}

export function worksheets() {
  const origin = location.href.replace(/[^/]*$/, '');
  const learnt = LETTERS.filter(L => store.progress().letters[L]);
  const card = h('div', 'pm-card pop');
  card.style.width = '760px';
  card.innerHTML = `<img src="img-9f8515ace2bb.png" alt="" style="height:150px;object-fit:contain"><h2>Tracing Worksheets</h2><p>Print a sheet for each letter, with its monster, a big letter to trace and practice rows.</p>`;
  const opts = [
    ['My letters', learnt.length ? `${learnt.length} letter${learnt.length > 1 ? 's' : ''} I've learnt` : 'Learn a letter first', () => learnt.length && printSheets(learnt.map(L => letterPage(L, origin)), 'My PhonoMonsters letters')],
    ['A to Z', 'All 26 letters', () => printSheets(LETTERS.map(L => letterPage(L, origin)), 'PhonoMonsters A to Z')],
    ['Tricky words', '4 sheets', () => printSheets(TRICKY.map(trickyPage), 'PhonoMonsters tricky words')],
  ];
  const row = h('div', 'pm-row');
  for (const [title, sub, fn] of opts) {
    const b = h('div', 'pm-sheetopt', `<b>${title}</b><span>${sub}</span>`);
    row.append(b);
    onTap(b, () => parentGate(fn), { sound: 'pop' });
  }
  card.append(row);
  const close = h('div', 'pm-btn alt', 'CLOSE');
  card.append(close);
  const o = overlay(card, { closeOnDim: true });
  onTap(close, () => o.close(), { sound: 'nav' });
  say('ui_worksheets');
}
