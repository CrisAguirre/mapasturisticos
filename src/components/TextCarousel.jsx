import { useCallback, useEffect, useRef, useState } from 'react';
import './TextCarousel.css';

// Carrusel de contenido (texto + icono) para la sección Proyecto.
// slides: [{ icon: ComponenteReact, kicker, title, text, gradient }]
export default function TextCarousel({ slides = [], interval = 6000, label = 'Carrusel' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const n = slides.length;

  const goTo = useCallback((i) => setIndex(((i % n) + n) % n), [n]);
  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);

  useEffect(() => {
    if (paused || n <= 1) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [paused, next, interval, n, index]);

  if (n === 0) return null;

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 40) prev();
    else if (dx < -40) next();
    touchX.current = null;
  };

  return (
    <div
      className="tc"
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="tc-viewport">
        <div className="tc-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                className="tc-slide"
                key={s.key || i}
                aria-hidden={i !== index}
                aria-label={`${i + 1} de ${n}: ${s.title}`}
              >
                <article
                  className={`tc-card${i === index ? ' active' : ''}`}
                  style={{ '--tc-gradient': s.gradient || 'linear-gradient(135deg, #0c4a6e, #0891b2)' }}
                >
                  {Icon && (
                    <span className="tc-icon" aria-hidden="true">
                      <Icon />
                    </span>
                  )}
                  {s.kicker && <p className="tc-kicker">{s.kicker}</p>}
                  <h4 className="tc-title">{s.title}</h4>
                  <p className="tc-text">{s.text}</p>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {n > 1 && (
        <>
          <button type="button" className="tc-arrow prev" onClick={prev} aria-label="Anterior">
            ‹
          </button>
          <button type="button" className="tc-arrow next" onClick={next} aria-label="Siguiente">
            ›
          </button>
          <div className="tc-footer">
            <div className="tc-dots" role="tablist" aria-label={`Páginas de ${label}`}>
              {slides.map((s, i) => (
                <button
                  key={s.key || i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ir a: ${s.title}`}
                  className={`tc-dot${i === index ? ' active' : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <span className="tc-count" aria-live="polite">
              {index + 1} / {n}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
