// Voice line keys shared by the app and the audio generator (tools/audio_manifest.mjs).

export const slug = w => w.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// How the narrator voices each consonant blend
export const BLEND_SAY = {
  bl: 'bluh', cl: 'kluh', fl: 'fluh', pl: 'pluh', sl: 'sluh',
  br: 'bruh', cr: 'kruh', dr: 'druh', tr: 'truh', st: 'stuh',
  nd: 'nnd', nk: 'nngk', mp: 'mmp', nt: 'nnt',
};

export const UI_LINES = {
  welcome: 'Welcome to PhonoMonsters! Where monster buddies make reading easy!',
  who: 'Who is learning today?',
  home: 'What shall we play today?',
  discover: 'Pick a level to discover new sounds!',
  minigames: 'Pick a game to play!',
  phonodex: 'Here are all your monster friends. Collect them all!',
  shop: 'Welcome to the shop!',
  l1: 'Tap a letter to learn its sound!',
  listen: 'Listen to the sound.',
  say_it: 'Now you say it!',
  meet: 'Meet the monster!',
  trace: 'Trace the letter with your finger!',
  l2: 'Let us find the middle and last sounds!',
  find_middle: 'Which monster makes the middle sound?',
  find_last: 'Which monster makes the last sound?',
  l3: 'How many sounds can you blend?',
  blend_go: 'Push the sounds together with the train!',
  l4: 'Let us learn the consonant blends!',
  blend_meet: 'These two monsters make a blend!',
  word_list: 'Tap each word to hear it!',
  sound_game: 'Listen to the monster, then tap the letter you hear!',
  drag_spell: 'Drag the monsters into the boxes to spell the word!',
  memory: 'Flip the cards and find the matching monster pairs!',
  reading: 'Pick a story to read!',
  locked: 'This one is still locked. Keep learning to unlock it!',
  coming_soon: 'Coming soon!',
  lesson_complete: 'Lesson complete! Great job!',
  unlocked: 'Yay! You unlocked a new monster friend!',
  parents: 'Parents only. Please enter your year of birth.',
  great_try: 'Great try! Keep practising!',
  listening: 'I am listening!',
  kid_hello: 'Hello friend!',
};
