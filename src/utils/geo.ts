import { SafetyShelter } from '../types';
import { SHELTERS } from '../data/shelters';

// Haversine formula to compute great-circle distance in meters
export function getDistanceMeters(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const R = 6371e3; // Earth radius in meters
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} 公尺`;
  }
  return `${(meters / 1000).toFixed(1)} 公里`;
}

// Estimate walking time assuming 4.8 km/h (approx 80 meters/min)
export function getEstimatedWalkTimeMinutes(meters: number): number {
  return Math.max(1, Math.ceil(meters / 75));
}

// Find closest shelter to a given coordinate
export function findNearestShelter(
  userCoord: [number, number],
  shelters: SafetyShelter[] = SHELTERS
): { shelter: SafetyShelter; distanceMeters: number } {
  let nearest = shelters[0];
  let minDistance = getDistanceMeters(userCoord, shelters[0].coordinates);

  for (let i = 1; i < shelters.length; i++) {
    const dist = getDistanceMeters(userCoord, shelters[i].coordinates);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = shelters[i];
    }
  }

  return { shelter: nearest, distanceMeters: minDistance };
}

// Generate realistic street walking waypoints (simulating street grid turns)
export function generateWalkingRoute(
  start: [number, number],
  dest: [number, number]
): [number, number][] {
  const points: [number, number][] = [start];
  const [lat1, lng1] = start;
  const [lat2, lng2] = dest;

  // Midpoints to simulate Taipei grid turn
  const mid1: [number, number] = [lat1 + (lat2 - lat1) * 0.45, lng1 + (lng2 - lng1) * 0.1];
  const mid2: [number, number] = [lat1 + (lat2 - lat1) * 0.55, lng1 + (lng2 - lng1) * 0.85];

  points.push(mid1, mid2, dest);
  return points;
}
