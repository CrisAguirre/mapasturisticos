import { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../config/api.js';
import './BackendStatus.css';

// Visor del estado del backend (GET /api/health): en línea, base de datos y
// latencia. Se refresca solo cada 30 s + botón reintentar.
export default function BackendStatus() {
  const [estado, setEstado] = useState({ fase: 'cargando', db: null, ms: null, hora: null });

  const consultar = useCallback(async () => {
    const t0 = performance.now();
    try {
      const res = await fetch(`${API_URL}/api/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      setEstado({
        fase: d?.db === 'connected' ? 'ok' : 'degradado',
        db: d?.db ?? '?',
        ms: Math.round(performance.now() - t0),
        hora: d?.time ? new Date(d.time).toLocaleTimeString('es-CO') : null,
      });
    } catch {
      setEstado({ fase: 'error', db: null, ms: null, hora: null });
    }
  }, []);

  useEffect(() => {
    const t0 = setTimeout(consultar, 0);
    const t = setInterval(consultar, 30000);
    return () => { clearTimeout(t0); clearInterval(t); };
  }, [consultar]);

  const textos = {
    cargando: 'Conectando con el servidor…',
    ok: `Servidor en línea${estado.ms != null ? ` · ${estado.ms} ms` : ''} · DB ${estado.db}`,
    degradado: `Servidor en línea · DB ${estado.db ?? '?'}`,
    error: 'Servidor sin conexión',
  };

  return (
    <div className={`bk-status ${estado.fase}`} role="status" title={estado.hora ? `Hora del servidor: ${estado.hora}` : undefined}>
      <span className="bk-dot" aria-hidden="true" />
      <span>{textos[estado.fase]}</span>
      {estado.fase === 'error' && (
        <button type="button" className="bk-reintentar" onClick={consultar}>Reintentar</button>
      )}
    </div>
  );
}
