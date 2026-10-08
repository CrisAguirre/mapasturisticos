import bannerImg from '../assets/banner.jpg';

export default function Inicio() {
  return (
    <section className="hero-section">
      <h1 className="sr-only">Caminos de Fogón y Palabra</h1>
      <img
        src={bannerImg}
        alt="Caminos de Fogón y Palabra — Saberes, historias y tradición"
        className="banner-img"
      />
    </section>
  );
}
