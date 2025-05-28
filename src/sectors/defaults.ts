import type { Sector } from '@/sectors/sectorDef';

const DEFAULT_SECTOR_WEIGHTS = {
  ai: 0.25,
  biotech: 0.2,
  semiconductors: 0.35,
  space: 0.15,
  quantum: 0.05,
} as const satisfies Record<Sector, number>;

export function getSectorWeights() {
  return structuredClone(DEFAULT_SECTOR_WEIGHTS);
}
