import { useCallback, useEffect, useRef, useState } from 'react';
import bannerImg from '../assets/banner.jpg';
import './BannerCarousel.css';

// Carrusel del home: 1 banner real + 6 placeholders (uno por menú).
// Cuando subas las imágenes, reemplaza cada entrada `placeholder`
// por `{ type: 'image', src: tuImagen, alt: '...', link: '#/seccion' }`.
const SLIDES = [
  {
    key: 'portada',
    type: 'image',
    src: bannerImg,
    alt: 'Caminos de Fogón y Palabra — Saberes, historias y tradición',
    link: null,
  },
  { key: 'proyecto', type: 'placeholder', label: 'El Proyecto', link: '#/proyecto', gradient: 'linear-gradient(135deg, #0b3d2e, #146642)' },
  { key: 'mujeres', type: 'placeholder', label: 'Mujeres que guían el territorio', link: '#/mujeres', gradient: 'linear-gradient(135deg, #5b21b6, #b45309)' },
  { key: 'mapa', type: 'placeholder', label: 'Mapa Turístico', link: '#/mapa', gradient: 'linear-gradient(135deg, #0c4a6e, #0891b2)' },
  { key: 'experiencias', type: 'placeholder', label: 'Experiencias', link: '#/experiencias', gradient: 'linear-gradient(135deg, #7c2d12, #ea580c)' },
  { key: 'voces', type: 'placeholder', label: 'Voces del Fogón', link: '#/voces', gradient: 'linear-gradient(135deg, #3b0764, #a21caf)' },
  { key: 'contacto', type: 'placeholder', label: 'Contacto / reserva', link: '#/contacto', gradient: 'linear-gradient(135deg, #064e3b, #16a34a)' },
];

const AUTOPLAY_MS = 6000;

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  const goTo = useCallback((i) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, next]);

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
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {SLIDES.map((s) =>
          s.type === 'image' ? (
            <div className="slide" key={s.key}>
              <img src={s.src} alt={s.alt} className="slide-img" draggable={false} />
            </div>
          ) : (
            <a className="slide" key={s.key} href={s.link} aria-label={`Ir a ${s.label}`}>
              <div className="slide-placeholder" style={{ background: s.gradient }}>
                <span className="ph-kicker">Espacio reservado · sube tu banner</span>
                <span className="ph-label">{s.label}</span>
                <span className="ph-cta">Explorar →</span>
              </div>
            </a>
          )
        )}
      </div>
      <button type="button" className="carousel-arrow prev" onClick={prev} aria-label="Banner anterior">‹</button>
      <button type="button" className="carousel-arrow next" onClick={next} aria-label="Banner siguiente">›</button>
      <div className="carousel-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className={`dot${i === index ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Ir al banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
