'use strict';

const API_BASE  = 'https://proudlyauthentication.com';
const PORTAL_KEY = 'pk_gri2butNfQ28AWQqNTD5xLtQKwer2MNv';
const TOKEN_KEY  = 'portalSessionToken';
const CUSTOMER_KEY = 'portalCustomer';

function getApiUrl(endpoint) {
  return `${API_BASE}/api/portal/v1/${PORTAL_KEY}${endpoint}`;
}

function getHeaders() {
  const h = { 'Content-Type': 'application/json' };
  const t = localStorage.getItem(TOKEN_KEY);
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
}

async function api(method, endpoint, body) {
  const res = await fetch(getApiUrl(endpoint), {
    method,
    headers: getHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign({}, data, { _status: res.status });
  return data;
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn._orig = btn._orig || btn.textContent;
  btn.textContent = loading ? '...' : btn._orig;
}

function getCachedCustomer() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || 'null');
  } catch {
    localStorage.removeItem(CUSTOMER_KEY);
    return null;
  }
}

function makeGoStep() {
  const panes = document.querySelectorAll('.step-pane');
  const dots  = document.querySelectorAll('.steps__dot');
  const lines = document.querySelectorAll('.steps__line');
  return function goStep(n) {
    panes.forEach(p => p.classList.toggle('active', +p.dataset.pane === n));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i + 1 === n);
      d.classList.toggle('done',   i + 1 < n);
    });
    lines.forEach((l, i) => l.classList.toggle('done', i + 1 < n));
  };
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────

function initLogin() {
  const form = document.getElementById('login-form');
  const btn  = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    setLoading(btn, true);
    try {
      const data = await api('POST', '/auth/login', { username, password });
      const token = data.session?.token;
      if (!token) { wraithToast('Login error: no token in response'); setLoading(btn, false); return; }
      localStorage.setItem(TOKEN_KEY, token);
      if (data.customer) localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data.customer));
      wraithToast('Signing in...');
      setTimeout(() => { window.location.href = '/dashboard'; }, 600);
    } catch (err) {
      wraithToast(err.message || 'Invalid credentials');
      setLoading(btn, false);
    }
  });
}

// ── REGISTER ──────────────────────────────────────────────────────────────────

function initRegister() {
  const goStep   = makeGoStep();
  const state    = { email: '' };
  const form     = document.getElementById('register-form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const verifyBtn = document.getElementById('verify-btn');

  // Step 1 — create account
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    setLoading(submitBtn, true);
    try {
      await api('POST', '/auth/register', { username, email, password });
      state.email = email;
      document.getElementById('email-target').textContent = email;
      wraithToast('Code sent to ' + email);
      goStep(2);
      document.querySelectorAll('[data-resend]').forEach(b => wraithResend(b, 30));
    } catch (err) {
      wraithToast(err.message || 'Registration failed');
    } finally {
      setLoading(submitBtn, false);
    }
  });

  // Step 2 — verify code
  verifyBtn.addEventListener('click', async () => {
    const code = [...document.querySelectorAll('#reg-codebox input')].map(i => i.value).join('');
    if (code.length < 6) { wraithToast('Enter all 6 digits'); return; }
    setLoading(verifyBtn, true);
    try {
      const data = await api('POST', '/auth/register/verify', { email: state.email, code });
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      wraithToast('Email verified');
      setTimeout(() => goStep(3), 600);
    } catch (err) {
      wraithToast(err.message || 'Invalid code');
      setLoading(verifyBtn, false);
    }
  });

  // Step 2 — resend
  document.querySelectorAll('[data-resend]').forEach(b => {
    b.addEventListener('click', async () => {
      try {
        await api('POST', '/auth/register/resend', { email: state.email });
        wraithToast('Code resent');
      } catch (err) {
        wraithToast(err.message || 'Could not resend');
      }
    });
  });

  document.getElementById('back-to-1').addEventListener('click', (e) => {
    e.preventDefault();
    goStep(1);
  });
}

// ── FORGOT ────────────────────────────────────────────────────────────────────

