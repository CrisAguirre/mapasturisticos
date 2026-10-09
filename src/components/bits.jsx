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
  const parts = splitBy === 'chars' ? [...text] : text.split(' ');
  return (
    <Tag ref={ref} className={`split${className ? ` ${className}` : ''}`} aria-label={text}>
      {parts.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`split-part${inView ? ' is-visible' : ''}`}
          style={{ transitionDelay: `${delay + i * stagger}ms` }}
        >
{splitBy === 'chars' ? (p === ' ' ? ' ' : p) : `${p} `}
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
