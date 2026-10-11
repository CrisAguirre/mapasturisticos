import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GOOGLE_MAPS_URL, RECORRIDO, mapsUrlPunto } from '../config/recorrido.js';
import RUTA from '../config/ruta.json';
import './MapaCorredor.css';

const CAPAS = {
  claro: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    ruta: '#b45309',
  },
  satelital: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
    ruta: '#ffd479',
  },
};

// Geometría del trazado para las flechas: distancia acumulada por tramo.
// RUTA.coords viene como [lat, lng] (388 pts por caminos, del punto 1 al 6).
const TRAZO = (() => {
  const pts = RUTA.coords?.length ? RUTA.coords : RECORRIDO.map((p) => [p.lat, p.lng]);
  const acum = [0];
  for (let k = 1; k < pts.length; k++) {
    const [la1, ln1] = pts[k - 1];
    const [la2, ln2] = pts[k];
    const x = ((ln2 - ln1) * Math.cos(((la1 + la2) / 2) * Math.PI / 180) * 111320);
    const y = (la2 - la1) * 110540;
    acum.push(acum[k - 1] + Math.hypot(x, y));
  }
  return { pts, acum, total: acum[acum.length - 1] };
})();

// Posición + rumbo (grados pantalla, 0° = este) a una distancia d del inicio.
function puntoEn(d) {
  const { pts, acum, total } = TRAZO;
  const dd = Math.min(Math.max(d, 0), total - 0.001);
  let k = 1;
  while (k < acum.length - 1 && acum[k] < dd) k++;
  const [la1, ln1] = pts[k - 1];
  const [la2, ln2] = pts[k];
  const t = (dd - acum[k - 1]) / Math.max(acum[k] - acum[k - 1], 0.001);
  const dx = (ln2 - ln1) * Math.cos((la1 * Math.PI) / 180);
  const dy = -(la2 - la1);
  return { lat: la1 + (la2 - la1) * t, lng: ln1 + (ln2 - ln1) * t, ang: (Math.atan2(dy, dx) * 180) / Math.PI };
}

