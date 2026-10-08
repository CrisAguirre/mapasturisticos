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
// ═══════════════════════════════════════════════════════

const BIRDS_URL = `${import.meta.env.BASE_URL}assets/birds.mp3`;

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

  // ── Audio refs (clon del TS original) ──
  const audioCtx = useRef(null);
  const rainGainLight = useRef(null);
  const rainGainHeavy = useRef(null);
  const rainNoiseLight = useRef(null);
  const rainNoiseHeavy = useRef(null);
  const audioInitialized = useRef(false);
  const birdAudio = useRef(null);
  const birdsActive = useRef(false);
  const userHasInteracted = useRef(false);

  useEffect(() => {
    birdAudio.current = new Audio(BIRDS_URL);
    birdAudio.current.loop = true;
    birdAudio.current.volume = 0.15;

    const onInteract = () => {
      userHasInteracted.current = true;
      if (audioCtx.current && audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }
    };
    document.addEventListener('click', onInteract);
    document.addEventListener('touchstart', onInteract);
    document.addEventListener('keydown', onInteract);

    return () => {
      document.removeEventListener('click', onInteract);
      document.removeEventListener('touchstart', onInteract);
      document.removeEventListener('keydown', onInteract);
      try { rainNoiseLight.current?.stop(); } catch { /* noop */ }
      try { rainNoiseHeavy.current?.stop(); } catch { /* noop */ }
      try { birdAudio.current?.pause(); } catch { /* noop */ }
      if (audioCtx.current) audioCtx.current.close().catch(() => {});
      if (lightningTimer.current) clearInterval(lightningTimer.current);
    };
  }, []);

  function ensureAudioCtx() {
    if (!audioCtx.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx.current = new AC();
    }
    return audioCtx.current;
  }

  function initAudio() {
    if (audioInitialized.current) return;
    const ctx = ensureAudioCtx();
    const bufferSize = ctx.sampleRate * 2;

    const lightBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const lightData = lightBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) lightData[i] = (Math.random() * 2 - 1) * 0.3;

    const heavyBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const heavyData = heavyBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) heavyData[i] = (Math.random() * 2 - 1) * 0.6;

    rainNoiseLight.current = ctx.createBufferSource();
    rainNoiseLight.current.buffer = lightBuffer;
    rainNoiseLight.current.loop = true;
    const filterLight = ctx.createBiquadFilter();
    filterLight.type = 'bandpass';
    filterLight.frequency.value = 3000;
    filterLight.Q.value = 0.5;
    rainGainLight.current = ctx.createGain();
    rainGainLight.current.gain.value = 0;
    rainNoiseLight.current.connect(filterLight);
    filterLight.connect(rainGainLight.current);
    rainGainLight.current.connect(ctx.destination);
    rainNoiseLight.current.start();

    rainNoiseHeavy.current = ctx.createBufferSource();
    rainNoiseHeavy.current.buffer = heavyBuffer;
    rainNoiseHeavy.current.loop = true;
    const filterHeavy = ctx.createBiquadFilter();
    filterHeavy.type = 'lowpass';
    filterHeavy.frequency.value = 1500;
    filterHeavy.Q.value = 0.3;
    rainGainHeavy.current = ctx.createGain();
    rainGainHeavy.current.gain.value = 0;
    rainNoiseHeavy.current.connect(filterHeavy);
    filterHeavy.connect(rainGainHeavy.current);
    rainGainHeavy.current.connect(ctx.destination);
    rainNoiseHeavy.current.start();

    audioInitialized.current = true;
  }

  function updateRainSound(precipitationRate) {
    if (precipitationRate > 0 && !audioInitialized.current) initAudio();
    if (!audioCtx.current || !rainGainLight.current || !rainGainHeavy.current) return;
    const now = audioCtx.current.currentTime;
    const fadeTime = 0.5;
    if (precipitationRate <= 0) {
      rainGainLight.current.gain.linearRampToValueAtTime(0, now + fadeTime);
      rainGainHeavy.current.gain.linearRampToValueAtTime(0, now + fadeTime);
    } else if (precipitationRate <= 50) {
      const vol = (precipitationRate / 50) * 0.35;
      rainGainLight.current.gain.linearRampToValueAtTime(vol, now + fadeTime);
      rainGainHeavy.current.gain.linearRampToValueAtTime(0, now + fadeTime);
    } else {
      const heavyVol = ((precipitationRate - 50) / 50) * 0.6;
      rainGainLight.current.gain.linearRampToValueAtTime(0.2, now + fadeTime);
      rainGainHeavy.current.gain.linearRampToValueAtTime(heavyVol, now + fadeTime);
    }
  }

  function updateBirdSound(precipitationRate, condensationRate) {
    const shouldSing = precipitationRate <= 0 && condensationRate < 30;
    if (shouldSing && !birdsActive.current) {
      if (!userHasInteracted.current) return;
      birdAudio.current.play().catch(() => {});
      birdsActive.current = true;
    } else if (!shouldSing && birdsActive.current) {
      birdAudio.current.pause();
      birdsActive.current = false;
    }
  }

  // ── Partículas + rayos + sonido: clon de ngOnInit subscribe ──
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

    updateRainSound(rates.precipitationRate);
    updateBirdSound(rates.precipitationRate, rates.condensationRate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates]);

  const onVarChange = (e, key) => {
    const value = key === 'windDirection' ? e.target.value : Number(e.target.value);
    updateVariable(key, value);
  };

  const windLower = (vars.windDirection || 'e').toLowerCase();
  const reverseFlow = ['W', 'NW', 'SW'].includes(vars.windDirection || 'E');

  return (
    <div className="sim5-clon">
      <div className="sim5-header glass-panel">
        <span className="sim5-kicker">Misión 5 · Lineamiento 5: Sistemicidad · Bloque: agua — CLON BASE SIN REFINAR</span>
        <h3>Ciclo del Agua Consolidado</h3>
        <p>Simulación sistémica completa que integra evaporación, condensación, precipitación y escorrentía en un solo modelo dinámico.</p>
      </div>

      <div className="activity-content">
        <h2>📋 Actividad: Análisis Sistémico del Ciclo</h2>
        <p>Observa el ciclo del agua no como procesos aislados, sino como un <strong>sistema interconectado</strong> donde cada variable afecta el equilibrio global.</p>
        <div className="activity-steps">
          <div className="step"><span className="step-num">1</span><p><strong>Evaporación:</strong> Sube la radiación y temperatura. Observa cómo las partículas de vapor ascienden desde el océano hacia la atmósfera.</p></div>
          <div className="step"><span className="step-num">2</span><p><strong>Transporte:</strong> Usa la brújula para dirigir el viento hacia la montaña (Este). Observa el movimiento de las nubes.</p></div>
          <div className="step"><span className="step-num">3</span><p><strong>Precipitación:</strong> Deja que las nubes se carguen (Condensación &gt; 80%). Observa cómo la lluvia descarga el agua sobre el continente.</p></div>
          <div className="step"><span className="step-num">4</span><p><strong>Retorno:</strong> Observa la escorrentía fluyendo por los ríos de regreso al mar, cerrando el ciclo perpetuo.</p></div>
        </div>
      </div>

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

        <footer className="educational-guide">
          <div className="guide-content glass-panel">
            <h2 className="text-neon-blue">Manual de Operación Meteorológica: Entorno Virtual de Aprendizaje EVA</h2>
            <section>
              <h3 className="text-neon-purple mt-4">1. La Vista Geográfica: Perspectiva Aérea Isométrica</h3>
              <p>El simulador utiliza una <strong>cámara de drone en ángulo de 45°</strong> (proyección isométrica) para ofrecer una comprensión espacial completa.</p>
              <ul>
                <li><strong>Oeste (Izquierda):</strong> Ubicación del océano. Es la zona donde se origina la evaporación.</li>
                <li><strong>Este (Derecha):</strong> Cordillera montañosa. Actúa como barrera física (orográfica).</li>
                <li><strong>Profundidad:</strong> Los elementos al <em>Norte</em> se ven más alejados y pequeños, al <em>Sur</em> en primer plano.</li>
              </ul>
            </section>
            <section>
              <h3 className="text-neon-purple mt-4">2. Funcionamiento de los Selectores (Variables de Entrada)</h3>
              <ul>
                <li><strong>Temperatura (°C):</strong> Aumenta la energía para la evaporación.</li>
                <li><strong>Radiación Solar (%):</strong> Potencia con la que el sol calienta el agua oceánica.</li>
                <li><strong>Velocidad del Viento (km/h):</strong> Acelera transporte de humedad y evaporación.</li>
                <li><strong>Presión Atmosférica (hPa):</strong> Baja presión facilita nubes y lluvia; alta presión despeja.</li>
                <li><strong>Humedad Ambiental (%):</strong> Si es muy alta, bloquea la evaporación.</li>
                <li><strong>Brújula:</strong> Vientos hacia el Este (Montaña) generan más lluvia terrestre.</li>
              </ul>
            </section>
            <section>
              <h3 className="text-neon-purple mt-4">3. Interpretación de Estados y Porcentajes (HUDs)</h3>
              <ul>
                <li><strong>Evaporación:</strong> Qué tan rápido asciende el agua del mar.</li>
                <li><strong>Condensación:</strong> Acumulador. Más de 50% nubes densas y grises.</li>
                <li><strong>Precipitación:</strong> Al llover vacía la nube.</li>
                <li><strong>Escorrentía:</strong> Agua corriendo por los ríos hacia el mar.</li>
              </ul>
            </section>
            <section>
              <h3 className="text-neon-purple mt-4">4. Guía de Efectos Visuales</h3>
              <ul>
                <li><strong>Anillo Elíptico de Flujo:</strong> Fluye según el viento.</li>
                <li><strong>Burbujas Ascendentes:</strong> Tasa de evaporación en el océano.</li>
                <li><strong>Cortina de Lluvia:</strong> Densidad según precipitación.</li>
                <li><strong>Nubes Dinámicas:</strong> Opacidad y tamaño proporcionales a condensación.</li>
                <li><strong>Brújula Interactiva:</strong> La aguja roja indica el desplazamiento de nubes.</li>
              </ul>
            </section>
            <section>
              <h3 className="text-neon-purple mt-4">5. Dinámica de Sistemas: El Ciclo Autónomo</h3>
              <p>Si dejas de mover los controles, el simulador seguirá funcionando como un verdadero <strong>ecosistema vivo y autorregulado</strong>.</p>
            </section>
          </div>
        </footer>
      </div>
    </div>
  );
}
