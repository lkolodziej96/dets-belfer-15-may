import type { Sector } from '@/sectors/sectorDef';
import type {
  AISubsectors,
  BiotechnologySubsectors,
  QuantumSubsectors,
  SemiconductorsSubsectors,
  SpaceSubsectors,
} from '@/subsectors/subsectorsDef';

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