function initForgot() {
  const goStep    = makeGoStep();
  const state     = { email: '', code: '' };
  const forgotForm = document.getElementById('forgot-form');
  const forgotBtn  = forgotForm.querySelector('button[type="submit"]');
  const verifyBtn  = document.getElementById('forgot-verify');
  const resetForm  = document.getElementById('reset-form');
  const resetBtn   = resetForm.querySelector('button[type="submit"]');

  // Step 1 — request reset code
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    setLoading(forgotBtn, true);
    try {
      await api('POST', '/auth/password-reset/request', { email });
      state.email = email;
      document.getElementById('forgot-email-target').textContent = email;
      wraithToast('Reset code sent');
      goStep(2);
      document.querySelectorAll('[data-resend]').forEach(b => wraithResend(b, 30));
    } catch (err) {
      wraithToast(err.message || 'Could not send reset code');
    } finally {
      setLoading(forgotBtn, false);
    }
  });

  // Step 2 — collect & advance
  verifyBtn.addEventListener('click', () => {
    const code = [...document.querySelectorAll('#forgot-codebox input')].map(i => i.value).join('');
    if (code.length < 6) { wraithToast('Enter all 6 digits'); return; }
    state.code = code;
    wraithToast('Code accepted');
    setTimeout(() => goStep(3), 500);
  });

  // Step 3 — set new password
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('new-pw').value;
    const confirm     = document.getElementById('confirm-pw').value;
    if (newPassword !== confirm) { wraithToast('Passwords do not match'); return; }
    setLoading(resetBtn, true);
    try {
      const data = await api('POST', '/auth/password-reset/confirm', {
        email: state.email,
        code: state.code,
        newPassword
      });
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      wraithToast('Password updated. Signing in...');
      setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    } catch (err) {
      wraithToast(err.message || 'Reset failed');
      setLoading(resetBtn, false);
    }
  });
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

