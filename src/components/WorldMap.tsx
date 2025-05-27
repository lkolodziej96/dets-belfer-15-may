import { useEffect, useRef, useMemo, useCallback } from 'react';

import * as d3 from 'd3';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Select from 'react-select';
import { feature } from 'topojson-client';

import type { AggregatedCountryData } from '@/data/types';
import { getSectorColor } from '@/sectors/colors';
import { getSectorLabel } from '@/sectors/labels';
import type { Sector } from '@/sectors/sectorDef';
import { getSubsectorLabel } from '@/subsectors/labels';
import { theme } from '@/theme';
import { calculateColorIntensity } from '@/utils/dataProcessing';
import { getPercentage } from '@/utils/display';

type CountryOption = {
  value: string;
  label: string;
};

// Map for converting between world map country names and data country names
const countryNameMap = {
  'United States of America': 'United States',
  USA: 'United States',
  US: 'United States',
  'U.S.A.': 'United States',
  'United Arab Emirates': 'U.A.E.',
  UAE: 'U.A.E.',
  'Republic of Singapore': 'Singapore',
  Singapore: 'Singapore',
};

function generateTooltipContent(
  selectedSector: Sector | null,
  { country, data, total }: AggregatedCountryData,
) {
  let tooltipContent = `
      <div style="font-weight: 700; margin-bottom: 8px; color: #1A202C; font-size: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
        ${country}
      </div>
      <div style="margin-bottom: 8px;">
    `;
  const baseColor = selectedSector ? getSectorColor(selectedSector) : theme.colors.main;

  Object.entries(data)
    .toSorted((a, b) => b[1] - a[1])
    .forEach(([key, value], index) => {
      const intensity = index / Object.keys(data).length;
      const color = d3.color(baseColor)!.brighter(intensity).toString();
      const label = selectedSector
        ? getSubsectorLabel(selectedSector, key)
        : getSectorLabel(key as Sector);

      tooltipContent += `
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            padding: 4px;
            border-radius: 4px;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background-color: ${color};
              margin-right: 8px;
              border-radius: 2px;
            "></div>
            <div style="flex-grow: 1; color: #4A5568;">
              ${label}
            </div>
            <div style="color: #2D3748; font-weight: 500;">
              ${getPercentage(value)}
            </div>
          </div>
        `;
    });

  tooltipContent += `
      </div>
      <div style="font-weight: 600; color: #2D3748; border-top: 1px solid #E2E8F0; padding-top: 6px;">
        Total Score: ${getPercentage(total)}
      </div>
    `;

  return tooltipContent;
}

export type WorldMapProps = {
  selectedSector: Sector | null;
  selectedCountries: string[];
  onCountrySelect: (countries: string[]) => void;
  aggregatedData: AggregatedCountryData[];
  selectedSubsector: string | null;
};

