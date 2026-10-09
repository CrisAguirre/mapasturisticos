import { useEffect, useState } from 'react';
import logoImg from '../assets/logo.png';
import { API_URL } from '../config/api.js';

const TOKEN_KEY = 'cfp_token';

async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export default function Entrar() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'ok' | 'error', text }
  const [session, setSession] = useState(null);

  // Si ya hay token guardado, valida la sesión contra el backend
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    api('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => setSession(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    const form = new FormData(e.currentTarget);
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          user: form.get('user'),
          password: form.get('password'),
        }),
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      window.dispatchEvent(new Event('cfp-auth'));
      setSession(data.user);
      setNotice({ type: 'ok', text: `Bienvenida, ${data.user.name}. Sesión iniciada.` });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event('cfp-auth'));
    setSession(null);
    setNotice(null);
  };

  return (
    <section className="page-section login-section">
      <div className="login-card">
        <img src={logoImg} alt="Logo Caminos de Fogón y Palabra" className="login-logo" />
        <h2>Entrar</h2>
        <p className="login-sub">Acceso a la plataforma</p>

        {session ? (
          <>
            <p className="login-notice" style={{ color: '#9ff0c0', borderColor: 'rgba(0,200,120,0.4)', background: 'rgba(0,200,120,0.08)' }}>
              Sesión activa como <strong>{session.name}</strong> ({session.email})
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <a className="btn primary login-btn" href="#/inicio">Ir al inicio</a>
              <button className="btn login-btn" type="button" onClick={onLogout}>Cerrar sesión</button>
            </div>
          </>
        ) : (
          <form onSubmit={onSubmit} className="login-form">
            <label className="field">
              Usuario
              <input type="text" name="user" placeholder="admin" required autoComplete="username" />
            </label>
            <label className="field">
              Contraseña
              <div className="pass-row">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass((s) => !s)}>
                  {showPass ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </label>
            <button className="btn primary login-btn" type="submit" disabled={loading}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        )}

        {notice && !session && (
          <p className="login-notice" style={notice.type === 'ok' ? { color: '#9ff0c0', borderColor: 'rgba(0,200,120,0.4)', background: 'rgba(0,200,120,0.08)' } : undefined}>
            {notice.text}
          </p>
        )}
      </div>
    </section>
  );
}
