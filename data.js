// PhonoMonsters content. Monster descriptions are taken verbatim from the
// Figma PhonoDex pages / project book; word lists follow the learning journey.

export const VOWELS = ['A', 'E', 'I', 'O', 'U'];

// say: how the narrator voices the phoneme (spelled for natural TTS)
export const MONSTERS = {
  A: { say: 'aah', word: 'apple', desc: 'The A Monster is orange and a little clumsy! It always trips and goes "Ahh!" when it gets a tiny bump.', why: 'That\'s why A makes the /a/ sound, just like when you say "ahh!" when you get hurt.', fact: 'Did you know that the letter A is the second most common letter in the English language?' },
  B: { say: 'buh', word: 'ball', desc: 'The B Monster loves music! It beatboxes everywhere it goes: "b-b-b!"', why: 'That\'s why B makes the /b/ sound, just like its fun beatbox beats!', fact: 'Did you know that B and D look alike? B has a big belly on the right side.' },
  C: { say: 'kuh', word: 'cat', desc: 'The C Monster is always cold! It shivers and chatters, going "c-c-c!"', why: 'That\'s why C makes the /k/ sound, like cold teeth chattering!', fact: 'Did you know that C can sound just like K? Cat and kite start with the same sound!' },
  D: { say: 'duh', word: 'dog', desc: 'The D Monster is strong and buff! It flexes its muscles and says, "duh!"', why: 'That\'s why D makes the /d/ sound, bold and strong like a proud "duh!"', fact: 'Did you know that D is the first letter of dinosaur, duck and drum?' },
  E: { say: 'eh', word: 'egg', desc: 'The E Monster always tilts its head and asks, "ehh?" It\'s super curious about everything!', why: 'That\'s why E makes the /e/ sound, just like when you say "ehh?" in confusion.', fact: 'Did you know that E is the most common letter in the English language?' },
  F: { say: 'fff', word: 'fish', desc: 'The F Monster floats gently in the air. When it moves, it lets out a soft "fffff" like air escaping a balloon.', why: 'That\'s why F makes the /f/ sound - a soft, airy puff!', fact: 'Did you know that you make the F sound by gently biting your bottom lip and blowing?' },
  G: { say: 'guh', word: 'goat', desc: 'The G Monster is always gulping juice! Glug, glug, glug, down it goes!', why: 'That\'s why G makes the /g/ sound, like a big gulp!', fact: 'Did you know that the G sound comes from the back of your throat, like a gulp?' },
  H: { say: 'huh', word: 'hat', desc: 'The H Monster loves to run and jump! After exercising, it pants loudly: "h-h-h!"', why: 'That\'s why H makes the /h/ sound, just like panting after a workout.', fact: 'Did you know that H is a quiet sound? Put your hand in front of your mouth and feel the air!' },
  I: { say: 'ih', word: 'igloo', desc: 'The I Monster is easily freaked out! It jumps and squeals, with even just a little noise, going "eeek!"', why: 'That\'s why I makes the /i/ sound, like a quick little shriek!', fact: 'Did you know that I is the only letter that is also a whole word about you?' },
  J: { say: 'juh', word: 'jam', desc: 'The J Monster is always jolly! It jumps and giggles, going "juh-juh-juh!"', why: 'That\'s why J makes the /j/ sound, just like a joyful jump!', fact: 'Did you know that J was the last letter added to the alphabet?' },
  K: { say: 'kuh', word: 'kite', desc: 'The K Monster loves karate! It kicks and goes, "Kuh!"', why: 'That\'s why K makes the /k/ sound, strong like a karate kick!', fact: 'Did you know that K and C can make the very same sound?' },
  L: { say: 'lll', word: 'lion', desc: 'The L Monster loves to sing. It hums a soft lullaby, "la-la-la..."', why: 'That\'s why L makes the /l/ sound, gentle like a loving lullaby.', fact: 'Did you know that your tongue touches the top of your mouth when you say L?' },
  M: { say: 'mmm', word: 'moon', desc: 'The M Monster is always munching. "Mm-mm-mm!" it hums with a full mouth.', why: 'That\'s why M makes the /m/ sound, like yummy munching!', fact: 'Did you know that you can hum the M sound with your mouth closed?' },
  N: { say: 'nnn', word: 'nest', desc: 'The N Monster is a little bit of a grumpy one. It folds its arms and says, "Nnnno!"', why: 'That\'s why N makes the /n/ sound, strong at the start of "no!"', fact: 'Did you know that N makes a buzzy sound in your nose?' },
  O: { say: 'aw', word: 'octopus', desc: 'The O Monster is always shocked! It opens its mouth round and wide: "oh!"', why: 'That\'s why O makes the /o/ sound, like a big surprised "oh!"', fact: 'Did you know that your mouth makes a round O shape when you say it?' },
  P: { say: 'puh', word: 'pig', desc: 'The P Monster pops out of nowhere! She is always happy to meet and play pranks on others. "Pop! Pop-pop!" it laughs.', why: 'That\'s why P makes the /p/ sound, like popping bubbles!', fact: 'Did you know that P and B are partners? P is the quiet puff, B is the noisy one.' },
  Q: { say: 'kwuh', word: 'queen', desc: 'The Q Monster is a royal queen! She wears a crown and says, "qu-qu-queen!"', why: 'That\'s why Q makes the /kw/ sound, like a quiet queen speaking!', fact: 'Did you know that Q almost always has its best friend U right next to it?' },
  R: { say: 'rrr', word: 'rabbit', desc: 'The R Monster is a pirate! It stomps its foot and growls, "Arrr!", swinging his hook around.', why: 'That\'s why R makes the /r/ sound, like a pirate\'s roar!', fact: 'Did you know that R can growl like a pirate or a tiger? Rrrr!' },
  S: { say: 'sss', word: 'sun', desc: 'The S Monster is silent like a ninja. It slithers and whispers, "Sss..." unseen with its unique shape.', why: 'That\'s why S makes the /s/ sound, smooth like a snake!', fact: 'Did you know that S is shaped like a slithering snake?' },
  T: { say: 'tuh', word: 'tiger', desc: 'The T Monster is tall and terrified. It tiptoes softly - "T-t-t!". She is afraid she would make a wrong move and tip over.', why: 'That\'s why T makes the /t/ sound, light like tiny toes!', fact: 'Did you know that T is the most common letter to start a word in English?' },
  U: { say: 'uh', word: 'umbrella', desc: 'The U Monster is super smart! When someone gets something wrong, it goes, "uhh..."', why: 'That\'s why U makes the /u/ sound, just like thinking or correcting someone kindly.', fact: 'Did you know that U is a vowel, and every word needs a vowel friend?' },
  V: { say: 'vvv', word: 'van', desc: 'The V Monster is super fast! It zooms and vrooms, going "vvvrrr!"', why: 'That\'s why V makes the /v/ sound, like a fast vrooming ride!', fact: 'Did you know that V makes your lip buzz? Try it: vvvv!' },
  W: { say: 'wuh', word: 'web', desc: 'The W Monster is big and weepy. It wobbles and whimpers, "Wuhhh..."', why: 'That\'s why W makes the /w/ sound, wide and windy!', fact: 'Did you know that W is called double-U because it looks like two U letters?' },
  X: { say: 'ks', word: 'fox', desc: 'The X Monster is super cool. It clicks its tongue - "ks!" trying to show off how cool he is as a protector.', why: 'That\'s why X makes the /x/ sound, sharp and snappy!', fact: 'Did you know that X usually hides at the end of words, like box and fox?' },
  Y: { say: 'yuh', word: 'yo-yo', desc: 'The Y Monster is super sassy. It flips its hair and says, "Yuh!"', why: 'That\'s why Y makes the /y/ sound, quick and sharp!', fact: 'Did you know that Y can sometimes act like a vowel, like in the word "my"?' },
  Z: { say: 'zzz', word: 'zebra', desc: 'The Z Monster is always sleepy. It yawns and is always dozing off "Zzzzz..."', why: 'That\'s why Z makes the /z/ sound, like buzzing sleepy snores!', fact: 'Did you know that Z is the last letter of the alphabet?' },
};

