import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from './bits.jsx';
import './ProcesoAnimado.css';

// ── 5 ejes de aprendizaje (resumen visual, sin muros de texto) ──
const EJES = [
  {
    key: 'derechos',
    num: '01',
    titulo: 'Derechos y liderazgo',
    texto: 'Reconocer derechos, fortalecer la voz y prevenir violencias de género.',
    dato: '15 mujeres protagonistas',
    grad: 'linear-gradient(135deg, #831843, #e11d48)',
  },
  {
    key: 'cocina',
    num: '02',
    titulo: 'Cocina y saberes campesinos',
    texto: 'Recetas, ingredientes locales y memoria gastronómica viva.',
    dato: 'Fogón = memoria',
    grad: 'linear-gradient(135deg, #7c2d12, #f59e0b)',
  },
  {
    key: 'economia',
    num: '03',
    titulo: 'Economías populares',
    texto: 'Mapear emprendimientos y tejer articulación entre iniciativas.',
    dato: 'Red, no esfuerzos aislados',
    grad: 'linear-gradient(135deg, #0b3d2e, #16a34a)',
  },
  {
    key: 'turismo',
    num: '04',
    titulo: 'Turismo comunitario',
    texto: 'Hospitalidad con dignidad, interpretación del territorio y patrimonio.',
    dato: 'Anfitrionas del territorio',
    grad: 'linear-gradient(135deg, #0c4a6e, #0891b2)',
  },
  {
    key: 'comunicacion',
    num: '05',
    titulo: 'Comunicación y red',
    texto: 'Contar el territorio, visibilizar emprendimientos y sostener acuerdos.',
    dato: 'Historias que caminan',
    grad: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
  },
];

export function ProcesoAnimado({ ejes = EJES, interval = 5200 }) {
  const [i, setI] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [ref, inView] = useInView(0.25);
  const n = ejes.length;
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const next = useCallback(() => setI((v) => (v + 1) % n), [n]);
  const prev = useCallback(() => setI((v) => (v - 1 + n) % n), [n]);

  useEffect(() => {
    if (pausa || !inView || n <= 1) return;
    if (reduce.current) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [pausa, inView, next, interval, n, i]);

  const act = ejes[i];
  const pct = ((i + 1) / n) * 100;

  return (
    <div
      ref={ref}
      className="pa"
      role="region"
      aria-roledescription="secuencia animada"
      aria-label="Cómo se desarrolló el proyecto en 5 ejes"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      {/* Barra de progreso superior */}
      <div className="pa-progress" aria-hidden="true">
        <div className="pa-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="pa-grid">
        {/* Rail de pasos */}
        <ol className="pa-rail">
          <span className="pa-rail-line" aria-hidden="true" />
          <span className="pa-rail-fill" aria-hidden="true" style={{ height: `${pct}%` }} />
          {ejes.map((e, k) => (
            <li key={e.key} className={`pa-step${k === i ? ' activo' : ''}${k < i ? ' visto' : ''}`}>
              <button type="button" onClick={() => setI(k)} aria-current={k === i ? 'step' : undefined} aria-label={`Eje ${e.num}: ${e.titulo}`}>
                <span className="pa-dot" style={{ '--g': e.grad }}><span>{e.num}</span></span>
                <span className="pa-step-txt">{e.titulo}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* Tarjeta animada */}
        <div className="pa-stage">
          <article key={act.key} className="pa-card" style={{ '--g': act.grad }}>
            <span className="pa-orb" aria-hidden="true" />
            <p className="pa-kicker">Eje {act.num} de {n}</p>
            <h4>{act.titulo}</h4>
            <p className="pa-texto">{act.texto}</p>
            <p className="pa-dato">{act.dato}</p>
            {/* Mini gráfico de barras animado */}
            <div className="pa-bars" aria-hidden="true">
              {ejes.map((e, k) => (
                <span key={e.key} className={`pa-bar${k <= i ? ' on' : ''}`} style={{ '--g': e.grad, animationDelay: `${k * 90}ms` }} />
              ))}
            </div>
          </article>
          <div className="pa-nav">
            <button type="button" onClick={prev} aria-label="Eje anterior">‹</button>
            <span aria-live="polite">{i + 1} / {n}</span>
            <button type="button" onClick={next} aria-label="Eje siguiente">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Línea de tiempo compacta de 9 momentos ──
export function LineaTiempo({ pasos = [] }) {
  const trackRef = useRef(null);
  const [prog, setProg] = useState(0);
  const [ref, inView] = useInView(0.2);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProg(max <= 0 ? 100 : Math.round((el.scrollLeft / max) * 100));
  };

  useEffect(() => {
    onScroll();
    window.addEventListener('resize', onScroll);
    return () => window.removeEventListener('resize', onScroll);
  }, []);

  const mover = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 360), behavior: 'smooth' });
  };

  if (!pasos.length) return null;

  return (
    <div ref={ref} className={`lt${inView ? ' on' : ''}`} role="region" aria-roledescription="línea de tiempo" aria-label="Historia del camino en 9 momentos">
      <div className="lt-top">
        <div className="lt-progress" aria-hidden="true"><span style={{ width: `${prog}%` }} /></div>
        <div className="lt-btns">
          <button type="button" onClick={() => mover(-1)} aria-label="Deslizar atrás">‹</button>
          <button type="button" onClick={() => mover(1)} aria-label="Deslizar adelante">›</button>
        </div>
      </div>
      <ol className="lt-track" ref={trackRef} onScroll={onScroll}>
        {pasos.map((s, k) => {
          const Icon = s.icon;
          return (
            <li key={s.key || k} className="lt-item" style={{ '--g': s.gradient }}>
              <span className="lt-nodo" aria-hidden="true">{Icon ? <Icon /> : k + 1}</span>
              <p className="lt-kicker">{s.kicker}</p>
              <p className="lt-titulo">{s.title}</p>
              <details className="lt-det">
                <summary>Ver más</summary>
                <p>{s.text}</p>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
