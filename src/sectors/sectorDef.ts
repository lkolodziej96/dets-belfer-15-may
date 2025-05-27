const SECTORS = ['ai', 'biotech', 'semiconductors', 'space', 'quantum'] as const;

export type Sector = (typeof SECTORS)[number];

export function getSectorList(): Sector[] {
  return [...SECTORS];
}
