// Voice line keys shared by the app and the audio generator (tools/voice_manifest.mjs).
// Every line the app speaks is recorded; nothing is left to the device's robot voice.
import { BADGES, MORE_STORIES } from './data.js';

export const slug = w => w.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// How the narrator voices each consonant blend
export const BLEND_SAY = {
  bl: 'bluh', cl: 'kluh', fl: 'fluh', pl: 'pluh', sl: 'sluh',
  br: 'bruh', cr: 'kruh', dr: 'druh', tr: 'truh', st: 'stuh',
  nd: 'nnd', nk: 'nngk', mp: 'mmp', nt: 'nnt',
};

// gate text for each level, kept here so the "locked" lines can be recorded
export const GATE_TEXT = {
  2: 'Learn 5 letters in Level 1', 3: 'Finish 2 lessons in Level 2', 4: 'Finish 2 lessons in Level 3',
  5: 'Finish 2 lessons in Level 4', 6: 'Finish 2 lessons in Level 5', 7: 'Finish 2 lessons in Level 6', 8: 'Finish 2 lessons in Level 7',
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
  l2: "Let's find the middle and last sounds!",
  find_middle: 'Which monster makes the middle sound?',
  find_last: 'Which monster makes the last sound?',
  l3: 'How many sounds can you blend?',
  blend_go: 'Push the sounds together with the train!',
  l4: "Let's learn the consonant blends!",
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
  listening: "I'm listening!",
  kid_hello: 'Hello, friend!',
  // Level 5 + 6: letter teams
  l5: 'Two letters can team up to make one new sound! Pick a sound team.',
  l5_meet: 'When these letters stand together, they make one sound.',
  l5_quiz: 'Listen to the word. Which sound team do you hear?',
  l6: 'Vowels love to team up too! Pick a sound team.',
  // Level 7: tricky words
  l7: "Tricky words don't follow the rules, so we learn them by heart. Pick a set!",
  l7_look: 'Look at the word, and listen.',
  l7_find: 'Find the word you hear!',
  find_monster: 'Which monster makes this sound?',
  // Level 8: boss battle
  l8: 'Oh no! Mumble the Word Wizard has mixed up all the sounds! Answer the questions to win them back!',
  boss_pic: 'Which word matches the picture?',
  boss_sound: 'Which letter makes this sound?',
  boss_mid: 'Which letter is missing?',
  boss_team: 'Which sound team is in this word?',
  boss_tricky: 'Which word did you hear?',
  boss_win: 'You did it! Mumble gives all the sounds back. You are a reading hero!',
  boss_lose: "So close! Mumble got away this time. Let's try again!",
  boss_hit: 'Bonk!',
  // unlocks and rewards
  level_open: 'Hooray! A new level is open!',
  story_open: 'A new story is ready to read!',
  more_levels: 'More levels this way!',
  more_stories: 'More stories this way!',
  treasure: 'Spend your coins on monster friends and fun hats!',
  need_coins: 'You need more coins. Keep playing to earn them!',
  got_friend: 'Yay! A new monster friend!',
  got_hat: 'Ooh, looking good!',
  shiny: 'Wow, three stars! Your monster is now shiny!',
  badges_many: 'Wow! You earned new badges!',
  streak_1: 'Hello, friend! Here is your daily treasure!',
  streak_more: 'Another day of learning! Here is your daily treasure!',
  // shop
  worksheets: 'Ask a grown-up to print your tracing sheets!',
  wishlist: 'Added to the wish list!',
  product: 'Ask a grown-up to take a look!',
};
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
for (let d = 2; d <= 7; d++) UI_LINES[`streak_${d}`] = `Day ${NUM[d]}! You're on a learning streak! Here is your daily treasure!`;
for (let n = 2; n <= 40; n++) UI_LINES[`levelup_${n}`] = `Level up! You are now level ${n}!`;
for (const [n, t] of Object.entries(GATE_TEXT)) UI_LINES[`lock_level_${n}`] = `This level is locked. ${t} to open it.`;
for (const [n, st] of Object.entries(MORE_STORIES)) UI_LINES[`lock_story_${n}`] = `This story is locked. ${st.gate.text} to open it.`;
for (const b of BADGES) {
  UI_LINES[`badge_new_${b.id}`] = `New badge! ${b.name}!`;
  UI_LINES[`badge_${b.id}`] = `${b.name}! ${b.desc}.`;
  UI_LINES[`badge_lock_${b.id}`] = `To earn this badge, ${b.desc.charAt(0).toLowerCase() + b.desc.slice(1)}.`;
}