export const LETTERS = Object.keys(MONSTERS);
export const isVowel = L => VOWELS.includes(L);

// Picture words. img: design art (assets/art) or Twemoji code point (assets/pics)
export const PICS = {
  cat: 'art:cat', duck: 'art:duck',
  dog: '1f415', pig: '1f416', sun: '2600', hen: '1f414', bed: '1f6cf', fox: '1f98a',
  bus: '1f68c', cup: '2615', hat: '1f452', map: '1f5fa', net: '1f945', bat: '1f987',
  bug: '1f41b', jam: '1f36f', web: '1f578', box: '1f4e6', van: '1f690', fan: '1fa6d',
  frog: '1f438', crab: '1f980', drum: '1f941', flag: '1f6a9', fish: '1f41f', milk: '1f95b',
  nest: '1fab9', tent: '26fa', plant: '1fab4', clock: '1f570', star: '2b50', snail: '1f40c',
  lamp: '1fa94', sock: '1f9e6', ant: '1f41c', egg: '1f95a', ox: '1f402', ten: '1f51f',
};

// Level 2: middle & last sounds (3-letter CVC words)
export const L2_WORDS = ['cat', 'dog', 'pig', 'sun', 'hen', 'bed', 'fox', 'bus', 'cup', 'hat', 'map', 'bug', 'jam', 'web', 'box', 'van'];

