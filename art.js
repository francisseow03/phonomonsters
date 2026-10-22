// Hand-drawn SVG art in the PhonoMonsters style (flat colour, round shapes, big shiny eyes):
// story scenes and props, Mumble the boss, badge medals, treasure-shop hats and small icons.
const monsterSrc = L => `m-${L}.png`;

const eye = (x, y, r = 12, look = 0) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + look}" cy="${y + r * 0.1}" r="${r * 0.58}" fill="#3a3a3a"/><circle cx="${x + look + r * 0.25}" cy="${y - r * 0.2}" r="${r * 0.2}" fill="#fff"/>`;
const blush = (x, y, r = 9) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.55}" fill="#ff9ab5" opacity=".7"/>`;

// ---------- props: [width, height, svg body] ----------
const box = `<polygon points="10,48 100,48 70,8 -12,20" fill="#e7b47a"/><polygon points="190,48 100,48 128,6 210,22" fill="#e7b47a"/>
  <rect x="10" y="44" width="180" height="116" rx="6" fill="#d9a066"/><rect x="130" y="44" width="60" height="116" rx="6" fill="#c98f55"/>
  <rect x="95" y="44" width="12" height="116" fill="#f3d9a8"/><path d="M30 120h40M30 134h26" stroke="#b97f45" stroke-width="5" stroke-linecap="round"/>`;
