import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FaArrowRight,
  FaCameraRetro,
  FaMapMarkerAlt,
  FaUser,
} from 'react-icons/fa';
import { EMPRENDIMIENTOS } from '../config/emprendimientos.js';
import { GOOGLE_MAPS_URL, SENDERO_BASE, mapsUrlPunto } from '../config/recorrido.js';
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

// Punto del mapa: número de la ficha, con estado activo.
function numIcon(n, activo) {
  return L.divIcon({
    className: 'mc-leaf',
    html: `<span class="mc-leaf-num${activo ? ' activo' : ''}">${n}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

// Grupo de puntos cercanos: al tocarlo se acerca para separarlos.
function clusterIcon(n) {
  return L.divIcon({
    className: 'mc-cluster-wrap',
    html: `<span class="mc-cluster">${n}</span>`,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  });
}

// Lee ?p=<id> del hash. Sirve para abrir una ficha concreta desde Mujeres.
function idFromHash() {
  const hash = window.location.hash || '';
  const qi = hash.indexOf('?');
  if (qi < 0) return null;
  const id = new URLSearchParams(hash.slice(qi + 1)).get('p');
  return EMPRENDIMIENTOS.some((e) => e.id === id) ? id : null;
}

// Nubes procedurales: cada vista del mapa (centro+zoom) siembra su propio
// cielo — misma vista, mismas nubes; al explorar, cielo nuevo sin saltos.
// De adorno: deriva con el viento, escala con el zoom. Nada meteorológico.
function hashStr(s) {
  let h = 2166136261;
  for (let k = 0; k < s.length; k++) {
    h ^= s.charCodeAt(k);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Cielo fijo y anclado: 8 nubes con coordenadas reales (4 cerca del corredor,
// 4 por Nariño), misma semilla siempre. Al mover o acercar, viajan con el mapa
// como parte del terreno — no van pegadas a la pantalla.
function sembrarCielo() {
  const rnd = mulberry32(hashStr('cielo-cabrera'));
  const caja = (lat0, lat1, lng0, lng1, n) =>
    Array.from({ length: n }, () => {
      const lobulos = 3 + Math.floor(rnd() * 3);
      return {
        lat: lat0 + rnd() * (lat1 - lat0),
        lng: lng0 + rnd() * (lng1 - lng0),
        w: 260 + rnd() * 180, // px a zoom 14; escala con 2^(z-14)
        h: 90 + rnd() * 70,
        opacity: 0.42 + rnd() * 0.13,
        duration: `${20 + rnd() * 12}s`,
        delay: `${-rnd() * 20}s`,
        lobulos: Array.from({ length: lobulos }, () => ({
          l: `${8 + rnd() * 55}%`,
          t: `${10 + rnd() * 45}%`,
          w: `${28 + rnd() * 30}%`,
          h: `${45 + rnd() * 45}%`,
          o: 0.7 + rnd() * 0.3,
        })),
      };
    });
  return [
    ...caja(1.17, 1.25, -77.32, -77.16, 4),
    ...caja(1.05, 1.35, -77.45, -77.0, 4),
  ];
}

export default function MapaCorredor() {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const marksRef = useRef(new Map());
  const capaRef = useRef(null);
  const lineaRef = useRef(null);
  const clusterLayerRef = useRef(null);
  const boundsRef = useRef(null);
  const ubiRef = useRef(null);
  const nubesRef = useRef([]);
  const [inicialId] = useState(idFromHash);
  const [puntoId, setPuntoId] = useState(() => inicialId ?? EMPRENDIMIENTOS[0].id);
  const [tema, setTema] = useState('satelital');
  const [mapaListo, setMapaListo] = useState(false);
  const [geoMsg, setGeoMsg] = useState(null);
  // Viento actual de la zona (Open-Meteo, gratis sin clave). x/y = vector
  // pantalla hacia donde SE MUEVEN las nubes. Fallback: alisios del este.
  const [viento, setViento] = useState({ dir: 'E', x: 1, y: 0, kmh: null });
  const [nubesOn, setNubesOn] = useState(true);

  const punto = EMPRENDIMIENTOS.find((p) => p.id === puntoId) ?? EMPRENDIMIENTOS[0];

  // Mapa real una sola vez: capa base + sendero + 9 marcadores + grupos.
  useEffect(() => {
    if (mapRef.current || !mapEl.current) return;
    const map = L.map(mapEl.current, {
      scrollWheelZoom: false,
      zoomControl: false,
      minZoom: 11,
      maxZoom: 19,
      // La vista no se escapa de Nariño: rebota suave al borde
      maxBounds: L.latLngBounds([0.95, -77.55], [1.45, -76.95]),
      maxBoundsViscosity: 0.8,
    }).setView([1.2098, -77.2103], 14);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);
    // Satelital por defecto (pedido de la usuaria); el toggle cambia a claro.
    capaRef.current = L.tileLayer(CAPAS.satelital.url, {
      maxZoom: CAPAS.satelital.maxZoom,
      attribution: CAPAS.satelital.attribution,
    }).addTo(map);

    // El sendero base queda como contexto, sin flechas ni numeración:
    // los números 01–09 son las fichas de las emprendedoras.
    const rutaPts = RUTA.coords?.length ? RUTA.coords : [];
    lineaRef.current = rutaPts.length
      ? L.polyline(rutaPts, {
          color: CAPAS.satelital.ruta,
          weight: 3,
          opacity: 0.55,
          dashArray: '8 6',
          className: 'mc-flujo',
        }).addTo(map)
      : null;

    marksRef.current = new Map();
    EMPRENDIMIENTOS.forEach((e) => {
      const m = L.marker([e.geo.lat, e.geo.lng], {
        icon: numIcon(e.num, e.id === (inicialId ?? EMPRENDIMIENTOS[0].id)),
        title: e.name,
      }).addTo(map);
      m.bindTooltip(`${e.num} · ${e.name}`);
      m.on('click', () => {
        setPuntoId(e.id);
        history.replaceState(null, '', `#/mapa?p=${e.id}`);
      });
      marksRef.current.set(e.id, m);
    });

    clusterLayerRef.current = L.layerGroup().addTo(map);

    // Agrupa puntos que se pisan en pantalla (solo con zoom < 16). Al tocar
    // un grupo, el mapa vuela al conjunto y los marcadores se separan.
    const actualizarClusteres = () => {
      const capa = clusterLayerRef.current;
      if (!capa) return;
      capa.clearLayers();
      const zoom = map.getZoom();
      const individuales = EMPRENDIMIENTOS.map((e) => ({
        e,
        px: map.project([e.geo.lat, e.geo.lng], zoom),
      }));

      if (zoom >= 16) {
        individuales.forEach(({ e }) => {
          const m = marksRef.current.get(e.id);
          if (m && !map.hasLayer(m)) m.addTo(map);
        });
        return;
      }

      const usados = new Set();
      const grupos = [];
      for (let i = 0; i < individuales.length; i++) {
        if (usados.has(i)) continue;
        const grupo = [individuales[i]];
        usados.add(i);
        // Crece alrededor del centro del grupo: si un punto cercano al centro
        // todavía no entró, se suma (evita que un punto quede pegado al grupo).
        let creció = true;
        while (creció) {
          creció = false;
          const cx = grupo.reduce((s, g) => s + g.px.x, 0) / grupo.length;
          const cy = grupo.reduce((s, g) => s + g.px.y, 0) / grupo.length;
          for (let j = i + 1; j < individuales.length; j++) {
            if (usados.has(j)) continue;
            const dx = individuales[j].px.x - cx;
            const dy = individuales[j].px.y - cy;
            if (Math.hypot(dx, dy) <= 70) {
              grupo.push(individuales[j]);
              usados.add(j);
              creció = true;
            }
          }
        }
        grupos.push(grupo);
      }

      grupos.forEach((grupo) => {
        if (grupo.length === 1) {
          const m = marksRef.current.get(grupo[0].e.id);
          if (m && !map.hasLayer(m)) m.addTo(map);
          return;
        }
        grupo.forEach(({ e }) => {
          const m = marksRef.current.get(e.id);
          if (m && map.hasLayer(m)) map.removeLayer(m);
        });
        const lat = grupo.reduce((s, g) => s + g.e.geo.lat, 0) / grupo.length;
        const lng = grupo.reduce((s, g) => s + g.e.geo.lng, 0) / grupo.length;
        const cm = L.marker([lat, lng], {
          icon: clusterIcon(grupo.length),
          title: `${grupo.length} emprendimientos`,
        });
        cm.bindTooltip(`${grupo.length} emprendimientos · toca para acercar`);
        cm.on('click', () => {
          const b = L.latLngBounds(grupo.map(({ e }) => [e.geo.lat, e.geo.lng]));
          map.flyToBounds(b.pad(0.25), { maxZoom: 17, duration: 0.8 });
        });
        cm.addTo(capa);
      });
    };

    map.on('zoomend moveend', actualizarClusteres);
    boundsRef.current = L.latLngBounds(
      EMPRENDIMIENTOS.map((e) => [e.geo.lat, e.geo.lng])
    );

    // Si llega un enlace directo (#/mapa?p=...), abre esa ficha de cerca.
    // El encuadre se aplica cuando el contenedor ya tiene su tamaño final:
    // si se calcula antes, el mapa queda demasiado cerca y oculta puntos.
    let vistaInicialHecha = false;
    const inicial = EMPRENDIMIENTOS.find((e) => e.id === inicialId);
    const aplicarVistaInicial = () => {
      if (vistaInicialHecha) return;
      const w = mapEl.current?.clientWidth ?? 0;
      const h = mapEl.current?.clientHeight ?? 0;
      if (!w || !h) return;
      map.invalidateSize();
      if (inicial) {
        map.setView([inicial.geo.lat, inicial.geo.lng], 16);
      } else {
        map.fitBounds(boundsRef.current, { padding: [36, 36] });
      }
      vistaInicialHecha = true;
      actualizarClusteres();
    };
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
      if (!vistaInicialHecha) aplicarVistaInicial();
    });
    ro.observe(mapEl.current);
    const tVista = setTimeout(aplicarVistaInicial, 250);

    // Punto azul de ubicación (geolocalización del visitante)
    map.on('locationfound', (e) => {
      if (ubiRef.current) {
        ubiRef.current.marca.setLatLng(e.latlng);
        ubiRef.current.circulo.setLatLng(e.latlng).setRadius(e.accuracy);
      } else {
        const marca = L.circleMarker(e.latlng, {
          radius: 8, color: '#fff', weight: 3, fillColor: '#00aadd', fillOpacity: 1,
        }).addTo(map);
        const circulo = L.circle(e.latlng, {
          radius: e.accuracy, color: '#00aadd', weight: 1, opacity: 0.5, fillOpacity: 0.12,
        }).addTo(map);
        ubiRef.current = { marca, circulo };
      }
      setGeoMsg(null);
    });
    map.on('locationerror', () => {
      setGeoMsg('No se pudo obtener tu ubicación.');
    });

    // Cielo anclado al mapa: pane propio bajo los marcadores; cada nube vive
    // en su lat/lng y se recoloca en cada movimiento/zoom (viaja con el terreno).
    const pane = map.createPane('nubes');
    pane.style.zIndex = 450;
    pane.style.pointerEvents = 'none';
    const colocarNubes = () => {
      const s = Math.min(2, Math.max(0.5, Math.pow(2, map.getZoom() - 14)));
      nubesRef.current.forEach((n) => {
        const p = map.latLngToLayerPoint([n.lat, n.lng]);
        const w = n.w * s;
        const h = n.h * s;
        n.el.style.left = `${p.x - w / 2}px`;
        n.el.style.top = `${p.y - h / 2}px`;
        n.el.style.width = `${w}px`;
        n.el.style.height = `${h}px`;
      });
    };
    nubesRef.current = sembrarCielo().map((n) => {
      const el = document.createElement('div');
      el.className = 'mc-nubegeo';
      el.style.opacity = n.opacity;
      el.setAttribute('aria-hidden', 'true');
      const deriva = document.createElement('div');
      deriva.className = 'mc-nubederiva';
      deriva.style.animationDuration = n.duration;
      deriva.style.animationDelay = n.delay;
      n.lobulos.forEach((b) => {
        const lob = document.createElement('span');
        lob.className = 'mc-lob';
        lob.style.left = b.l;
        lob.style.top = b.t;
        lob.style.width = b.w;
        lob.style.height = b.h;
        lob.style.opacity = b.o;
        deriva.appendChild(lob);
      });
      el.appendChild(deriva);
      pane.appendChild(el);
      return { ...n, el };
    });
    colocarNubes();
    map.on('move zoom viewreset', colocarNubes);
    // No atrapar el scroll de la página: el zoom con rueda solo al tocar el mapa
    map.on('focus', () => map.scrollWheelZoom.enable());
    map.on('blur', () => map.scrollWheelZoom.disable());
    map.on('click', () => map.scrollWheelZoom.enable());
    mapRef.current = map;
    setMapaListo(true);
    return () => {
      clearTimeout(tVista);
      ro.disconnect();
      // Detén pan/zoom animados antes de destruir: si se navega a mitad de un
      // flyTo, Leaflet puede quedar con un frame de zoom pendiente.
      map.stop();
      map.remove();
      mapRef.current = null;
      marksRef.current = new Map();
      clusterLayerRef.current = null;
      nubesRef.current = [];
      capaRef.current = null;
      lineaRef.current = null;
    };
  }, [inicialId]); // solo montaje: el id inicial no cambia

  // Tema claro ↔ oscuro: cambia baldosas y color del sendero
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

  // Resaltar el marcador activo al cambiar de ficha
  useEffect(() => {
    EMPRENDIMIENTOS.forEach((e) => {
      const m = marksRef.current.get(e.id);
      if (m) m.setIcon(numIcon(e.num, e.id === puntoId));
    });
  }, [puntoId]);

  // Enlaces directos desde otra página o desde el historial.
  useEffect(() => {
    const onHash = () => {
      const id = idFromHash();
      if (!id) return;
      setPuntoId((prev) => (prev === id ? prev : id));
      const e = EMPRENDIMIENTOS.find((p) => p.id === id);
      if (e && mapRef.current) {
        mapRef.current.flyTo([e.geo.lat, e.geo.lng], 16, { duration: 0.8 });
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

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

  // Nubes: mostrar/ocultar + dirección del viento sobre el pane anclado
  useEffect(() => {
    const pane = mapRef.current?.getPane('nubes');
    if (!pane || !mapaListo) return;
    pane.style.display = nubesOn ? '' : 'none';
    pane.style.setProperty('--dx', viento.x.toFixed(2));
    pane.style.setProperty('--dy', viento.y.toFixed(2));
  }, [nubesOn, viento, mapaListo]);

  const seleccionar = (id, volar = false) => {
    setPuntoId(id);
    history.replaceState(null, '', `#/mapa?p=${id}`);
    if (volar && mapRef.current) {
      const e = EMPRENDIMIENTOS.find((p) => p.id === id);
      if (e) mapRef.current.flyTo([e.geo.lat, e.geo.lng], 16, { duration: 0.8 });
    }
  };

  const verPunto = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([punto.geo.lat, punto.geo.lng], 16, { duration: 0.8 });
    }
  };

  // Vuelve al encuadre de los 9 emprendimientos y limpia el enlace profundo
  const encuadrarTodos = () => {
    setPuntoId(EMPRENDIMIENTOS[0].id);
    history.replaceState(null, '', '#/mapa');
    if (mapRef.current && boundsRef.current) {
      mapRef.current.flyToBounds(boundsRef.current, {
        padding: [40, 40],
        maxZoom: 15,
        duration: 0.8,
      });
    }
  };

  // Punto azul: ubica al visitante que camina la ruta
  const irAMiUbicacion = () => {
    const map = mapRef.current;
    if (!map) return;
    if (!('geolocation' in navigator)) {
      setGeoMsg('Tu dispositivo no ofrece ubicación.');
      return;
    }
    setGeoMsg('Buscando tu ubicación…');
    map.locate({ setView: true, maxZoom: 16, timeout: 10000 });
  };

  const exactas = EMPRENDIMIENTOS.filter((e) => e.geo.precision === 'exacta').length;

  return (
    <div className="mc-clon">
      <div className="mc-head">
        <span className="mc-eyebrow">Mapa cultural · 9 emprendimientos</span>
        <h3>Los 9 puntos de las mujeres que guían el territorio</h3>
        <p>
          Cabrera, San Pedro de la Laguna, Aguapamba, Jongovito y Cujacal Bajo en un solo
          mapa. Toca un número o una ficha de la lista para conocer el emprendimiento; el
          trazado punteado es el sendero base de {SENDERO_BASE.paradas} paradas.
        </p>
        <div className="mc-acciones">
          <button type="button" className="mc-btn primario" onClick={encuadrarTodos}>
            Ver los 9 puntos
          </button>
          <a className="mc-btn chico" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            Sendero base en Google Maps
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
          <span className="mc-meta">
            9 puntos · {exactas} exactos · {EMPRENDIMIENTOS.length - exactas} aproximados
          </span>
        </div>
        <p className="mc-nota">
          Solo <strong>Al Son de la Cuchara</strong> y <strong>Jardín de Mamá Luz</strong>{' '}
          tienen ubicación exacta verificada. Las demás fichas se ubican a nivel de vereda
          para no inventar direcciones; el botón <strong>Google Maps</strong> busca el
          nombre del emprendimiento.
        </p>
        {geoMsg && <p className="mc-geo" role="status">{geoMsg}</p>}
      </div>

      <div className={`mc-main tema-${tema}`}>
        <div className="mc-visual">
          <div ref={mapEl} className="mc-map" role="application" aria-label="Mapa de los 9 emprendimientos" />
          <div className="mc-tools" role="group" aria-label="Controles del mapa">
            <button type="button" onClick={encuadrarTodos} title="Ver los 9 puntos" aria-label="Ver los 9 puntos">⤢</button>
            <button type="button" onClick={irAMiUbicacion} title="Dónde estoy" aria-label="Mostrar mi ubicación">📍</button>
          </div>
          <div className="mc-viento" aria-hidden="true">
            🌬️ {viento.dir}{viento.kmh != null ? ` · ${Math.round(viento.kmh)} km/h` : ''}
          </div>
          <div className="mc-leyenda" aria-hidden="true">
            <span className="mc-lg-linea" /> Sendero base
            <span className="mc-lg-punto" /> Emprendimiento
          </div>
          <div className="mc-chip">{punto.num} · {punto.name}</div>
        </div>

        <aside className="mc-panel" aria-label="Fichas de los 9 emprendimientos">
          <div className="mc-ficha activa" style={{ '--g1': punto.c1, '--g2': punto.c2 }}>
            <span className="mc-kicker">Punto {punto.num} de {EMPRENDIMIENTOS.length} · {punto.cat}</span>
            <h4>{punto.name}</h4>
            <p className="mc-sub"><FaMapMarkerAlt aria-hidden="true" /> {punto.lugar}</p>
            {punto.foto ? (
              <img src={punto.foto} alt={`${punto.owner} · ${punto.name}`} className="mc-foto" />
            ) : (
              <div className="mc-foto-ph">
                <FaCameraRetro aria-hidden="true" />
                <span>Foto en camino</span>
              </div>
            )}
            <p className="mc-owner"><FaUser aria-hidden="true" /> {punto.owner}</p>
            <p className="mc-desc">{punto.resumen}</p>
            <div className="mc-claves" aria-label="Productos y experiencias">
              {punto.claves.slice(0, 4).map((c) => <span key={c}>{c}</span>)}
            </div>
            <span className={`mc-precision ${punto.geo.precision}`}>
              {punto.geo.precision === 'exacta' ? 'Ubicación exacta' : 'Ubicación aproximada · nivel de vereda'}
            </span>
            <div className="mc-ficha-btns">
              <button type="button" className="mc-btn chico" onClick={verPunto}>
                Centrar en el mapa
              </button>
              <a className="mc-btn chico" href={mapsUrlPunto(punto)} target="_blank" rel="noopener noreferrer">
                Google Maps
              </a>
              <a className="mc-btn chico mc-btn-historia" href={`#/mujeres?f=${punto.id}`}>
                Ver historia completa <FaArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <ul className="mc-lista">
            {EMPRENDIMIENTOS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`mc-item${p.id === puntoId ? ' activo' : ''}`}
                  onClick={() => seleccionar(p.id, true)}
                >
                  <span className="mc-item-num">{p.num}</span>
                  {p.foto ? (
                    <img className="mc-item-foto" src={p.foto} alt="" loading="lazy" />
                  ) : (
                    <span className="mc-item-foto mc-item-foto-ph" aria-hidden="true">
                      <FaCameraRetro />
                    </span>
                  )}
                  <span className="mc-item-txt">
                    <strong>{p.name}</strong>
                    <small>{p.lugar}</small>
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
