import { useEffect, useRef, useState } from 'react';
import {
  useWaterCycle,
  getEvapState,
  getCondState,
  getPrecipState,
  getRunoffState,
  getCompassRotation,
} from '../simulation/useWaterCycle.jsx';
import './CicloConsolidado.css';

// ═══════════════════════════════════════════════════════
// CLON TAL CUAL — Misión 5: Ciclo Consolidado (watercycle)
// Origen: src/app/components/laboratorio/sim5-ciclo-consolidado/
// Se porta 1:1 a React para tener base adelantada en la
// sección 5. Mapa Interactivo. Pendiente refinar a mapa
// turístico del corredor oriental.
// NOTA: audio eliminado (sin lluvia ni pájaros), solo visual.
// ═══════════════════════════════════════════════════════

export default function CicloConsolidado() {
  const { variables: vars, rates, updateVariable } = useWaterCycle();

  const [evaporationParticles, setEvaporationParticles] = useState([]);
  const [rainDropParticles, setRainDropParticles] = useState([]);
  const [runoffParticles, setRunoffParticles] = useState([]);
  const [lightningFlash, setLightningFlash] = useState(false);

  const lastPrecip = useRef(-1);
  const lastEvap = useRef(-1);
  const lastWindDir = useRef('');
  const lightningTimer = useRef(null);
  const lightningEvery = useRef(0);

  // Limpieza del temporizador de rayos al desmontar (sin audio)
  useEffect(() => {
    return () => {
      if (lightningTimer.current) clearInterval(lightningTimer.current);
    };
  }, []);

  // ── Partículas + rayos: clon de ngOnInit subscribe (sin sonido) ──
  useEffect(() => {
    if (
      Math.abs(lastPrecip.current - rates.precipitationRate) > 8 ||
      Math.abs(lastEvap.current - rates.evaporationRate) > 8 ||
      lastWindDir.current !== rates.currentWindDir
    ) {
      lastPrecip.current = rates.precipitationRate;
      lastEvap.current = rates.evaporationRate;
      lastWindDir.current = rates.currentWindDir;

      const evapCount = Math.floor(rates.evaporationRate / 1.5);
      setEvaporationParticles(
        Array(evapCount).fill(0).map(() => ({
          left: 2 + Math.random() * 25 + '%',
          duration: 3 + Math.random() * 4 + 's',
        }))
      );

      const rainCount = Math.floor(rates.precipitationRate * 1.5);
      let baseLeft = 55, rangeLeft = 35;
      if (['W', 'NW', 'SW'].includes(rates.currentWindDir)) {
        baseLeft = 10; rangeLeft = 30;
      } else if (['N', 'S'].includes(rates.currentWindDir)) {
        baseLeft = 40; rangeLeft = 20;
      }
      setRainDropParticles(
        Array(rainCount).fill(0).map(() => ({
          left: baseLeft + Math.random() * rangeLeft + '%',
          duration: 0.5 + Math.random() * 0.4 + 's',
        }))
      );

      const runoffCount = ['E', 'NE', 'SE'].includes(rates.currentWindDir)
        ? Math.floor(rates.precipitationRate / 1.5) : 0;
      setRunoffParticles(
        Array(runoffCount).fill(0).map(() => ({
          duration: 3 + Math.random() * 3 + 's',
        }))
      );
    }

    // Rayos
    const triggerFlash = () => {
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 200);
    };
    if (rates.condensationRate >= 80) {
      const interval = rates.condensationRate >= 90 ? 7000 : 15000;
      if (!lightningTimer.current || lightningEvery.current !== interval) {
        if (lightningTimer.current) clearInterval(lightningTimer.current);
        triggerFlash();
        lightningTimer.current = setInterval(triggerFlash, interval);
        lightningEvery.current = interval;
      }
    } else if (lightningTimer.current) {
      clearInterval(lightningTimer.current);
      lightningTimer.current = null;
      setLightningFlash(false);
    }
  }, [rates]);

  const onVarChange = (e, key) => {
    const value = key === 'windDirection' ? e.target.value : Number(e.target.value);
    updateVariable(key, value);
  };

  const windLower = (vars.windDirection || 'e').toLowerCase();
  const reverseFlow = ['W', 'NW', 'SW'].includes(vars.windDirection || 'E');

  return (
    <div className="sim5-clon">
      <div className="sim-container">
        <div className="sim-main">
          <div className="sim-area relative realistic-bg">
            <div className="sun" style={{ opacity: vars.solarRadiation / 100 + 0.1 }}></div>

            <div className="compass-widget">
              <svg viewBox="0 0 100 100" className="compass-svg">
                <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="rgba(0,0,0,0.5)" />
                <text x="50" y="19" fill="#00ffff" fontSize="13" textAnchor="middle" fontWeight="bold">N</text>
                <text x="86" y="55" fill="#ffffff" fontSize="13" textAnchor="middle" fontWeight="bold">E</text>
                <text x="50" y="91" fill="#ffffff" fontSize="13" textAnchor="middle" fontWeight="bold">S</text>
                <text x="14" y="55" fill="#ffffff" fontSize="13" textAnchor="middle" fontWeight="bold">W</text>
                <g
                  style={{
                    transformOrigin: '50px 50px',
                    transform: `rotate(${getCompassRotation(vars.windDirection)})`,
                    transition: 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1.5)',
                  }}
                >
                  <path d="M50 24 L56 50 L44 50 Z" fill="#ff3333" />
                  <path d="M50 76 L56 50 L44 50 Z" fill="#cccccc" />
                  <circle cx="50" cy="50" r="4" fill="#ffffff" />
                </g>
              </svg>
              <div className="compass-text">{vars.windDirection}</div>
            </div>

            <div className="cycle-indicators">
              <svg viewBox="0 0 300 150" className="flow-svg-container">
                <ellipse cx="150" cy="75" rx="140" ry="60" className={`flow-ring${reverseFlow ? ' reverse-flow' : ''}`} />
              </svg>
            </div>

            <div className={`cloud-cluster cloud-pos-${windLower}`}>
              <div
                className={`cloud-graphics${rates.condensationRate > 50 ? ' heavy-clouds' : ''}${rates.precipitationRate > 50 ? ' storm-clouds' : ''}`}
                style={{
                  opacity: rates.condensationRate / 100 + 0.2,
                  transform: `scale(${rates.condensationRate / 100 + 0.5})`,
                }}
              >
                <div className="real-cloud rcl-1"></div>
                <div className="real-cloud rcl-2"></div>
                <div className="real-cloud rcl-3"></div>
                <div className="real-cloud rcl-4" style={{ opacity: rates.condensationRate > 50 ? (rates.condensationRate - 50) / 50 : 0 }}></div>
                <div className="real-cloud rcl-5" style={{ opacity: rates.condensationRate > 50 ? (rates.condensationRate - 50) / 50 : 0 }}></div>
              </div>
            </div>

            <div className="hud-group">
              <div className="hud-panel">
                <div className="hud-title"><span className="hud-dot bg-purple"></span> Condensación</div>
                <div className="hud-value">{Math.round(rates.condensationRate)}% <span className="hud-sub">| {getCondState(rates.condensationRate)}</span></div>
              </div>
              <div className="hud-panel">
                <div className="hud-title"><span className="hud-dot bg-cyan"></span> Precipitación</div>
                <div className="hud-value">{Math.round(rates.precipitationRate)}% <span className="hud-sub">| {getPrecipState(rates.precipitationRate)}</span></div>
              </div>
            </div>

            <div className="hud-panel hud-evap">
              <div className="hud-title"><span className="hud-dot bg-blue"></span> Evaporación</div>
              <div className="hud-value">{Math.round(rates.evaporationRate)}% <span className="hud-sub">| {getEvapState(rates.evaporationRate)}</span></div>
            </div>

            <div className="hud-panel hud-runoff">
              <div className="hud-title"><span className="hud-dot" style={{ background: '#aaffcc' }}></span> Escorrentía</div>
              <div className="hud-value">{Math.round(rates.runoffRate)}% <span className="hud-sub">| {getRunoffState(rates.runoffRate)}</span></div>
            </div>

            {evaporationParticles.map((p, i) => (
              <div key={`e-${i}`} className="particle evap-vapor" style={{ left: p.left, animationDuration: p.duration }}></div>
            ))}
            {rainDropParticles.map((p, i) => (
              <div key={`r-${i}`} className="particle real-rain" style={{ left: p.left, animationDuration: p.duration }}></div>
            ))}
            {runoffParticles.map((r, i) => (
              <div key={`f-${i}`} className="runoff-stream" style={{ animationDuration: r.duration }}></div>
            ))}

            <div className={`storm-darken${rates.condensationRate >= 90 ? ' darken-heavy' : rates.condensationRate >= 80 ? ' darken-moderate' : ''}`}></div>
            {lightningFlash && <div className="lightning-fullscreen"></div>}
          </div>

          <div className="control-panel glass-panel">
            <h3 className="panel-title">Taller: Realidad y Sistemas</h3>
            <div className="controls-wrapper">
              <div className="slider-group">
                <label>Temperatura (°C): {vars.temperature}</label>
                <input type="range" min="0" max="100" value={vars.temperature} onChange={(e) => onVarChange(e, 'temperature')} className="neon-slider" />
              </div>
              <div className="slider-group">
                <label>Radiación Solar (%): {vars.solarRadiation}</label>
                <input type="range" min="0" max="100" value={vars.solarRadiation} onChange={(e) => onVarChange(e, 'solarRadiation')} className="neon-slider" />
              </div>
              <div className="slider-group">
                <label>Velocidad Viento (km/h): {vars.windSpeed}</label>
                <input type="range" min="1" max="100" value={vars.windSpeed} onChange={(e) => onVarChange(e, 'windSpeed')} className="neon-slider" />
              </div>
              <div className="slider-group mt-2">
                <label>Presión Atmosférica (hPa): {vars.atmosphericPressure}</label>
                <input type="range" min="900" max="1100" value={vars.atmosphericPressure} onChange={(e) => onVarChange(e, 'atmosphericPressure')} className="neon-slider" />
              </div>
              <div className="slider-group">
                <label>Humedad Ambiental (%): {vars.humidity}</label>
                <input type="range" min="0" max="100" value={vars.humidity} onChange={(e) => onVarChange(e, 'humidity')} className="neon-slider" />
              </div>
              <div className="slider-group mt-2">
                <label>Rosa de los Vientos:</label>
                <select value={vars.windDirection} onChange={(e) => onVarChange(e, 'windDirection')} className="glass-select">
                  <option value="N">Norte (Paralelo a costa)</option>
                  <option value="NE">Noreste (Diagonal Montaña)</option>
                  <option value="E">Este (Hacia Montaña)</option>
                  <option value="SE">Sureste (Diagonal Montaña)</option>
                  <option value="S">Sur (Paralelo a costa)</option>
                  <option value="SW">Suroeste (Diagonal Océano)</option>
                  <option value="W">Oeste (Hacia Océano)</option>
                  <option value="NW">Noroeste (Diagonal Océano)</option>
                </select>
              </div>
            </div>

            <div className="monitor-panel">
              <h4 className="text-muted" style={{ marginBottom: '5px' }}>Estación Meteorológica</h4>
              <div className="weather-instruments" style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <div style={{ fontSize: '0.85rem', color: '#fff' }}><strong>Barómetro:</strong> {rates.barometerState}</div>
                <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '5px' }}><strong>T. Punto de Rocío:</strong> {rates.dewPoint} °C</div>
              </div>
              <div className="meter-row">
                <span>Evaporación Atmosférica</span>
                <div className="meter-bar"><div className="fill blue" style={{ width: `${rates.evaporationRate}%` }}></div></div>
              </div>
              <div className="meter-row">
                <span>Saturación de Nubes</span>
                <div className="meter-bar"><div className="fill purple" style={{ width: `${rates.condensationRate}%` }}></div></div>
              </div>
              <div className="meter-row">
                <span>Precipitación</span>
                <div className="meter-bar"><div className="fill cyan" style={{ width: `${rates.precipitationRate}%` }}></div></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
