// ───────── WRAITH site JS ─────────

// Scroll progress
const progress = document.querySelector('.scroll-progress');
function updateProgress() {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = pct + '%';
}
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// IntersectionObserver reveals
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      // word-slide hooks
      e.target.querySelectorAll('.word-slide').forEach((w, i) => {
        setTimeout(() => w.classList.add('in'), i * 80);
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

// Hero word-slide trigger immediately
document.querySelectorAll('.hero .word-slide').forEach((w, i) => {
  setTimeout(() => w.classList.add('in'), 180 + i * 90);
});

// Hero stat counters
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const dur = 1600;
  const start = performance.now();
  const suffix = el.dataset.suffix || '';
  function frame(t) {
    const p = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = target.toLocaleString() + suffix;
  }
  requestAnimationFrame(frame);
}
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      statIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => statIO.observe(el));

// Feature card mouse glow
document.querySelectorAll('.feature').forEach(f => {
  f.addEventListener('pointermove', (e) => {
    const r = f.getBoundingClientRect();
    f.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    f.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

// FAQ
document.querySelectorAll('.faq__item').forEach(item => {
  item.addEventListener('click', () => item.classList.toggle('open'));
});

// ──────── PARTICLES (embers + dust) ────────
const particleCanvas = document.getElementById('particles');
if (particleCanvas) {
  const ctx = particleCanvas.getContext('2d');
  let W, H;
  function resize() {
    W = particleCanvas.width = particleCanvas.offsetWidth * devicePixelRatio;
    H = particleCanvas.height = particleCanvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = 90;
  const particles = Array.from({ length: N }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 0.4,
    vx: (Math.random() - 0.5) * 0.3 * devicePixelRatio,
    vy: (-Math.random() * 0.6 - 0.2) * devicePixelRatio,
    life: Math.random(),
    hue: Math.random() < 0.7 ? 'ember' : 'dust',
  }));

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 0.005;
      if (p.y < -10 || p.x < -10 || p.x > W + 10) {
        p.x = Math.random() * W;
        p.y = H + 10;
        p.life = 0;
      }
      const opacity = Math.sin(p.life * Math.PI) * 0.9;
      if (p.hue === 'ember') {
        ctx.fillStyle = `rgba(255, 80, 60, ${opacity * 0.85})`;
        ctx.shadowColor = 'rgba(255,80,60,1)';
        ctx.shadowBlur = 12;
      } else {
        ctx.fillStyle = `rgba(200,180,150, ${opacity * 0.5})`;
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
}

// ──────── COMMAND RAIN (in install section bg) ────────
const rainCanvas = document.getElementById('rain');
if (rainCanvas) {
  const ctx = rainCanvas.getContext('2d');
  let W, H;
  const cmds = [
    'wraith.heal()','wraith.tp()','setGodMode(true)','spawn.ped()','aimbot.lock()',
    'esp.draw()','noclip.toggle()','infiniteAmmo()','weather.set()','rainPigeons()',
    'spawnHorse()','clone.attach()','silentKill()','stratosphere()','blackHole()',
    'cuff(player)','jail(10m)','crashTarget()','fakeMessage()','animals.esp()',
  ];
  function resize() {
    W = rainCanvas.width = rainCanvas.offsetWidth * devicePixelRatio;
    H = rainCanvas.height = rainCanvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener('resize', resize);

  const cols = 24;
  const drops = Array.from({ length: cols }, (_, i) => ({
    x: (i + 0.5) * (W / cols),
    y: Math.random() * H,
    speed: (Math.random() * 1 + 0.6) * devicePixelRatio,
    text: cmds[i % cmds.length],
    fontSize: (12 + Math.random() * 4) * devicePixelRatio,
  }));

  function tick() {
    ctx.fillStyle = 'rgba(5,3,4,0.18)';
    ctx.fillRect(0, 0, W, H);
    drops.forEach(d => {
      ctx.font = `${d.fontSize}px JetBrains Mono, monospace`;
      ctx.fillStyle = 'rgba(193,39,45,0.6)';
      ctx.fillText(d.text, d.x, d.y);
      d.y += d.speed * 1.4;
      if (d.y > H + 30) {
        d.y = -20;
        d.text = cmds[Math.floor(Math.random() * cmds.length)];
      }
    });
    requestAnimationFrame(tick);
  }
  tick();
}

// ──────── TYPED TERMINAL ────────
const term = document.querySelector('.terminal__body');
if (term) {
  const lines = [
    { type: 'cmd', text: 'cd resources && git clone https://github.com/wraith/wraith.git' },
    { type: 'out', text: 'Cloning into \'wraith\'... done.' },
    { type: 'cmd', text: 'echo "ensure wraith" >> server.cfg' },
    { type: 'cmd', text: 'redm-server start' },
    { type: 'out', text: '[wraith] Loading 1,800+ ped configs...' },
    { type: 'out', text: '[wraith] Loading 116 vehicles, 106 horses...' },
    { type: 'out', text: '[wraith] Hooking native menus...' },
    { type: 'ok',  text: '[wraith] ✓ ready — press F4 in-game' },
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let currentLine = null;

  function next() {
    if (lineIdx >= lines.length) {
      // restart
      setTimeout(() => {
        term.innerHTML = '';
        lineIdx = 0; charIdx = 0;
        next();
      }, 4000);
      return;
    }
    const line = lines[lineIdx];
    if (!currentLine) {
      currentLine = document.createElement('span');
      currentLine.className = 'terminal__line';
      if (line.type === 'cmd') {
        currentLine.innerHTML = '<span class="t-prompt">▸</span><span class="t-cmd"></span>';
      } else if (line.type === 'ok') {
        currentLine.innerHTML = '<span class="t-ok"></span>';
      } else {
        currentLine.innerHTML = '<span class="t-out"></span>';
      }
      term.appendChild(currentLine);
    }
    const target = currentLine.querySelector('.t-cmd, .t-out, .t-ok');
    if (charIdx < line.text.length) {
      target.textContent += line.text[charIdx++];
      const delay = line.type === 'cmd' ? 28 + Math.random()*30 : 8;
      setTimeout(next, delay);
    } else {
      term.appendChild(document.createElement('br'));
      currentLine = null;
      lineIdx++;
      charIdx = 0;
      setTimeout(next, line.type === 'cmd' ? 350 : 200);
    }
  }
  // start when in view
  const tIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { next(); tIO.disconnect(); }
    });
  }, { threshold: 0.4 });
  tIO.observe(term);
}

// ──────── HERO TITLE PARALLAX ────────
const heroTitle = document.querySelector('.hero__title');
if (heroTitle) {
  document.addEventListener('pointermove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    heroTitle.style.transform = `translate(${x}px, ${y}px)`;
  });
  document.addEventListener('scroll', () => {
    const y = window.scrollY * 0.4;
    heroTitle.style.opacity = Math.max(0, 1 - window.scrollY / 700);
  }, { passive: true });
}

// Marquee duplication for seamless loop
document.querySelectorAll('.marquee__track').forEach(track => {
  track.innerHTML += track.innerHTML;
});
