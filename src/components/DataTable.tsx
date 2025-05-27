import React, { useState, useMemo } from 'react';

import type { AggregatedCountryData } from '@/data/types';
import { getSectorColor } from '@/sectors/colors';
import { getSectorLabel } from '@/sectors/labels';
import { getSectorList, type Sector } from '@/sectors/sectorDef';
import { getSubsectorLabel } from '@/subsectors/labels';
import { getSubsectorList } from '@/subsectors/subsectorsDef';
import { theme } from '@/theme';
import { getPercentage } from '@/utils/display';
import { cn } from '@/utils/styling';

import { calculateColorIntensity } from '../utils/dataProcessing';

export type DataTableProps = {
  selectedSector: Sector | null;
  selectedCountries: string[];
  selectedSubsector: string | null;
  aggregatedData: AggregatedCountryData[];
};

export default function DataTable({
  selectedSector,
  selectedCountries,
  aggregatedData,
  selectedSubsector,
}: DataTableProps) {
  const tableColumnKeys = useMemo(() => {
    return selectedSector ? getSubsectorList(selectedSector) : getSectorList();
  }, [selectedSector]);
  const columns = useMemo(
    () =>
      tableColumnKeys.map((key) => ({
        key,
        label: selectedSector
          ? getSubsectorLabel(selectedSector, key)
          : getSectorLabel(key as Sector),
      })),
    [selectedSector, tableColumnKeys],
  );
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [sortField, setSortField] = useState<string>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [tooltipContent, setTooltipContent] = useState<string>('');

  const tableData = useMemo(
    () =>
      aggregatedData
        .toSorted((a, b) => {
          if (sortField === 'country') {
            return sortDirection === 'asc'
              ? a.country.localeCompare(b.country)
              : b.country.localeCompare(a.country);
          }
          if (sortField === 'total') {
            return sortDirection === 'asc' ? a.total - b.total : b.total - a.total;
          }

          const aValue = a.data[sortField];
          const bValue = b.data[sortField];

          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        })
        .map(({ country, data, total }) => ({
          country,
          data: Object.entries(data).reduce(
            (acc, [key, value]) => {
              acc[key] = getPercentage(value);
              return acc;
            },
            {} as Record<string, number>,
          ),
          total: getPercentage(total),
        })),
    [aggregatedData, sortField, sortDirection],
  );

  const maxScores = useMemo(
    () =>
      tableData.reduce(
        (acc, { data, total }) => {
          Object.entries(data).forEach(([key, value]) => {
            acc[key] = Math.max(acc[key] ?? 0, value as number);
          });
          acc.total = Math.max(acc.total ?? 0, total as number);
          return acc;
        },
        {} as Record<string, number>,
      ),
    [tableData],
  );

  const handleHeaderClick = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
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

  const headerColor = selectedSector ? getSectorColor(selectedSector) : theme.colors.main;

  return (
    <div className="relative overflow-hidden">
      {showTooltip && (
        <div
          className="fixed z-50 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
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
      <table className="w-full table-fixed divide-y divide-gray-200">
        <thead style={{ backgroundColor: headerColor }}>
          <tr>
            <th
              className="w-[15%] cursor-pointer px-2 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white hover:opacity-80"
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
            {columns.map(({ key, label }) => (
              <th
                key={key}
                className={cn(
                  'w-[7.5%] cursor-pointer px-2 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white hover:opacity-80',
                  { 'opacity-50': selectedSubsector && selectedSubsector !== key },
                )}
                onClick={() => handleHeaderClick(key)}
                onMouseEnter={(e) => handleHeaderMouseEnter(e, label)}
                onMouseLeave={handleHeaderMouseLeave}
              >
                <div className="flex h-12 items-center">
                  <span className="line-clamp-2 break-words">
                    {label}
                    {sortField === key && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </span>
                </div>
              </th>
            ))}
            <th
              className="w-[7.5%] cursor-pointer px-2 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white hover:opacity-80"
              onClick={() => handleHeaderClick('total')}
              onMouseEnter={(e) => handleHeaderMouseEnter(e, 'Total Score')}
              onMouseLeave={handleHeaderMouseLeave}
            >
              <div className="truncate">
                Total
                {sortField === 'total' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {tableData.map(({ country, data, total }) => {
            return (
              <tr
                key={country}
                className={cn('hover:bg-gray-50', {
                  'bg-blue-50': selectedCountries.includes(country),
                })}
              >
                <td className="truncate px-2 py-2 text-sm font-medium text-gray-900">{country}</td>
                {columns.map(({ key }) => (
                  <td
                    key={key}
                    className={cn('px-2 py-2 text-center text-sm font-semibold', {
                      'opacity-50': selectedSubsector && selectedSubsector !== key,
                    })}
                    style={{
                      backgroundColor: calculateColorIntensity(
                        data[key],
                        maxScores[key],
                        selectedSector,
                      ),
                      color: data[key] > maxScores[key] * 0.5 ? 'white' : '#1a202c',
                    }}
                  >
                    {data[key]}
                  </td>
                ))}
                <td
                  className="px-2 py-2 text-center text-sm font-semibold"
                  style={{
                    backgroundColor: calculateColorIntensity(
                      total,
                      maxScores.total,
                      selectedSector,
                    ),
                    color: total > maxScores.total * 0.5 ? 'white' : '#1a202c',
                  }}
                >
                  {total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
