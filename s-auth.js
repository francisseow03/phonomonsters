// Splash, sign up, sign in, child profile picker.
import { route, go, tpl, $, $$, h, box, onTap, overlay, toast } from './core.js';
import * as store from './store.js';
import { unlock, music, say, sfx } from './audio.js';
import { AVATARS, avatarInner } from './ui.js';

route('splash', el => {
  const t = tpl('splash');
  el.append(t);
  const play = $(t, '67:75');
  onTap(play, () => {
    unlock();
    music('menu');
    say('ui_welcome');
    if (store.signedIn()) go(store.isGuest() ? 'home' : 'profiles');
    else if (store.hasAccounts()) go('login');
    else { store.startGuest(); go('home'); } // first launch: straight into play, no sign-up wall
  }, { sound: 'pop' });
  play.classList.add('pulse');
  play.style.transformOrigin = '529px 599px';
});

function field(t, x, y, w, hgt, type, placeholder) {
  const i = h('input', 'field');
  Object.assign(i.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hgt + 'px' });
  i.type = type; i.placeholder = placeholder; i.autocomplete = type === 'password' ? 'current-password' : 'username';
  t.append(i);
  return i;
}
const link = (t, x, y, html, fn) => { const l = box(x, y, 400, 30, "text-center font-['Nunito'] text-[18px] text-[#188e81]", html); t.append(l); onTap(l, fn); return l; };

route('signup', el => {
  const t = tpl('signup');
  el.append(t);
  $$(t, '[data-node-id="73:150"],[data-node-id="73:166"],[data-node-id="73:167"]').forEach(p => p.remove());
  const email = field(t, 311, 243, 572, 68, 'email', 'Email');
  const pass = field(t, 311, 336, 572, 68, 'password', 'Password');
  const conf = field(t, 311, 435, 572, 68, 'password', 'Confirm Password');
  pass.autocomplete = conf.autocomplete = 'new-password';
  // consent must be an active choice by the grown-up, so the box starts unticked
  let agree = false;
  const tick = $(t, '73:134'), sq = $(t, '73:124');
  const toggle = () => { agree = !agree; tick.style.opacity = agree ? 1 : 0; sq.style.background = agree ? '#20c9bd' : '#fff'; sq.style.border = agree ? '' : '3px solid #20c9bd'; };
  [tick, sq].forEach(n => onTap(n, toggle));
  onTap($(t, '73:123'), toggle);
  tick.style.opacity = 0; sq.style.background = '#fff'; sq.style.border = '3px solid #20c9bd';
  t.append(box(311, 660, 572, 44, "text-center font-['Nunito'] text-[15px] text-[#555] leading-snug", 'Progress is saved on this device only. The microphone is used only while your child holds the mic button.'));
  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.value)) return toast('Please enter a valid email');
    if (pass.value.length < 4) return toast('Password needs at least 4 characters');
    if (pass.value !== conf.value) return toast('Passwords do not match');
    if (!agree) return toast('Please agree to the terms first');
    try { const wasGuest = store.isGuest(); await store.signUp(email.value, pass.value); sfx('sparkle'); go(wasGuest ? 'settings' : 'profiles'); }
    catch (e) { toast(e.message, 3000); }
  };
  onTap($(t, '75:86'), submit, { sound: 'pop' });
  onTap($(t, '75:87'), submit, { sound: 'pop' });
  t.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  link(t, 397, 715, 'Already have an account? <b>Sign in</b>', () => go('login'));
});

route('login', el => {
  const t = tpl('login');
  el.append(t);
  const user = field(t, 103, 256, 446, 76, 'text', 'Email or username');
  const pass = field(t, 103, 377, 446, 76, 'password', 'Password');
  user.style.background = pass.style.background = 'transparent';
  const submit = async () => {
    try { await store.signIn(user.value, pass.value); sfx('sparkle'); go('profiles'); }
    catch (e) { toast(e.message, 3000); }
  };
  onTap($(t, '73:185'), submit, { sound: 'pop' });
  onTap($(t, '73:186'), submit, { sound: 'pop' });
  onTap($(t, '73:182'), () => toast('Ask a grown-up: make a new account with Sign up', 3000));
  t.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  link(t, 126, 632, 'New here? <b>Sign up</b>', () => go('signup'));
  const mascot = $(t, '96:429');
  mascot.classList.add('float');
  onTap(mascot, () => sfx('giggle'), { sound: null });
});

