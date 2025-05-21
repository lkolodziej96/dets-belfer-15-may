import type { SectorWeights } from '../types';

export const defaultSectorWeights = {
  ai: 0.25,
  biotech: 0.2,
  semiconductors: 0.35,
  space: 0.15,
  quantum: 0.05,
};

export const defaultAISubsectorWeights = {
  algorithms: 0.15,
  computing_power: 0.15,
  data: 0.15,
  economic_resources: 0.2,
  global_player: 0.025,
  human_capital: 0.2,
  regulatory: 0.025,
  accuracy_of_top_models: 0.1,
};

export const defaultQuantumSubsectorWeights = {
  economic_resources: 0.2,
  human_capital: 0.15,
  global_player: 0.05,
  policy_environment: 0.1,
  quantum_communications: 0.15,
  quantum_computing: 0.15,
  quantum_sensing: 0.15,
  security: 0.05,
};

export const defaultSemiconductorsSubsectorWeights = {
  chip_design_and_tools: 0.325,
  manufacturing: 0.1,
  economic_resources: 0.2,
  human_capital: 0.2,
  equipment: 0.075,
  'assembly_and_testing_(osat)': 0.025,
  global_player: 0.025,
  raw_materials_and_wafers: 0.025,
  regulatory: 0.025,
};

export const defaultBiotechSubsectorWeights = {
  economic_resources: 0.1,
  security: 0.05,
  human_capital: 0.25,
  global_player: 0.025,
  regulatory: 0.025,
  agricultural_technology: 0.05,
  vaccine_research: 0.15,
  pharmaceutical_production: 0.2,
  genetic_engineering: 0.15,
};

export const defaultSpaceSubsectorWeights = {
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
};

export const sectorColors = {
  ai: '#5A97DB',
  biotech: '#69B97E',
  semiconductors: '#ED8936',
  space: '#F56565',
  quantum: '#9F7AEA',
};

export const viewBaseColors = {
  main: '#962437',
  ai: '#5A97DB',
  biotech: '#69B97E',
  semiconductors: '#ED8936',
  space: '#F56565',
  quantum: '#9F7AEA',
};

export const aiSubsectorColors = {
  algorithms: '#1E40AF',
  computing_power: '#2563EB',
  data: '#3B82F6',
  economic_resources: '#60A5FA',
  global_player: '#93C5FD',
  human_capital: '#BFDBFE',
  regulatory: '#DBEAFE',
  accuracy_of_top_models: '#EFF6FF',
};

export const quantumSubsectorColors = {
  economic_resources: '#4C1D95',
  security: '#5B21B6',
  human_capital: '#6D28D9',
  global_player: '#7C3AED',
  policy_environment: '#8B5CF6',
  quantum_sensing: '#A78BFA',
  quantum_communications: '#C4B5FD',
  quantum_computing: '#EDE9FE',
};

export const semiconductorsSubsectorColors = {
  chip_design_and_tools: '#7C2D12', // Darkest - most important
  manufacturing: '#9A3412',
  economic_resources: '#B45309',
  human_capital: '#D97706',
  equipment: '#F59E0B',
  'assembly_and_testing_(osat)': '#FBBF24',
  global_player: '#FCD34D',
  raw_materials_and_wafers: '#FDE68A',
  regulatory: '#FEF3C7', // Lightest - least important
};

export const biotechSubsectorColors = {
  agricultural_technology: '#065F46',
  genetic_engineering: '#10B981',
  global_player: '#34D399',
  human_capital: '#059669',
  pharmaceutical_production: '#6EE7B7',
  regulatory: '#A7F3D0',
  economic_resources: '#99F6E4',
  security: '#047857',
  vaccine_research: '#D1FAE5',
};

export const spaceSubsectorColors = {
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
};

export const sectorNames = {
  ai: 'AI',
  biotech: 'Biotechnology',
  semiconductors: 'Semiconductors',
  space: 'Space',
  quantum: 'Quantum',
};

export const subsectorDefinitions = {
  ai: {
    algorithms: 'Algorithms',
    computing_power: 'Computing Power',
    data: 'Data',
    economic_resources: 'Economic Resources',
    global_player: 'Global Player',
    human_capital: 'Human Capital',
    regulatory: 'Regulatory',
    accuracy_of_top_models: 'Accuracy of Top Models',
  },
  quantum: {
    economic_resources: 'Economic Resources',
    security: 'Security',
    human_capital: 'Human Capital',
    global_player: 'Global Player',
    policy_environment: 'Policy Environment',
    quantum_sensing: 'Quantum Sensing',
    quantum_communications: 'Quantum Communications',
    quantum_computing: 'Quantum Computing',
  },
  semiconductors: {
    chip_design_and_tools: 'Chip Design and Tools',
    manufacturing: 'Manufacturing and Fabrication',
    economic_resources: 'Economic Resources',
    human_capital: 'Human Capital',
    equipment: 'Equipment',
    'assembly_and_testing_(osat)': 'Assembly and Testing',
    global_player: 'Global Player',
    raw_materials_and_wafers: 'Specialized Materials and Wafers',
    regulatory: 'Regulatory',
  },
  biotech: {
    agricultural_technology: 'Agricultural Technology',
    genetic_engineering: 'Genetic Engineering',
    global_player: 'Global Player',
    human_capital: 'Human Capital',
    pharmaceutical_production: 'Pharmaceutical Production',
    regulatory: 'Regulatory',
    economic_resources: 'Economic Resources',
    security: 'Security',
    vaccine_research: 'Vaccine Research',
  },
  space: {
    domestic_launch_capability: 'Domestic Launch Capability',
    economic_resources: 'Economic Resources',
    global_player: 'Global Player',
    human_capital: 'Human Capital',
    pnt: 'Position, Navigation, and Timing',
    regulatory: 'Regulatory',
    remote_sensing: 'Remote Sensing',
    science_and_exploration: 'Science and Exploration',
    telecommunications: 'Telecommunications',
    security: 'Security',
  },
};
