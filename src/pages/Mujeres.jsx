import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCameraRetro,
  FaMapMarkerAlt,
  FaRandom,
  FaTimes,
  FaUser,
} from 'react-icons/fa';
import { Reveal, SplitText, Spotlight } from '../components/bits.jsx';
import { EMPRENDIMIENTOS, FILTROS } from '../config/emprendimientos.js';
import './Mujeres.css';

// Cuántas fichas tiene cada filtro (se calcula una sola vez).
const CUENTA = FILTROS.reduce((acc, f) => {
  acc[f.id] = f.id === 'todos'
    ? EMPRENDIMIENTOS.length
    : EMPRENDIMIENTOS.filter((e) => e.filtro === f.id).length;
  return acc;
}, {});

export default function Mujeres() {
  const [filtro, setFiltro] = useState('todos');
  const [activoId, setActivoId] = useState(null);
  const panelRef = useRef(null);

  const lista = useMemo(
    () => (filtro === 'todos' ? EMPRENDIMIENTOS : EMPRENDIMIENTOS.filter((e) => e.filtro === filtro)),
    [filtro]
  );
  const activo = EMPRENDIMIENTOS.find((e) => e.id === activoId) ?? null;

  // Modal: bloquea el scroll, cierra con Esc y navega con las flechas.
  useEffect(() => {
    if (!activo) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKey = (ev) => {
      if (ev.key === 'Escape') {
        setActivoId(null);
        return;
      }
      if (ev.key === 'Tab') {
        const focusables = panelRef.current?.querySelectorAll('button, a[href]');
        if (!focusables?.length) return;
        const primero = focusables[0];
        const ultimo = focusables[focusables.length - 1];
        if (ev.shiftKey && document.activeElement === primero) {
          ev.preventDefault();
          ultimo.focus();
        } else if (!ev.shiftKey && document.activeElement === ultimo) {
          ev.preventDefault();
          primero.focus();
        }
        return;
      }
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      const total = EMPRENDIMIENTOS.length;
      const i = EMPRENDIMIENTOS.findIndex((e) => e.id === activo.id);
      const paso = ev.key === 'ArrowRight' ? 1 : -1;
      setActivoId(EMPRENDIMIENTOS[(i + paso + total) % total].id);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener('keydown', onKey);
    };
  }, [activo]);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [activoId]);

  const mover = (paso) => {
    if (!activo) return;
    const total = EMPRENDIMIENTOS.length;
    const i = EMPRENDIMIENTOS.findIndex((e) => e.id === activo.id);
    setActivoId(EMPRENDIMIENTOS[(i + paso + total) % total].id);
  };

  const alAzar = () => {
    const i = Math.floor(Math.random() * EMPRENDIMIENTOS.length);
    setActivoId(EMPRENDIMIENTOS[i].id);
  };

  return (
    <section className="page-section mujeres">
      <p className="eyebrow">3 · Mujeres que guían el territorio</p>
      <SplitText
        as="h2"
        splitBy="chars"
        stagger={14}
        text="Nueve emprendimientos, una misma forma de habitar el territorio"
        className="hero-title"
      />
      <Reveal delay={120}>
        <p className="lead mj-lead">
          Cocina, naturaleza, arte y crianza se encuentran en el corredor oriental de Pasto.
          Abre cada ficha para conocer a la mujer que la sostiene, lo que ofrece y la historia
          que hay detrás de su mesa, su jardín o su fogón.
        </p>
      </Reveal>

      <div className="stat-strip" aria-label="Las mujeres y sus emprendimientos en cifras">
        <div className="stat"><span className="stat-num">9</span><span className="stat-label">emprendimientos</span></div>
        <div className="stat"><span className="stat-num">8</span><span className="stat-label">fotos · 1 en camino</span></div>
        <div className="stat"><span className="stat-num">4</span><span className="stat-label">corregimientos</span></div>
        <div className="stat"><span className="stat-num">1</span><span className="stat-label">red de mujeres</span></div>
      </div>

      <Reveal>
        <div className="mj-barra">
          <div className="mj-filtros" role="group" aria-label="Filtrar emprendimientos por oficio">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`mj-chip${filtro === f.id ? ' activo' : ''}`}
                onClick={() => setFiltro(f.id)}
                aria-pressed={filtro === f.id}
              >
                <f.icon aria-hidden="true" />
                {f.label}
                <span className="mj-chip-num">{CUENTA[f.id]}</span>
              </button>
            ))}
          </div>
          <button type="button" className="mj-azar" onClick={alAzar}>
            <FaRandom aria-hidden="true" /> Sorpréndeme
          </button>
        </div>
        <p className="mj-contador" aria-live="polite">
          {lista.length} de {EMPRENDIMIENTOS.length} fichas
          {filtro !== 'todos' ? ` · ${FILTROS.find((f) => f.id === filtro)?.label}` : ''}
          <span> · toca una tarjeta para leer la historia completa</span>
        </p>
      </Reveal>

      <div className="mj-grid">
        {lista.map((e, i) => (
          <article
            key={`${filtro}-${e.id}`}
            className={`mj-card${e.foto ? '' : ' sin-foto'}`}
            style={{ '--g1': e.c1, '--g2': e.c2, '--i': i }}
          >
            <div className="mj-foto">
              {e.foto ? (
                <img src={e.foto} alt={`${e.owner} · ${e.name}`} loading="lazy" />
              ) : (
                <div className="mj-foto-vacia">
                  <FaCameraRetro aria-hidden="true" />
                  <span>Foto en camino</span>
                </div>
              )}
              <span className="mj-num">{e.num}</span>
              <span className="mj-cat">
                <e.icon aria-hidden="true" /> {e.cat}
              </span>
              <span className="mj-foto-grad" aria-hidden="true" />
            </div>
            <div className="mj-body">
              <p className="mj-lugar"><FaMapMarkerAlt aria-hidden="true" /> {e.lugar}</p>
              <h3>{e.name}</h3>
              <p className="mj-resumen">{e.resumen}</p>
              <span className="mj-owner">{e.owner}</span>
              <span className="mj-ver">Leer su historia <FaArrowRight aria-hidden="true" /></span>
            </div>
            <button
              type="button"
              className="mj-card-btn"
              onClick={() => setActivoId(e.id)}
              aria-label={`Ver la historia de ${e.name}`}
            />
          </article>
        ))}
      </div>

      <p className="mj-nota">
        La ficha de <strong>Tradiciones Nariñenses Marucha</strong> espera la foto de su
        emprendedora. El resto de su historia ya está disponible.
      </p>

      <Reveal>
        <Spotlight className="card mj-invitar">
          <h3>Una red que se visita</h3>
          <p>
            Cada emprendimiento es una puerta abierta: una mesa, un jardín, un telar de
            historias o un fogón que espera visitantes. Conocerlas es también reconocer el
            trabajo de las mujeres que sostienen la vida rural del corredor oriental de Pasto.
          </p>
          <div className="mj-ctas">
            <a className="btn primary" href="#/mapa">Recorrer el mapa</a>
            <a className="btn" href="#/contacto">Contacto / reserva</a>
          </div>
        </Spotlight>
      </Reveal>

      {activo && (
        <div className="mj-modal">
          <div className="mj-backdrop" onClick={() => setActivoId(null)} aria-hidden="true" />
          <div
            className="mj-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mj-modal-title"
            ref={panelRef}
            tabIndex={-1}
            style={{ '--g1': activo.c1, '--g2': activo.c2 }}
          >
            <button
              type="button"
              className="mj-cerrar"
              onClick={() => setActivoId(null)}
              aria-label="Cerrar la ficha"
            >
              <FaTimes aria-hidden="true" />
            </button>

            <div className="mj-modal-foto">
              {activo.foto ? (
                <img src={activo.foto} alt={`${activo.owner} · ${activo.name}`} />
              ) : (
                <div className="mj-foto-vacia mj-foto-vacia-modal">
                  <FaCameraRetro aria-hidden="true" />
                  <span>Foto en camino</span>
                </div>
              )}
              <span className="mj-modal-degradado" aria-hidden="true" />
              <div className="mj-modal-cab">
                <p className="mj-modal-kicker">{activo.num} · {activo.cat}</p>
                <h3 id="mj-modal-title">{activo.name}</h3>
                <p className="mj-modal-sub">{activo.tagline}</p>
              </div>
            </div>

            <div className="mj-modal-body">
              <div className="mj-meta">
                <span><FaUser aria-hidden="true" /> {activo.owner}{activo.rol ? ` · ${activo.rol}` : ''}</span>
                <span><FaMapMarkerAlt aria-hidden="true" /> {activo.lugar}</span>
                {activo.anio && <span><FaCalendarAlt aria-hidden="true" /> Desde {activo.anio}</span>}
              </div>

              <p className="mj-modal-lead">{activo.lead}</p>

              {activo.secciones.map((s) => (
                <div className="mj-sec" key={s.titulo}>
                  <h4>{s.titulo}</h4>
                  <p>{s.texto}</p>
                </div>
              ))}

              <div className="mj-claves" aria-label="Productos y experiencias">
                {activo.claves.map((c) => <span key={c}>{c}</span>)}
              </div>

              <blockquote className="mj-cierre">{activo.cierre}</blockquote>

              <div className="mj-modal-nav">
                <button type="button" className="mj-nav-btn" onClick={() => mover(-1)}>
                  <FaArrowLeft aria-hidden="true" /> Anterior
                </button>
                <a className="mj-nav-btn mj-nav-cta" href="#/mapa" onClick={() => setActivoId(null)}>
                  Ver en el mapa
                </a>
                <button type="button" className="mj-nav-btn" onClick={() => mover(1)}>
                  Siguiente <FaArrowRight aria-hidden="true" />
                </button>
              </div>
              <p className="mj-nav-pista">Usa ← → para cambiar de ficha · Esc para cerrar</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
