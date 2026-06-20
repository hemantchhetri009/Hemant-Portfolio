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
    if (btn) btn.textContent = '⏸';
  }
}

function toggleMusic() {
  var btn = document.getElementById('music-toggle');
  if (!audioPlayer) return;
  
  if (musicPlaying) {
    audioPlayer.pause();
    musicPlaying = false;
    if (btn) btn.textContent = '▶';
  } else {
    audioPlayer.play().catch(err => {
      console.log('Audio play blocked:', err);
    });
    musicPlaying = true;
    if (btn) btn.textContent = '⏸';
  }
}

// ============================================================
// MOBILE MENU
// ============================================================
function toggleMobileMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('nav-links').classList.remove('open');
}

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