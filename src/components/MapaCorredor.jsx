import { useEffect, useState } from 'react';
import { GOOGLE_MAPS_URL, RECORRIDO, mapsUrlPunto } from '../config/recorrido.js';
import fondoZona from '../assets/media/2proyecto-web/foto-1.jpg';
import './MapaCorredor.css';

function crearNubes() {
  // Banda alta (4-18%) para no tapar la ruta ni los puntos.
  // Opacidad baja + blur + sin interacción.
  return [0, 1, 2].map((i) => ({
    id: i + Math.random(),
    top: `${4 + Math.random() * 14}%`,
    left: `${5 + Math.random() * 70}%`,
    width: `${220 + Math.random() * 160}px`,
    height: `${70 + Math.random() * 60}px`,
    opacity: 0.16 + Math.random() * 0.1,
    duration: `${50 + Math.random() * 30}s`,
    delay: `${-Math.random() * 20}s`,
  }));
}

export default function MapaCorredor() {
  const [nubes, setNubes] = useState(crearNubes);
  const [puntoId, setPuntoId] = useState(1);
  const punto = RECORRIDO.find((p) => p.id === puntoId) ?? RECORRIDO[0];

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setNubes(crearNubes()), 8000);
    return () => clearInterval(t);
  }, []);

  const d = `M ${RECORRIDO.map((p) => `${p.x},${p.y}`).join(' L ')} Z`;

  return (
    <div className="mc-clon">
      <div className="mc-head">
        <span className="mc-eyebrow">Mapa cultural · Cabrera — San Pedro de la Laguna</span>
        <h3>Circuito a pie · 6 paradas</h3>
        <p>
          Esquema cultural sobre foto real de la zona. No es plano a escala exacta:
          para caminar usa el recorrido de Google Maps.
        </p>
        <div className="mc-acciones">
          <a className="mc-btn primario" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            Abrir recorrido en Google Maps
          </a>
          <span className="mc-meta">6 paradas · a pie · ~2 km</span>
        </div>
      </div>

      <div className="mc-main">
        <div className="mc-visual">
          <img src={fondoZona} alt="Paisaje del corredor oriental Cabrera – Laguna" className="mc-fondo" />
          <div className="mc-nubes" aria-hidden="true">
            {nubes.map((n) => (
              <div
                key={n.id}
                className="mc-nube"
                style={{
                  top: n.top,
                  left: n.left,
                  width: n.width,
                  height: n.height,
                  opacity: n.opacity,
                  animationDuration: n.duration,
                  animationDelay: n.delay,
                }}
              />
            ))}
          </div>
          <div className="mc-overlay" aria-hidden="true" />

          <svg className="mc-ruta" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={d} className="mc-ruta-linea" vectorEffect="non-scaling-stroke" />
          </svg>

          {RECORRIDO.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`mc-parada${p.id === puntoId ? ' activo' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => setPuntoId(p.id)}
              aria-pressed={p.id === puntoId}
              aria-label={`${p.titulo}. ${p.subtitulo}`}
            >
              <span className="mc-parada-num">{p.id}</span>
            </button>
          ))}

          <div className="mc-norte" aria-hidden="true">N ↑</div>
          <div className="mc-chip">{punto.titulo}</div>
        </div>

        <aside className="mc-panel" aria-label="Fichas de paradas">
          <div className="mc-ficha activa">
            <span className="mc-kicker">Parada {punto.id} de 6</span>
            <h4>{punto.titulo}</h4>
            <p className="mc-sub">{punto.subtitulo}</p>
            {punto.foto ? (
              <img src={punto.foto} alt={punto.titulo} className="mc-foto" />
            ) : (
              <div className="mc-foto-ph">Foto pendiente — llegará con la ficha</div>
            )}
            <p className="mc-desc">{punto.descripcion}</p>
            <p className="mc-coords">{punto.lat}, {punto.lng}</p>
            <div className="mc-ficha-btns">
              <a className="mc-btn chico" href={mapsUrlPunto(punto)} target="_blank" rel="noopener noreferrer">
                Ver punto en Maps
              </a>
              <a className="mc-btn chico fantasma" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                Circuito completo
              </a>
            </div>
          </div>

          <ul className="mc-lista">
            {RECORRIDO.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`mc-item${p.id === puntoId ? ' activo' : ''}`}
                  onClick={() => setPuntoId(p.id)}
                >
                  <span className="mc-item-num">{p.id}</span>
                  <span className="mc-item-txt">
                    <strong>{p.titulo}</strong>
                    <small>{p.subtitulo}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
