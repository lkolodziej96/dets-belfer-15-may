import type { Sector } from '@/sectors/sectorDef';

export const SUBSECTORS = {
  ai: [
    'algorithms',
    'computing_power',
    'data',
    'economic_resources',
    'global_player',
    'human_capital',
    'regulatory',
    'accuracy_of_top_models',
  ],
  biotech: [
    'economic_resources',
    'security',
    'human_capital',
    'global_player',
    'regulatory',
    'agricultural_technology',
    'vaccine_research',
    'pharmaceutical_production',
    'genetic_engineering',
  ],
  semiconductors: [
    'chip_design_and_tools',
    'manufacturing',
    'economic_resources',
    'human_capital',
    'equipment',
    'assembly_and_testing_(osat)',
    'global_player',
    'raw_materials_and_wafers',
    'regulatory',
  ],
  space: [
    'domestic_launch_capability',
    'economic_resources',
    'global_player',
    'regulatory',
    'science_and_exploration',
    'pnt',
    'telecommunications',
    'remote_sensing',
    'human_capital',
    'security',
  ],
  quantum: [
    'economic_resources',
    'security',
    'human_capital',
    'global_player',
    'policy_environment',
    'quantum_sensing',
    'quantum_communications',
    'quantum_computing',
  ],
} as const satisfies Record<Sector, string[]>;

export type AISubsectors = (typeof SUBSECTORS.ai)[number];

export type QuantumSubsectors = (typeof SUBSECTORS.quantum)[number];

export type SemiconductorsSubsectors = (typeof SUBSECTORS.semiconductors)[number];

export type BiotechnologySubsectors = (typeof SUBSECTORS.biotech)[number];

export type SpaceSubsectors = (typeof SUBSECTORS.space)[number];

export function getSubsectorList(sector: Sector): string[] {
  return [...SUBSECTORS[sector]];
}
