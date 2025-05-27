import type { Sector } from '@/sectors/sectorDef';
import {
  getSubsectorList,
  type AISubsectors,
  type BiotechnologySubsectors,
  type QuantumSubsectors,
  type SemiconductorsSubsectors,
  type SpaceSubsectors,
} from '@/subsectors/subsectorsDef';

const AI_SUBSECTOR_COLORS = {
  algorithms: '#1E40AF',
  computing_power: '#2563EB',
  data: '#3B82F6',
  economic_resources: '#60A5FA',
  global_player: '#93C5FD',
  human_capital: '#BFDBFE',
  regulatory: '#DBEAFE',
  accuracy_of_top_models: '#EFF6FF',
} as const satisfies Record<AISubsectors, string>;

const QUANTUM_SUBSECTOR_COLORS = {
  economic_resources: '#4C1D95',
  security: '#5B21B6',
  human_capital: '#6D28D9',
  global_player: '#7C3AED',
  policy_environment: '#8B5CF6',
  quantum_sensing: '#A78BFA',
  quantum_communications: '#C4B5FD',
  quantum_computing: '#EDE9FE',
} as const satisfies Record<QuantumSubsectors, string>;

const SEMICONDUCTORS_SUBSECTOR_COLORS = {
  chip_design_and_tools: '#7C2D12',
  manufacturing: '#9A3412',
  economic_resources: '#B45309',
  human_capital: '#D97706',
  equipment: '#F59E0B',
  'assembly_and_testing_(osat)': '#FBBF24',
  global_player: '#FCD34D',
  raw_materials_and_wafers: '#FDE68A',
  regulatory: '#FEF3C7', // Lightest - least important
} as const satisfies Record<SemiconductorsSubsectors, string>;

const BIOTECH_SUBSECTOR_COLORS = {
  agricultural_technology: '#065F46',
  genetic_engineering: '#10B981',
  global_player: '#34D399',
  human_capital: '#059669',
  pharmaceutical_production: '#6EE7B7',
  regulatory: '#A7F3D0',
  economic_resources: '#99F6E4',
  security: '#047857',
  vaccine_research: '#D1FAE5',
} as const satisfies Record<BiotechnologySubsectors, string>;

const SPACE_SUBSECTOR_COLORS = {
  domestic_launch_capability: '#991B1B',
  economic_resources: '#B91C1C',
  global_player: '#DC2626',
  human_capital: '#EF4444',
  pnt: '#F87171',
  regulatory: '#FCA5A5',
  remote_sensing: '#FECACA',
  science_and_exploration: '#FEE2E2',
  telecommunications: '#FEF2F2',
  security: '#FFF1F1',
} as const satisfies Record<SpaceSubsectors, string>;

export function getAiSubsectorColor(subsector: AISubsectors): string {
  return structuredClone(AI_SUBSECTOR_COLORS[subsector]);
}

export function getQuantumSubsectorColor(subsector: QuantumSubsectors): string {
  return structuredClone(QUANTUM_SUBSECTOR_COLORS[subsector]);
}

export function getSemiconductorsSubsectorColor(subsector: SemiconductorsSubsectors): string {
  return structuredClone(SEMICONDUCTORS_SUBSECTOR_COLORS[subsector]);
}

export function getBiotechSubsectorColor(subsector: BiotechnologySubsectors): string {
  return structuredClone(BIOTECH_SUBSECTOR_COLORS[subsector]);
}

export function getSpaceSubsectorColor(subsector: SpaceSubsectors): string {
  return structuredClone(SPACE_SUBSECTOR_COLORS[subsector]);
}

export function getSubsectorColor(sector: Sector, subsector: string): string {
  switch (sector) {
    case 'ai':
      if (getSubsectorList('ai').includes(subsector)) {
        return getAiSubsectorColor(subsector as AISubsectors);
      }
      throw new Error(`Invalid AI subsector: ${subsector}`);
    case 'quantum':
      if (getSubsectorList('quantum').includes(subsector)) {
        return getQuantumSubsectorColor(subsector as QuantumSubsectors);
      }
      throw new Error(`Invalid quantum subsector: ${subsector}`);
    case 'semiconductors':
      if (getSubsectorList('semiconductors').includes(subsector)) {
        return getSemiconductorsSubsectorColor(subsector as SemiconductorsSubsectors);
      }
      throw new Error(`Invalid semiconductors subsector: ${subsector}`);
    case 'biotech':
      if (getSubsectorList('biotech').includes(subsector)) {
        return getBiotechSubsectorColor(subsector as BiotechnologySubsectors);
      }
      throw new Error(`Invalid biotech subsector: ${subsector}`);
    case 'space':
      if (getSubsectorList('space').includes(subsector)) {
        return getSpaceSubsectorColor(subsector as SpaceSubsectors);
      }
      throw new Error(`Invalid space subsector: ${subsector}`);
    default:
      throw new Error(`Invalid sector: ${sector}`);
  }
}