// Level 3: blending by number of sounds
export const L3_WORDS = {
  3: ['cat', 'dog', 'sun', 'pig', 'hat', 'bed', 'cup', 'fox'],
  4: ['frog', 'crab', 'drum', 'flag', 'milk', 'nest', 'tent', 'lamp'],
  5: ['plant', 'clock', 'snail', 'stamp', 'crisp', 'trunk'],
};

// Level 4: consonant blends
export const L4_BLENDS = {
  easy: [
    { b: 'bl', words: ['black', 'blob', 'blue', 'blow', 'blush', 'blink'] },
    { b: 'cl', words: ['clap', 'clip', 'clock', 'cloud', 'clown', 'class'] },
    { b: 'fl', words: ['flag', 'flap', 'flip', 'flow', 'fly', 'flat'] },
    { b: 'pl', words: ['plan', 'play', 'plum', 'plug', 'plant', 'plate'] },
    { b: 'sl', words: ['slip', 'slow', 'sled', 'slug', 'slide', 'sleep'] },
  ],
  complex: [
    { b: 'br', words: ['brag', 'brick', 'brush', 'bring', 'brown', 'bread'] },
    { b: 'cr', words: ['crab', 'crib', 'crop', 'crack', 'crown', 'cry'] },
    { b: 'dr', words: ['drum', 'drip', 'drop', 'dress', 'drink', 'dry'] },
    { b: 'tr', words: ['trap', 'trip', 'tree', 'truck', 'train', 'try'] },
    { b: 'st', words: ['stop', 'step', 'star', 'stick', 'stamp', 'stem'] },
  ],
  ending: [
    { b: 'nd', words: ['hand', 'band', 'sand', 'pond', 'wind', 'bend'] },
    { b: 'nk', words: ['pink', 'sink', 'tank', 'bank', 'wink', 'trunk'] },
    { b: 'mp', words: ['jump', 'lamp', 'camp', 'bump', 'stamp', 'pump'] },
    { b: 'st', words: ['nest', 'best', 'fast', 'lost', 'vest', 'list'] },
    { b: 'nt', words: ['tent', 'hunt', 'mint', 'plant', 'went', 'ant'] },
  ],
};

// Minigame: blending practice (drag monsters to spell the picture)
export const BLEND_GAME_WORDS = ['duck', 'cat', 'dog', 'frog', 'sun', 'pig', 'fox', 'crab', 'bus', 'hen'];

