import { useMemo } from 'react';

import debug from 'debug';

import { mainData } from '@/data/mainData';
import type { AggregatedCountryData, Weights } from '@/data/types';
import type { Sector } from '@/sectors/sectorDef';

function applyWeightsToSubsectorData(
  subsectorData: Record<string, number>,
  weights: Record<string, number>,
  sectorWeight: number,
): Record<string, number> {
  return Object.entries(subsectorData).reduce(
    (acc, [key, value]) => {
      acc[key] = value * weights[key] * sectorWeight;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export type UseDataPipelineProps = {
  weights: Weights;
  selectedSector: Sector | null;
};

export function useDataPipeline({
  weights,
  selectedSector,
}: UseDataPipelineProps): AggregatedCountryData[] {
  const weightedSubSectorDataPerCountry = useMemo(
    () =>
      mainData.map(({ country, sectorDetails }) => {
        return {
          country,
          sectors: Object.entries(sectorDetails).reduce(
            (acc, [_sector, _subSectors]) => {
              const sector = _sector as Sector;
              const subSectorData = _subSectors as Record<string, number>;
              const correctWeights = weights[sector];
              const weightedSubsectorData = applyWeightsToSubsectorData(
                subSectorData,
                correctWeights,
                weights.overall[sector],
              );

              acc[sector] = weightedSubsectorData;

              return acc;
            },
            {} as Record<Sector, Record<string, number>>,
          ),
        };
      }),
    [weights],
  );

  debug('weightedSubSectorDataPerCountry')(weightedSubSectorDataPerCountry);

  const totalSectorScoresPerCountry = useMemo(() => {
    return weightedSubSectorDataPerCountry.map(({ country, sectors }) => {
      return {
        country,
        sectors: Object.entries(sectors).reduce(
          (acc, [_sector, subsectorData]) => {
            const sector = _sector as Sector;
            const sectorScore = Object.values(subsectorData).reduce((sum, score) => sum + score, 0);

            acc[sector] = sectorScore;
            return acc;
          },
          {} as Record<Sector, number>,
        ),
      };
    });
  }, [weightedSubSectorDataPerCountry]);

  debug('totalSectorScoresPerCountry')(totalSectorScoresPerCountry);

  const totalCountryScores = useMemo(() => {
    return totalSectorScoresPerCountry.map(({ country, sectors }) => {
      return {
        country,
        score: selectedSector
          ? sectors[selectedSector]
          : Object.entries(sectors).reduce((sum, [, sectorToal]) => {
              return sum + sectorToal;
            }, 0),
      };
    });
  }, [totalSectorScoresPerCountry, selectedSector]);

  debug('totalCountryScores')(totalCountryScores);

  const countrySectorTotalLookup = useMemo(() => {
    return totalSectorScoresPerCountry.reduce(
      (acc, { country, sectors }) => {
        acc[country] = sectors;
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );
  }, [totalSectorScoresPerCountry]);

  const countryTotalLookup = useMemo(
    () =>
      totalCountryScores.reduce(
        (acc, { country, score }) => {
          acc[country] = score;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [totalCountryScores],
  );

  const aggregatedData = useMemo(
    () =>
      weightedSubSectorDataPerCountry.map(({ country, sectors }) => ({
        country,
        data: selectedSector ? sectors[selectedSector] : countrySectorTotalLookup[country],
        total: countryTotalLookup[country],
      })),
    [weightedSubSectorDataPerCountry, selectedSector, countrySectorTotalLookup, countryTotalLookup],
  );

  debug('aggregatedData')(aggregatedData);

  return aggregatedData;
}
