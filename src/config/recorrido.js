// Sendero base a pie — Cabrera / San Pedro de la Laguna.
// Los 9 emprendimientos viven en `emprendimientos.js` (única fuente de verdad).
// Este archivo solo guarda el enlace al circuito caminable y helpers de Maps.

export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/dir/Mini+Granja+Al+Son+De+La+Cuchara,+Corregimiento+de+Cabrera,+Pasto,+CABRERA,+Pasto,+Nari%C3%B1o/LAGUNA+PARK,+Unnamed+Road,+Pasto,+Nari%C3%B1o/1%C2%B012\'09.5%22N+77%C2%B012\'18.8%22W/1%C2%B012\'52.0%22N+77%C2%B012\'20.2%22W/1%C2%B013\'00.4%22N+77%C2%B012\'31.3%22W/1.2153542,-77.2144394/@1.2097692,-77.2131541,2179m/data=!3m1!1e3!4m28!4m27!1m5!1m1!1s0x8e2ed5c958705bd5:0xc1795da1467381c!2m2!1d-77.2152805!2d1.214662!1m5!1m1!1s0x8e2ed5bf5ec198f5:0xf7eb822a5c0074ec!2m2!1d-77.2131784!2d1.2034358!1m3!2m2!1d-77.2052222!2d1.2026389!1m3!2m2!1d-77.2056111!2d1.2144444!1m3!2m2!1d-77.2086944!2d1.2167778!1m1!4e1!3e2?entry=ttu';

export const SENDERO_BASE = {
  paradas: 6,
  km: 7.4,
  titulo: 'Sendero base Cabrera — La Laguna',
};

// Búsqueda por nombre + vereda. Para las fichas exactas, Google encuentra el
// negocio; para las aproximadas, al menos lleva a la vereda correcta.
export function mapsUrlPunto(p) {
  const q = p.mapsQuery || `${p.name}, ${p.lugar}, Pasto, Nariño`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
