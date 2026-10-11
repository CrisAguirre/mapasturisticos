import { useEffect, useState } from 'react';
import { API_URL, fotoUrl } from '../config/api.js';
import './Cuenta.css';

const TOKEN_KEY = 'cfp_token';

const ROLES = {
  admin: { label: 'Administración', desc: 'Gestiona los contenidos y las cuentas de la plataforma.' },
  mujer: { label: 'Mujer guía', desc: 'Protagonista del territorio: sus fichas, saberes y experiencias.' },
  visitante: { label: 'Visitante', desc: 'Explora el mapa, las historias y reserva experiencias.' },
};

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` };
}

export default function Cuenta({ session, onLogout }) {
  const [perfil, setPerfil] = useState(session);
  const [nombre, setNombre] = useState(session?.name ?? '');
  const [archivo, setArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [ver, setVer] = useState({ actual: false, nueva: false });
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [notice, setNotice] = useState(null);

  const esAdmin = perfil?.id === 'admin' || perfil?.role === 'admin';
  const rol = ROLES[perfil?.role] ?? ROLES.visitante;

  // Perfil fresco del servidor (trae createdAt y confirma la sesión)
  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { headers: authHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('sesión'))))
      .then((d) => {
        setPerfil(d.user);
        setNombre(d.user.name);
      })
      .catch(() => onLogout())
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGuardar = async (e) => {
    e.preventDefault();
    setNotice(null);
    if (nueva && nueva !== confirmar) {
      setNotice({ type: 'error', text: 'La nueva contraseña y su confirmación no coinciden.' });
      return;
    }
    if (nueva && !actual) {
      setNotice({ type: 'error', text: 'Escribe tu contraseña actual para cambiarla.' });
      return;
    }
    setLoading(true);
    try {
      const body = {};
      if (nombre.trim() !== perfil.name) body.name = nombre.trim();
      if (nueva) {
        body.currentPassword = actual;
        body.newPassword = nueva;
      }
      if (!Object.keys(body).length) {
        setNotice({ type: 'ok', text: 'No hay cambios por guardar.' });
        return;
      }
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setPerfil(data.user);
      setNombre(data.user.name);
      setActual('');
      setNueva('');
      setConfirmar('');
      window.dispatchEvent(new Event('cfp-auth'));
      setNotice({ type: 'ok', text: 'Cuenta actualizada.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const onElegirFoto = (e) => {
    const f = e.target.files?.[0];
    setNotice(null);
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setNotice({ type: 'error', text: 'Solo JPG, PNG o WebP.' });
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setNotice({ type: 'error', text: 'La foto debe pesar máximo 2 MB.' });
      return;
    }
    if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
    setArchivo(f);
    setVistaPrevia(URL.createObjectURL(f));
  };

  const onSubirFoto = async () => {
    if (!archivo) return;
    setLoading(true);
    setNotice(null);
    try {
      const form = new FormData();
      form.append('foto', archivo);
      const res = await fetch(`${API_URL}/api/auth/foto`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setPerfil(data.user);
      setArchivo(null);
      if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
      setVistaPrevia(null);
      window.dispatchEvent(new Event('cfp-auth'));
      setNotice({ type: 'ok', text: 'Foto actualizada.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const onQuitarFoto = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ foto: '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setPerfil(data.user);
      window.dispatchEvent(new Event('cfp-auth'));
      setNotice({ type: 'ok', text: 'Foto eliminada.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (cargando) {
    return (
      <section className="page-section cuenta-section">
        <p className="cuenta-cargando">Cargando tu cuenta…</p>
      </section>
    );
  }

  const inicial = (perfil.name || '?').trim().charAt(0).toUpperCase();
  const miembroDesde = perfil.createdAt
    ? new Date(perfil.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })
    : null;

  return (
    <section className="page-section cuenta-section">
      <p className="eyebrow cuenta-eyebrow">Mi cuenta</p>

      <header className="cuenta-head">
        {fotoUrl(perfil.foto) ? (
          <img src={fotoUrl(perfil.foto)} alt={`Foto de ${perfil.name}`} className="cuenta-avatar-img" />
        ) : (
          <span className="cuenta-avatar" aria-hidden="true">{inicial}</span>
        )}
        <div>
          <h2>{perfil.name}</h2>
          <p className="cuenta-email">{perfil.email}</p>
        </div>
        <span className={`cuenta-rol rol-${perfil.role}`}>{rol.label}</span>
      </header>
      <p className="cuenta-rol-desc">{rol.desc}{miembroDesde ? ` · Miembro desde ${miembroDesde}.` : ''}</p>

      {esAdmin && (
        <p className="cuenta-nota-admin">
          La cuenta de administración se configura en el servidor y no se edita aquí.
        </p>
      )}

      <form onSubmit={onGuardar} className="cuenta-grid">
        <div className="cuenta-card">
          <h3>Perfil</h3>
          <label className="field">
            Nombre
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              minLength={2}
              maxLength={80}
              required
              disabled={esAdmin}
              autoComplete="name"
            />
          </label>
          <label className="field">
            Foto de perfil <small className="solo-lectura">(JPG, PNG o WebP, máx 2 MB)</small>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onElegirFoto}
              disabled={esAdmin || loading}
            />
          </label>
          {(vistaPrevia || fotoUrl(perfil.foto)) && (
            <img
              src={vistaPrevia ?? fotoUrl(perfil.foto)}
              alt="Foto de perfil"
              className="cuenta-foto-prev"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
          {!fotoUrl(perfil.foto) && !vistaPrevia && (
            <div className="cuenta-foto-ph">Sin foto — se muestra tu inicial</div>
          )}
          <div className="cuenta-foto-btns">
            <button type="button" className="btn" onClick={onSubirFoto} disabled={esAdmin || loading || !archivo}>
              {loading ? 'Subiendo…' : 'Subir foto'}
            </button>
            {fotoUrl(perfil.foto) && (
              <button type="button" className="btn cuenta-quitar" onClick={onQuitarFoto} disabled={esAdmin || loading}>
                Quitar
              </button>
            )}
          </div>
          <label className="field">
            Correo <small className="solo-lectura">(solo lectura: es tu usuario de ingreso)</small>
            <input type="email" value={perfil.email} readOnly disabled aria-readonly="true" />
          </label>
          <label className="field">
            Rol <small className="solo-lectura">(solo lectura: lo asigna la administración)</small>
            <input type="text" value={rol.label} readOnly disabled aria-readonly="true" />
          </label>
        </div>

        <div className="cuenta-card">
          <h3>Contraseña</h3>
          <label className="field">
            Actual
            <div className="pass-row">
              <input
                type={ver.actual ? 'text' : 'password'}
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                disabled={esAdmin}
                autoComplete="current-password"
                placeholder="Solo si vas a cambiarla"
              />
              <button type="button" className="pass-toggle" onClick={() => setVer((v) => ({ ...v, actual: !v.actual }))}>
                {ver.actual ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </label>
          <label className="field">
            Nueva <small className="solo-lectura">(mínimo 6 caracteres)</small>
            <div className="pass-row">
              <input
                type={ver.nueva ? 'text' : 'password'}
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                minLength={6}
                disabled={esAdmin}
                autoComplete="new-password"
                placeholder="Déjala vacía para no cambiarla"
              />
              <button type="button" className="pass-toggle" onClick={() => setVer((v) => ({ ...v, nueva: !v.nueva }))}>
                {ver.nueva ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </label>
          <label className="field">
            Confirmar nueva
            <input
              type={ver.nueva ? 'text' : 'password'}
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              disabled={esAdmin}
              autoComplete="new-password"
            />
          </label>
        </div>

        <div className="cuenta-acciones">
          <button className="btn primary" type="submit" disabled={loading || esAdmin}>
            {loading ? 'Guardando…' : 'Guardar cambios'}
          </button>
          <a className="btn" href="#/inicio">Ir al inicio</a>
          <button className="btn cuenta-salir" type="button" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </form>

      {notice && (
        <p className={`cuenta-notice ${notice.type}`}>{notice.text}</p>
      )}
    </section>
  );
}
