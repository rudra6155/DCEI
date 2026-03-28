/**
 * DCEI Scoring Engine
 * Implements WSI, CII, CPI, TLI composite index
 */

import { getRiskCategory, getRiskColor } from '../utils/helpers.js'

export const DEFAULT_WEIGHTS = { w1: 0.35, w2: 0.25, w3: 0.20, w4: 0.20 }

export const WEIGHT_SCENARIOS = [
  {
    name: 'default',
    label: 'Balanced (Default)',
    weights: { w1: 0.35, w2: 0.25, w3: 0.20, w4: 0.20 },
  },
  {
    name: 'water-first',
    label: 'Water-First',
    weights: { w1: 0.55, w2: 0.20, w3: 0.15, w4: 0.10 },
  },
  {
    name: 'carbon-first',
    label: 'Carbon-First',
    weights: { w1: 0.20, w2: 0.50, w3: 0.15, w4: 0.15 },
  },
  {
    name: 'community-first',
    label: 'Community-First',
    weights: { w1: 0.20, w2: 0.20, w3: 0.40, w4: 0.20 },
  },
  {
    name: 'thermal-first',
    label: 'Thermal-First',
    weights: { w1: 0.15, w2: 0.20, w3: 0.15, w4: 0.50 },
  },
]

export function normalizeWeights(w) {
  const sum = (w.w1 || 0) + (w.w2 || 0) + (w.w3 || 0) + (w.w4 || 0)
  if (sum === 0) return { w1: 0.25, w2: 0.25, w3: 0.25, w4: 0.25 }
  return {
    w1: w.w1 / sum,
    w2: w.w2 / sum,
    w3: w.w3 / sum,
    w4: w.w4 / sum,
  }
}

function clamp(v, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, v))
}

function getMinMax(arr) {
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  return { min, max }
}

function minMaxNorm(value, min, max) {
  if (max === min) return 0
  return clamp(((value - min) / (max - min)) * 100)
}

function logMinMaxNorm(value, min, max) {
  // Log normalization: log(x+1) then min-max
  const logVal = Math.log(value + 1)
  const logMin = Math.log(min + 1)
  const logMax = Math.log(max + 1)
  if (logMax === logMin) return 0
  return clamp(((logVal - logMin) / (logMax - logMin)) * 100)
}

