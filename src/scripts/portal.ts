// Port of the old portal.js. Same backend, portal key, endpoints and localStorage keys,
// so existing sessions keep working after the redesign.
import { toast, setupCodebox, readCode, startResend, setLoading } from './auth-ui';

const API_BASE = 'https://proudlyauthentication.com';
const PORTAL_KEY = 'pk_gri2butNfQ28AWQqNTD5xLtQKwer2MNv';
export const TOKEN_KEY = 'portalSessionToken';
const CUSTOMER_KEY = 'portalCustomer';

type Json = Record<string, any>;

const store = {
  get(k: string) {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  set(k: string, v: string) {
    try { localStorage.setItem(k, v); } catch { /* storage blocked */ }
  },
  remove(k: string) {
    try { localStorage.removeItem(k); } catch { /* storage blocked */ }
  },
};

export function hasSession() {
  return !!store.get(TOKEN_KEY);
}

async function api(method: string, endpoint: string, body?: unknown): Promise<Json> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const t = store.get(TOKEN_KEY);
  if (t) headers.Authorization = `Bearer ${t}`;
  const res = await fetch(`${API_BASE}/api/portal/v1/${PORTAL_KEY}${endpoint}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign({}, data, { _status: res.status });
  return data;
}

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

function makeGoStep() {
  const panes = document.querySelectorAll<HTMLElement>('.step-pane');
  const dots = document.querySelectorAll<HTMLElement>('.steps__dot');
  return (n: number) => {
    panes.forEach((p) => p.classList.toggle('active', +p.dataset.pane! === n));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i + 1 === n);
      d.classList.toggle('done', i + 1 < n);
    });
    panes[n - 1]?.querySelector<HTMLElement>('input, button')?.focus();
  };
}

// ── LOGIN ──
export function initLogin() {
  const form = $<HTMLFormElement>('login-form');
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = $<HTMLInputElement>('username').value.trim();
    const password = $<HTMLInputElement>('password').value;
    setLoading(btn, true);
    try {
      const data = await api('POST', '/auth/login', { username, password });
      const token = data.session?.token;
      if (!token) {
        toast('Login error: no token in response');
        setLoading(btn, false);
        return;
      }
      store.set(TOKEN_KEY, token);
      if (data.customer) store.set(CUSTOMER_KEY, JSON.stringify(data.customer));
      toast('Signing in…');
      setTimeout(() => (location.href = '/dashboard'), 600);
    } catch (err: any) {
      toast(err.message || 'Invalid credentials');
      setLoading(btn, false);
    }
  });
}

// ── FORGOT ──
export function initForgot() {
  const goStep = makeGoStep();
  const state = { email: '', code: '' };
  const forgotForm = $<HTMLFormElement>('forgot-form');
  const forgotBtn = forgotForm.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const verifyBtn = $<HTMLButtonElement>('forgot-verify');
  const resetForm = $<HTMLFormElement>('reset-form');
  const resetBtn = resetForm.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const codebox = $('forgot-codebox');
  const resendBtns = document.querySelectorAll<HTMLButtonElement>('[data-resend]');
  setupCodebox(codebox);

  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $<HTMLInputElement>('forgot-email').value.trim();
    setLoading(forgotBtn, true);
    try {
      await api('POST', '/auth/password-reset/request', { email });
      state.email = email;
      $('forgot-email-target').textContent = email;
      toast('Reset code sent');
      goStep(2);
      resendBtns.forEach((b) => startResend(b, 30));
    } catch (err: any) {
      toast(err.message || 'Could not send reset code');
    } finally {
      setLoading(forgotBtn, false);
    }
  });

  resendBtns.forEach((b) =>
    b.addEventListener('click', async () => {
      try {
        await api('POST', '/auth/password-reset/request', { email: state.email });
        toast('Code resent');
        startResend(b, 30);
      } catch (err: any) {
        toast(err.message || 'Could not resend');
      }
    }),
  );

  verifyBtn.addEventListener('click', () => {
    const code = readCode(codebox);
    if (code.length < 6) return toast('Enter all 6 digits');
    state.code = code;
    toast('Code accepted');
    setTimeout(() => goStep(3), 500);
  });

  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = $<HTMLInputElement>('new-pw').value;
    if (newPassword !== $<HTMLInputElement>('confirm-pw').value) return toast('Passwords do not match');
    setLoading(resetBtn, true);
    try {
      const data = await api('POST', '/auth/password-reset/confirm', {
        email: state.email,
        code: state.code,
        newPassword,
      });
      if (data.token) store.set(TOKEN_KEY, data.token);
      toast('Password updated. Signing in…');
      setTimeout(() => (location.href = '/dashboard'), 1000);
    } catch (err: any) {
      toast(err.message || 'Reset failed');
      setLoading(resetBtn, false);
    }
  });
}

// ── DASHBOARD ──
export function initDashboard() {
  if (!hasSession()) {
    location.href = '/login';
    return;
  }

  const TIER_MAP: Record<string, string> = { '10': 'Elite', '11': 'Platinum' };
  const TIER_PRIORITY = ['11', '10'];

  const subId = (sub: any): string => {
    if (sub == null) return '';
    if (typeof sub === 'string' || typeof sub === 'number') return String(sub);
    return String(sub.id || sub.subscription_id || sub.subscriptionId || sub.product_id || sub.productId || '');
  };

  const tierFrom = (subs: any): string => {
    const list = Array.isArray(subs) ? subs : [subs];
    const ids = list.map(subId);
    const hit = TIER_PRIORITY.find((id) => ids.includes(id));
    if (hit) return TIER_MAP[hit];
    return list.find((s) => s && typeof s === 'object' && s.tier)?.tier || '';
  };

  const fmtDate = (v: any) => {
    if (!v) return '';
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const setTier = (tier: string) => {
    if (!tier) return;
    $('dash-tier').textContent = tier;
    $('dash-tier-badge').textContent = tier;
    document.body.dataset.tier = tier.toLowerCase();
  };
  const setActivated = (v: any) => {
    const f = fmtDate(v);
    if (f) $('dash-activated').textContent = f;
  };

  function populateUser(session: Json) {
    const user = session.customer || session.user || session;
    if (user.username) {
      const nameEl = $('dash-name');
      const m = String(user.username).match(/^(.*?)(\d+)$/);
      nameEl.textContent = '';
      if (m) {
        nameEl.append(m[1]);
        const em = document.createElement('em');
        em.textContent = m[2];
        nameEl.append(em);
      } else nameEl.textContent = user.username;
    }
    if (user.profile_picture) $<HTMLImageElement>('dash-pfp').src = user.profile_picture;
  }

  function populateProfile(profile: Json) {
    const mid = profile.memberId || profile.member_id || profile.id;
    if (mid) $('dash-member').textContent = `Member #${mid}`;
    const joined = profile.joinedAt || profile.joined_at || profile.created_at;
    if (joined) {
      $('dash-joined').textContent = `Joined ${new Date(joined).toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
    }
  }

  function populateLicense(subs: any) {
    setTier(tierFrom(subs));
    const sub = Array.isArray(subs) ? subs.find((s) => s && typeof s === 'object') : subs;
    if (!sub) return;

    if (sub.status) {
      const active = sub.status === 'active';
      const statusEl = $('dash-status');
      statusEl.textContent = '';
      const strong = document.createElement('strong');
      strong.textContent = String(sub.status).toUpperCase();
      statusEl.append(strong, active ? ' · The wraith rides with you.' : ` · Your license is ${sub.status}.`);
      document.body.dataset.license = active ? 'active' : 'inactive';
    }

    setActivated(sub.created_at);
    const expires = sub.expiresAt || sub.expires_at;
    $('dash-expires').textContent = expires ? new Date(expires).toLocaleDateString() : 'Never';
    $('stat-days').textContent = expires ? String(Math.ceil((new Date(expires).getTime() - Date.now()) / 86400000)) : '∞';
  }

  async function load() {
    try {
      const cached = JSON.parse(store.get(CUSTOMER_KEY) || 'null');
      if (cached) {
        setTier(tierFrom(cached.subscriptions));
        setActivated(cached.created_at);
      }
    } catch {
      store.remove(CUSTOMER_KEY);
    }

    try {
      const session = await api('GET', '/auth/session');
      populateUser(session);
      const user = session.customer || session.user || session;
      if (user) store.set(CUSTOMER_KEY, JSON.stringify(user));
      setTier(tierFrom(user.subscriptions));
      setActivated(user.created_at);
    } catch (err: any) {
      if (err._status === 401 || err._status === 403) {
        store.remove(TOKEN_KEY);
        store.remove(CUSTOMER_KEY);
        location.href = '/login';
      }
      return;
    }

    try { populateLicense(await api('GET', '/subscriptions')); } catch { /* non-fatal */ }
    try { populateProfile(await api('GET', '/profile')); } catch { /* non-fatal */ }
  }

  $<HTMLFormElement>('redeem-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $<HTMLInputElement>('redeem-input');
    const v = input.value.trim();
    if (!v) return toast('Enter a key');
    const btn = (e.target as HTMLFormElement).querySelector<HTMLButtonElement>('button[type="submit"]')!;
    setLoading(btn, true);
    try {
      await api('POST', '/auth/redeem-key', { key: v.toUpperCase() });
      toast('Key redeemed!');
      input.value = '';
      populateLicense(await api('GET', '/subscriptions'));
    } catch (err: any) {
      toast(err.message || 'Redemption failed');
    } finally {
      setLoading(btn, false);
    }
  });

  const logout = (e: Event) => {
    e.preventDefault();
    api('POST', '/auth/logout').catch(() => {});
    store.remove(TOKEN_KEY);
    store.remove(CUSTOMER_KEY);
    toast('Signing out…');
    setTimeout(() => (location.href = '/login'), 600);
  };
  document.querySelectorAll('[data-logout]').forEach((el) => el.addEventListener('click', logout));

  // profile picture
  const popup = $('pfp-popup');
  const pfpInput = $<HTMLInputElement>('pfp-url-input');
  const pfpImg = $<HTMLImageElement>('dash-pfp');
  const open = () => {
    pfpInput.value = pfpImg.getAttribute('src')?.startsWith('http') ? pfpImg.src : '';
    popup.hidden = false;
    pfpInput.focus();
  };
  const close = () => (popup.hidden = true);
  $('pfp-edit-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    popup.hidden ? open() : close();
  });
  $('pfp-cancel-btn').addEventListener('click', close);
  document.addEventListener('click', (e) => {
    if (!$('pfp-wrap').contains(e.target as Node)) close();
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  $('pfp-save-btn').addEventListener('click', async () => {
    const url = pfpInput.value.trim();
    if (!url) return toast('Enter an image URL');
    const btn = $<HTMLButtonElement>('pfp-save-btn');
    setLoading(btn, true);
    try {
      await api('PUT', '/profile', { profile_picture: url });
      pfpImg.src = url;
      close();
      toast('Profile picture updated');
    } catch (err: any) {
      toast(err.message || 'Could not update picture');
    } finally {
      setLoading(btn, false);
    }
  });

  load();
}
