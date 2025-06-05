import type { Sector } from '@/sectors/sectorDef';
import {
  getSubsectorList,
  type AISubsectors,
  type BiotechnologySubsectors,
  type QuantumSubsectors,
  type SemiconductorsSubsectors,
  type SpaceSubsectors,
} from '@/subsectors/subsectorsDef';

const AI_SUBSECTOR_LABELS = {
  algorithms: 'Algorithms',
  computing_power: 'Computing Power',
  data: 'Data',
  economic_resources: 'Economic Resources',
  global_player: 'Global Player',
  human_capital: 'Human Capital',
  regulatory: 'Regulatory',
  accuracy_of_top_models: 'Accuracy of Top Models',
} as const satisfies Record<AISubsectors, string>;

const QUANTUM_SUBSECTOR_LABELS = {
  economic_resources: 'Economic Resources',
  security: 'Security',
  human_capital: 'Human Capital',
  global_player: 'Global Player',
  policy_environment: 'Policy Environment',
  quantum_sensing: 'Quantum Sensing',
  quantum_communications: 'Quantum Communications',
  quantum_computing: 'Quantum Computing',
} as const satisfies Record<QuantumSubsectors, string>;

const SEMICONDUCTORS_SUBSECTOR_LABELS = {
  chip_design_and_tools: 'Chip Design and Tools',
  manufacturing: 'Manufacturing and Fabrication',
  economic_resources: 'Economic Resources',
  human_capital: 'Human Capital',
  equipment: 'Equipment',
  'assembly_and_testing_(osat)': 'Assembly and Testing',
  global_player: 'Global Player',
  raw_materials_and_wafers: 'Specialized Materials and Wafers',
  regulatory: 'Regulatory',
} as const satisfies Record<SemiconductorsSubsectors, string>;

const BIOTECH_SUBSECTOR_LABELS = {
  economic_resources: 'Economic Resources',
  security: 'Security',
  human_capital: 'Human Capital',
  global_player: 'Global Player',
  regulatory: 'Regulatory',
  agricultural_technology: 'Agricultural Technology',
  vaccine_research: 'Vaccine Research',
  pharmaceutical_production: 'Pharmaceutical Production',
  genetic_engineering: 'Genetic Engineering',
} as const satisfies Record<BiotechnologySubsectors, string>;

const SPACE_SUBSECTOR_LABELS = {
  domestic_launch_capability: 'Domestic Launch Capability',
  economic_resources: 'Economic Resources',
  global_player: 'Global Player',
  regulatory: 'Regulatory',
  science_and_exploration: 'Science and Exploration',
  pnt: 'Position, Navigation, and Timing',
  telecommunications: 'Telecommunications',
  remote_sensing: 'Remote Sensing',
  human_capital: 'Human Capital',
  security: 'Security',
} as const satisfies Record<SpaceSubsectors, string>;

export function getAiSubsectorLabel(subsector: AISubsectors): string {
  return AI_SUBSECTOR_LABELS[subsector];
}

export function getQuantumSubsectorLabel(subsector: QuantumSubsectors): string {
  return QUANTUM_SUBSECTOR_LABELS[subsector];
}

export function getSemiconductorsSubsectorLabel(subsector: SemiconductorsSubsectors): string {
  return SEMICONDUCTORS_SUBSECTOR_LABELS[subsector];
}

export function getBiotechSubsectorLabel(subsector: BiotechnologySubsectors): string {
  return BIOTECH_SUBSECTOR_LABELS[subsector];
}

export function getSpaceSubsectorLabel(subsector: SpaceSubsectors): string {
  return SPACE_SUBSECTOR_LABELS[subsector];
}

export function getSubsectorLabel(sector: Sector, subsector: string): string {
  switch (sector) {
    case 'ai':
      if (getSubsectorList('ai').includes(subsector)) {
        return getAiSubsectorLabel(subsector as AISubsectors);
      }
      throw new Error(`Invalid AI subsector: ${subsector}`);
    case 'quantum':
      if (getSubsectorList('quantum').includes(subsector)) {
        return getQuantumSubsectorLabel(subsector as QuantumSubsectors);
      }
      throw new Error(`Invalid quantum subsector: ${subsector}`);
    case 'semiconductors':
      if (getSubsectorList('semiconductors').includes(subsector)) {
        return getSemiconductorsSubsectorLabel(subsector as SemiconductorsSubsectors);
      }
      throw new Error(`Invalid semiconductors subsector: ${subsector}`);
    case 'biotech':
      if (getSubsectorList('biotech').includes(subsector)) {
        return getBiotechSubsectorLabel(subsector as BiotechnologySubsectors);
      }
      throw new Error(`Invalid biotech subsector: ${subsector}`);
    case 'space':
      if (getSubsectorList('space').includes(subsector)) {
        return getSpaceSubsectorLabel(subsector as SpaceSubsectors);
      }
      throw new Error(`Invalid space subsector: ${subsector}`);
    default:
      throw new Error(`Invalid sector: ${sector}`);
  }
}
