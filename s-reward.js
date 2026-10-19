// "Lesson Complete" reward page (shared by every lesson and minigame).
import { route, go, tpl, $, onTap, confetti } from './core.js';
import { music, say, sfx, wait } from './audio.js';
import { settingsPopup } from './ui.js';

route('reward', (el, { replay, done }) => {
  const t = tpl('reward');
  el.append(t);
  music('menu');
  const stars = ['429:385', '430:368', '430:374'].map(id => $(t, id));
  stars.forEach(s => { s.style.opacity = 0; });
  (async () => {
    sfx('complete');
    confetti(80);
    for (const s of stars) { await wait(260); s.style.opacity = 1; s.classList.add('pop'); sfx('star', 0.7); }
    sfx('cheer', 0.6);
    say('ui_lesson_complete');
  })();
  const doReplay = () => go(...replay);
  const doDone = () => go(...done);
  onTap($(t, '430:377'), doReplay, { sound: 'pop' }); onTap($(t, '430:378'), doReplay, { sound: 'pop' });
  onTap($(t, '428:779'), doDone, { sound: 'pop' }); onTap($(t, '428:782'), doDone, { sound: 'pop' });
  onTap($(t, '428:638'), doDone, { sound: 'nav' });
  onTap($(t, '428:634'), () => settingsPopup());
  $(t, '96:182') && ($(t, '96:182').style.pointerEvents = 'none');
});