export default function WorldMap({
  selectedSector,
  selectedCountries,
  onCountrySelect,
  aggregatedData,
  selectedSubsector,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null);
  const geoPathRef = useRef<d3.GeoPath>();
  const featuresRef = useRef<any[]>([]);
  const countryData = useMemo(
    () =>
      fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json').then((response) =>
        response.json(),
      ),
    [],
  );

  const countryOptions = useMemo(() => {
    return aggregatedData
      .map(({ country }) => ({
        value: country,
        label: country,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [aggregatedData]);

  const selectedOptions = useMemo(() => {
    return selectedCountries.map((country) => ({
      value: country,
      label: country,
    }));
  }, [selectedCountries]);

  const mapData = useMemo(
    () =>
      aggregatedData.map(({ country, data, total }) => ({
        country,
        data: selectedSubsector ? { [selectedSubsector]: data[selectedSubsector] } : data,
        total: selectedSubsector ? data[selectedSubsector] : total,
      })),
    [aggregatedData, selectedSubsector],
  );

  const zoomToCountries = useCallback((countryNames: string[]) => {
    if (!svgRef.current || !zoomRef.current || !geoPathRef.current || !countryNames.length) return;

    const svg = d3.select(svgRef.current);
    const zoom = zoomRef.current;
    const path = geoPathRef.current;
    const width = svgRef.current.clientWidth;
    const height = 400;

    if (countryNames.length === 1 && countryNames[0] === 'Singapore') {
      // Special handling for Singapore
      const singaporeCoords = [103.8198, 1.3521] as [number, number]; // Singapore coordinates
      const projection = d3
        .geoMercator()
        .scale((width - 3) / (2 * Math.PI))
        .translate([width / 2, height / 2]);

      const [x, y] = projection(singaporeCoords)!;
      const scale = 15;

      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform as any,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(scale)
            .translate(-x!, -y!),
        );
      return;
    }

    // Find all features for selected countries
    const features = countryNames
      .map((countryName) => {
        const feature = featuresRef.current.find((f) => {
          const featureName = f.properties.name;
          return (
            featureName === countryName ||
            countryNameMap[featureName as keyof typeof countryNameMap] === countryName ||
            countryNameMap[countryName as keyof typeof countryNameMap] === featureName
          );
        });
        return feature;
      })
      .filter(Boolean);

    if (features.length) {
      // Calculate bounds that encompass all selected countries
      const bounds = features.reduce((acc, feature) => {
        const [[x0, y0], [x1, y1]] = path.bounds(feature);
        return [
          [Math.min(acc[0][0], x0), Math.min(acc[0][1], y0)],
          [Math.max(acc[1][0], x1), Math.max(acc[1][1], y1)],
        ];
      }, path.bounds(features[0]));

      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;

      const scale = Math.min(8, 0.9 / Math.max(dx / width, dy / height));
      const translate = [width / 2 - scale * x, height / 2 - scale * y];

      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform as any,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale),
        );
    } else {
      svg
        .transition()
        .duration(750)
        .call(zoom.transform as any, d3.zoomIdentity);
    }
  }, []);

  const handleCountrySelect = useCallback(
    (options: readonly CountryOption[] = []) => {
      const countryNames = options.map((option) => option.value);
      onCountrySelect(countryNames);
      zoomToCountries(countryNames);
    },
    [onCountrySelect, zoomToCountries],
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    const projection = d3
      .geoMercator()
      .scale((width - 3) / (2 * Math.PI))
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);
    geoPathRef.current = path;

    const g = svg.append('g');

    const tooltip = d3
      .select(tooltipRef.current)
      .style('position', 'fixed')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('padding', '16px')
      .style('border', '1px solid #E2E8F0')
      .style('border-radius', '8px')
      .style('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)')
      .style('pointer-events', 'none')
      .style('font-family', "'Inter', 'Helvetica', 'Arial', sans-serif")
      .style('font-size', '14px')
      .style('z-index', '9999')
      .style('min-width', '280px')
      .style('max-width', '320px');

    countryData.then((worldData) => {
      const countries = feature(worldData, worldData.objects.countries);
      featuresRef.current = (countries as any).features;

      const maxScore = mapData.reduce((max, country) => {
        return Math.max(max, country.total);
      }, 0);

      const countryDataMap = new Map(mapData.map((d) => [d.country, d]));

      // Add Singapore point
      if (countryDataMap.has('Singapore')) {
        const singaporeData = countryDataMap.get('Singapore')!;
        const singaporeCoords = [103.8198, 1.3521] as [number, number]; // Singapore coordinates
        g.append('circle')
          .attr('cx', projection(singaporeCoords)![0])
          .attr('cy', projection(singaporeCoords)![1])
          .attr('r', 3)
          .attr('fill', () =>
            calculateColorIntensity(singaporeData.total, maxScore, selectedSector),
          )
          .attr('stroke', '#cbd5e0')
          .attr('stroke-width', selectedCountries.includes('Singapore') ? 2 : 0.5)
          .style(
            'opacity',
            selectedCountries.length && !selectedCountries.includes('Singapore') ? 0.5 : 1,
          )
          .style('cursor', 'pointer')
          .on('click', () => {
            const newSelectedCountries = selectedCountries.includes('Singapore')
              ? selectedCountries.filter((c) => c !== 'Singapore')
              : [...selectedCountries, 'Singapore'];
            onCountrySelect(newSelectedCountries);
            zoomToCountries(newSelectedCountries);
          })
          .on('mouseover', (event) => {
            // Show tooltip with Singapore data
            const tooltipContent = generateTooltipContent(selectedSector, singaporeData);
            tooltip.html(tooltipContent).style('visibility', 'visible');
            d3.select(event.currentTarget)
              .transition()
              .duration(200)
              .attr('stroke-width', '2')
              .attr('stroke', '#4A5568');
          })
          .on('mousemove', (event) => {
            const [mouseX, mouseY] = d3.pointer(event, document.body);
            const tooltipNode = tooltip.node() as HTMLDivElement;
            const tooltipWidth = tooltipNode.offsetWidth;
            const tooltipHeight = tooltipNode.offsetHeight;
            let left = mouseX + 16;
            let top = mouseY - tooltipHeight / 2;
            if (left + tooltipWidth > window.innerWidth) {
              left = mouseX - tooltipWidth - 16;
            }
            if (top < 0) {
              top = 0;
            } else if (top + tooltipHeight > window.innerHeight) {
              top = window.innerHeight - tooltipHeight;
            }
            tooltip.style('left', `${left}px`).style('top', `${top}px`);
          })
          .on('mouseout', (event) => {
            tooltip.style('visibility', 'hidden');
            d3.select(event.currentTarget)
              .transition()
              .duration(200)
              .attr('stroke-width', selectedCountries.includes('Singapore') ? 2 : 0.5)
              .attr('stroke', '#cbd5e0');
          });
      }

      g.selectAll('path')
        .data((countries as any).features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', (d: any) => {
          const countryName = d.properties.name;
          const mappedName =
            countryNameMap[countryName as keyof typeof countryNameMap] || countryName;
          const countryData = countryDataMap.get(mappedName);
          if (!countryData) return '#e2e8f0';

          return calculateColorIntensity(countryData.total, maxScore, selectedSector);
        })
        .attr('stroke', '#cbd5e0')
        .attr('stroke-width', (d: any) => {
          const countryName = d.properties.name;
          const mappedName =
            countryNameMap[countryName as keyof typeof countryNameMap] || countryName;
          const isSelected = selectedCountries.includes(mappedName);
          return isSelected ? 2 : 0.5;
        })
        .style('opacity', (d: any) => {
          if (!selectedCountries.length) return 1;
          const countryName = d.properties.name;
          const mappedName =
            countryNameMap[countryName as keyof typeof countryNameMap] || countryName;
          return selectedCountries.includes(mappedName) ? 1 : 0.5;
        })
        .style('cursor', 'pointer')
        .on('click', (_, d: any) => {
          const countryName = d.properties.name;
          const mappedName =
            countryNameMap[countryName as keyof typeof countryNameMap] || countryName;
          let newSelectedCountries;
          if (selectedCountries.includes(mappedName)) {
            newSelectedCountries = selectedCountries.filter((c) => c !== mappedName);
          } else {
            newSelectedCountries = [...selectedCountries, mappedName];
          }
          onCountrySelect(newSelectedCountries);
          zoomToCountries(newSelectedCountries);
        })
        .on('mouseover', (event, d: any) => {
          const countryName = d.properties.name;
          const mappedName =
            countryNameMap[countryName as keyof typeof countryNameMap] || countryName;
          const countryData = countryDataMap.get(mappedName);
          if (countryData) {
            const tooltipContent = generateTooltipContent(selectedSector, countryData);
            tooltip.html(tooltipContent).style('visibility', 'visible');
            d3.select(event.currentTarget)
              .transition()
              .duration(200)
              .attr('stroke-width', '2')
              .attr('stroke', '#4A5568');
          }
        })
        .on('mousemove', (event) => {
          const [mouseX, mouseY] = d3.pointer(event, document.body);
          const tooltipNode = tooltip.node() as HTMLDivElement;
          const tooltipWidth = tooltipNode.offsetWidth;
          const tooltipHeight = tooltipNode.offsetHeight;
          let left = mouseX + 16;
          let top = mouseY - tooltipHeight / 2;
          if (left + tooltipWidth > window.innerWidth) {
            left = mouseX - tooltipWidth - 16;
          }
          if (top < 0) {
            top = 0;
          } else if (top + tooltipHeight > window.innerHeight) {
            top = window.innerHeight - tooltipHeight;
          }
          tooltip.style('left', `${left}px`).style('top', `${top}px`);
        })
        .on('mouseout', (event) => {
          tooltip.style('visibility', 'hidden');
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('stroke-width', (d) => {
              const countryName = (d as any).properties.name;
              const mappedName =
                countryNameMap[countryName as keyof typeof countryNameMap] || countryName;
              const isSelected = selectedCountries.includes(mappedName);
              return isSelected ? 2 : 0.5;
            })
            .attr('stroke', '#cbd5e0');
        });

      const zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });
      zoomRef.current = zoom;
      svg.call(zoom as any);
      if (selectedCountries.length) {
        zoomToCountries(selectedCountries);
      }
    });
  }, [mapData, countryData, selectedCountries, selectedSector, onCountrySelect, zoomToCountries]);

  const handleZoom = (action: 'in' | 'out' | 'reset') => {
    if (!svgRef.current || !zoomRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoom = zoomRef.current;

    if (action === 'reset') {
      svg
        .transition()
        .duration(750)
        .call(zoom.transform as any, d3.zoomIdentity);
    } else {
      const scale = action === 'in' ? 1.5 : 0.667;
      const currentTransform = d3.zoomTransform(svg.node()!);

      svg
        .transition()
        .duration(750)
        .call(zoom.transform as any, currentTransform.scale(scale));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select<CountryOption, true>
          className="w-[400px]"
          value={selectedOptions}
          onChange={(options) => handleCountrySelect(options || [])}
          options={countryOptions}
          isMulti
          isClearable
          placeholder="Search for countries..."
          classNames={{
            control: (state) =>
              `!bg-white !border-gray-300 !shadow-sm hover:!border-gray-400 ${
                state.isFocused ? '!border-blue-500 !ring-1 !ring-blue-500' : ''
              }`,
            option: (state) =>
              `!py-2 !px-3 ${
                state.isSelected
                  ? '!bg-blue-500 !text-white'
                  : state.isFocused
                    ? '!bg-blue-50 !text-gray-900'
                    : '!text-gray-700'
              }`,
          }}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom('in')}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => handleZoom('reset')}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            title="Reset Zoom"
          >
            <RotateCcw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="relative">
        <svg
          ref={svgRef}
          width="100%"
          height="400"
          className="bg-gray-50"
          style={{ overflow: 'hidden' }}
        />
        <div ref={tooltipRef} />
      </div>
    </div>
  );
}