// Reading room. Story 1 pages from the Figma story frames.
export const STORIES = [
  {
    title: 'Story 1', level: 1, pages: [
      { lines: ['A **cat**.', 'A **fat** **cat**.', 'The **cat** has a **hat**.'] },
      { lines: ['The **hat** is red.', 'The **cat** is **glad**.', '"Aha!" says the **cat**.'] },
      { lines: ['A **rat** sees the **hat**.', 'The **rat** is **mad**.', 'The **rat** grabs the **hat**.'] },
      { lines: ['"Oh no!" says the **cat**.', '"My **hat**! My red **hat**!"'] },
      { lines: ['The **rat** trips - "**SPLAT**!"', 'The **hat** is back.', 'The **cat** is glad again.'], pos: 'right' },
      { lines: ['The **cat** **pats** the **rat**.', '"Sorry", the **rat** says.', '"Let\'s play!" the **cat** says.'] },
      { lines: ['They play on the **mat**.', 'The cat and the rat are friends!'] },
    ],
  },
  { title: 'Story 2', level: 2, locked: true },
  { title: 'Story 3', level: 3, locked: true },
  { title: 'Story 4', level: 4, locked: true },
];

export const PRAISE = ['Great job!', 'Well done!', 'Awesome!', 'You did it!', 'Super!', 'Fantastic!'];
export const TRY_AGAIN = ['Oops, try again!', 'Almost! Try again.', 'Not quite. Listen again!'];

export const AVATARS = ['pfp-jane', 'pfp-victor', 'pfp-rebecca', 'pfp-other'];

// Level 5: digraphs - two letters, one sound. Voiced by the device voice (no recorded clips yet).
export const DIGRAPHS = [
  { d: 'sh', say: 'shh', color: '#a37fe8', words: ['ship', 'shop', 'fish', 'dish', 'shell', 'wish'] },
  { d: 'ch', say: 'chuh', color: '#fb5063', words: ['chip', 'chin', 'chop', 'much', 'lunch', 'chick'] },
  { d: 'th', say: 'thuh', color: '#1fa7e1', words: ['thin', 'bath', 'moth', 'path', 'math', 'thick'] },
  { d: 'wh', say: 'wuh', color: '#75d069', words: ['whip', 'when', 'whale', 'which', 'wheel', 'whisk'] },
  { d: 'ck', say: 'kuh', color: '#ffb000', words: ['duck', 'sock', 'rock', 'kick', 'back', 'neck'] },
];

// Level 6: vowel teams - more letter teams that make one sound
export const VOWEL_TEAMS = [
  { d: 'ai', say: 'ay', color: '#fb5063', words: ['rain', 'tail', 'snail', 'paint', 'train', 'mail'] },
  { d: 'ee', say: 'ee', color: '#75d069', words: ['bee', 'tree', 'feet', 'sheep', 'seed', 'green'] },
  { d: 'oa', say: 'oh', color: '#1fa7e1', words: ['boat', 'goat', 'coat', 'road', 'soap', 'toad'] },
  { d: 'oo', say: 'oo', color: '#a37fe8', words: ['moon', 'food', 'boot', 'pool', 'zoo', 'spoon'] },
  { d: 'igh', say: 'eye', color: '#ffb000', words: ['night', 'light', 'high', 'bright', 'right', 'sigh'] },
  { d: 'ar', say: 'ar', color: '#fa7d3c', words: ['car', 'star', 'park', 'farm', 'jar', 'shark'] },
];

// Level 7: tricky words - learnt by sight, in sets of five
export const TRICKY = [
  { name: 'Set 1', color: '#1fa7e1', words: ['the', 'to', 'I', 'no', 'go'] },
  { name: 'Set 2', color: '#75d069', words: ['he', 'she', 'we', 'me', 'be'] },
  { name: 'Set 3', color: '#a37fe8', words: ['was', 'you', 'they', 'all', 'are'] },
  { name: 'Set 4', color: '#fb5063', words: ['my', 'said', 'look', 'so', 'like'] },
];

