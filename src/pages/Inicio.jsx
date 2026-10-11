import BannerCarousel from '../components/BannerCarousel.jsx';
import BackendStatus from '../components/BackendStatus.jsx';

export default function Inicio({ user }) {
  return (
    <section className="hero-section">
      <h1 className="sr-only">Caminos de Fogón y Palabra</h1>
      <BannerCarousel />
      {!user && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          <BackendStatus />
        </div>
      )}
    </section>
  );
}
