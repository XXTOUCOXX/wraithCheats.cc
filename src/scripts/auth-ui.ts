// Shared UI helpers ported from the old auth.js: toast, 6-digit code box, resend timer.

let toastTimer: number | undefined;

export function toast(msg: string) {
  let t = document.querySelector<HTMLDivElement>('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => t!.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t!.classList.remove('show'), 2800);
}

export function setupCodebox(root: HTMLElement) {
  const inputs = [...root.querySelectorAll<HTMLInputElement>('input')];
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      const v = inp.value.replace(/\D/g, '').slice(0, 1);
      inp.value = v;
      inp.classList.toggle('filled', !!v);
      if (v) inputs[i + 1]?.focus();
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !inp.value && inputs[i - 1]) {
        inputs[i - 1].focus();
        inputs[i - 1].value = '';
        inputs[i - 1].classList.remove('filled');
      }
    });
    inp.addEventListener('paste', (e) => {
      e.preventDefault();
      const txt = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, inputs.length);
      txt.split('').forEach((ch, j) => {
        inputs[j].value = ch;
        inputs[j].classList.add('filled');
      });
      inputs[Math.min(txt.length, inputs.length - 1)].focus();
    });
  });
}

export function readCode(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLInputElement>('input')].map((i) => i.value).join('');
}

export function startResend(btn: HTMLButtonElement, seconds = 30) {
  let s = seconds;
  btn.disabled = true;
  const label = btn.dataset.label || btn.textContent || 'Resend code';
  btn.dataset.label = label;
  const tick = () => {
    if (s <= 0) {
      btn.disabled = false;
      btn.textContent = label;
      return;
    }
    btn.textContent = `Resend in ${s}s`;
    s--;
    setTimeout(tick, 1000);
  };
  tick();
}

export function setLoading(btn: HTMLButtonElement, loading: boolean) {
  btn.disabled = loading;
  btn.dataset.orig ??= btn.textContent || '';
  btn.textContent = loading ? '…' : btn.dataset.orig;
}
