import type { Sector } from '@/sectors/sectorDef';
import type {
  AISubsectors,
  BiotechnologySubsectors,
  QuantumSubsectors,
  SemiconductorsSubsectors,
  SpaceSubsectors,
} from '@/subsectors/subsectorsDef';

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

export type AggregatedCountryData = {
  country: string;
  data: Record<string, number>;
  total: number;
};

export type Weights = {
  overall: Record<Sector, number>;
  ai: Record<AISubsectors, number>;
  biotech: Record<BiotechnologySubsectors, number>;
  quantum: Record<QuantumSubsectors, number>;
  semiconductors: Record<SemiconductorsSubsectors, number>;
  space: Record<SpaceSubsectors, number>;
};