// Level 8 boss battle: picture words that have both a picture and a recorded word clip
export const BOSS_WORDS = ['cat', 'dog', 'pig', 'sun', 'hen', 'bed', 'fox', 'bus', 'cup', 'hat', 'map', 'bug', 'jam', 'web', 'box', 'van', 'frog', 'crab', 'drum', 'flag', 'milk', 'nest', 'tent', 'lamp', 'duck', 'star', 'ant'];

// Stories 2-8: decodable read-alongs (only sounds taught by that level, plus a few tricky words),
// illustrated with the monsters themselves. Words in **bold** can be tapped to hear them.
// scene: bg + props [name, x, y, scale, extra css class] + chars [letter, x, bottom y, height, class]
export const MORE_STORIES = {
  2: {
    title: 'Pip and the Box', level: 2, color: '#79c9ee', cover: { L: 'P', prop: 'box' },
    gate: { text: 'Finish a Level 2 lesson', test: p => p.levels[2] >= 1 },
    pages: [
      { lines: ['Pip has a **big** **box**.'], bg: 'day', props: [['sun', 980, 230, 1], ['box', 610, 470, 1.3]], chars: [['P', 300, 720, 260]] },
      { lines: ['Pip **tips** the **box**.', '**Tap**, **tap**, **tap**!'], bg: 'day', props: [['sun', 980, 230, 1], ['boxTipped', 600, 470, 1.3]], chars: [['P', 300, 720, 260, 'wiggle-loop']] },
      { lines: ['Is it a **cat**?', 'Is it a **hat**?'], bg: 'day', props: [['boxTipped', 600, 470, 1.3], ['ask', 690, 300, 1], ['ask', 850, 260, 0.8]], chars: [['P', 300, 720, 260]] },
      { lines: ['It is a **red** **bug**!', 'The **bug** can **hop**.'], bg: 'day', props: [['boxTipped', 640, 470, 1.3], ['bug', 560, 560, 1.2, 'hop-loop']], chars: [['P', 260, 720, 260]] },
      { lines: ['Pip and the **bug**', '**sit** in the **sun**.'], bg: 'day', props: [['sun', 900, 220, 1.4], ['bug', 520, 600, 1]], chars: [['P', 300, 720, 260, 'float']] },
    ],
  },
  3: {
    title: 'Fin and the Frog', level: 3, color: '#75d069', cover: { L: 'F', prop: 'frog' },
    gate: { text: 'Finish a Level 3 lesson', test: p => p.levels[3] >= 1 },
    pages: [
      { lines: ['Fin **sits** on a **log**.'], bg: 'pond', props: [['log', 330, 600, 1.2]], chars: [['F', 480, 640, 240]] },
      { lines: ['A **frog** **hops** up', 'on the **log**.'], bg: 'pond', props: [['log', 330, 600, 1.2], ['frog', 640, 520, 1, 'hop-loop']], chars: [['F', 430, 640, 240]] },
      { lines: ['"I can **jump**!"', '**yells** the **frog**.'], bg: 'pond', props: [['log', 330, 600, 1.2], ['frog', 700, 380, 1.1, 'float']], chars: [['F', 430, 640, 240]] },
      { lines: ['Fin **jumps** and **jumps**.', '**Plop**! Fin **lands** in the **pond**!'], bg: 'pond', props: [['splash', 720, 560, 1.4]], chars: [['F', 790, 760, 200, 'wiggle-loop']] },
      { lines: ['Fin is **wet**.', 'The **frog** **grins** at Fin.'], bg: 'pond', props: [['log', 330, 600, 1.2], ['frog', 470, 520, 1]], chars: [['F', 760, 700, 240, 'float']] },
    ],
  },
  4: {
    title: 'Camp in the Tent', level: 4, color: '#fb5063', cover: { L: 'S', prop: 'tent' },
    gate: { text: 'Finish a Level 4 lesson', test: p => p.levels[4] >= 1 },
    pages: [
      { lines: ['Max and **Stan**', '**camp** in a **tent**.'], bg: 'dusk', props: [['tent', 560, 420, 1.2]], chars: [['M', 230, 720, 230], ['S', 1000, 720, 230]] },
      { lines: ['The **lamp** is on.', 'It is **snug** in the **tent**.'], bg: 'night', props: [['tent', 560, 420, 1.2], ['lamp', 560, 560, 1, 'glow']], chars: [['M', 230, 720, 230], ['S', 1000, 720, 230]] },
      { lines: ['A **slug** **slips** **past**', 'the **tent**.'], bg: 'night', props: [['tent', 640, 420, 1.2], ['slug', 330, 650, 1.2, 'creep']], chars: [] },
      { lines: ['**Stop**! **Stan** **spots** a **bat**!', 'The **bat** **flaps** and **flits**.'], bg: 'night', props: [['tent', 560, 420, 1.2], ['bat', 760, 230, 1.2, 'float']], chars: [['S', 1000, 720, 230, 'wiggle-loop']] },
      { lines: ['Max and **Stan** **nap**.', '**Snap**! The **lamp** is off.'], bg: 'night', props: [['tent', 560, 420, 1.2], ['zzz', 780, 380, 1, 'float']], chars: [] },
    ],
  },
  5: {
    title: 'Chip and the Ship', level: 5, color: '#a37fe8', cover: { L: 'C', prop: 'ship' },
    gate: { text: 'Finish a Level 5 lesson', test: p => p.levels[5] >= 1 },
    pages: [
      { lines: ['Chip has a **ship**.', 'The **ship** is **big** and **red**.'], bg: 'sea', props: [['dock', 200, 560, 1], ['ship', 760, 380, 1]], chars: [['C', 230, 600, 230]] },
      { lines: ['Chip **packs** a **lunch**', 'and **sets** off.'], bg: 'sea', props: [['ship', 520, 380, 1], ['lunchbox', 420, 470, 0.8]], chars: [['C', 600, 562, 170]] },
      { lines: ['A **fish** **swims** by the **ship**.'], bg: 'sea', props: [['ship', 520, 380, 1], ['fish', 330, 680, 1, 'swim'], ['fish', 900, 720, 0.8, 'swim']], chars: [['C', 600, 562, 170]] },
      { lines: ['The **ship** **rocks**!', '**Smash**! **Crash**!'], bg: 'storm', props: [['ship', 520, 380, 1, 'rock'], ['waves', 597, 560, 1]], chars: [['C', 600, 562, 170, 'rock']] },
      { lines: ['Chip **gets** **back** to the **dock**.', 'Chip **munches** **lunch**.'], bg: 'sea', props: [['dock', 200, 560, 1], ['ship', 820, 400, 0.9], ['lunchbox', 380, 480, 0.8]], chars: [['C', 230, 600, 230, 'float']] },
    ],
  },
  6: {
    title: 'Lee and the Rain', level: 6, color: '#ffb000', cover: { L: 'L', prop: 'raincloud' },
    gate: { text: 'Finish a Level 6 lesson', test: p => p.levels[6] >= 1 },
    pages: [
      { lines: ['**Rain** **drips** on **Lee**.'], bg: 'rain', props: [['raincloud', 360, 180, 1.3], ['tree', 880, 330, 1]], chars: [['L', 470, 720, 250]] },
      { lines: ['**Lee** **hops** in a **boat**.'], bg: 'rainsea', props: [['raincloud', 360, 180, 1.3], ['rowboat', 420, 560, 1.2, 'rock']], chars: [['L', 600, 610, 200, 'rock']] },
      { lines: ['The **boat** **floats**', 'to a **green** **tree**.'], bg: 'rainsea', props: [['tree', 880, 330, 1], ['rowboat', 420, 560, 1.2, 'rock']], chars: [['L', 600, 610, 200, 'rock']] },
      { lines: ['The **rain** **stops**.', 'The **sun** is **bright**!'], bg: 'day', props: [['sun', 900, 230, 1.5], ['tree', 140, 330, 1]], chars: [['L', 600, 720, 250, 'float']] },
      { lines: ['At **night**, **Lee** **sees** the **moon**.'], bg: 'night', props: [['moon', 900, 200, 1.4], ['tree', 140, 330, 1]], chars: [['L', 600, 720, 250]] },
    ],
  },
  7: {
    title: 'Look at Me!', level: 7, color: '#1fa7e1', cover: { L: 'K', prop: 'zigzag' },
    gate: { text: 'Finish a Level 7 lesson', test: p => p.levels[7] >= 1 },
    pages: [
      { lines: ['"**Look** at **me**!" **said** Kit.'], bg: 'day', props: [['sun', 980, 230, 1]], chars: [['K', 500, 720, 260, 'float']] },
      { lines: ['"I can **spin** and **spin**!"'], bg: 'day', props: [['swirl', 380, 300, 1.2]], chars: [['K', 500, 720, 260, 'spin']] },
      { lines: ['"**Look** at **me**!" **said** Zed.', '"I can **zig** and **zag**!"'], bg: 'day', props: [['zigzag', 300, 380, 1.4]], chars: [['Z', 680, 720, 260, 'zig']] },
      { lines: ['"**Look** at **you**!" **said** Kit.', '"**You** are **so** **fast**!"'], bg: 'day', props: [], chars: [['K', 330, 720, 250], ['Z', 830, 720, 250, 'zig']] },
      { lines: ['**They** **all** **spin**', 'and **zig** and **zag**!'], bg: 'day', props: [['swirl', 140, 300, 0.9], ['zigzag', 760, 380, 1]], chars: [['K', 400, 720, 240, 'spin'], ['Z', 800, 720, 240, 'zig']] },
    ],
  },
  8: {
    title: 'Mumble Says Sorry', level: 8, color: '#5b4a9b', cover: { boss: true },
    gate: { text: 'Beat Mumble in Level 8', test: p => p.levels[8] >= 1 },
    pages: [
      { lines: ['Mumble **sits** on a **hill**.', 'He **feels** **sad**.'], bg: 'dusk', props: [['boss', 597, 330, 1, 'sad']], chars: [] },
      { lines: ['"I **was** **bad**," he **said**.', '"I am **sad**. I **need** a **pal**."'], bg: 'dusk', props: [['boss', 597, 330, 1, 'sad']], chars: [] },
      { lines: ['Kit and Zed **run** up the **hill**.'], bg: 'day', props: [['boss', 760, 330, 1]], chars: [['K', 250, 720, 230, 'hop-loop'], ['Z', 470, 720, 230, 'hop-loop']] },
      { lines: ['"**You** can **spin** with **us**!"'], bg: 'day', props: [['boss', 760, 330, 1]], chars: [['K', 250, 720, 230], ['Z', 470, 720, 230, 'spin']] },
      { lines: ['Mumble **grins**.', '**They** **all** **spin** and **zig** and **zag**!'], bg: 'day', props: [['boss', 560, 330, 1, 'spin']], chars: [['K', 200, 720, 230, 'spin'], ['Z', 980, 720, 230, 'zig']] },
    ],
  },
};

