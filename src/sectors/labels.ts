import type { Sector } from './sectorDef';

const SECTOR_LABELS = {
  ai: 'AI',
  biotech: 'Biotechnology',
  semiconductors: 'Semiconductors',
  space: 'Space',
  quantum: 'Quantum',
} as const satisfies Record<Sector, string>;

export function getSectorLabel(sector: Sector): string {
  return SECTOR_LABELS[sector];
}
