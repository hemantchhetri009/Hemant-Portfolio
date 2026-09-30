// ============================================================
// POPUP STARS
// ============================================================
(function() {
  const c = document.getElementById('popup-stars');
  if (!c) return;
  const ctx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  const stars = Array.from({length: 80}, () => ({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: Math.random() * 2 + 0.5,
    a: Math.random(),
    d: Math.random() * 0.01 + 0.005
  }));
  function animStars() {
    ctx.clearRect(0, 0, c.width, c.height);
    stars.forEach(s => {
      s.a += s.d;
      if (s.a > 1 || s.a < 0) s.d *= -1;
      ctx.globalAlpha = s.a;
      ctx.fillStyle = '#39ff14';
      ctx.fillRect(s.x | 0, s.y | 0, s.r | 0, s.r | 0);
    });
    requestAnimationFrame(animStars);
  }
  animStars();
})();

// ============================================================
// MAIN STARS
// ============================================================
const mainCanvas = document.getElementById('stars-canvas');
const mCtx = mainCanvas.getContext('2d');
mainCanvas.width = window.innerWidth;
mainCanvas.height = window.innerHeight;
const mainStars = Array.from({length: 120}, () => ({
  x: Math.random() * mainCanvas.width,
  y: Math.random() * mainCanvas.height,
  r: Math.random() * 2 + 0.5,
  a: Math.random(),
  d: Math.random() * 0.008 + 0.003,
  color: ['#39ff14','#00ffff','#ff00aa','#ffe600'][Math.floor(Math.random()*4)]
}));

function animMainStars() {
  mCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  mainStars.forEach(s => {
    s.a += s.d;
    if (s.a > 1 || s.a < 0) s.d *= -1;
    mCtx.globalAlpha = s.a * 0.7;
    mCtx.fillStyle = s.color;
    mCtx.fillRect(s.x | 0, s.y | 0, s.r | 0, s.r | 0);
  });
  requestAnimationFrame(animMainStars);
}
animMainStars();

window.addEventListener('resize', () => {
  mainCanvas.width = window.innerWidth;
  mainCanvas.height = window.innerHeight;
});

// ============================================================
// POPUP ENTER
// ============================================================
// ============================================================
// MUSIC PLAYER - HTML5 AUDIO
// ============================================================
let audioPlayer = null;
let musicPlaying = false;

// Create audio element for Nepali music
(function() {
  audioPlayer = document.createElement('audio');
  audioPlayer.id = 'music-audio';
  audioPlayer.loop = true;
  audioPlayer.volume = 0.75;
  // Popular Nepali song - Timro Mitho Maya by Prakash Saput
  audioPlayer.src = 'ms1.mp3';
  document.body.appendChild(audioPlayer);
})();

function startMusic() {
  var player = document.getElementById('music-player');
  if (player) player.style.display = 'flex';
  
  if (audioPlayer) {
    audioPlayer.play().catch(err => {
      console.log('Audio play blocked:', err);
    });   
    musicPlaying = true;
    var btn = document.getElementById('music-toggle');
    if (btn) { btn.textContent = '⏸'; btn.setAttribute('aria-label', 'Pause music'); }
  }
}

function toggleMusic() {
  var btn = document.getElementById('music-toggle');
  if (!audioPlayer) return;
  
  if (musicPlaying) {
    audioPlayer.pause();
    musicPlaying = false;
    if (btn) { btn.textContent = '▶'; btn.setAttribute('aria-label', 'Play music'); }
  } else {
    audioPlayer.play().catch(err => {
      console.log('Audio play blocked:', err);
    });
    musicPlaying = true;
    if (btn) { btn.textContent = '⏸'; btn.setAttribute('aria-label', 'Pause music'); }
  }
}

// ============================================================
// MOBILE MENU
// ============================================================
function toggleMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  const menuBtn = document.getElementById('menu-btn');
  const isOpen = navLinks.classList.toggle('open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  const menuBtn = document.getElementById('menu-btn');
  navLinks.classList.remove('open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
}

// ============================================================
// WRITER MODE GATE
// ============================================================
const WRITER_PASSCODE = '1010';

function openWriterGate() {
  // Already unlocked earlier this session? Skip straight to writer mode.
  if (sessionStorage.getItem('writerUnlocked') === 'true') {
    window.location.href = 'writer.html';
    return;
  }
  const gate = document.getElementById('writer-gate');
  if (!gate) return;
  gate.classList.add('active');
  document.body.style.overflow = 'hidden';
  const firstDigit = gate.querySelector('.gate-pin-digit[data-index="0"]');
  if (firstDigit) setTimeout(() => firstDigit.focus(), 100);
}

function closeWriterGate() {
  const gate = document.getElementById('writer-gate');
  if (!gate) return;
  gate.classList.remove('active');
  document.body.style.overflow = '';
  document.querySelectorAll('.gate-pin-digit').forEach(i => i.value = '');
  const err = document.getElementById('gate-error');
  if (err) err.textContent = '';
}

function submitPasscode() {
  const digits = document.querySelectorAll('.gate-pin-digit');
  const code = Array.from(digits).map(d => d.value).join('');
  const errEl = document.getElementById('gate-error');
  const box = document.querySelector('.writer-gate-box');

  if (code === WRITER_PASSCODE) {
    sessionStorage.setItem('writerUnlocked', 'true');
    if (errEl) {
      errEl.style.color = 'var(--pixel-green)';
      errEl.textContent = '✓ ACCESS GRANTED';
    }
    setTimeout(() => { window.location.href = 'writer.html'; }, 500);
  } else {
    if (errEl) {
      errEl.style.color = '#ff4444';
      errEl.textContent = '⚠ ACCESS DENIED — WRONG CODE';
    }
    digits.forEach(d => d.value = '');
    if (digits[0]) digits[0].focus();
    if (box) {
      box.classList.add('shake');
      setTimeout(() => box.classList.remove('shake'), 400);
    }
  }
}

// Passcode input: auto-advance between digit boxes, backspace to go back,
// Enter to submit. Script tag is at the end of <body>, so the gate markup
// already exists in the DOM by the time this runs.
(function setupGateInputs() {
  const digits = document.querySelectorAll('.gate-pin-digit');
  digits.forEach((input, idx) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '');
      if (input.value && idx < digits.length - 1) {
        digits[idx + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        digits[idx - 1].focus();
      }
      if (e.key === 'Enter') {
        submitPasscode();
      }
    });
  });

  // Click outside the box, or Escape, closes the gate
  const overlay = document.getElementById('writer-gate');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeWriterGate();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const gate = document.getElementById('writer-gate');
      if (gate && gate.classList.contains('active')) closeWriterGate();
    }
  });
})();

