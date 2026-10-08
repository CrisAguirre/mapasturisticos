import { useEffect, useRef, useState } from 'react';
import logoImg from './assets/logo.png';
import Inicio from './pages/Inicio.jsx';
import Proyecto from './pages/Proyecto.jsx';
import Mujeres from './pages/Mujeres.jsx';
import Contacto from './pages/Contacto.jsx';
import MapaTuristico from './pages/MapaTuristico.jsx';
import Experiencias from './pages/Experiencias.jsx';
import Voces from './pages/Voces.jsx';
import './App.css';

const TABS = [
  { id: 'inicio', label: 'Inicio', Page: Inicio },
  { id: 'proyecto', label: 'Proyecto', Page: Proyecto },
  { id: 'mujeres', label: 'Mujeres', Page: Mujeres },
  { id: 'contacto', label: 'Contacto', Page: Contacto },
  { id: 'mapa', label: 'Mapa', Page: MapaTuristico },
  { id: 'experiencias', label: 'Experiencias', Page: Experiencias },
  { id: 'voces', label: 'Voces', Page: Voces },
];

function routeFromHash() {
  const h = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return TABS.some((t) => t.id === h) ? h : 'inicio';
}

function App() {
  const [route, setRoute] = useState(routeFromHash);
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
    const update = () => {
      const el = tabsRef.current?.querySelector(`[data-route="${route}"]`);
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
    };
    update();
    const t = setTimeout(update, 120);
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', update);
      window.removeEventListener('load', update);
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
        <div className="tabs" ref={tabsRef}>
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
      </nav>

      <main key={route} className="page-enter">
        <Page />
      </main>

      <footer className="footer">
        <span>Caminos de Fogón y Palabra · React + Vite</span>
      </footer>
    </>
  );
}

export default App;