function initDashboard() {
  if (!localStorage.getItem(TOKEN_KEY)) {
    window.location.href = '/login';
    return;
  }

  const TIER_MAP = { '10': 'Elite', '11': 'Platinum' };
  const TIER_PRIORITY = ['11', '10'];

  function getSubscriptionId(sub) {
    if (sub == null) return '';
    if (typeof sub === 'string' || typeof sub === 'number') return String(sub);
    return String(sub.id || sub.subscription_id || sub.subscriptionId || sub.product_id || sub.productId || '');
  }

  function getTierFromSubscriptions(subs) {
    const list = Array.isArray(subs) ? subs : [subs];
    const ids = list.map(getSubscriptionId);
    const priorityId = TIER_PRIORITY.find(id => ids.includes(id));
    if (priorityId) return TIER_MAP[priorityId];
    const tiered = list.find(sub => sub && typeof sub === 'object' && sub.tier);
    return tiered?.tier || '';
  }

  function setTier(tier) {
    const tierEl = document.querySelector('.license-info dd');
    if (tierEl && tier) tierEl.textContent = tier;
  }

  async function loadDashboard() {
    let session;
    const cachedCustomer = getCachedCustomer();
    if (cachedCustomer) setTier(getTierFromSubscriptions(cachedCustomer.subscriptions));

    try {
      session = await api('GET', '/auth/session');
      populateUser(session);
      const user = session.customer || session.user || session;
      if (user) localStorage.setItem(CUSTOMER_KEY, JSON.stringify(user));
      setTier(getTierFromSubscriptions(user.subscriptions));
    } catch (err) {
      if (err._status === 401 || err._status === 403) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CUSTOMER_KEY);
        window.location.href = '/login';
      }
      return;
    }

    try { populateLicense(await api('GET', '/subscriptions')); } catch { /* non-fatal */ }
    try { populateProfile(await api('GET', '/profile')); }       catch { /* non-fatal */ }
  }

  function populateUser(session) {
    const user   = session.customer || session.user || session;
    const nameEl = document.querySelector('.dash-name');
    if (nameEl && user.username) {
      const m = user.username.match(/^(.*?)(\d+)$/);
      nameEl.innerHTML = m ? `${m[1]}<em>${m[2]}</em>` : user.username;
    }
    const pfp  = document.getElementById('dash-pfp');
    const wrap = document.getElementById('pfp-wrap');
    if (pfp && wrap) {
      if (user.profile_picture) pfp.src = user.profile_picture;
      wrap.style.display = 'block';
    }
  }

  function populateProfile(profile) {
    const metaEl = document.querySelector('.dash-meta');
    if (!metaEl) return;
    const strong = metaEl.querySelector('strong');
    const span   = metaEl.querySelector('span');
    const mid = profile.memberId || profile.member_id || profile.id;
    if (strong && mid) strong.textContent = `MEMBER #${mid}`;
    const joined = profile.joinedAt || profile.joined_at || profile.created_at;
    if (span && joined) {
      const d = new Date(joined);
      span.textContent = `JOINED · ${d.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}`;
    }
  }

  function populateLicense(subs) {
    const tier = getTierFromSubscriptions(subs);
    setTier(tier);

    const sub = Array.isArray(subs) ? subs.find(item => item && typeof item === 'object') : subs;
    if (!sub) return;

    const statusEl = document.querySelector('.license-status__text');
    if (statusEl && sub.status) {
      const active = sub.status === 'active';
      statusEl.innerHTML = `<strong>${sub.status.toUpperCase()}</strong> · ${
        active ? 'You own Wraith. The wraith rides with you.' : 'Your license is ' + sub.status + '.'
      }`;
    }

    const dds = document.querySelectorAll('.license-info dd');
    const activatedAt = sub.activatedAt || sub.activated_at;
    if (dds[1] && activatedAt) {
      dds[1].textContent = new Date(activatedAt).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    }
    const expiresAtVal = sub.expiresAt || sub.expires_at;
    if (dds[2]) dds[2].textContent = expiresAtVal ? new Date(expiresAtVal).toLocaleDateString() : 'Never';

    const expiresAt = sub.expiresAt || sub.expires_at;
    const daysEl = document.getElementById('stat-days');
    if (daysEl) {
      daysEl.textContent = expiresAt
        ? Math.ceil((new Date(expiresAt) - Date.now()) / 86400000)
        : '\u221e';
    }
  }

  document.getElementById('redeem-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('redeem-input');
    const v     = input.value.trim();
    if (!v) { wraithToast('Enter a key'); return; }
    const btn = e.target.querySelector('button[type="submit"]');
    setLoading(btn, true);
    try {
      await api('POST', '/auth/redeem-key', { key: v.toUpperCase() });
      wraithToast('Key redeemed!');
      input.value = '';
      populateLicense(await api('GET', '/subscriptions'));
    } catch (err) {
      wraithToast(err.message || 'Redemption failed');
    } finally {
      setLoading(btn, false);
    }
  });

  function logout() {
    api('POST', '/auth/logout').catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_KEY);
    wraithToast('Signing out...');
    setTimeout(() => { window.location.href = '/login'; }, 600);
  }
  document.getElementById('logout-btn').addEventListener('click', (e) => { e.preventDefault(); logout(); });
  document.getElementById('logout-top').addEventListener('click', (e) => { e.preventDefault(); logout(); });

  // ── Profile picture edit ──────────────────────────────────────────────────
  const pfpPopup  = document.getElementById('pfp-popup');
  const pfpInput  = document.getElementById('pfp-url-input');
  const pfpImg    = document.getElementById('dash-pfp');

  function openPfpPopup() {
    pfpInput.value = pfpImg.src !== location.href ? pfpImg.src : '';
    pfpPopup.style.display = 'block';
    pfpInput.focus();
  }
  function closePfpPopup() { pfpPopup.style.display = 'none'; }

  document.getElementById('dash-pfp').addEventListener('click', openPfpPopup);
  document.getElementById('pfp-edit-btn').addEventListener('click', openPfpPopup);
  document.getElementById('pfp-cancel-btn').addEventListener('click', closePfpPopup);

  document.getElementById('pfp-save-btn').addEventListener('click', async () => {
    const url = pfpInput.value.trim();
    if (!url) { wraithToast('Enter an image URL'); return; }
    const btn = document.getElementById('pfp-save-btn');
    setLoading(btn, true);
    try {
      await api('PUT', '/profile', { profile_picture: url });
      pfpImg.src = url;
      closePfpPopup();
      wraithToast('Profile picture updated');
    } catch (err) {
      wraithToast(err.message || 'Could not update picture');
    } finally {
      setLoading(btn, false);
    }
  });

  document.addEventListener('click', (e) => {
    if (!document.getElementById('pfp-wrap')?.contains(e.target)) closePfpPopup();
  });

  loadDashboard();
}

// ── Router ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
  if (page === 'login')     initLogin();
  if (page === 'register')  initRegister();
  if (page === 'forgot')    initForgot();
  if (page === 'dashboard') initDashboard();
});
