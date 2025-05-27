import type { Sector } from '@/sectors/sectorDef';

const SECTOR_COLORS = {
  ai: '#5A97DB',
  biotech: '#69B97E',
  semiconductors: '#ED8936',
  space: '#F56565',
  quantum: '#9F7AEA',
} as const satisfies Record<Sector, string>;

export function getSectorColor(sector: Sector): string {
  return SECTOR_COLORS[sector];
}
