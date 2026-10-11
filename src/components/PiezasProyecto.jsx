import { useState } from 'react';
import { Reveal, Spotlight } from './bits.jsx';
import './PiezasProyecto.css';

// ── Rejilla fija de propósitos: todo visible, cero auto-play ──
export function PropositosGrid({ items = [] }) {
  const [abierto, setAbierto] = useState(null);
  if (!items.length) return null;
  return (
    <div className="pg-grid" role="list" aria-label="Propósitos del proyecto">
      {items.map((s, i) => {
        const Icon = s.icon;
        const esAbierto = abierto === (s.key || i);
        return (
          <Reveal key={s.key || i} delay={(i % 3) * 90}>
            <Spotlight className={esAbierto ? ' abierto' : ''}>
              <article
                role="listitem"
                className="pg-card"
                style={{ '--g': s.gradient }}
                onClick={() => setAbierto(esAbierto ? null : s.key || i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setAbierto(esAbierto ? null : s.key || i);
                  }
                }}
                tabIndex={0}
                aria-expanded={esAbierto}
                aria-label={`${s.kicker}: ${s.title}`}
              >
                <span className="pg-bar" aria-hidden="true" />
                {Icon && <span className="pg-icon" aria-hidden="true"><Icon /></span>}
                <p className="pg-kicker">{s.kicker}</p>
                <h4>{s.title}</h4>
                <p className="pg-texto">{s.text}</p>
              </article>
            </Spotlight>
          </Reveal>
        );
      })}
    </div>
  );
}

// ── Duelo Fogón / Palabra: panel dividido conmutador, sin rotación ──
export function DueloFogon({ items = [] }) {
  const [activo, setActivo] = useState(items[0]?.key || 'fogon');
  if (items.length < 2) return null;
  const [a, b] = items;
  const IconA = a.icon;
  const IconB = b.icon;
  const esA = activo === a.key;

  const mitad = (s, Icon, esActiva) => (
    <button
      type="button"
      role="tab"
      aria-selected={esActiva}
      onClick={() => setActivo(s.key)}
      className={`duelo-mitad ${esActiva ? 'activa' : ''}`}
      style={{ '--g': s.gradient }}
      aria-label={`${s.kicker}: ${s.title}`}
    >
      <span className="duelo-fondo" aria-hidden="true" />
      {Icon && <span className="duelo-icon" aria-hidden="true"><Icon /></span>}
      <span className="duelo-kicker">{s.kicker}</span>
      <span className="duelo-titulo">{s.title}</span>
      <span className="duelo-texto">{s.text}</span>
    </button>
  );

  return (
    <div className="duelo-wrap" role="region" aria-roledescription="panel dividido" aria-label="El fogón y la palabra">
      <div className="duelo-toggle" role="tablist" aria-label="Elegir lado">
        <button
          type="button" role="tab" aria-selected={esA}
          className={esA ? 'activo' : ''} onClick={() => setActivo(a.key)}
        >
          🔥 El fogón
        </button>
        <button
          type="button" role="tab" aria-selected={!esA}
          className={!esA ? 'activo' : ''} onClick={() => setActivo(b.key)}
        >
          💬 La palabra
        </button>
      </div>
      <div className="duelo">
        {mitad(a, IconA, esA)}
        <span className="duelo-vs" aria-hidden="true">✦</span>
        {mitad(b, IconB, !esA)}
      </div>
    </div>
  );
}
