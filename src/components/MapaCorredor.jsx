import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GOOGLE_MAPS_URL, RECORRIDO, mapsUrlPunto } from '../config/recorrido.js';
import './MapaCorredor.css';

function numIcon(n, activo) {
  return L.divIcon({
    className: 'mc-leaf',
    html: `<span class="mc-leaf-num${activo ? ' activo' : ''}">${n}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

// Nubes de adorno: realzan el mapa con deriva suave, tenues y sin clics.
// Banda alta para no tapar los marcadores. Nada meteorológico.
function crearNubes() {
  return [0, 1, 2].map((i) => ({
    id: i + Math.random(),
    top: `${2 + Math.random() * 13}%`,
    left: `${3 + Math.random() * 62}%`,
    width: `${240 + Math.random() * 160}px`,
    height: `${75 + Math.random() * 55}px`,
    opacity: 0.2 + Math.random() * 0.1,
    duration: `${55 + Math.random() * 25}s`,
    delay: `${-Math.random() * 20}s`,
  }));
}

export default function MapaCorredor() {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const marksRef = useRef([]);
  const [puntoId, setPuntoId] = useState(1);
  const [nubes, setNubes] = useState(crearNubes);
  const [nubesOn, setNubesOn] = useState(true);
  const punto = RECORRIDO.find((p) => p.id === puntoId) ?? RECORRIDO[0];

  // Mapa real una sola vez: OSM + ruta + 6 marcadores numerados
  useEffect(() => {
    if (mapRef.current || !mapEl.current) return;
    const map = L.map(mapEl.current, { scrollWheelZoom: false }).setView([1.2098, -77.2103], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const latlngs = RECORRIDO.map((p) => [p.lat, p.lng]);
    L.polyline([...latlngs, latlngs[0]], {
      color: '#b45309',
      weight: 4,
      dashArray: '8 6',
    }).addTo(map);

    marksRef.current = RECORRIDO.map((p) => {
      const m = L.marker([p.lat, p.lng], { icon: numIcon(p.id, p.id === 1), title: p.titulo }).addTo(map);
      m.bindTooltip(`${p.id} · ${p.titulo}`);
      m.on('click', () => setPuntoId(p.id));
      return m;
    });

    map.fitBounds(L.latLngBounds(latlngs).pad(0.18));
    // No atrapar el scroll de la página: el zoom con rueda solo al tocar el mapa
    map.on('focus', () => map.scrollWheelZoom.enable());
    map.on('blur', () => map.scrollWheelZoom.disable());
    map.on('click', () => map.scrollWheelZoom.enable());
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      marksRef.current = [];
    };
  }, []);

  // Resaltar el marcador activo al cambiar de ficha
  useEffect(() => {
    marksRef.current.forEach((m, k) => {
      m.setIcon(numIcon(RECORRIDO[k].id, RECORRIDO[k].id === puntoId));
    });
  }, [puntoId]);

  // Nubes: deriva aleatoria, quietas si el usuario prefiere sin movimiento
  useEffect(() => {
    if (!nubesOn) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setNubes(crearNubes()), 9000);
    return () => clearInterval(t);
  }, [nubesOn]);

  const verPunto = () => {
    const m = marksRef.current[puntoId - 1];
    if (m && mapRef.current) mapRef.current.flyTo(m.getLatLng(), 16, { duration: 0.8 });
  };

  return (
    <div className="mc-clon">
      <div className="mc-head">
        <span className="mc-eyebrow">Mapa cultural · Cabrera — San Pedro de la Laguna</span>
        <h3>Circuito a pie · 6 paradas</h3>
        <p>
          Mapa real del corredor oriental. Toca un número para ver su ficha, o abre el
          recorrido en Google Maps para caminarlo.
        </p>
        <div className="mc-acciones">
          <a className="mc-btn primario" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            Abrir recorrido en Google Maps
          </a>
          <button
            type="button"
            className="mc-btn chico"
            onClick={() => setNubesOn((v) => !v)}
            aria-pressed={nubesOn}
          >
            {nubesOn ? '☁️ Nubes: sí' : '☁️ Nubes: no'}
          </button>
          <span className="mc-meta">6 paradas · a pie · ~2 km</span>
        </div>
      </div>

      <div className="mc-main">
        <div className="mc-visual">
          <div ref={mapEl} className="mc-map" role="application" aria-label="Mapa del recorrido con 6 paradas" />
          {nubesOn && (
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
          )}
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
              <button type="button" className="mc-btn chico" onClick={verPunto}>
                Centrar en el mapa
              </button>
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
                  onClick={() => {
                    setPuntoId(p.id);
                    const m = marksRef.current[p.id - 1];
                    if (m && mapRef.current) mapRef.current.flyTo(m.getLatLng(), 16, { duration: 0.8 });
                  }}
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