export const PROPS = {
  sun: [140, 140, `<g stroke="#ffc843" stroke-width="9" stroke-linecap="round">${Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return `<line x1="${70 + Math.cos(a) * 54}" y1="${70 + Math.sin(a) * 54}" x2="${70 + Math.cos(a) * 68}" y2="${70 + Math.sin(a) * 68}"/>`; }).join('')}</g>
    <circle cx="70" cy="70" r="44" fill="#ffc843"/><circle cx="62" cy="62" r="30" fill="#ffd96a"/>`],
  cloud: [210, 100, `<g fill="#fff"><circle cx="55" cy="60" r="32"/><circle cx="100" cy="42" r="40"/><circle cx="150" cy="56" r="34"/><rect x="40" y="58" width="130" height="36" rx="18"/></g>`],
  raincloud: [240, 230, `<g class="rain" stroke="#5fb7ea" stroke-width="6" stroke-linecap="round">${[[50, 110], [90, 140], [130, 115], [170, 145], [70, 175], [150, 185], [110, 200], [195, 120]].map(([x, y]) => `<line x1="${x}" y1="${y}" x2="${x - 6}" y2="${y + 22}"/>`).join('')}</g>
    <g fill="#8e9aa8"><circle cx="60" cy="62" r="34"/><circle cx="110" cy="44" r="44"/><circle cx="165" cy="60" r="36"/><rect x="40" y="60" width="150" height="38" rx="19"/></g>`],
  box: [200, 160, box],
  boxTipped: [220, 180, `<g transform="rotate(-22 100 100)">${box}</g><ellipse cx="80" cy="64" rx="58" ry="16" fill="#7a4f28" transform="rotate(-22 80 64)"/>`],
  ask: [80, 110, `<text x="40" y="94" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="110" fill="#1fa7e1" stroke="#fff" stroke-width="6" paint-order="stroke">?</text>`],
  bug: [110, 90, `<g stroke="#3a3a3a" stroke-width="5" stroke-linecap="round"><path d="M22 50l-16-6M22 64l-18 6M88 50l16-6M88 64l18 6M46 14l-10-12M64 14l10-12"/></g>
    <circle cx="55" cy="58" r="32" fill="#e8453c"/><path d="M55 28v62" stroke="#3a2b2b" stroke-width="4"/>
    <circle cx="40" cy="50" r="7" fill="#3a2b2b"/><circle cx="70" cy="48" r="6" fill="#3a2b2b"/><circle cx="42" cy="72" r="6" fill="#3a2b2b"/><circle cx="70" cy="72" r="7" fill="#3a2b2b"/>
    <circle cx="55" cy="26" r="16" fill="#3a3a3a"/>${eye(48, 24, 6)}${eye(62, 24, 6)}`],
  log: [330, 90, `<rect x="0" y="14" width="310" height="66" rx="33" fill="#a0683d"/><path d="M40 34h80M150 58h90M70 62h40" stroke="#87552f" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="300" cy="47" rx="22" ry="33" fill="#d6a66f"/><ellipse cx="300" cy="47" rx="12" ry="19" fill="none" stroke="#a0683d" stroke-width="4"/><ellipse cx="300" cy="47" rx="4" ry="7" fill="#a0683d"/>`],
  frog: [140, 120, `<ellipse cx="22" cy="96" rx="22" ry="12" fill="#5fb84a"/><ellipse cx="118" cy="96" rx="22" ry="12" fill="#5fb84a"/>
    <ellipse cx="70" cy="74" rx="54" ry="40" fill="#75d069"/><ellipse cx="70" cy="86" rx="34" ry="24" fill="#c9f0b8"/>
    <circle cx="44" cy="34" r="20" fill="#75d069"/><circle cx="96" cy="34" r="20" fill="#75d069"/>${eye(44, 32, 13, 2)}${eye(96, 32, 13, -2)}
    <path d="M48 66q22 18 44 0" stroke="#3a6b2a" stroke-width="5" fill="none" stroke-linecap="round"/>${blush(34, 64)}${blush(106, 64)}`],
  splash: [200, 150, `<ellipse cx="100" cy="130" rx="96" ry="18" fill="#7fd0f5"/><ellipse cx="100" cy="130" rx="60" ry="10" fill="#bfe9fb"/>
    <g fill="#4fb3e6">${[[40, 70, 14], [70, 34, 12], [100, 18, 15], [132, 36, 12], [160, 72, 14], [20, 104, 9], [182, 102, 9]].map(([x, y, r]) => `<path d="M${x} ${y - r * 1.6}Q${x + r} ${y} ${x} ${y + r}Q${x - r} ${y} ${x} ${y - r * 1.6}Z"/>`).join('')}</g>`],
  tent: [400, 290, `<polygon points="200,12 22,276 378,276" fill="#f4911e"/><polygon points="200,12 378,276 398,276 230,12" fill="#d97a12"/>
    <polygon points="200,92 136,276 264,276" fill="#3a2b52"/><polygon points="200,92 264,276 300,276" fill="#ffb15c"/>
    <path d="M200 12v-12" stroke="#8a5a33" stroke-width="8" stroke-linecap="round"/><rect x="0" y="272" width="400" height="12" rx="6" fill="rgba(0,0,0,.12)"/>`],
  lamp: [140, 150, `<circle cx="70" cy="86" r="66" fill="url(#pmGlow)"/><path d="M52 40q18-30 36 0" stroke="#6b6b6b" stroke-width="6" fill="none"/>
    <rect x="46" y="40" width="48" height="12" rx="4" fill="#6b6b6b"/><rect x="50" y="52" width="40" height="56" rx="10" fill="#ffd96a"/><rect x="58" y="60" width="24" height="40" rx="8" fill="#fff4c2"/><rect x="46" y="106" width="48" height="10" rx="4" fill="#6b6b6b"/>`],
  moon: [140, 140, `<circle cx="70" cy="70" r="68" fill="#ffe58a" opacity=".18"/><path d="M84 12a58 58 0 1 0 44 92a46 46 0 1 1 -44 -92z" fill="#ffe58a"/>`],
  slug: [170, 100, `<path d="M16 86q-6-28 28-34q36-6 64-2q30 4 44 24q8 12-6 12z" fill="#c7d36b"/><path d="M24 86q50-14 124 0z" fill="#e3ea9f"/>
    <path d="M128 52l10-36M144 58l18-30" stroke="#c7d36b" stroke-width="7" stroke-linecap="round"/>${eye(138, 14, 9)}${eye(162, 26, 9)}
    <path d="M140 72q8 6 16 0" stroke="#5b6b2a" stroke-width="4" fill="none" stroke-linecap="round"/>`],
  bat: [200, 110, `<path d="M100 44q-30-34-96-24q22 14 16 36q20-10 30 4q12-14 24 0q8-10 26-16z" fill="#4b3a6b"/><path d="M100 44q30-34 96-24q-22 14-16 36q-20-10-30 4q-12-14-24 0q-8-10-26-16z" fill="#4b3a6b"/>
    <ellipse cx="100" cy="62" rx="30" ry="34" fill="#5d4a82"/><path d="M78 34l6-22 10 18M122 34l-6-22-10 18" fill="#5d4a82"/>${eye(88, 56, 10)}${eye(112, 56, 10)}
    <path d="M92 78l4 8 4-8M104 78l4 8 4-8" fill="#fff"/>`],
  zzz: [140, 140, `<g font-family="Fredoka, Nunito, sans-serif" font-weight="700" fill="#fff" opacity=".9"><text x="10" y="130" font-size="60">Z</text><text x="56" y="84" font-size="46">z</text><text x="94" y="44" font-size="34">z</text></g>`],
  ship: [400, 280, `<path d="M200 28v150" stroke="#8a5a33" stroke-width="12" stroke-linecap="round"/><path d="M206 36l112 128h-112z" fill="#fff"/><path d="M206 92l62 72h-62z" fill="#fa96ba"/>
    <path d="M194 48l-96 116h96z" fill="#f1fffd"/><path d="M200 22l38 12-38 12z" fill="#ffc843"/>
    <path d="M18 176h364l-40 76q-6 12-20 12H76q-14 0-20-12z" fill="#e8453c"/><rect x="18" y="176" width="364" height="18" fill="#fff"/>
    <circle cx="120" cy="222" r="11" fill="#bfe9fb" stroke="#fff" stroke-width="5"/><circle cx="200" cy="222" r="11" fill="#bfe9fb" stroke="#fff" stroke-width="5"/><circle cx="280" cy="222" r="11" fill="#bfe9fb" stroke="#fff" stroke-width="5"/>`],
  rowboat: [260, 120, `<path d="M8 40h244l-34 64q-6 12-20 12H62q-14 0-20-12z" fill="#a0683d"/><rect x="8" y="36" width="244" height="14" rx="7" fill="#c88b51"/><path d="M40 70h170" stroke="#87552f" stroke-width="5" stroke-linecap="round"/>`],
  fish: [130, 80, `<path d="M96 40l32-24v48z" fill="#f4911e"/><ellipse cx="58" cy="40" rx="48" ry="30" fill="#ffb000"/><path d="M50 14q20 26 0 52" stroke="#fff" stroke-width="7" fill="none" opacity=".7"/>${eye(30, 34, 9)}`],
  waves: [1194, 300, `<path d="M0 60q75-50 150 0t150 0t150 0t150 0t150 0t150 0t150 0t150 0V300H0z" fill="#2f8fd0"/><path d="M0 120q75-46 150 0t150 0t150 0t150 0t150 0t150 0t150 0t150 0V300H0z" fill="#4fb3e6"/>
    <g fill="#fff" opacity=".8"><circle cx="150" cy="60" r="8"/><circle cx="450" cy="60" r="8"/><circle cx="750" cy="60" r="8"/><circle cx="1050" cy="60" r="8"/></g>`],
  dock: [540, 260, `<g fill="#87552f"><rect x="40" y="40" width="26" height="220"/><rect x="250" y="40" width="26" height="220"/><rect x="460" y="40" width="26" height="220"/></g>
    <rect x="0" y="20" width="520" height="40" rx="6" fill="#b07a46"/><path d="M80 20v40M160 20v40M240 20v40M320 20v40M400 20v40" stroke="#93622f" stroke-width="4"/>`],
  lunchbox: [130, 110, `<path d="M40 30q0-24 25-24t25 24" stroke="#d93a4a" stroke-width="10" fill="none"/><rect x="6" y="28" width="118" height="78" rx="14" fill="#fb5063"/>
    <rect x="6" y="28" width="118" height="22" rx="10" fill="#ff7b8c"/><rect x="55" y="44" width="20" height="14" rx="4" fill="#ffc843"/><circle cx="96" cy="80" r="12" fill="#75d069"/>`],
  tree: [250, 340, `<rect x="104" y="170" width="42" height="170" rx="16" fill="#8a5a33"/><path d="M125 250l40-40" stroke="#8a5a33" stroke-width="14" stroke-linecap="round"/>
    <g fill="#5fb84a"><circle cx="70" cy="130" r="62"/><circle cx="180" cy="130" r="62"/></g><g fill="#75d069"><circle cx="125" cy="80" r="74"/><circle cx="70" cy="110" r="50"/><circle cx="182" cy="108" r="50"/></g>
    <g fill="#9be38a"><circle cx="100" cy="60" r="16"/><circle cx="160" cy="90" r="12"/></g>`],
  swirl: [280, 280, `<g fill="none" stroke-linecap="round" stroke-width="10"><path d="M140 40a100 100 0 0 1 100 100" stroke="#1fa7e1"/><path d="M240 160a100 100 0 0 1 -100 100" stroke="#fa96ba"/><path d="M120 240a100 100 0 0 1 -80 -100" stroke="#ffb000"/><path d="M40 120a100 100 0 0 1 80 -80" stroke="#75d069"/></g>`],
  zigzag: [320, 150, `<polyline points="10,120 70,30 130,120 190,30 250,120 310,30" fill="none" stroke="#ffb000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 24"/>`],
  boss: [260, 300, null], // filled below
};

