import type { Sector } from '@/sectors/sectorDef';

const DEFAULT_SECTOR_WEIGHTS = {
  ai: 0.2,
  biotech: 0.2,
  semiconductors: 0.2,
  space: 0.2,
  quantum: 0.2,
} as const satisfies Record<Sector, number>;

export function getDefaultSectorWeight(sector: Sector): number {
  return DEFAULT_SECTOR_WEIGHTS[sector];
}
