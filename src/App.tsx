import { useState } from 'react';
import { useImmer } from 'use-immer';

import WorldMap from '@/components/WorldMap';
import BarChart from '@/components/BarChart';
import PieChart from '@/components/PieChart';
import DataTable from '@/components/DataTable';
import SectorNav from '@/components/SectorNav';
import type { Sector } from '@/sectors/sectorDef';
import { getSectorWeights } from '@/sectors/defaults';
import {
  getAISectorWeights,
  getBiotechSectorWeights,
  getQuantumSectorWeights,
  getSemiconductorsSectorWeights,
  getSpaceSectorWeights,
} from '@/subsectors/defaults';
import { WeigthsTweaker } from '@/components/WeigthsTweaker';
import { getSectorColor } from '@/sectors/colors';
import { theme } from '@/theme';
import { getSectorLabel } from '@/sectors/labels';
import { getSubsectorLabel } from '@/subsectors/labels';
import { useDataPipeline } from '@/data/useDataPieline';
import type { Weights } from '@/types';

function getDefaultWeights(): Weights {
  return {
    overall: getSectorWeights(),
    ai: getAISectorWeights(),
    biotech: getBiotechSectorWeights(),
    quantum: getQuantumSectorWeights(),
    semiconductors: getSemiconductorsSectorWeights(),
    space: getSpaceSectorWeights(),
  };
}

function formatSectorLabel(sector: Sector | null) {
  if (!sector) return 'Sector';

  const acronymOverrides: Record<string, string> = {
    ai: 'AI',
  };

  const lower = sector.toLowerCase();
  return acronymOverrides[lower] || lower.charAt(0).toUpperCase() + lower.slice(1);
}

export default function App() {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedSubsector, setSelectedSubsector] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const [weights, setWeights] = useImmer<Weights>(getDefaultWeights);
  const aggregatedData = useDataPipeline({ weights, selectedSector });

  const handleCountrySelect = (countries: string[]) => {
    setSelectedCountries(countries);
  };

  const handleSectorNavClick = (sector: Sector | null) => {
    setSelectedSector(sector);
    setSelectedCountries([]);
  };

  const handleReset = () => {
    const defaultWeights = getDefaultWeights();
    setSelectedSubsector(null);
    setSelectedCountries([]);
    setWeights((draft) => {
      if (selectedSector) {
        // Following assumption is correct `as never` is needed to avoid type errors
        draft[selectedSector] = defaultWeights[selectedSector] as never;
      } else {
        draft.overall = defaultWeights.overall;
      }
    });
  };

  return (
    <div className="mx-auto w-[1200px] bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white shadow-lg">
        <div className="px-8 py-4">
          <div className="text-center">
            <div className="inline-block rounded-2xl border border-gray-100 bg-white px-8 py-4 shadow-xl">
              <h1 className="bg-gradient-to-r from-[#962437] to-[#d4526d] bg-clip-text text-4xl font-bold text-transparent">
                Critical and Emerging Technologies Dashboard
              </h1>
            </div>
          </div>
        </div>
      </div>
      <SectorNav currentSector={selectedSector} onSectorChange={handleSectorNavClick} />

      <div className="px-8 py-8">
        <div className="flex gap-8">
          {/* Left Panel - Sector Weights */}
          <div className="w-60 flex-shrink-0">
            <div className="sticky top-8 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">
                {selectedSector
                  ? `${formatSectorLabel(selectedSector)} Pillar Weights`
                  : 'Sector Weights'}
              </h2>
              <WeigthsTweaker
                accentColor={selectedSector ? getSectorColor(selectedSector) : theme.colors.main}
                weights={selectedSector ? weights[selectedSector] : weights.overall}
                getLabel={(key) => {
                  if (selectedSector) {
                    return getSubsectorLabel(selectedSector, key);
                  }
                  return getSectorLabel(key as Sector);
                }}
                onChangeWeight={(sector, value) =>
                  setWeights((draft) => {
                    if (selectedSector) {
                      draft[selectedSector][
                        sector as keyof (typeof weights)[typeof selectedSector]
                      ] = value;
                    } else {
                      draft.overall[sector as Sector] = value;
                    }
                  })
                }
              />

              <div className="mt-6 border-t border-gray-100 pt-6">
                <button
                  onClick={handleReset}
                  className="w-full rounded-lg bg-gray-100 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Reset Selection
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-[760px] space-y-8">
            {/* Bar Chart */}
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
              <BarChart
                selectedSector={selectedSector}
                selectedCountries={selectedCountries}
                onCountrySelect={handleCountrySelect}
                aggregatedData={aggregatedData}
                selectedSubsector={selectedSubsector}
              />
            </div>

            {/* World Map and Pie Chart */}
            <div className="grid grid-cols-5 gap-8">
              {/* World Map (3 columns) */}
              <div className="col-span-3 rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
                <WorldMap
                  selectedSector={selectedSector}
                  selectedCountries={selectedCountries}
                  onCountrySelect={handleCountrySelect}
                  aggregatedData={aggregatedData}
                  selectedSubsector={selectedSubsector}
                />
              </div>

              {/* Pie Chart (2 columns) */}
              <div className="col-span-2 overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="relative" style={{ height: '400px' }}>
                  <PieChart
                    selectedSector={selectedSector}
                    selectedCountries={selectedCountries}
                    aggregatedData={aggregatedData}
                    onSubSectorSelect={setSelectedSubsector}
                    selectedSubsector={selectedSubsector}
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
              <DataTable
                selectedSector={selectedSector}
                selectedCountries={selectedCountries}
                aggregatedData={aggregatedData}
                selectedSubsector={selectedSubsector}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