/** Mumble the Word Wizard: a fluffy purple cloud monster who mumbles the sounds. */
export function bossSvg(w = 260, mood = 'cheeky') {
  const brows = mood === 'sad' ? 'M84 132l28 8M176 132l-28 8' : 'M84 140l28-10M176 140l-28-10';
  const mouth = mood === 'sad' ? 'M110 214q20-14 40 0' : 'M104 206q8-8 14 0t14 0t14 0t14 0';
  return `<svg viewBox="0 0 260 300" width="${w}" height="${w * 300 / 260}" class="pm-boss">
    <ellipse cx="130" cy="290" rx="90" ry="10" fill="rgba(0,0,0,.12)"/>
    <rect x="78" y="250" width="34" height="40" rx="14" fill="#6b4fb8"/><rect x="148" y="250" width="34" height="40" rx="14" fill="#6b4fb8"/>
    <path d="M232 168l20-40" stroke="#8a5a33" stroke-width="8" stroke-linecap="round"/><path d="M252 106l7 14 15 2-11 10 3 15-14-8-13 8 3-15-11-10 15-2z" fill="#ffc843"/>
    <g fill="#8f6fd8"><circle cx="58" cy="170" r="40"/><circle cx="202" cy="170" r="40"/><circle cx="80" cy="128" r="40"/><circle cx="180" cy="128" r="40"/><circle cx="130" cy="112" r="46"/><circle cx="70" cy="214" r="40"/><circle cx="190" cy="214" r="40"/><ellipse cx="130" cy="196" rx="96" ry="70"/></g>
    <ellipse cx="226" cy="178" rx="22" ry="16" fill="#8f6fd8"/><ellipse cx="34" cy="190" rx="22" ry="16" fill="#8f6fd8"/>
    <ellipse cx="130" cy="226" rx="58" ry="34" fill="#a98ce6"/>
    ${eye(102, 168, 20, 3)}${eye(158, 168, 20, -3)}<path d="${brows}" stroke="#3a2b52" stroke-width="7" stroke-linecap="round"/>
    <path d="${mouth}" stroke="#3a2b52" stroke-width="6" fill="none" stroke-linecap="round"/>${blush(76, 196, 12)}${blush(184, 196, 12)}
    <path d="M58 108q60-30 144 0l-14-12q-30-86-52-90q-12 30-62 90z" fill="#2e3f8f"/><path d="M62 100q66-26 136 0" stroke="#ffc843" stroke-width="10" fill="none"/>
    <path d="M118 52l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#ffc843"/><circle cx="150" cy="78" r="4" fill="#ffc843"/><circle cx="102" cy="82" r="3" fill="#ffc843"/>
    <ellipse cx="130" cy="106" rx="86" ry="12" fill="#26347a"/>
  </svg>`;
}

