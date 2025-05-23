import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import Select from 'react-select';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { CountryData, ViewState, CountryOption } from '../types';
import { calculateColorIntensity } from '../utils/dataProcessing';
import { subsectorDefinitions, sectorColors, viewBaseColors } from '../utils/constants';

interface Props {
  data: CountryData[];
  selectedSector: string | null;
  selectedCountries: string[];
  onCountrySelect: (countries: string[]) => void;
  viewState: ViewState;
  sectorWeights?: Record<string, number>;
}

const WorldMap: React.FC<Props> = ({
  data,
  selectedSector,
  selectedCountries,
  onCountrySelect,
  viewState,
  sectorWeights = {},
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<Element, unknown>>();
  const geoPathRef = useRef<d3.GeoPath>();
  const featuresRef = useRef<any[]>([]);
  const countryData = useMemo(
    () =>
      fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json').then((response) =>
        response.json(),
      ),
    [],
  );

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

  const countryOptions = useMemo(() => {
    return data
      .map((country) => ({
        value: country.country,
        label: country.country,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  const selectedOptions = useMemo(() => {
    return selectedCountries.map((country) => ({
      value: country,
      label: country,
    }));
  }, [selectedCountries]);

  const handleZoom = (action: 'in' | 'out' | 'reset') => {
    if (!svgRef.current || !zoomRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoom = zoomRef.current;

    if (action === 'reset') {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    } else {
      const scale = action === 'in' ? 1.5 : 0.667;
      const currentTransform = d3.zoomTransform(svg.node()!);

      svg.transition().duration(750).call(zoom.transform, currentTransform.scale(scale));
    }
  };

  const zoomToCountries = (countryNames: string[]) => {
    if (!svgRef.current || !zoomRef.current || !geoPathRef.current || !countryNames.length) return;

    const svg = d3.select(svgRef.current);
    const zoom = zoomRef.current;
    const path = geoPathRef.current;
    const width = svgRef.current.clientWidth;
    const height = 400;

    if (countryNames.length === 1 && countryNames[0] === 'Singapore') {
      // Special handling for Singapore
      const singaporeCoords = [103.8198, 1.3521]; // Singapore coordinates
      const projection = d3
        .geoMercator()
        .scale((width - 3) / (2 * Math.PI))
        .translate([width / 2, height / 2]);

      const [x, y] = projection(singaporeCoords);
      const scale = 15;

      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
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
            countryNameMap[featureName] === countryName ||
            countryNameMap[countryName] === featureName
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
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    } else {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }
  };

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

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
      featuresRef.current = countries.features;

      const maxScore =
        d3.max(data, (d) => {
          if (viewState.type === 'sector' && viewState.sector) {
            const sectorDetails = d.sectorDetails?.[viewState.sector] ?? {};
            return d3.max(Object.values(sectorDetails)) || 0;
          }
          return selectedSector ? d.sectorScores[selectedSector] : d.totalScore;
        }) || 0;

      const countryDataMap = new Map(data.map((d) => [d.country, d]));

      // Add Singapore point
      if (countryDataMap.has('Singapore')) {
        const singaporeData = countryDataMap.get('Singapore')!;
        const singaporeCoords = [103.8198, 1.3521]; // Singapore coordinates

        g.append('circle')
          .attr('cx', projection(singaporeCoords)![0])
          .attr('cy', projection(singaporeCoords)![1])
          .attr('r', 3)
          .attr('fill', () => {
            let score;
            if (viewState.type === 'sector' && viewState.sector) {
              const sectorScores = Object.values(
                singaporeData.sectorDetails?.[viewState.sector] ?? {},
              );
              score =
                sectorScores.length > 0
                  ? sectorScores.reduce((sum, val) => sum + (val ?? 0), 0) / sectorScores.length
                  : 0;
            } else {
              score = selectedSector
                ? singaporeData.sectorScores[selectedSector]
                : singaporeData.totalScore;
            }

            return calculateColorIntensity(score, maxScore, viewState.type, viewState.sector);
          })
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
            const tooltipContent = generateTooltipContent(singaporeData, viewState, selectedSector);
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
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', (d: any) => {
          const countryName = d.properties.name;
          const mappedName = countryNameMap[countryName] || countryName;
          const countryData = countryDataMap.get(mappedName);

          if (!countryData) return '#e2e8f0';

          let score;
          if (viewState.type === 'sector' && viewState.sector) {
            const sectorScores = Object.values(countryData.sectorDetails?.[viewState.sector] ?? {});
            score =
              sectorScores.length > 0
                ? sectorScores.reduce((sum, val) => sum + (val ?? 0), 0) / sectorScores.length
                : 0;
          } else {
            score = selectedSector
              ? countryData.sectorScores[selectedSector]
              : countryData.totalScore;
          }

          return calculateColorIntensity(score, maxScore, viewState.type, viewState.sector);
        })
        .attr('stroke', '#cbd5e0')
        .attr('stroke-width', (d: any) => {
          const countryName = d.properties.name;
          const mappedName = countryNameMap[countryName] || countryName;
          const isSelected = selectedCountries.includes(mappedName);
          return isSelected ? 2 : 0.5;
        })
        .style('opacity', (d: any) => {
          if (!selectedCountries.length) return 1;
          const countryName = d.properties.name;
          const mappedName = countryNameMap[countryName] || countryName;
          return selectedCountries.includes(mappedName) ? 1 : 0.5;
        })
        .style('cursor', 'pointer')
        .on('click', (event, d: any) => {
          const countryName = d.properties.name;
          const mappedName = countryNameMap[countryName] || countryName;

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
          const mappedName = countryNameMap[countryName] || countryName;
          const countryData = countryDataMap.get(mappedName);

          if (countryData) {
            const tooltipContent = generateTooltipContent(countryData, viewState, selectedSector);
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
              const mappedName = countryNameMap[countryName] || countryName;
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
  }, [
    data,
    selectedSector,
    selectedCountries,
    onCountrySelect,
    viewState,
    countryNameMap,
    countryData,
  ]);

  const handleCountrySelect = (options: readonly CountryOption[]) => {
    const countryNames = options.map((option) => option.value);
    onCountrySelect(countryNames);
    zoomToCountries(countryNames);
  };

  const generateTooltipContent = (
    countryData: CountryData,
    viewState: ViewState,
    selectedSector: string | null,
  ) => {
    let tooltipContent = `
      <div style="font-weight: 700; margin-bottom: 8px; color: #1A202C; font-size: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
        ${countryData.country}
      </div>
      <div style="margin-bottom: 8px;">
    `;

    if (viewState.type === 'sector' && viewState.sector) {
      // Show subsector scores
      const sectorDetails = countryData.sectorDetails?.[viewState.sector] ?? {};
      const subsectorDefs = subsectorDefinitions[viewState.sector] ?? {};
      const baseColor = viewBaseColors[viewState.sector];

      Object.entries(sectorDetails).forEach(([key, value], index) => {
        const intensity = index / Object.keys(sectorDetails).length;
        const color = d3.color(baseColor)!.brighter(intensity).toString();

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
              ${subsectorDefs[key] ?? key}
            </div>
            <div style="color: #2D3748; font-weight: 500;">
              ${(value as number).toFixed(3)}
            </div>
          </div>
        `;
      });
    } else {
      // Show sector scores
      Object.entries(countryData.sectorDetails ?? {}).forEach(([sector, details]) => {
        const sectorScore = Object.values(details).reduce((sum, val) => sum + (val ?? 0), 0);
        const color = sectorColors[sector];

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
              ${sector.toUpperCase()}
            </div>
            <div style="color: #2D3748; font-weight: 500;">
              ${sectorScore.toFixed(3)}
            </div>
          </div>
        `;
      });
    }

    // Calculate and show total score
    const totalScore =
      viewState.type === 'sector' && viewState.sector
        ? Object.values(countryData.sectorDetails?.[viewState.sector] ?? {}).reduce(
            (sum, val) => sum + (val ?? 0),
            0,
          )
        : countryData.totalScore;

    tooltipContent += `
      </div>
      <div style="font-weight: 600; color: #2D3748; border-top: 1px solid #E2E8F0; padding-top: 6px;">
        Total Score: ${totalScore.toFixed(3)}
      </div>
    `;

    return tooltipContent;
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
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => handleZoom('reset')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
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
};

export default WorldMap;