function numIcon(n, activo) {
  return L.divIcon({
    className: 'mc-leaf',
    html: `<span class="mc-leaf-num${activo ? ' activo' : ''}">${n}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

function flechaIcon() {
  return L.divIcon({
    className: 'mc-flecha-wrap',
    html: '<span class="mc-flecha">➤</span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

// Nubes de adorno: realzan el mapa con deriva suave, tenues y sin clics.
// Banda alta para no tapar los marcadores. Nada meteorológico.
function crearNubes() {
  return [0, 1, 2].map((i) => ({
    id: i + Math.random(),
    top: `${2 + Math.random() * 13}%`,
    left: `${3 + Math.random() * 60}%`,
    width: `${280 + Math.random() * 160}px`,
    height: `${90 + Math.random() * 60}px`,
    opacity: 0.38 + Math.random() * 0.14,
    duration: `${55 + Math.random() * 25}s`,
    delay: `${-Math.random() * 20}s`,
  }));
}

export default function MapaCorredor() {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const marksRef = useRef([]);
  const capaRef = useRef(null);
  const lineaRef = useRef(null);
  const flechasRef = useRef([]);
  const rafRef = useRef(0);
  const [puntoId, setPuntoId] = useState(1);
  const [tema, setTema] = useState('claro');
  const [mapaListo, setMapaListo] = useState(false);
  const [zoom, setZoom] = useState(14);
  // Viento actual de la zona (Open-Meteo, gratis sin clave). x/y = vector
  // pantalla hacia donde SE MUEVEN las nubes. Fallback: alisios del este.
  const [viento, setViento] = useState({ dir: 'E', x: 1, y: 0, kmh: null });
  const [nubes, setNubes] = useState(crearNubes);
  const [nubesOn, setNubesOn] = useState(true);
  const punto = RECORRIDO.find((p) => p.id === puntoId) ?? RECORRIDO[0];

  // Mapa real una sola vez: capa base + ruta + 6 marcadores + 3 flechas
  useEffect(() => {
    if (mapRef.current || !mapEl.current) return;
    const map = L.map(mapEl.current, { scrollWheelZoom: false }).setView([1.2098, -77.2103], 14);
    capaRef.current = L.tileLayer(CAPAS.claro.url, {
      maxZoom: CAPAS.claro.maxZoom,
      attribution: CAPAS.claro.attribution,
    }).addTo(map);

    lineaRef.current = L.polyline(TRAZO.pts, {
      color: CAPAS.claro.ruta,
      weight: 4,
      dashArray: '8 6',
      className: 'mc-flujo',
    }).addTo(map);

    marksRef.current = RECORRIDO.map((p) => {
      const m = L.marker([p.lat, p.lng], { icon: numIcon(p.id, p.id === 1), title: p.titulo }).addTo(map);
      m.bindTooltip(`${p.id} · ${p.titulo}`);
      m.on('click', () => setPuntoId(p.id));
      return m;
    });

    // 3 flechas del flujo de la caminata (1 → 6)
    flechasRef.current = [0.05, 0.38, 0.71].map((f) => {
      const pos = puntoEn(f * TRAZO.total);
      const m = L.marker([pos.lat, pos.lng], {
        icon: flechaIcon(),
        interactive: false,
        keyboard: false,
      }).addTo(map);
      const el = m.getElement()?.querySelector('.mc-flecha');
      if (el) el.style.transform = `rotate(${pos.ang}deg)`;
      return { m, frac: f };
    });

    map.fitBounds(L.latLngBounds(TRAZO.pts).pad(0.18));
    // Las nubes se adecúan al zoom: se escala su tamaño con el nivel del mapa
    setZoom(map.getZoom());
    map.on('zoomend', () => setZoom(map.getZoom()));
    // No atrapar el scroll de la página: el zoom con rueda solo al tocar el mapa
    map.on('focus', () => map.scrollWheelZoom.enable());
    map.on('blur', () => map.scrollWheelZoom.disable());
    map.on('click', () => map.scrollWheelZoom.enable());
    mapRef.current = map;
    setMapaListo(true);
    return () => {
      cancelAnimationFrame(rafRef.current);
      map.remove();
      mapRef.current = null;
      marksRef.current = [];
      flechasRef.current = [];
      capaRef.current = null;
      lineaRef.current = null;
    };
  }, []);

  // Tema claro ↔ oscuro: cambia baldosas y color de la ruta
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !capaRef.current) return;
    map.removeLayer(capaRef.current);
    capaRef.current = L.tileLayer(CAPAS[tema].url, {
      maxZoom: CAPAS[tema].maxZoom,
      attribution: CAPAS[tema].attribution,
    }).addTo(map);
    capaRef.current.bringToBack();
    lineaRef.current?.setStyle({ color: CAPAS[tema].ruta });
  }, [tema]);

  // Flechas en marcha: avanzan 1 → 6 a velocidad constante y reinician.
  // Con reduced-motion quedan fijas (las del init ya están orientadas).
  useEffect(() => {
    if (!mapaListo) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const vel = TRAZO.total / 90; // recorrido completo en ~90 s
    let t0 = performance.now();
    const paso = (ahora) => {
      const dt = Math.min((ahora - t0) / 1000, 1);
      t0 = ahora;
      flechasRef.current.forEach((f) => {
        f.frac += (vel * dt) / TRAZO.total;
        if (f.frac > 0.995) f.frac = 0.005;
        const pos = puntoEn(f.frac * TRAZO.total);
        f.m.setLatLng([pos.lat, pos.lng]);
        const el = f.m.getElement()?.querySelector('.mc-flecha');
        if (el) el.style.transform = `rotate(${pos.ang}deg)`;
      });
      rafRef.current = requestAnimationFrame(paso);
    };
    rafRef.current = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mapaListo]);

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

  // Viento actual sobre Cabrera (Open-Meteo). Si falla la red, queda el este.
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=1.2098&longitude=-77.2103&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh&timezone=auto')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('viento'))))
      .then((d) => {
        const g = d?.current?.wind_direction_10m;
        const kmh = d?.current?.wind_speed_10m;
        if (g == null) return;
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const hacia = ((g + 180) % 360) * (Math.PI / 180); // hacia dónde va
        setViento({
          dir: dirs[Math.round(g / 45) % 8],
          x: Math.sin(hacia),
          y: -Math.cos(hacia),
          kmh: kmh ?? null,
        });
      })
      .catch(() => {});
  }, []);

  // Las nubes se adecúan al zoom: crecen al acercar, se atenúan al alejar
  const zc = Math.min(1.6, Math.max(0.6, 1 + (zoom - 14) * 0.15));
  const opF = Math.min(1, Math.max(0.7, 1.1 - (zoom - 14) * 0.05));

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
          Mapa real del corredor oriental. Las flechas marcan el sentido de la caminata:
          toca un número para ver su ficha, o abre el recorrido en Google Maps para caminarlo.
        </p>
        <div className="mc-acciones">
          <a className="mc-btn primario" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            Abrir recorrido en Google Maps
          </a>
          <button
            type="button"
            className="mc-btn chico"
            onClick={() => setTema((t) => (t === 'claro' ? 'satelital' : 'claro'))}
            aria-pressed={tema === 'satelital'}
          >
            {tema === 'claro' ? '🛰️ Vista satélite' : '🗺️ Mapa claro'}
          </button>
          <button
            type="button"
            className="mc-btn chico"
            onClick={() => setNubesOn((v) => !v)}
            aria-pressed={nubesOn}
          >
            {nubesOn ? '☁️ Nubes: sí' : '☁️ Nubes: no'}
          </button>
          <span className="mc-meta">6 paradas · a pie · ~7 km</span>
        </div>
      </div>

      <div className={`mc-main tema-${tema}`}>
        <div className="mc-visual">
          <div ref={mapEl} className="mc-map" role="application" aria-label="Mapa del recorrido con 6 paradas" />
          {nubesOn && (
            <div
              className="mc-nubes"
              aria-hidden="true"
              style={{ '--dx': viento.x.toFixed(2), '--dy': viento.y.toFixed(2) }}
            >
              {nubes.map((n) => (
                <div
                  key={n.id}
                  className="mc-nube"
                  style={{
                    top: n.top,
                    left: n.left,
                    width: n.width,
                    height: n.height,
                    opacity: n.opacity * opF,
                    animationDuration: n.duration,
                    animationDelay: n.delay,
                    '--zc': zc.toFixed(2),
                  }}
                />
              ))}
            </div>
          )}
          <div className="mc-viento" aria-hidden="true">
            🌬️ {viento.dir}{viento.kmh != null ? ` · ${Math.round(viento.kmh)} km/h` : ''}
          </div>
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
