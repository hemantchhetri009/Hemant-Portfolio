// ============================================================
// TYPEWRITER INTRO LINE
// ============================================================
(function () {
  const el = document.getElementById('typewriter-line');
  if (!el) return;
  const text = "Some days the code won't cooperate, so I write instead.";
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 45);
    }
  }
  setTimeout(type, 300);
})();

// ============================================================
// MUSIC PLAYER
// (Silent until a <source> is added inside #writer-audio in
// writer.html -- see the comment there for how to add a track.)
// ============================================================
let writerMusicPlaying = false;

(function () {
  const audio = document.getElementById('writer-audio');
  const btn = document.getElementById('wr-music-btn');
  const name = document.getElementById('wr-music-name');
  const sub = document.getElementById('wr-music-sub');
  if (!audio || !btn) return;

  const hasSource = !!audio.querySelector('source[src]') || !!audio.getAttribute('src');

  if (hasSource) {
    btn.disabled = false;
    if (name) name.textContent = 'Ambient track';
    if (sub) sub.textContent = 'Tap play to start the music';
  }
})();

function toggleWriterMusic() {
  const audio = document.getElementById('writer-audio');
  const btn = document.getElementById('wr-music-btn');
  if (!audio || !btn || btn.disabled) return;

  if (writerMusicPlaying) {
    audio.pause();
    btn.textContent = '\u25B6';
  } else {
    audio.play().catch(() => {});
    btn.textContent = '\u23F8';
  }
  writerMusicPlaying = !writerMusicPlaying;
}
