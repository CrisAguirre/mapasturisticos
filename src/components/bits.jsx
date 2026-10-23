import { useEffect, useRef, useState } from 'react';
import './bits.css';

// Efectos visuales estilo React Bits, sin dependencias externas.
// Reveal: aparece al hacer scroll. SplitText: revela por palabras/letras.
// Spotlight: brillo que sigue el mouse.

// Observa una sola vez si el elemento entra en pantalla
export function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export function SplitText({
  text,
  as: Tag = 'h2',
  className = '',
  splitBy = 'words', // 'words' | 'chars'
  stagger = 26,
  delay = 0,
}) {
  const [ref, inView] = useInView(0.3);
  const visibleClass = inView ? ' is-visible' : '';
  const words = text.split(' ');

  // En modo letras, cada palabra va dentro de un inline-block.
  // Así se anima letra por letra sin que el navegador parta palabras al
  // cambiar de línea en pantallas estrechas.
  if (splitBy === 'chars') {
    let charIndex = 0;
    return (
      <Tag ref={ref} className={`split${className ? ` ${className}` : ''}`} aria-label={text}>
        {words.map((word, wi) => (
          <span key={`${wi}-${word}`} aria-hidden="true">
            <span className="split-word">
              {[...word].map((c) => {
                const i = charIndex++;
                return (
                  <span
                    key={i}
                    className={`split-part${visibleClass}`}
                    style={{ transitionDelay: `${delay + i * stagger}ms` }}
                  >
                    {c}
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={`split${className ? ` ${className}` : ''}`} aria-label={text}>
      {words.map((p, i) => (
        <span key={i} aria-hidden="true">
          <span
            className={`split-part${visibleClass}`}
            style={{ transitionDelay: `${delay + i * stagger}ms` }}
          >
            {p}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

export function Spotlight({ children, className = '' }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
