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