// ---------- backgrounds (1194 x 834) ----------
const hills = (back, front, flowers = true) => `<path d="M0 560q180-120 380-40t420-30t394 40V834H0z" fill="${back}"/><path d="M0 650q300-60 600-10t594-20V834H0z" fill="${front}"/>
  ${flowers ? [[90, 720], [260, 770], [480, 700], [700, 760], [930, 720], [1110, 780]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff"/><circle cx="${x}" cy="${y}" r="4" fill="#ffc843"/>`).join('') : ''}`;
const sky = (a, b) => `<linearGradient id="pmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const STARS = [[80, 90], [210, 160], [330, 70], [470, 140], [610, 60], [760, 120], [880, 70], [1010, 150], [1130, 90], [150, 300], [420, 260], [700, 250], [980, 290], [1100, 380], [60, 420]];
const sea = (c1, c2) => `<rect x="0" y="540" width="1194" height="294" fill="${c1}"/><path d="M0 560q100-20 200 0t200 0t200 0t200 0t200 0t200 0V834H0z" fill="${c2}"/>`;
const BG = {
  day: () => [sky('#a9e2fa', '#e6f7fd'), `<use href="#pmCloudA" x="120" y="120"/><use href="#pmCloudA" x="640" y="70"/>${hills('#b6e39a', '#8fd36f')}`],
  pond: () => [sky('#a9e2fa', '#e6f7fd'), `<use href="#pmCloudA" x="120" y="120"/>${hills('#b6e39a', '#8fd36f')}<ellipse cx="800" cy="740" rx="360" ry="78" fill="#4fb3e6"/><ellipse cx="800" cy="730" rx="300" ry="50" fill="#7fd0f5"/>
    <g stroke="#5fb84a" stroke-width="8" stroke-linecap="round"><path d="M430 720v-80M450 720v-60M1150 700v-90M1130 700v-60"/></g>`],
  dusk: () => [sky('#ffcf9e', '#b48ad8'), hills('#9bc77f', '#7fb267')],
  night: () => [sky('#1f2a55', '#3b4c8c'), `${STARS.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 3 : 5}" fill="#fff" class="twinkle" style="animation-delay:${(i % 5) * .4}s"/>`).join('')}${hills('#2e5a4f', '#3d6e5c', false)}`],
  sea: () => [sky('#a9e2fa', '#e6f7fd'), `<use href="#pmCloudA" x="760" y="90"/><path d="M820 545q90-70 180 0z" fill="#8fd36f"/>${sea('#2f8fd0', '#4fb3e6')}`],
  storm: () => [sky('#7f8fa3', '#b9c3cf'), `<g fill="#9aa6b4"><use href="#pmCloudA" x="80" y="60"/><use href="#pmCloudA" x="700" y="40"/></g><path d="M1000 230l-30 90h30l-20 80 60-110h-32l26-60z" fill="#ffd96a"/>${sea('#245f8f', '#2f7fb8')}`],
  rain: () => [sky('#aab6c2', '#dfe6ec'), hills('#9ccf86', '#7fbb6a')],
  rainsea: () => [sky('#aab6c2', '#dfe6ec'), sea('#3a8cc4', '#5aa8dc')],
};

const propSvg = (name, x, y, s = 1, cls = '') => {
  if (name === 'boss') { const w = 260 * s; return `<foreignObject x="${x - w / 2}" y="${y}" width="${w}" height="${w * 300 / 260}"><div xmlns="http://www.w3.org/1999/xhtml" class="${cls}" style="width:100%;height:100%">${bossSvg(w, cls.includes('sad') ? 'sad' : 'cheeky')}</div></foreignObject>`; }
  const [w, h, body] = PROPS[name];
  return `<g transform="translate(${x - w * s / 2} ${y}) scale(${s})"><g class="pm-prop ${cls}" style="transform-box:fill-box;transform-origin:center">${body}</g></g>`;
};

/** A full 1194x834 story scene: background, props and the monster characters. */
export function sceneHtml(page) {
  const [defs, ground] = BG[page.bg || 'day']();
  const props = (page.props || []).map(([n, x, y, s, c]) => propSvg(n, x, y, s, c)).join('');
  const chars = (page.chars || []).map(([L, x, bottom, ht, cls = 'float']) =>
    `<div class="pm-char ${cls}" style="left:${x - ht * 0.6}px;top:${bottom - ht}px;width:${ht * 1.2}px;height:${ht}px"><img src="${monsterSrc(L)}" alt=""></div>`).join('');
  return `<svg class="pm-scene" viewBox="0 0 1194 834" width="1194" height="834" preserveAspectRatio="xMidYMid slice"><defs>${defs}
    <radialGradient id="pmGlow"><stop offset="0" stop-color="#fff3b0" stop-opacity=".95"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient>
    <g id="pmCloudA">${PROPS.cloud[2]}</g></defs><rect width="1194" height="834" fill="url(#pmSky)"/>${ground}${props}</svg>${chars}`;
}

/** Book-cover art for a story card (230 x 332). */
export function coverHtml(st) {
  const c = st.cover;
  const inner = c.boss ? bossSvg(190) : `<img src="${monsterSrc(c.L)}" style="height:150px;position:relative;z-index:2" alt=""><svg viewBox="0 0 ${PROPS[c.prop][0]} ${PROPS[c.prop][1]}" style="width:130px;height:auto;position:absolute;right:6px;bottom:96px;z-index:1">${PROPS[c.prop][2]}</svg>`;
  return `<div style="position:relative;width:100%;height:210px;display:flex;align-items:flex-end;justify-content:center;background:linear-gradient(#e6f7fd,#e6f7fd 70%,#b6e39a 70%);border-radius:10px;overflow:hidden">${inner}</div>`;
}

// ---------- badge medal ----------
export function medalSvg(b, size = 96, locked = false) {
  return `<svg viewBox="0 0 100 120" width="${size}" height="${size * 1.2}" class="pm-medal${locked ? ' locked' : ''}">
    <polygon points="28,70 14,118 34,108 44,120 52,80" fill="${b.c}"/><polygon points="72,70 86,118 66,108 56,120 48,80" fill="${b.c}" opacity=".8"/>
    <circle cx="50" cy="50" r="46" fill="#ffc843"/><circle cx="50" cy="50" r="46" fill="none" stroke="#e8a800" stroke-width="4"/>
    <circle cx="50" cy="50" r="36" fill="#fff"/><clipPath id="md${b.id}"><circle cx="50" cy="50" r="34"/></clipPath>
    <image href="${monsterSrc(b.m)}" x="10" y="16" width="80" height="80" clip-path="url(#md${b.id})" preserveAspectRatio="xMidYMin meet"/>
    <path d="M50 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#fff"/></svg>`;
}

// ---------- hats (120 x 80, sit on the top edge of an avatar circle) ----------
export const HAT_SVG = {
  party: `<polygon points="60,2 30,74 90,74" fill="#fa96ba"/><polygon points="49,28 71,28 76,40 44,40" fill="#fff7c2"/><polygon points="38,54 82,54 87,66 33,66" fill="#fff7c2"/><circle cx="60" cy="6" r="9" fill="#ffc843"/>`,
  crown: `<path d="M18 72l-6-50 26 22 22-36 22 36 26-22-6 50z" fill="#ffc843"/><rect x="16" y="62" width="88" height="14" rx="5" fill="#e8a800"/><circle cx="60" cy="48" r="7" fill="#fb5063"/><circle cx="34" cy="54" r="5" fill="#1fa7e1"/><circle cx="86" cy="54" r="5" fill="#75d069"/>`,
  wizard: `<path d="M24 70q30-6 72 0l-10-14q-12-40-18-54q-10 22-34 54z" fill="#2e3f8f"/><path d="M30 62q30-8 60 0" stroke="#ffc843" stroke-width="7" fill="none"/><ellipse cx="60" cy="72" rx="50" ry="8" fill="#26347a"/><path d="M58 24l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" fill="#ffc843"/>`,
  cap: `<path d="M22 70q0-50 40-50t40 50z" fill="#fb5063"/><path d="M62 70h56q-4 10-26 10H62z" fill="#d93a4a"/><circle cx="62" cy="20" r="6" fill="#d93a4a"/><path d="M62 22v48" stroke="#d93a4a" stroke-width="3"/>`,
  flower: `<path d="M12 70q48-26 96 0" stroke="#5fb84a" stroke-width="8" fill="none"/>${[[20, 62, '#fa96ba'], [40, 52, '#ffc843'], [60, 48, '#fff'], [80, 52, '#fa96ba'], [100, 62, '#ffc843']].map(([x, y, c]) => `<g fill="${c}"><circle cx="${x - 7}" cy="${y}" r="7"/><circle cx="${x + 7}" cy="${y}" r="7"/><circle cx="${x}" cy="${y - 7}" r="7"/><circle cx="${x}" cy="${y + 7}" r="7"/></g><circle cx="${x}" cy="${y}" r="5" fill="#f4911e"/>`).join('')}`,
  tophat: `<rect x="34" y="8" width="52" height="58" rx="6" fill="#3a3a3a"/><rect x="34" y="46" width="52" height="12" fill="#fb5063"/><ellipse cx="60" cy="68" rx="48" ry="9" fill="#2a2a2a"/>`,
  pirate: `<path d="M6 66q54-74 108 0q-54-16-108 0z" fill="#2a2a2a"/><circle cx="60" cy="42" r="10" fill="#fff"/><circle cx="56" cy="41" r="2.5" fill="#2a2a2a"/><circle cx="64" cy="41" r="2.5" fill="#2a2a2a"/><path d="M48 58l24-8M48 50l24 8" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  bow: `<path d="M60 46q-36-36-50-10q-8 26 50 10z" fill="#fa96ba"/><path d="M60 46q36-36 50-10q8 26-50 10z" fill="#fa96ba"/><circle cx="60" cy="46" r="11" fill="#e17b9f"/>`,
};
export const hatSvg = (id, w = 120) => `<svg viewBox="0 0 120 80" width="${w}" height="${w * 80 / 120}">${HAT_SVG[id] || ''}</svg>`;

