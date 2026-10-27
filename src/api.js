const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const AUTH_KEY = 'ranking-de-filmes:auth';

/** Chamado quando a API responde 401 numa rota protegida (sessão expirada). */
let onUnauthorized = null;
export function setOnUnauthorized(fn) { onUnauthorized = fn; }

export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const auth = JSON.parse(raw);
    return auth?.token && auth?.perfil ? auth : null;
  } catch { return null; }
}

function setAuth(auth) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); } catch { /* sem armazenamento */ }
}

function clearAuth() {
  try { localStorage.removeItem(AUTH_KEY); } catch { /* sem armazenamento */ }
}

export class ApiError extends Error {
  constructor(status, message, campos) {
    super(message);
    this.status = status;
    this.campos = campos;
  }
}

async function request(method, path, body, { auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getAuth()?.token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar. Tente de novo.');
  }

  if (auth && res.status === 401) {
    clearAuth();
    if (onUnauthorized) onUnauthorized();
    throw new ApiError(401, 'Sessão expirada. Entre de novo.');
  }

  if (res.status === 204) return null;

  let data = null;
  try { data = await res.json(); } catch { /* resposta sem corpo JSON */ }

  if (!res.ok) {
    throw new ApiError(res.status, data?.erro || 'Não foi possível conectar. Tente de novo.', data?.campos);
  }
  return data;
}

export async function login(perfil, senha) {
  const data = await request('POST', '/api/login', { perfil, senha }, { auth: false });
  const auth = { token: data.token, perfil: data.perfil };
  setAuth(auth);
  return auth;
}

export function logout() { clearAuth(); }

export async function listMovies(perfil) {
  const data = await request('GET', `/api/filmes?perfil=${encodeURIComponent(perfil)}`);
  return data?.filmes ?? [];
}

export async function getMovie(id) {
  const data = await request('GET', `/api/filmes/${encodeURIComponent(id)}`);
  return data?.filme;
}

export async function createMovie({ name, date, comment, notes }) {
  const data = await request('POST', '/api/filmes', { name, date, comment, notes });
  return data?.filme;
}

export async function updateMovie(id, { name, date, comment, notes }) {
  const data = await request('PUT', `/api/filmes/${encodeURIComponent(id)}`, { name, date, comment, notes });
  return data?.filme;
}

export async function deleteMovie(id) {
  await request('DELETE', `/api/filmes/${encodeURIComponent(id)}`);
}
