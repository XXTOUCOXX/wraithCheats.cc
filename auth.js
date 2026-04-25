// Shared auth + dashboard JS

// ─── Particles for auth pages ───
const partCanvas = document.getElementById('auth-particles');
if (partCanvas) {
  const ctx = partCanvas.getContext('2d');
  let W, H;
  function resize() {
    W = partCanvas.width = window.innerWidth * devicePixelRatio;
    H = partCanvas.height = window.innerHeight * devicePixelRatio;
    partCanvas.style.width = window.innerWidth + 'px';
    partCanvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);
  const N = 60;
  const ps = Array.from({ length: N }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
    vy: (-Math.random() * 0.5 - 0.15) * devicePixelRatio,
    life: Math.random(),
    ember: Math.random() < 0.65,
  }));
  function tick() {
    ctx.clearRect(0, 0, W, H);
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life += 0.005;
      if (p.y < -10 || p.x < -10 || p.x > W + 10) {
        p.x = Math.random() * W; p.y = H + 10; p.life = 0;
      }
      const a = Math.sin(p.life * Math.PI) * 0.85;
      if (p.ember) {
        ctx.fillStyle = `rgba(255,80,60,${a * 0.8})`;
        ctx.shadowColor = 'rgba(255,80,60,1)';
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = `rgba(200,180,150,${a * 0.4})`;
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

// ─── Toast helper ───
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}
window.wraithToast = toast;

// ─── Code box (6 inputs) ───
function setupCodebox(root) {
  const inputs = [...root.querySelectorAll('input')];
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', (e) => {
      const v = e.target.value.replace(/\D/g, '').slice(0, 1);
      e.target.value = v;
      if (v) {
        e.target.classList.add('filled');
        if (inputs[i + 1]) inputs[i + 1].focus();
      } else {
        e.target.classList.remove('filled');
      }
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && inputs[i - 1]) {
        inputs[i - 1].focus();
        inputs[i - 1].value = '';
        inputs[i - 1].classList.remove('filled');
      }
    });
    inp.addEventListener('paste', (e) => {
      e.preventDefault();
      const txt = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, inputs.length);
      txt.split('').forEach((ch, j) => {
        if (inputs[j]) {
          inputs[j].value = ch;
          inputs[j].classList.add('filled');
        }
      });
      const next = Math.min(txt.length, inputs.length - 1);
      inputs[next].focus();
    });
  });
}
window.wraithCodebox = setupCodebox;
document.querySelectorAll('.codebox').forEach(setupCodebox);

// ─── Resend timer ───
function setupResend(btn, seconds = 30) {
  let s = seconds;
  btn.disabled = true;
  const orig = btn.dataset.label || btn.textContent;
  btn.dataset.label = orig;
  function tick() {
    btn.textContent = `Resend in ${s}s`;
    if (s <= 0) {
      btn.disabled = false;
      btn.textContent = orig;
      return;
    }
    s--;
    setTimeout(tick, 1000);
  }
  tick();
}
window.wraithResend = setupResend;
document.querySelectorAll('[data-resend]').forEach(b => setupResend(b, 30));
