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

// Level 6 boss battle: picture words that have both a picture and a recorded word clip
export const BOSS_WORDS = ['cat', 'dog', 'pig', 'sun', 'hen', 'bed', 'fox', 'bus', 'cup', 'hat', 'map', 'bug', 'jam', 'web', 'box', 'van', 'frog', 'crab', 'drum', 'flag', 'milk', 'nest', 'tent', 'lamp', 'duck', 'star', 'ant'];

// Stories 2-4: decodable read-alongs that open as the child moves through the levels.
// pic: a PICS word. Words in **bold** can be tapped to hear them.
export const MORE_STORIES = {
  2: {
    title: 'The Hen and the Egg', level: 2, color: '#79c9ee', cover: 'hen',
    gate: { text: 'Finish a Level 2 lesson', test: p => p.levels[2] >= 1 },
    pages: [
      { pic: 'nest', lines: ['A red **hen** sat on a **nest**.'] },
      { pic: 'egg', lines: ['In the **nest** is an **egg**.'] },
      { pic: 'sun', lines: ['The **sun** is hot.', 'The **hen** sits and sits.'] },
      { pic: 'egg', lines: ['**Tap**, **tap**, **tap**!', 'The **egg** has a **crack**.'] },
      { pic: 'hen', lines: ['Out pops a chick!', 'The **hen** is so **glad**.'] },
    ],
  },
  3: {
    title: 'Frog and Crab', level: 3, color: '#75d069', cover: 'frog',
    gate: { text: 'Finish a Level 3 lesson', test: p => p.levels[3] >= 1 },
    pages: [
      { pic: 'frog', lines: ['A **frog** sat on a log.'] },
      { pic: 'crab', lines: ['A **crab** ran on the **sand**.'] },
      { pic: 'frog', lines: ['The **frog** can **jump**.', 'The **crab** can grab.'] },
      { pic: 'drum', lines: ['The **crab** has a **drum**.', 'Tum, tum, tum!'] },
      { pic: 'crab', lines: ['The **frog** and the **crab**', '**clap** and **jump**.', 'What fun!'] },
    ],
  },
  4: {
    title: 'The Star Tent', level: 4, color: '#fb5063', cover: 'tent',
    gate: { text: 'Finish a Level 4 lesson', test: p => p.levels[4] >= 1 },
    pages: [
      { pic: 'tent', lines: ['We **camp** in a **tent**.'] },
      { pic: 'lamp', lines: ['The **lamp** is on.', 'It is snug.'] },
      { pic: 'snail', lines: ['A **snail** slips past', 'the **tent**.'] },
      { pic: 'star', lines: ['**Stop**! Look up!', 'The sky is **black**.', 'The stars are bright.'] },
      { pic: 'tent', lines: ['We **sleep** in the **tent**.', 'Good night!'] },
    ],
  },
};