export function scoreAllCities(cities, weights) {
  const nw = normalizeWeights(weights)

  // --- Extract raw field arrays for global min/max ---
  const gwScores = cities.map(c => c.gw_score)
  const perCapitaWater = cities.map(c => c.per_capita_water_lpd)
  const rainfallCv = cities.map(c => c.rainfall_cv)
  const competingDemand = cities.map(c => c.competing_demand)

  const gridEf = cities.map(c => c.grid_emission_factor)
  const renewablePct = cities.map(c => c.renewable_pct)
  // For CII renewable: we want (100 - renewable_pct) to penalize low renewable
  const renewableInverse = cities.map(c => 100 - c.renewable_pct)
  const gridReliability = cities.map(c => c.grid_reliability)

  const popDensity = cities.map(c => c.population_density)
  const dcCount = cities.map(c => c.dc_count)
  const noiseScore = cities.map(c => c.noise_score)
  const utilityPressure = cities.map(c => c.utility_pressure)

  const wetBulbTemp = cities.map(c => c.wet_bulb_temp_c)
  const coolingDD = cities.map(c => c.cooling_degree_days)
  const relHumidity = cities.map(c => c.relative_humidity_pct)
  const heatIsland = cities.map(c => c.heat_island_score)

  // Compute min/max
  const mmGw = getMinMax(gwScores)
  const mmWater = getMinMax(perCapitaWater)
  const mmRainCv = getMinMax(rainfallCv)
  const mmCompDem = getMinMax(competingDemand)

  const mmGridEf = getMinMax(gridEf)
  const mmRenewInv = getMinMax(renewableInverse)
  const mmGridRel = getMinMax(gridReliability)

  const mmPopDen = getMinMax(popDensity)
  const mmDcCount = getMinMax(dcCount)
  const mmNoise = getMinMax(noiseScore)
  const mmUtility = getMinMax(utilityPressure)

  const mmWetBulb = getMinMax(wetBulbTemp)
  const mmCoolDD = getMinMax(coolingDD)
  const mmHumidity = getMinMax(relHumidity)
  const mmHeatIsland = getMinMax(heatIsland)

  const scored = cities.map(c => {
    // === WSI: Water Stress Index ===
    // gw_score: direct risk (higher = worse) → already 0-100 scale
    const gwNorm = minMaxNorm(c.gw_score, mmGw.min, mmGw.max)
    // per_capita_water_lpd: higher = more water available = LOWER stress → inverse
    const waterNorm = 100 - minMaxNorm(c.per_capita_water_lpd, mmWater.min, mmWater.max)
    // rainfall_cv: higher variability = higher risk
    const rainCvNorm = minMaxNorm(c.rainfall_cv, mmRainCv.min, mmRainCv.max)
    // competing_demand: higher = worse
    const compDemNorm = minMaxNorm(c.competing_demand, mmCompDem.min, mmCompDem.max)

    const WSI = clamp(
      0.40 * gwNorm +
      0.25 * waterNorm +
      0.20 * rainCvNorm +
      0.15 * compDemNorm
    )

    // === CII: Carbon Intensity Index ===
    // grid_emission_factor: higher = worse
    const gridEfNorm = minMaxNorm(c.grid_emission_factor, mmGridEf.min, mmGridEf.max)
    // renewable_pct: higher renewable = LOWER carbon → penalize low renewable using (100 - renewable_pct)
    const renewInvNorm = minMaxNorm(100 - c.renewable_pct, mmRenewInv.min, mmRenewInv.max)
    // grid_reliability (population density used as proxy) → normalize, higher = worse (congested grids)
    const gridRelNorm = minMaxNorm(c.grid_reliability, mmGridRel.min, mmGridRel.max)

    const CII = clamp(
      0.50 * gridEfNorm +
      0.30 * renewInvNorm +
      0.20 * gridRelNorm
    )

    // === CPI: Community Pressure Index ===
    // population_density: log normalization (highly skewed)
    const popDenNorm = logMinMaxNorm(c.population_density, mmPopDen.min, mmPopDen.max)
    // dc_count: higher = more existing infrastructure pressure
    const dcCountNorm = minMaxNorm(c.dc_count, mmDcCount.min, mmDcCount.max)
    // noise_score: higher = worse
    const noiseNorm = minMaxNorm(c.noise_score, mmNoise.min, mmNoise.max)
    // utility_pressure: higher = worse
    const utilNorm = minMaxNorm(c.utility_pressure, mmUtility.min, mmUtility.max)

    const CPI = clamp(
      0.35 * popDenNorm +
      0.25 * dcCountNorm +
      0.20 * noiseNorm +
      0.20 * utilNorm
    )

    // === TLI: Thermal Load Index ===
    // wet_bulb_temp_c: higher = harder cooling
    const wetBulbNorm = minMaxNorm(c.wet_bulb_temp_c, mmWetBulb.min, mmWetBulb.max)
    // cooling_degree_days: higher = worse
    const coolDDNorm = minMaxNorm(c.cooling_degree_days, mmCoolDD.min, mmCoolDD.max)
    // relative_humidity_pct: higher = worse for cooling
    const humidNorm = minMaxNorm(c.relative_humidity_pct, mmHumidity.min, mmHumidity.max)
    // heat_island_score: higher = worse
    const heatIslandNorm = minMaxNorm(c.heat_island_score, mmHeatIsland.min, mmHeatIsland.max)

    const TLI = clamp(
      0.40 * wetBulbNorm +
      0.30 * coolDDNorm +
      0.20 * humidNorm +
      0.10 * heatIslandNorm
    )

    // === DCEI Composite ===
    const DCEI_score = clamp(
      nw.w1 * WSI +
      nw.w2 * CII +
      nw.w3 * CPI +
      nw.w4 * TLI
    )

    const risk_category = getRiskCategory(DCEI_score)
    const risk_color = getRiskColor(DCEI_score)

    return {
      ...c,
      WSI: Math.round(WSI * 10) / 10,
      CII: Math.round(CII * 10) / 10,
      CPI: Math.round(CPI * 10) / 10,
      TLI: Math.round(TLI * 10) / 10,
      DCEI_score: Math.round(DCEI_score * 10) / 10,
      risk_category,
      risk_color,
    }
  })

  return scored.sort((a, b) => b.DCEI_score - a.DCEI_score)
}
