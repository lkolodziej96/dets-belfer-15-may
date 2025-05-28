export interface SubsectorData {
  name: string;
  score: number;
}

export interface SectorData {
  name: string;
  score: number;
  subsectors: SubsectorData[];
}

export interface CountryData {
  country: string;
  sectorDetails: {
    [key: string]: {
      [subsector: string]: number;
    };
  };
}

export interface SectorWeights {
  ai: number;
  quantum: number;
  semiconductors: number;
  biotech: number;
  space: number;
}

export interface CountryOption {
  value: string;
  label: string;
}

export interface InteractiveProps {
  selectedCountries: string[];
  onCountrySelect: (countries: string[]) => void;
}

export interface ViewState {
  type: 'main' | 'sector';
  sector: string | null;
}

export interface AISectorData {
  economic_resources: number;
  human_capital: number;
  global_player: number;
  regulatory: number;
  computing_power: number;
  algorithms: number;
  data: number;
  accuracy_of_top_models: number;
}

export interface QuantumSectorData {
  economic_resources: number;
  security: number;
  human_capital: number;
  global_player: number;
  policy_environment: number;
  quantum_sensing: number;
  quantum_communications: number;
  quantum_computing: number;
}

export type WeightedSubSectorCountryData = {
  country: string;
  sectors: Record<string, Record<string, number>>;
};

export type TotalSectorScoresCountryData = {
  country: string;
  sectors: Record<string, number>;
};

export type TotalCountryScoreData = {
  country: string;
  score: number;
};