// Slots in the Figma "multi profiles" frame: avatar group, name text
const SLOTS = [
  { group: '615:875', name: '127:67', ring: '127:64' },
  { group: '615:878', name: '127:68', ring: '127:62' },
  { group: '615:876', name: '127:70', ring: '127:63' },
];
route('profiles', el => {
  if (!store.signedIn()) return go('login');
  const t = tpl('profiles');
  el.append(t);
  music('menu');
  say('ui_who');
  const list = store.profiles().slice(0, 3);
  SLOTS.forEach((s, i) => {
    const p = list[i];
    const g = $(t, s.group), n = $(t, s.name);
    if (!p) { g.remove(); n.remove(); return; }
    n.textContent = p.name;
    n.className = n.className.replace('text-[#188e81]', 'text-[#333]');
    const img = g.querySelector('[data-name]');
    if (img) img.innerHTML = avatarInner(p.avatar);
    const pick = () => { store.selectProfile(p.id); sfx('sparkle'); go('home'); };
    onTap(g, pick, { sound: 'pop' }); onTap(n, pick, { sound: 'pop' });
  });
  const add = () => store.profiles().length >= 6 ? toast('You can have up to 6 children') : addProfileDialog(() => go('profiles'));
  onTap($(t, '615:877'), add); onTap($(t, '127:71'), add);
  if (store.profiles().length > 3) {
    const more = box(397, 600, 400, 40, "text-center font-['Nunito'] font-bold text-[20px] text-[#188e81]", 'More children ›');
    t.append(more);
    onTap(more, () => chooser());
  }
  onTap($(t, '127:73'), () => { store.signOut(); go('login'); }, { sound: 'nav' });
});

function chooser() {
  const card = h('div', 'relative pop bg-[#eafbfe] border-[10px] border-[#b3e8ff] rounded-[20px] shadow-[0_6px_0_#78bddb] w-[760px] p-8 flex flex-wrap gap-6 justify-center');
  const o = overlay(card, { closeOnDim: true });
  for (const p of store.profiles()) {
    const c = h('div', 'flex flex-col items-center gap-2 w-[150px]');
    const a = h('div', 'relative size-[130px] rounded-full bg-white', avatarInner(p.avatar));
    c.append(a, h('div', "font-['Nunito'] font-bold text-[20px] text-[#333]", p.name));
    card.append(c);
    onTap(c, () => { o.close(); store.selectProfile(p.id); go('home'); }, { sound: 'pop' });
  }
}

export function addProfileDialog(done) {
  const card = h('div', 'relative pop bg-[#eafbfe] border-[10px] border-[#b3e8ff] rounded-[20px] shadow-[0_6px_0_#78bddb] w-[657px] px-10 py-8 flex flex-col items-center gap-5');
  card.innerHTML = `<p class="font-['KitRounded'] text-[40px] text-[#109586] m-0">Add a Child</p>`;
  const name = h('input', "w-full h-[70px] rounded-[10px] bg-white border-4 border-[#6ed0cf] px-5 font-['Nunito'] text-[24px] outline-none");
  name.placeholder = "Child's name"; name.maxLength = 16;
  const row = h('div', 'flex gap-4 flex-wrap justify-center');
  let chosen = 'jane';
  const opts = Object.keys(AVATARS).map(k => {
    const a = h('div', 'relative size-[96px] rounded-full bg-white border-4 border-transparent', avatarInner(k));
    onTap(a, () => { chosen = k; opts.forEach(o => o.style.borderColor = 'transparent'); a.style.borderColor = '#fa96ba'; });
    row.append(a); return a;
  });
  opts[0].style.borderColor = '#fa96ba';
  const ok = h('div', "w-[250px] h-[80px] rounded-[10px] bg-[#fa96ba] shadow-[0_6px_0_#e17b9f] flex items-center justify-center font-['Nunito'] font-extrabold text-[36px] text-white", 'SAVE');
  card.append(name, row, ok);
  const o = overlay(card, { closeOnDim: true });
  setTimeout(() => name.focus(), 50);
  onTap(ok, () => {
    if (!name.value.trim()) return toast('Type a name first');
    store.addProfile(name.value, chosen);
    sfx('sparkle'); o.close(); done && done();
  }, { sound: 'pop' });
}
