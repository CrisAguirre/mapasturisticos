import { useCallback, useEffect, useRef, useState } from 'react';
import './GallerySlider.css';

// Slider fotográfico para encabezados de sección.
// images: [{ src, alt }]. Autoplay con botón pausa/play, flechas, swipe,
// contador, Ken Burns y pausa en hover/foco.
export default function GallerySlider({ images = [], interval = 5000, label = 'Galería de fotos' }) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(
    () => !(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
  const [hover, setHover] = useState(false);
  const touchX = useRef(null);
  const n = images.length;
  const paused = !auto || hover;

  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);

  useEffect(() => {
    if (paused || n <= 1) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [paused, next, interval, n, index]);

  if (n === 0) return null;
  const current = images[index];

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
      className={`gal${paused ? ' gal-pausado' : ''}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="gal-viewport">
        <div className="gal-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((img, i) => (
            <div className="gal-slide" key={img.src} aria-hidden={i !== index}>
              <img
                key={`${img.src}-${i === index ? index : 'idle'}`}
                src={img.src}
                alt={img.alt}
                className={`gal-img${i === index ? ' kb' : ''}`}
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
        <div className="gal-caption">
          <div>
            <p className="gal-kicker">Galería · El proyecto</p>
            <p className="gal-title">Encuentros, talleres y recorridos en el corredor oriental de Pasto</p>
          </div>
          <span className="gal-tools">
            <span className="gal-count" aria-live="polite">
              {index + 1} / {n}
            </span>
            <button
              type="button"
              className="gal-play"
              onClick={() => setAuto((a) => !a)}
              aria-pressed={!auto}
              aria-label={auto ? 'Pausar galería' : 'Reproducir galería'}
            >
              {auto ? '❚❚' : '▶'}
            </button>
          </span>
        </div>
        {/* Barra de progreso del autoplay (solo cuando avanza) */}
        {!paused && (
          <span className="gal-progress" key={index} style={{ animationDuration: `${interval}ms` }} aria-hidden="true" />
        )}
      </div>

      {n > 1 && (
        <>
          <button type="button" className="gal-arrow prev" onClick={prev} aria-label="Foto anterior">
            ‹
          </button>
          <button type="button" className="gal-arrow next" onClick={next} aria-label="Foto siguiente">
            ›
          </button>
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {current.alt} ({index + 1} de {n})
      </span>
    </div>
  );
}
