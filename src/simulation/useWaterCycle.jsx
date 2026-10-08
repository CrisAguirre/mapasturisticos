import { useEffect, useRef, useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════
// Clon tal cual del SimulationService de watercycle
// (src/app/services/simulation.service.ts)
// Motor "Life Engine" — Dinámica de Sistemas cada 500ms
// Basado en: Clausius-Clapeyron, Magnus (rocío), Penman
// ═══════════════════════════════════════════════════════

const INITIAL_VARS = {
  temperature: 25,
  solarRadiation: 50,
  windSpeed: 20,
  windDirection: 'E',
  atmosphericPressure: 1013,
  humidity: 50,
};

const INITIAL_RATES = {
  evaporationRate: 0,
  condensationRate: 0,
  precipitationRate: 0,
  runoffRate: 0,
  currentWindDir: 'E',
  dewPoint: 0,
  barometerState: 'Estable',
};

export function getEvapState(rate) {
  if (rate <= 5) return 'Mínima / Estancada';
  if (rate < 40) return 'Leve (Mar estable)';
  if (rate < 75) return 'Moderada (En ascenso)';
  return 'Altamente Acelerada';
}

export function getCondState(rate) {
  if (rate <= 5) return 'Despejado / Nula';
  if (rate < 40) return 'Parcial / Ligera';
  if (rate < 75) return 'Densa (Nubarrones)';
  return 'Saturación Crítica';
}

export function getPrecipState(rate) {
  if (rate === 0) return 'Seco (Ausente)';
  if (rate < 30) return 'Llovizna / Rocío';
  if (rate < 60) return 'Lluvia Moderada';
  return 'Precipitación Torrencial';
}

export function getRunoffState(rRate) {
  if (rRate <= 0) return 'Cauces Secos';
  if (rRate < 15) return 'Infiltración Subterránea';
  if (rRate < 40) return 'Flujo de Ríos Moderado';
  if (rRate < 70) return 'Corriente Terrestre Alta';
  return 'Desbordamiento e Inundación';
}

export function getCompassRotation(dir) {
  const angleMap = {
    N: '0deg', NE: '45deg', E: '90deg', SE: '135deg',
    S: '180deg', SW: '225deg', W: '270deg', NW: '315deg',
  };
  return angleMap[dir || 'N'] || '0deg';
}

export function useWaterCycle() {
  const [variables, setVariables] = useState({ ...INITIAL_VARS });
  const [rates, setRates] = useState({ ...INITIAL_RATES });

  const varsRef = useRef({ ...INITIAL_VARS });
  const stockCloudMass = useRef(0);
  const stockRunoff = useRef(0);
  const stockAtmosphericVapor = useRef(0);

  const processSystemDynamicsTick = useCallback(() => {
    const vars = varsRef.current;

    // ── 0. PUNTO DE ROCÍO (Magnus) ──
    const a = 17.27, b = 237.7;
    const humidityClamp = Math.max(1, vars.humidity);
    const alpha = (a * vars.temperature) / (b + vars.temperature) + Math.log(humidityClamp / 100);
    const dewPoint = (b * alpha) / (a - alpha);

    // ── 1. EVAPORACIÓN (Clausius-Clapeyron simplificado) ──
    const tempFactor = Math.max(0, Math.exp(0.0627 * (vars.temperature - 20)) - 0.3);
    const solarFactor = vars.solarRadiation / 100;
    const windFactor = Math.sqrt(vars.windSpeed) / Math.sqrt(100);
    const humidityBlock = Math.pow(1 - vars.humidity / 100, 1.5);
    const pressureFactor = 1 + (1013 - vars.atmosphericPressure) * 0.001;

    let evapRate = (tempFactor * 35 + solarFactor * 30 + windFactor * 20)
      * humidityBlock
      * pressureFactor;

    if (vars.temperature < 2) {
      evapRate *= vars.temperature < 0 ? 0.05 : (vars.temperature / 2) * 0.3;
    }
    evapRate = Math.max(0, Math.min(100, evapRate));
    const vaporInjectionPerTick = evapRate * 0.06;

    // ── 2. CONDENSACIÓN (rocío + orografía) ──
    stockAtmosphericVapor.current += vaporInjectionPerTick;
    stockAtmosphericVapor.current = Math.min(100, stockAtmosphericVapor.current);

    const deltaDewPoint = vars.temperature - dewPoint;
    let condensationEfficiency = 0;
    if (deltaDewPoint <= 2) {
      condensationEfficiency = 1.0;
    } else if (deltaDewPoint <= 5) {
      condensationEfficiency = 1 - (deltaDewPoint - 2) / 3 * 0.5;
    } else if (deltaDewPoint <= 10) {
      condensationEfficiency = 0.5 - (deltaDewPoint - 5) / 5 * 0.4;
    } else if (deltaDewPoint <= 20) {
      condensationEfficiency = 0.1 - (deltaDewPoint - 10) / 10 * 0.1;
    } else {
      condensationEfficiency = 0;
    }

    const windTowardsOcean = ['W', 'NW', 'SW'];
    const windParallel = ['N', 'S'];
    let orographicMult = 1.0;
    if (windTowardsOcean.includes(vars.windDirection)) {
      orographicMult = 0.3;
    } else if (windParallel.includes(vars.windDirection)) {
      orographicMult = 0.6;
    } else {
      orographicMult = 1.5;
    }

    const windCondBoost = 1 + Math.min(vars.windSpeed / 100, 1) * 0.5;
    const condensationFlow = stockAtmosphericVapor.current * condensationEfficiency
      * orographicMult * windCondBoost * 0.08;

    stockAtmosphericVapor.current -= condensationFlow * 0.6;
    stockAtmosphericVapor.current = Math.max(0, stockAtmosphericVapor.current);

    let dissipation = 0;
    if (vars.atmosphericPressure > 1015) {
      dissipation += (vars.atmosphericPressure - 1015) * 0.003;
    }
    if (vars.temperature > 35 && vars.humidity < 40) {
      dissipation += (vars.temperature - 35) * 0.005;
    }

    stockCloudMass.current += condensationFlow;
    stockCloudMass.current -= dissipation;

    // ── 3. PRECIPITACIÓN (umbral 65%, curva cuadrática) ──
    let rainFlowTick = 0;
    const precipitationThreshold = 65;

    if (stockCloudMass.current > precipitationThreshold) {
      const excess = stockCloudMass.current - precipitationThreshold;
      const maxExcess = 100 - precipitationThreshold;
      const normalizedExcess = excess / maxExcess;
      rainFlowTick = Math.pow(normalizedExcess, 1.8) * 5;

      if (vars.atmosphericPressure < 1005) {
        const stormBoost = 1 + (1005 - vars.atmosphericPressure) * 0.008;
        rainFlowTick *= stormBoost;
      }
      if (vars.atmosphericPressure > 1025) {
        const antiBoost = 1 - Math.min((vars.atmosphericPressure - 1025) * 0.006, 0.7);
        rainFlowTick *= antiBoost;
      }
      rainFlowTick *= 1 + vars.windSpeed * 0.003;
    }

    // ── 4. STOCKS ──
    stockCloudMass.current -= rainFlowTick;
    stockCloudMass.current = Math.max(0, Math.min(100, stockCloudMass.current));

    // ── 5. ESCORRENTÍA CON INERCIA ──
    let terrainRainContribution = 0;
    if (['E', 'NE', 'SE'].includes(vars.windDirection)) {
      terrainRainContribution = rainFlowTick * 1.0;
    } else if (['N', 'S'].includes(vars.windDirection)) {
      terrainRainContribution = rainFlowTick * 0.4;
    } else {
      terrainRainContribution = rainFlowTick * 0.1;
    }

    const soilAbsorption = 0.3;
    const surfaceContribution = terrainRainContribution * (1 - soilAbsorption);

    stockRunoff.current += surfaceContribution * 1.5;
    const drainRate = 0.15;
    stockRunoff.current -= stockRunoff.current * drainRate;
    stockRunoff.current = Math.max(0, Math.min(100, stockRunoff.current));

    // ── 6. DISPLAY ──
    let baroState = 'Estable / Tránsito';
    if (vars.atmosphericPressure < 985) baroState = 'Borrasca Severa (Ciclón)';
    else if (vars.atmosphericPressure < 1000) baroState = 'Borrasca / Tormenta (Baja Presión)';
    else if (vars.atmosphericPressure < 1010) baroState = 'Ligeramente Inestable';
    else if (vars.atmosphericPressure > 1035) baroState = 'Anticiclón Fuerte (Muy Despejado)';
    else if (vars.atmosphericPressure > 1020) baroState = 'Anticiclón / Cielos Despejados';

    const uiRainDisplay = Math.min(100, Math.round(rainFlowTick * 18));

    setRates({
      evaporationRate: Math.round(evapRate),
      condensationRate: Math.round(stockCloudMass.current),
      precipitationRate: uiRainDisplay,
      runoffRate: Math.round(stockRunoff.current),
      currentWindDir: vars.windDirection,
      dewPoint: Math.round(dewPoint * 10) / 10,
      barometerState: baroState,
    });
  }, []);

  useEffect(() => {
    const id = setInterval(processSystemDynamicsTick, 500);
    return () => clearInterval(id);
  }, [processSystemDynamicsTick]);

  const updateVariable = useCallback((key, value) => {
    varsRef.current = { ...varsRef.current, [key]: value };
    setVariables({ ...varsRef.current });
  }, []);

  return { variables, rates, updateVariable };
}