// ============================================================
// CONTACT FORM
// ============================================================
function sendMessage() {
  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const msg = document.getElementById('form-msg').value.trim();
  const fb = document.getElementById('form-feedback');

  if (!name || !email || !msg) {
    fb.textContent = '⚠ ALL FIELDS REQUIRED!';
    fb.style.color = '#ff4444';
    return;
  }

  fb.textContent = '> SENDING...';
  fb.style.color = 'var(--pixel-yellow)';

  setTimeout(() => {
    window.location.href = `mailto:sanskritchhetry009@gmail.com?subject=Message from ${name}&body=${encodeURIComponent(msg + '\n\nFrom: ' + name + '\nEmail: ' + email)}`;
    fb.textContent = '✓ MESSAGE TRANSMITTED!';
    fb.style.color = 'var(--pixel-green)';
    document.getElementById('form-name').value = '';
    document.getElementById('form-email').value = '';
    document.getElementById('form-msg').value = '';
  }, 800);
}

// ============================================================
// POPUP ENTER
// ============================================================
function enterSite() {
  const overlay = document.getElementById('popup-overlay');
  const wrapper = document.getElementById('page-wrapper');

  // Animate popup out
  overlay.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  overlay.style.opacity = '0';
  overlay.style.transform = 'scale(1.05)';

  setTimeout(() => {
    overlay.style.display = 'none';
    wrapper.style.display = 'block';
    // Start music
    try { startMusic(); } catch(e) { console.log('Audio error:', e); }
    setTimeout(() => initPage(), 100);
  }, 800);
}

// Keyboard Enter support
document.addEventListener('keydown', function(e) {
  const overlay = document.getElementById('popup-overlay');
  if (e.key === 'Enter' && overlay && overlay.style.display !== 'none') {
    enterSite();
  }
});

// ============================================================
// PAGE INIT
// ============================================================
function initPage() {
  // Fade-in scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Skill bars animation
  const skillSection = document.getElementById('skills');
  if (skillSection) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            const pct = bar.dataset.pct;
            setTimeout(() => { bar.style.width = pct + '%'; }, 300);
          });
        }
      });
    }, { threshold: 0.1 });
    skillObserver.observe(skillSection);
  }

  // Typing effect in terminal
  const cmds = [
    'ls projects/', 'cat bio.md', 'ping hemant.dev', 'sudo vim future.txt'
  ];
  let ci = 0, ci2 = 0, typing = true;
  const typingEl = document.getElementById('typing-cmd');

  function typeLoop() {
    if (!typingEl) return;
    const cmd = cmds[ci % cmds.length];
    if (typing) {
      typingEl.textContent = cmd.slice(0, ci2);
      ci2++;
      if (ci2 > cmd.length) {
        typing = false;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      typingEl.textContent = cmd.slice(0, ci2);
      ci2--;
      if (ci2 < 0) {
        typing = true;
        ci++;
        ci2 = 0;
        setTimeout(typeLoop, 400);
        return;
      }
    }
    setTimeout(typeLoop, typing ? 100 : 50);
  }
  setTimeout(typeLoop, 500);

  // Pixel cursor trail
  const container = document.getElementById('cursor-container');
  const pixels = [];
  const MAX_PIXELS = 12;

  document.addEventListener('mousemove', (e) => {
    const px = document.createElement('div');
    px.className = 'cursor-pixel';
    px.style.left = (e.clientX - 3) + 'px';
    px.style.top  = (e.clientY - 3) + 'px';
    px.style.background = ['#39ff14','#00ffff','#ff00aa','#ffe600'][Math.floor(Math.random()*4)];
    container.appendChild(px);
    pixels.push(px);
    if (pixels.length > MAX_PIXELS) {
      const old = pixels.shift();
      old.style.opacity = '0';
      setTimeout(() => old.remove(), 300);
    }
    setTimeout(() => {
      px.style.opacity = '0';
      setTimeout(() => {
        if (px.parentNode) px.remove();
        const i = pixels.indexOf(px);
        if (i > -1) pixels.splice(i, 1);
      }, 300);
    }, 200);
  });
}