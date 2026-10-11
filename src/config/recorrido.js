// Recorrido cultural — Caminos de Fogón y Palabra
// Esquema diagramático (no a escala geográfica exacta).
// El link largo de Google es la navegación real a pie.
// Cuando lleguen nombres/fichas/fotos, solo rellenar titulo/resumen/foto/mujer.

export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/dir/Mini+Granja+Al+Son+De+La+Cuchara,+Corregimiento+de+Cabrera,+Pasto,+CABRERA,+Pasto,+Nari%C3%B1o/LAGUNA+PARK,+Unnamed+Road,+Pasto,+Nari%C3%B1o/1%C2%B012\'09.5%22N+77%C2%B012\'18.8%22W/1%C2%B012\'52.0%22N+77%C2%B012\'20.2%22W/1%C2%B013\'00.4%22N+77%C2%B012\'31.3%22W/1.2153542,-77.2144394/@1.2097692,-77.2131541,2179m/data=!3m1!1e3!4m28!4m27!1m5!1m1!1s0x8e2ed5c958705bd5:0xc1795da1467381c!2m2!1d-77.2152805!2d1.214662!1m5!1m1!1s0x8e2ed5bf5ec198f5:0xf7eb822a5c0074ec!2m2!1d-77.2131784!2d1.2034358!1m3!2m2!1d-77.2052222!2d1.2026389!1m3!2m2!1d-77.2056111!2d1.2144444!1m3!2m2!1d-77.2086944!2d1.2167778!1m1!4e1!3e2?entry=ttu';

// Posiciones x/y (%) proyectadas de lat/lng reales a caja 10-90 / 15-85.
// Sirven solo para dibujar el esquema sobre la foto de la zona.
export const RECORRIDO = [
  {
    id: 1,
    titulo: 'Punto 1 — Mini Granja Al Son de la Cuchara',
    subtitulo: 'Cabrera · Inicio',
    lat: 1.214662,
    lng: -77.2152805,
    x: 10,
    y: 25.5,
    descripcion: 'Ficha en camino — aquí irá la historia, la anfitriona y los sabores de este punto.',
    foto: null,
    mujer: null,
  },
  {
    id: 2,
    titulo: 'Punto 2 — Laguna Park',
    subtitulo: 'San Pedro de la Laguna',
    lat: 1.2034358,
    lng: -77.2131784,
    x: 26.7,
    y: 81,
    descripcion: 'Ficha en camino — aquí irá la historia, la anfitriona y los sabores de este punto.',
    foto: null,
    mujer: null,
  },
  {
    id: 3,
    titulo: 'Punto 3 — Parada por definir',
    subtitulo: 'Corredor oriental · 1.2026389, -77.2052222',
    lat: 1.2026389,
    lng: -77.2052222,
    x: 90,
    y: 85,
    descripcion: 'Ficha en camino — aquí irá la historia, la anfitriona y los sabores de este punto.',
    foto: null,
    mujer: null,
  },
  {
    id: 4,
    titulo: 'Punto 4 — Parada por definir',
    subtitulo: 'Corredor oriental · 1.2144444, -77.2056111',
    lat: 1.2144444,
    lng: -77.2056111,
    x: 86.9,
    y: 26.5,
    descripcion: 'Ficha en camino — aquí irá la historia, la anfitriona y los sabores de este punto.',
    foto: null,
    mujer: null,
  },
  {
    id: 5,
    titulo: 'Punto 5 — Parada por definir',
    subtitulo: 'Corredor oriental · 1.2167778, -77.2086944',
    lat: 1.2167778,
    lng: -77.2086944,
    x: 62.4,
    y: 15,
    descripcion: 'Ficha en camino — aquí irá la historia, la anfitriona y los sabores de este punto.',
    foto: null,
    mujer: null,
  },
  {
    id: 6,
    titulo: 'Punto 6 — Cierre del circuito',
    subtitulo: 'Cabrera · 1.2153542, -77.2144394',
    lat: 1.2153542,
    lng: -77.2144394,
    x: 16.7,
    y: 22,
    descripcion: 'Ficha en camino — aquí irá la historia, la anfitriona y los sabores de este punto.',
    foto: null,
    mujer: null,
  },
];

export function mapsUrlPunto(p) {
  return `https://www.google.com/maps?q=${p.lat},${p.lng}`;
}
