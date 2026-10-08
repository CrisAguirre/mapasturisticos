import BannerCarousel from '../components/BannerCarousel.jsx';

export default function Inicio() {
  return (
    <section className="hero-section">
      <h1 className="sr-only">Caminos de Fogón y Palabra</h1>
      <BannerCarousel />

      <div className="video-section">
        <h2 className="video-title">🎬 Video de bienvenida</h2>
        <div className="video-placeholder" role="img" aria-label="Espacio reservado para el video de bienvenida">
          <span className="play-btn" aria-hidden="true">▶</span>
          <span className="video-note">Espacio reservado · aquí irá el video de bienvenida</span>
        </div>
      </div>
    </section>
  );
}
