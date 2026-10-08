import { useState } from 'react';
import logoImg from '../assets/logo.png';

// Maqueta visual del ingreso. Sin backend: el formulario no autentica,
// solo muestra un aviso. Aquí se conectará el backend después.
export default function Entrar() {
  const [showPass, setShowPass] = useState(false);
  const [notice, setNotice] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setNotice('Maqueta visual: el ingreso real se habilitará cuando se conecte el backend.');
  };

  return (
    <section className="page-section login-section">
      <div className="login-card">
        <img src={logoImg} alt="Logo Caminos de Fogón y Palabra" className="login-logo" />
        <h2>Entrar</h2>
        <p className="login-sub">
          Acceso a la plataforma <span className="mock-tag">Maqueta · sin backend aún</span>
        </p>
        <form onSubmit={onSubmit} className="login-form">
          <label className="field">
            Correo o usuario
            <input type="text" name="user" placeholder="tucorreo@ejemplo.com" required autoComplete="username" />
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
          <button className="btn primary login-btn" type="submit">Ingresar</button>
        </form>
        {notice && <p className="login-notice">{notice}</p>}
        <div className="login-links">
          <a href="#/entrar">¿Olvidaste tu contraseña?</a>
          <a href="#/entrar">Crear cuenta</a>
        </div>
      </div>
    </section>
  );
}