// ---------- badges (medal art: a monster in a coloured medal) ----------
const lettersDone = p => Object.keys(p.letters).length;
const shinyCount = p => LETTERS.filter(L => p.best[`l1_${L}`] === 3).length;
export const BADGES = [
  { id: 'first_friend', m: 'A', c: '#ffb000', name: 'First Friend', desc: 'Learn your first letter', test: p => lettersDone(p) >= 1 },
  { id: 'monster_pal', m: 'P', c: '#fa96ba', name: 'Monster Pal', desc: 'Learn 5 letters', test: p => lettersDone(p) >= 5 },
  { id: 'vowel_hero', m: 'E', c: '#a37fe8', name: 'Vowel Hero', desc: 'Learn A, E, I, O and U', test: p => VOWELS.every(L => p.letters[L]) },
  { id: 'alphabet_ace', m: 'Z', c: '#1fa7e1', name: 'Alphabet Ace', desc: 'Learn all 26 letters', test: p => LETTERS.every(L => p.letters[L]) },
  { id: 'sound_sleuth', m: 'S', c: '#1c9886', name: 'Sound Sleuth', desc: 'Finish Sound Practice 3 times', test: p => p.games.sound >= 3 },
  { id: 'memory_master', m: 'M', c: '#fb5063', name: 'Memory Master', desc: 'Finish Memory Matching 3 times', test: p => p.games.memory >= 3 },
  { id: 'word_builder', m: 'B', c: '#fa7d3c', name: 'Word Builder', desc: 'Finish Blending Practice 3 times', test: p => p.games.blend >= 3 },
  { id: 'bookworm', m: 'R', c: '#75d069', name: 'Bookworm', desc: 'Read 3 stories', test: p => (p.games.story || 0) >= 3 },
  { id: 'story_star', m: 'O', c: '#ffb000', name: 'Story Star', desc: 'Read all 8 stories', test: p => [1, 2, 3, 4, 5, 6, 7, 8].every(s => p.stories[s]) },
  { id: 'train_driver', m: 'T', c: '#1fa7e1', name: 'Train Driver', desc: 'Finish 3 Level 3 lessons', test: p => p.levels[3] >= 3 },
  { id: 'blend_boss', m: 'D', c: '#a37fe8', name: 'Blend Boss', desc: 'Finish 3 Level 4 lessons', test: p => p.levels[4] >= 3 },
  { id: 'digraph_detective', m: 'H', c: '#fb5063', name: 'Digraph Detective', desc: 'Finish a Level 5 lesson', test: p => p.levels[5] >= 1 },
  { id: 'team_player', m: 'I', c: '#75d069', name: 'Team Player', desc: 'Finish a Level 6 lesson', test: p => p.levels[6] >= 1 },
  { id: 'tricky_trickster', m: 'Q', c: '#5b4a9b', name: 'Tricky Trickster', desc: 'Finish a Level 7 lesson', test: p => p.levels[7] >= 1 },
  { id: 'word_wizard', m: 'W', c: '#5b4a9b', name: 'Word Wizard', desc: 'Beat Mumble in Level 8', test: p => p.levels[8] >= 1 },
  { id: 'superstar', m: 'U', c: '#ffb000', name: 'Superstar', desc: 'Get 3 stars 5 times', test: p => p.perfect >= 5 },
  { id: 'shiny_5', m: 'G', c: '#e8a800', name: 'Shiny Collector', desc: 'Make 5 monsters shiny', test: p => shinyCount(p) >= 5 },
  { id: 'shiny_26', m: 'X', c: '#e8a800', name: 'Golden Gang', desc: 'Make all 26 monsters shiny', test: p => shinyCount(p) >= 26 },
  { id: 'dress_up', m: 'F', c: '#fa96ba', name: 'Dress Up', desc: 'Buy a hat in the Treasure Shop', test: p => (p.hats || []).length >= 1 },
  { id: 'streak_3', m: 'J', c: '#fb5063', name: 'On Fire', desc: 'Learn 3 days in a row', test: p => (p.streak.best || 0) >= 3 },
  { id: 'streak_7', m: 'K', c: '#fa7d3c', name: 'Super Streak', desc: 'Learn 7 days in a row', test: p => (p.streak.best || 0) >= 7 },
  { id: 'treasure', m: 'N', c: '#e8a800', name: 'Treasure Hunter', desc: 'Earn 300 coins', test: p => p.xp >= 300 },
];

// ---------- treasure shop hats (drawn in art.js) ----------
export const HATS = [
  { id: 'party', name: 'Party Hat', price: 40 },
  { id: 'crown', name: 'Crown', price: 60 },
  { id: 'wizard', name: 'Wizard Hat', price: 60 },
  { id: 'cap', name: 'Cap', price: 40 },
  { id: 'flower', name: 'Flower Crown', price: 50 },
  { id: 'tophat', name: 'Top Hat', price: 50 },
  { id: 'pirate', name: 'Pirate Hat', price: 70 },
  { id: 'bow', name: 'Big Bow', price: 30 },
];
