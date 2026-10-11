import logoImg from '../assets/logo2.png';
import './Preload.css';

// Pantalla de carga inicial: marca + barra animada. Se desmonta con fundido.
export default function Preload({ visible }) {
  return (
    <div className={`preload${visible ? '' : ' preload-sale'}`} role="status" aria-label="Cargando Caminos de Fogón y Palabra">
      <img src={logoImg} alt="Caminos de Fogón y Palabra" className="preload-logo" />
      <p className="preload-nombre">Caminos de Fogón y Palabra</p>
      <p className="preload-sub">Mujeres que Guían el Territorio</p>
      <div className="preload-barra" aria-hidden="true"><span /></div>
    </div>
  );
}
