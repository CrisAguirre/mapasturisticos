import { useEffect, useRef, useState } from 'react';
import logoImg from './assets/logo.png';
import Inicio from './pages/Inicio.jsx';
import Proyecto from './pages/Proyecto.jsx';
import Mujeres from './pages/Mujeres.jsx';
import Contacto from './pages/Contacto.jsx';
import MapaTuristico from './pages/MapaTuristico.jsx';
import Experiencias from './pages/Experiencias.jsx';
import Voces from './pages/Voces.jsx';
import Entrar from './pages/Entrar.jsx';
import WhatsAppFloat from './components/WhatsAppFloat.jsx';
import './App.css';

const TABS = [
  { id: 'inicio', label: 'Inicio', Page: Inicio },
  { id: 'proyecto', label: 'Proyecto', Page: Proyecto },
  { id: 'mujeres', label: 'Mujeres', Page: Mujeres },
  { id: 'mapa', label: 'Mapa', Page: MapaTuristico },
  { id: 'experiencias', label: 'Experiencias', Page: Experiencias },
  { id: 'voces', label: 'Voces', Page: Voces },
  { id: 'entrar', label: 'Entrar', Page: Entrar },
  { id: 'contacto', label: 'Contacto', Page: Contacto },
];

function routeFromHash() {
  const h = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return TABS.some((t) => t.id === h) ? h : 'inicio';
}

function App() {
  const [route, setRoute] = useState(routeFromHash);
  // Menú retráctil: abierto por defecto en escritorio, cerrado en móvil
  const [menuOpen, setMenuOpen] = useState(() => window.matchMedia('(min-width: 721px)').matches);
  const tabsRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

  useEffect(() => {
    const onChange = () => {
      setRoute(routeFromHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  // Pestaña animada: píldora deslizante bajo la pestaña activa
  useEffect(() => {
    const update = (scroll) => {
      const el = tabsRef.current?.querySelector(`[data-route="${route}"]`);
      if (!el) return;
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
      // En móvil la barra es deslizable: centra la pestaña activa
      if (scroll) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };
    update(true);
    const t = setTimeout(() => update(false), 120);
    const onResize = () => update(false);
    const onLoad = () => update(false);
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onLoad);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
    };
  }, [route]);

  const active = TABS.find((t) => t.id === route) ?? TABS[0];
  const { Page } = active;

  return (
    <>
      <nav className="topnav">
        <a href="#/inicio" className="brand">
          <img src={logoImg} alt="Logo Caminos de Fogón y Palabra" className="brand-logo" />
          Caminos de Fogón y Palabra
        </a>
        <div className={`tabs${menuOpen ? '' : ' closed'}`} ref={tabsRef}>
          <span
            className="tabs-indicator"
            style={{
              opacity: indicator.visible ? 1 : 0,
              width: `${indicator.width}px`,
              transform: `translateX(${indicator.left}px)`,
            }}
          />
          {TABS.map((t) => (
            <a
              key={t.id}
              data-route={t.id}
              href={`#/${t.id}`}
              className={`tab${t.id === route ? ' active' : ''}`}
            >
              {t.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          className={`menu-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Ocultar menú' : 'Mostrar menú'}
        >
          <span className="burger" aria-hidden="true" />
        </button>
      </nav>

      <main key={route} className="page-enter">
        <Page />
      </main>

      <footer className="footer">
        <span>Caminos de Fogón y Palabra · <a href="https://deploydevs.vercel.app/" target="_blank" rel="noopener noreferrer">Agencia Deploy</a></span>
      </footer>
      <WhatsAppFloat />
    </>
  );
}

export default App;