// ---------- small icons (instead of emoji, which look different on every device) ----------
export const ICON = {
  heart: (s = 40, on = true) => `<svg viewBox="0 0 40 36" width="${s}" height="${s * .9}"><path d="M20 34S2 23 2 12C2 5 7 2 11.5 2c3.6 0 6.5 2.2 8.5 5 2-2.8 4.9-5 8.5-5C33 2 38 5 38 12c0 11-18 22-18 22z" fill="${on ? '#fb5063' : '#d5dde0'}"/><ellipse cx="11" cy="11" rx="4" ry="3" fill="#fff" opacity="${on ? .6 : 0}"/></svg>`,
  flame: (s = 54) => `<svg viewBox="0 0 40 52" width="${s * .77}" height="${s}"><path d="M20 2c4 10 16 16 16 30a16 16 0 0 1-32 0c0-8 5-12 7-18 2 5 5 7 5 7s-1-10 4-19z" fill="#fa7d3c"/><path d="M20 22c3 6 9 9 9 17a9 9 0 0 1-18 0c0-5 3-7 4-10 1 3 3 4 3 4s-1-6 2-11z" fill="#ffc843"/></svg>`,
  party: (s = 90) => `<svg viewBox="0 0 90 90" width="${s}" height="${s}"><path d="M10 82l22-60 38 38z" fill="#ffb000"/><path d="M18 60l8-20 20 20zM14 72l3-8 9 9z" fill="#fb5063"/>${[[60, 14, '#1fa7e1'], [76, 30, '#fa96ba'], [48, 6, '#75d069'], [82, 50, '#ffc843']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c}"/>`).join('')}<path d="M40 20q8-14 0-18M64 44q14-6 18 2" stroke="#a37fe8" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  sparkle: (s = 28, c = '#ffc843') => `<svg viewBox="0 0 20 20" width="${s}" height="${s}"><path d="M10 0l2.5 7.5L20 10l-7.5 2.5L10 20l-2.5-7.5L0 10l7.5-2.5z" fill="${c}"/></svg>`,
};
