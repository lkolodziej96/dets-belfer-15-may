import type { Sector } from '@/sectors/sectorDef';
import {
  getSubsectorList,
  type AISubsectors,
  type BiotechnologySubsectors,
  type QuantumSubsectors,
  type SemiconductorsSubsectors,
  type SpaceSubsectors,
} from '@/subsectors/subsectorsDef';

const AI_DEFAULT_SUBSECTOR_WEIGHTS = {
  algorithms: 0.15,
  computing_power: 0.15,
  data: 0.15,
  economic_resources: 0.2,
  global_player: 0.025,
  human_capital: 0.2,
  regulatory: 0.025,
  accuracy_of_top_models: 0.1,
} as const satisfies Record<AISubsectors, number>;

const QUANTUM_DEFAULT_SUBSECTOR_WEIGHTS = {
  economic_resources: 0.2,
  human_capital: 0.15,
  global_player: 0.05,
  policy_environment: 0.1,
  quantum_communications: 0.15,
  quantum_computing: 0.15,
  quantum_sensing: 0.15,
  security: 0.05,
} as const satisfies Record<QuantumSubsectors, number>;

const SEMICONDUCTORS_DEFAULT_SUBSECTOR_WEIGHTS = {
  chip_design_and_tools: 0.325,
  manufacturing: 0.1,
  economic_resources: 0.2,
  human_capital: 0.2,
  equipment: 0.075,
  'assembly_and_testing_(osat)': 0.025,
  global_player: 0.025,
  raw_materials_and_wafers: 0.025,
  regulatory: 0.025,
} as const satisfies Record<SemiconductorsSubsectors, number>;

const BIOTECH_DEFAULT_SUBSECTOR_WEIGHTS = {
  economic_resources: 0.1,
  security: 0.05,
  human_capital: 0.25,
  global_player: 0.025,
  regulatory: 0.025,
  agricultural_technology: 0.05,
  vaccine_research: 0.15,
  pharmaceutical_production: 0.2,
  genetic_engineering: 0.15,
} as const satisfies Record<BiotechnologySubsectors, number>;

const SPACE_DEFAULT_SUBSECTOR_WEIGHTS = {
  domestic_launch_capability: 0.1,
  economic_resources: 0.15,
  global_player: 0.025,
  human_capital: 0.15,
  pnt: 0.1,
  regulatory: 0.025,
  remote_sensing: 0.1,
  science_and_exploration: 0.1,
  telecommunications: 0.1,
  security: 0.15,
} as const satisfies Record<SpaceSubsectors, number>;

export function getAISectorWeights() {
  return structuredClone(AI_DEFAULT_SUBSECTOR_WEIGHTS);
}

export function getQuantumSectorWeights() {
  return structuredClone(QUANTUM_DEFAULT_SUBSECTOR_WEIGHTS);
}

export function getSemiconductorsSectorWeights() {
  return structuredClone(SEMICONDUCTORS_DEFAULT_SUBSECTOR_WEIGHTS);
}

export function getBiotechSectorWeights() {
  return structuredClone(BIOTECH_DEFAULT_SUBSECTOR_WEIGHTS);
}

export function getSpaceSectorWeights() {
  return structuredClone(SPACE_DEFAULT_SUBSECTOR_WEIGHTS);
}

// export function getSubsectorWeight(sector: Sector, subsector: string): number {
//   switch (sector) {
//     case 'ai':
//       if (getSubsectorList('ai').includes(subsector)) {
//         return getAISectorWeights()[subsector as AISubsectors];
//       }
//       throw new Error(`Invalid AI subsector: ${subsector}`);
//     case 'quantum':
//       if (getSubsectorList('quantum').includes(subsector)) {
//         return getQuantumSubsectorWeight(subsector as QuantumSubsectors);
//       }
//       throw new Error(`Invalid quantum subsector: ${subsector}`);
//     case 'semiconductors':
//       if (getSubsectorList('semiconductors').includes(subsector)) {
//         return getSemiconductorsSubsectorWeight(subsector as SemiconductorsSubsectors);
//       }
//       throw new Error(`Invalid semiconductors subsector: ${subsector}`);
//     case 'biotech':
//       if (getSubsectorList('biotech').includes(subsector)) {
//         return getBiotechSubsectorWeight(subsector as BiotechnologySubsectors);
//       }
//       throw new Error(`Invalid biotech subsector: ${subsector}`);
//     case 'space':
//       if (getSubsectorList('space').includes(subsector)) {
//         return getSpaceSubsectorWeight(subsector as SpaceSubsectors);
//       }
//       throw new Error(`Invalid space subsector: ${subsector}`);
//     default:
//       throw new Error(`Invalid sector: ${sector}`);
//   }
// }
