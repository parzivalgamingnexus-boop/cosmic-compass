export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: {
    hazardous: number;
    diameter: number;
    distance: number;
    velocity: number;
  };
}

export function calculateRisk(params: {
  isHazardous: boolean;
  diameterMaxKm: number;
  missDistanceKm: number;
  velocityKmH: number;
}): RiskAssessment {
  const { isHazardous, diameterMaxKm, missDistanceKm, velocityKmH } = params;

  const hazardousFactor = isHazardous ? 30 : 0;
  const diameterFactor = Math.min(25, Math.log10(diameterMaxKm * 1000 + 1) * 8);
  const lunarDistance = missDistanceKm / 384400;
  const distanceFactor = Math.max(0, Math.min(25, 25 * (1 - lunarDistance / 100)));
  const velocityFactor = Math.min(20, (velocityKmH / 150000) * 20);

  const score = Math.round(
    Math.min(100, Math.max(0, hazardousFactor + diameterFactor + distanceFactor + velocityFactor))
  );

  let level: RiskLevel;
  if (score >= 75) level = 'critical';
  else if (score >= 50) level = 'high';
  else if (score >= 25) level = 'medium';
  else level = 'low';

  return {
    score,
    level,
    factors: {
      hazardous: Math.round(hazardousFactor),
      diameter: Math.round(diameterFactor),
      distance: Math.round(distanceFactor),
      velocity: Math.round(velocityFactor),
    },
  };
}

export function formatDistance(km: number): string {
  if (km >= 1_000_000) return `${(km / 1_000_000).toFixed(1)}M km`;
  if (km >= 1_000) return `${(km / 1_000).toFixed(0)}K km`;
  return `${km.toFixed(0)} km`;
}

export function formatVelocity(kmh: number): string {
  if (kmh >= 1_000) return `${(kmh / 1_000).toFixed(1)}K km/h`;
  return `${kmh.toFixed(0)} km/h`;
}

export function formatDiameter(minKm: number, maxKm: number): string {
  if (maxKm < 0.01) return `${(minKm * 1000).toFixed(0)}-${(maxKm * 1000).toFixed(0)} m`;
  return `${minKm.toFixed(3)}-${maxKm.toFixed(3)} km`;
}
