import React, { useState } from 'react';
import type { CountryData, ViewState } from '../types';
import { calculateColorIntensity } from '../utils/dataProcessing';
import { viewBaseColors } from '../utils/constants';

interface Column {
  key: string;
  name: string;
}

interface Props {
  data: CountryData[];
  columns: Column[];
  viewState: ViewState;
  selectedSector: string | null;
  selectedCountries: string[];
  handleSort: (key: string) => void;
  sectorWeights?: Record<string, number>;
  aiSubsectorWeights: Record<string, number>;
  quantumSubsectorWeights: Record<string, number>;
  semiconductorsSubsectorWeights: Record<string, number>;
  biotechSubsectorWeights: Record<string, number>;
  spaceSubsectorWeights: Record<string, number>;
}

const DataTable: React.FC<Props> = ({
  data,
  columns,
  viewState,
  selectedSector,
  selectedCountries,
  handleSort,
  sectorWeights = {},
  aiSubsectorWeights,
  quantumSubsectorWeights,
  semiconductorsSubsectorWeights,
  biotechSubsectorWeights,
  spaceSubsectorWeights,
}) => {
  const [sortField, setSortField] = useState<string>('totalScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleHeaderClick = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    handleSort(field);
  };

  // Calculate score for a single subsector with exact precision
  const calculateSubsectorScore = (value: number = 0, weight: number = 0): number => {
    return Number((value * weight).toFixed(15));
  };

  // Calculate score for a single sector based on its subsectors with exact precision
  const calculateSectorScore = (
    sectorDetails: Record<string, number> = {},
    weights: Record<string, number>,
  ): number => {
    return Number(
      Object.entries(sectorDetails)
        .reduce((total, [key, value]) => {
          return total + calculateSubsectorScore(value, weights[key] ?? 0);
        }, 0)
        .toFixed(15),
    );
  };

  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortField === 'country') {
        return sortDirection === 'asc'
          ? a.country.localeCompare(b.country)
          : b.country.localeCompare(a.country);
      }

      let aValue = 0,
        bValue = 0;

      if (viewState.type === 'sector' && viewState.sector) {
        // For sector view, sort by subsector value or sum of subsectors
        if (sortField === 'totalScore') {
          // Sum all visible subsector scores with exact precision
          aValue = Number(
            columns
              .reduce((sum, { key }) => {
                const value = a.sectorDetails?.[viewState.sector]?.[key] ?? 0;
                return sum + value;
              }, 0)
              .toFixed(15),
          );
          bValue = Number(
            columns
              .reduce((sum, { key }) => {
                const value = b.sectorDetails?.[viewState.sector]?.[key] ?? 0;
                return sum + value;
              }, 0)
              .toFixed(15),
          );
        } else {
          // Sort by individual subsector
          aValue = a.sectorDetails?.[viewState.sector]?.[sortField] ?? 0;
          bValue = b.sectorDetails?.[viewState.sector]?.[sortField] ?? 0;
        }
      } else {
        // For overview, sort by sector score or total
        if (sortField === 'totalScore') {
          // Sum all visible sector scores with exact precision
          aValue = Number(
            columns
              .reduce((sum, { key }) => {
                const weights =
                  key === 'ai'
                    ? aiSubsectorWeights
                    : key === 'quantum'
                      ? quantumSubsectorWeights
                      : key === 'semiconductors'
                        ? semiconductorsSubsectorWeights
                        : key === 'biotech'
                          ? biotechSubsectorWeights
                          : spaceSubsectorWeights;

                const sectorValue = calculateSectorScore(a.sectorDetails?.[key], weights);
                return sum + sectorValue * (sectorWeights[key] ?? 0);
              }, 0)
              .toFixed(15),
          );
          bValue = Number(
            columns
              .reduce((sum, { key }) => {
                const weights =
                  key === 'ai'
                    ? aiSubsectorWeights
                    : key === 'quantum'
                      ? quantumSubsectorWeights
                      : key === 'semiconductors'
                        ? semiconductorsSubsectorWeights
                        : key === 'biotech'
                          ? biotechSubsectorWeights
                          : spaceSubsectorWeights;

                const sectorValue = calculateSectorScore(b.sectorDetails?.[key], weights);
                return sum + sectorValue * (sectorWeights[key] ?? 0);
              }, 0)
              .toFixed(15),
          );
        } else {
          // Sort by individual sector
          const weights =
            sortField === 'ai'
              ? aiSubsectorWeights
              : sortField === 'quantum'
                ? quantumSubsectorWeights
                : sortField === 'semiconductors'
                  ? semiconductorsSubsectorWeights
                  : sortField === 'biotech'
                    ? biotechSubsectorWeights
                    : spaceSubsectorWeights;

          aValue =
            calculateSectorScore(a.sectorDetails?.[sortField], weights) *
            (sectorWeights[sortField] ?? 0);
          bValue =
            calculateSectorScore(b.sectorDetails?.[sortField], weights) *
            (sectorWeights[sortField] ?? 0);
        }
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [
    data,
    sortField,
    sortDirection,
    viewState,
    columns,
    sectorWeights,
    aiSubsectorWeights,
    quantumSubsectorWeights,
    semiconductorsSubsectorWeights,
    biotechSubsectorWeights,
    spaceSubsectorWeights,
  ]);

  const maxScores = React.useMemo(() => {
    if (viewState.type === 'sector' && viewState.sector) {
      // Find max scores for each subsector
      const subsectorMaxes = columns.reduce(
        (acc, { key }) => {
          acc[key] = Math.max(...data.map((d) => d.sectorDetails?.[viewState.sector]?.[key] ?? 0));
          return acc;
        },
        {} as Record<string, number>,
      );

      // Calculate max total as sum of visible subsectors with exact precision
      subsectorMaxes.totalScore = Math.max(
        ...data.map((d) =>
          Number(
            columns
              .reduce((sum, { key }) => {
                const value = d.sectorDetails?.[viewState.sector]?.[key] ?? 0;
                return sum + value;
              }, 0)
              .toFixed(15),
          ),
        ),
      );

      return subsectorMaxes;
    }

    // For overview, find max scores for each sector and total
    return {
      ...columns.reduce(
        (acc, { key }) => {
          const weights =
            key === 'ai'
              ? aiSubsectorWeights
              : key === 'quantum'
                ? quantumSubsectorWeights
                : key === 'semiconductors'
                  ? semiconductorsSubsectorWeights
                  : key === 'biotech'
                    ? biotechSubsectorWeights
                    : spaceSubsectorWeights;

          acc[key] = Math.max(
            ...data.map(
              (d) =>
                calculateSectorScore(d.sectorDetails?.[key], weights) * (sectorWeights[key] ?? 0),
            ),
          );
          return acc;
        },
        {} as Record<string, number>,
      ),
      // Calculate max total as sum of visible sectors with exact precision
      totalScore: Math.max(
        ...data.map((d) =>
          Number(
            columns
              .reduce((sum, { key }) => {
                const weights =
                  key === 'ai'
                    ? aiSubsectorWeights
                    : key === 'quantum'
                      ? quantumSubsectorWeights
                      : key === 'semiconductors'
                        ? semiconductorsSubsectorWeights
                        : key === 'biotech'
                          ? biotechSubsectorWeights
                          : spaceSubsectorWeights;

                const sectorValue = calculateSectorScore(d.sectorDetails?.[key], weights);
                return sum + sectorValue * (sectorWeights[key] ?? 0);
              }, 0)
              .toFixed(15),
          ),
        ),
      ),
    };
  }, [
    data,
    columns,
    viewState,
    sectorWeights,
    aiSubsectorWeights,
    quantumSubsectorWeights,
    semiconductorsSubsectorWeights,
    biotechSubsectorWeights,
    spaceSubsectorWeights,
  ]);

  const getHeaderColor = () => {
    if (viewState.type === 'sector' && viewState.sector) {
      return viewBaseColors[viewState.sector];
    }
    return viewBaseColors.main;
  };

  const handleHeaderMouseEnter = (event: React.MouseEvent, name: string) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipContent(name);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height,
    });
    setShowTooltip(true);
  };

  const handleHeaderMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="overflow-hidden relative">
      {showTooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-md text-sm shadow-lg whitespace-nowrap"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, 8px)',
            pointerEvents: 'none',
          }}
        >
          {tooltipContent}
        </div>
      )}
      <table className="w-full divide-y divide-gray-200 table-fixed">
        <thead style={{ backgroundColor: getHeaderColor() }}>
          <tr>
            <th
              className="w-[15%] px-2 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider cursor-pointer hover:opacity-80"
              onClick={() => handleHeaderClick('country')}
              onMouseEnter={(e) => handleHeaderMouseEnter(e, 'Country')}
              onMouseLeave={handleHeaderMouseLeave}
            >
              <div className="truncate">
                Country
                {sortField === 'country' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            {columns.map(({ key, name }) => (
              <th
                key={key}
                className={`w-[7.5%] px-2 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider cursor-pointer hover:opacity-80 ${
                  selectedSector && selectedSector !== key ? 'opacity-50' : ''
                }`}
                onClick={() => handleHeaderClick(key)}
                onMouseEnter={(e) => handleHeaderMouseEnter(e, name)}
                onMouseLeave={handleHeaderMouseLeave}
              >
                <div className="h-12 flex items-center">
                  <span className="break-words line-clamp-2">
                    {name}
                    {sortField === key && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </span>
                </div>
              </th>
            ))}
            <th
              className="w-[7.5%] px-2 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider cursor-pointer hover:opacity-80"
              onClick={() => handleHeaderClick('totalScore')}
              onMouseEnter={(e) => handleHeaderMouseEnter(e, 'Total Score')}
              onMouseLeave={handleHeaderMouseLeave}
            >
              <div className="truncate">
                Total
                {sortField === 'totalScore' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((country) => {
            // Calculate scores and total based on view type with exact precision
            let columnScores: number[] = [];
            let total = 0;

            if (viewState.type === 'sector' && viewState.sector) {
              // For sector view, show raw subsector scores
              columnScores = columns.map(
                ({ key }) => country.sectorDetails?.[viewState.sector]?.[key] ?? 0,
              );
              // Total is sum of visible subsector scores
              total = Number(
                columnScores.reduce((sum, score) => sum + (score || 0), 0).toFixed(15),
              );
            } else {
              // For overview, show weighted sector scores
              columnScores = columns.map(({ key }) => {
                const weights =
                  key === 'ai'
                    ? aiSubsectorWeights
                    : key === 'quantum'
                      ? quantumSubsectorWeights
                      : key === 'semiconductors'
                        ? semiconductorsSubsectorWeights
                        : key === 'biotech'
                          ? biotechSubsectorWeights
                          : spaceSubsectorWeights;

                const sectorScore = calculateSectorScore(country.sectorDetails?.[key], weights);
                return Number((sectorScore * (sectorWeights[key] ?? 0)).toFixed(15));
              });
              // Total is sum of visible sector scores
              total = Number(
                columnScores.reduce((sum, score) => sum + (score || 0), 0).toFixed(15),
              );
            }

            return (
              <tr
                key={country.country}
                className={`hover:bg-gray-50 ${
                  selectedCountries.includes(country.country) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-2 py-2 text-sm font-medium text-gray-900 truncate">
                  {country.country}
                </td>
                {columns.map(({ key }, index) => (
                  <td
                    key={key}
                    className={`px-2 py-2 text-sm font-semibold text-center ${
                      selectedSector && selectedSector !== key ? 'opacity-50' : ''
                    }`}
                    style={{
                      backgroundColor: calculateColorIntensity(
                        columnScores[index],
                        maxScores[key],
                        viewState.type,
                        viewState.sector,
                      ),
                      color: columnScores[index] > maxScores[key] * 0.5 ? 'white' : '#1a202c',
                    }}
                  >
                    {viewState.type === 'main'
                      ? (columnScores[index] * 100).toFixed(1)
                      : columnScores[index].toFixed(3)}
                  </td>
                ))}
                <td
                  className="px-2 py-2 text-sm font-semibold text-center"
                  style={{
                    backgroundColor: calculateColorIntensity(
                      total,
                      maxScores.totalScore,
                      viewState.type,
                      viewState.sector,
                    ),
                    color: total > maxScores.totalScore * 0.5 ? 'white' : '#1a202c',
                  }}
                >
                  {viewState.type === 'main' ? (total * 100).toFixed(1) : total.toFixed(3)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
