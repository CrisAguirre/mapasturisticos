import CicloConsolidado from './components/CicloConsolidado.jsx';
import './App.css';

function App() {
  return (
    <>
      <nav className="topnav">
        <a href="#inicio" className="brand">🔥 Caminos de Fogón y Palabra</a>
        <div className="links">
          <a href="#inicio">1. Inicio</a>
          <a href="#proyecto">2. Proyecto</a>
          <a href="#mujeres">3. Mujeres</a>
          <a href="#contacto">4. Contacto</a>
          <a href="#mapa">5. Mapa</a>
          <a href="#experiencias">6. Experiencias</a>
          <a href="#voces">7. Voces</a>
        </div>
      </nav>

      {/* 1. INICIO */}
      <section id="inicio" className="hero-section">
        <h1>Caminos de Fogón y Palabra</h1>
        <p className="subtitle">Mujeres que guían el territorio — Corredor oriental de Pasto</p>
        <div className="cta-row">
          <a href="#mapa" className="btn primary">Conoce las rutas</a>
          <a href="#mujeres" className="btn">Conoce a las mujeres</a>
          <a href="#mapa" className="btn">Explora el territorio</a>
          <a href="#contacto" className="btn">Planifica tu visita</a>
        </div>
      </section>

      {/* 2. EL PROYECTO */}
      <section id="proyecto" className="page-section">
        <h2>🌿 2. El proyecto</h2>
        <p>
          ¿Qué es <strong>Caminos de Fogón y Palabra</strong>? ¿Cómo nació? ¿Qué busca?
          ¿Por qué las mujeres? ¿Qué significa el fogón? ¿Qué significa la palabra?
        </p>
        <ul className="bullet">
          <li>Corredor oriental de Pasto</li>
          <li>Proceso comunitario</li>
          <li>Línea de tiempo interactiva (pendiente)</li>
        </ul>
      </section>

      {/* 3. MUJERES */}
      <section id="mujeres" className="page-section">
        <h2>👩🏽 3. Mujeres que guían el territorio</h2>
        <p>Cada mujer tendrá su ficha: nombre, vereda, emprendimiento, producto, experiencia, historia, galería, audio y video.</p>
        <div className="cards">
          <div className="card">🍲 Ejemplo: Helados de paila — “Conoce a María y la historia detrás de sus helados”.</div>
          <div className="card">🌽 Ficha pendiente: vereda / corregimiento / especialidad.</div>
          <div className="card">🎧 Ficha pendiente: relato sonoro + video.</div>
        </div>
      </section>

      {/* 4. CONTACTO */}
      <section id="contacto" className="page-section">
        <h2>📞 4. Contacto / reserva</h2>
        <p>La idea es que la persona no solamente vea “Helados de paila”, sino “Conoce a María y la historia detrás”.</p>
        <button className="btn primary" type="button">Reservar experiencia (próximamente)</button>
      </section>

      {/* 5. MAPA TURÍSTICO */}
      <section id="mapa" className="page-section mapa-section">
        <h2>🗺️ 5. Mapa Turístico</h2>
        <div className="mapa-clon-wrapper">
          <CicloConsolidado />
        </div>
      </section>

      {/* 6. EXPERIENCIAS */}
      <section id="experiencias" className="page-section">
        <h2>🔥 6. Experiencias</h2>
        <ul className="bullet">
          <li>“Sabores del fogón” — cocina tradicional</li>
          <li>“Caminos de memoria” — recorridos y relatos</li>
          <li>“Del territorio a la mesa” — gastronómicas</li>
          <li>“Mujeres que guían” — encuentros con emprendedoras</li>
        </ul>
      </section>

      {/* 7. VOCES */}
      <section id="voces" className="page-section">
        <h2>🎙️ 7. Voces del Fogón</h2>
        <p>Espacio multimedia: audios, podcast, videos, fotografía, historias, testimonios, recetas y saberes.</p>
        <button className="btn" type="button">🎧 Escucha esta historia (próximamente)</button>
      </section>

      <footer className="footer">
        <span>Caminos de Fogón y Palabra · React + Vite</span>
      </footer>
    </>
  );
}

export default App;
