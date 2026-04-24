// StratosEvent — Shared Utilities
const API = 'http://localhost:5000/api';

// ── AUTH HELPERS ──
function getToken() { return localStorage.getItem('stratoToken'); }
function getUser()  { return JSON.parse(localStorage.getItem('stratoUser') || 'null'); }

function setAuth(data) {
  localStorage.setItem('stratoToken', data.token);
  localStorage.setItem('stratoUser', JSON.stringify(data));
}

function clearAuth() {
  localStorage.removeItem('stratoToken');
  localStorage.removeItem('stratoUser');
}

function logout() {
  clearAuth();
  showToast('Logged out successfully', 'success');
  setTimeout(() => window.location.href = '/index.html', 700);
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` };
}

// ── API FETCH HELPER ──
async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API}${endpoint}`, {
    headers: authHeaders(),
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── NAVBAR STATE ──
function initNav() {
  const user = getUser();
  const login    = document.getElementById('nav-login');
  const register = document.getElementById('nav-register');
  const logout   = document.getElementById('nav-logout');
  const admin    = document.getElementById('nav-admin');
  const myregs   = document.getElementById('nav-myregs');
  const navUser  = document.getElementById('nav-user');

  if (user) {
    login    && (login.style.display    = 'none');
    register && (register.style.display = 'none');
    logout   && (logout.style.display   = 'block');
    myregs   && (myregs.style.display   = 'block');
    navUser  && (navUser.style.display  = 'block');
    navUser  && (navUser.textContent    = `Hi, ${user.name.split(' ')[0]}`);
    if (user.role === 'admin') {
      admin && (admin.style.display = 'block');
    }
  }
}

// ── TOAST NOTIFICATIONS ──
function showToast(msg, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ── FORMATTERS ──
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(d) {
  return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(n) {
  if (n === 0) return 'Free';
  return '₹' + Number(n).toLocaleString('en-IN');
}

function catEmoji(cat) {
  const map = { Conference: '🎤', Workshop: '🛠️', Webinar: '💻', Other: '🎯' };
  return map[cat] || '📅';
}

function catClass(cat) {
  const map = { Conference: 'cat-conference', Workshop: 'cat-workshop', Webinar: 'cat-webinar', Other: 'cat-other' };
  return map[cat] || 'cat-other';
}

function statusBadge(status) {
  const map = {
    approved:  '<span class="badge badge-success">Approved</span>',
    pending:   '<span class="badge badge-warning">Pending</span>',
    rejected:  '<span class="badge badge-danger">Rejected</span>',
    cancelled: '<span class="badge badge-muted">Cancelled</span>',
    published: '<span class="badge badge-success">Published</span>',
    draft:     '<span class="badge badge-muted">Draft</span>',
  };
  return map[status] || `<span class="badge badge-muted">${status}</span>`;
}

// ── MODAL HELPERS ──
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ── REQUIRE AUTH ──
function requireAuth(redirectTo = '/pages/login.html') {
  if (!getToken()) {
    showToast('Please login to continue', 'warning');
    setTimeout(() => window.location.href = redirectTo, 800);
    return false;
  }
  return true;
}

function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    showToast('Admin access required', 'error');
    setTimeout(() => window.location.href = '/index.html', 800);
    return false;
  }
  return true;
}

// Init nav on every page
window.addEventListener('DOMContentLoaded', initNav);
