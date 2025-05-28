import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import type { CountryData, ViewState } from '../types';
import {
  sectorColors,
  subsectorDefinitions,
  aiSubsectorColors,
  quantumSubsectorColors,
  spaceSubsectorColors,
  semiconductorsSubsectorColors,
  biotechSubsectorColors,
  defaultSpaceSubsectorWeights,
  defaultBiotechSubsectorWeights,
  defaultAISubsectorWeights,
  defaultQuantumSubsectorWeights,
  defaultSemiconductorsSubsectorWeights,
} from '../utils/constants';

interface Props {
  data: CountryData[];
  selectedSector: string | null;
  selectedCountries: string[];
  onCountrySelect: (countries: string[]) => void;
  viewState: ViewState;
  sectorWeights?: Record<string, number>;
}

const BarChart: React.FC<Props> = ({
  data,
  selectedSector,
  selectedCountries,
  onCountrySelect,
  viewState,
  sectorWeights = {},
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1) Build key arrays from your weight maps
  const aiKeys = Object.keys(defaultAISubsectorWeights) as Array<
    keyof typeof defaultAISubsectorWeights
  >;
  const quantumKeys = Object.keys(defaultQuantumSubsectorWeights) as Array<
    keyof typeof defaultQuantumSubsectorWeights
  >;
  const semiconductorsKeys = Object.keys(
    defaultSemiconductorsSubsectorWeights
  ) as Array<keyof typeof defaultSemiconductorsSubsectorWeights>;
  const biotechKeys = Object.keys(defaultBiotechSubsectorWeights) as Array<
    keyof typeof defaultBiotechSubsectorWeights
  >;
  const spaceKeys = Object.keys(defaultSpaceSubsectorWeights) as Array<
    keyof typeof defaultSpaceSubsectorWeights
  >;

  // 2) Precompute a tiny "flattened + weighted" array per view
  const aiChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.ai ?? {};
        const weighted: Record<string, number> = {};

        aiKeys.forEach((k) => {
          weighted[k] = Number(
            ((raw[k] ?? 0) * defaultAISubsectorWeights[k]).toFixed(15)
          );
        });

        return {
          country: d.country,
          ...weighted,
          total: Number(
            aiKeys
              .reduce((sum, k) => sum + weighted[k], 0)
              .toFixed(15)
          ),
        };
      }),
    [data]
  );

  const quantumChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.quantum ?? {};
        const weighted: Record<string, number> = {};

        quantumKeys.forEach((k) => {
          weighted[k] = Number(
            ((raw[k] ?? 0) * defaultQuantumSubsectorWeights[k]).toFixed(15)
          );
        });

        return {
          country: d.country,
          ...weighted,
          total: Number(
            quantumKeys
              .reduce((sum, k) => sum + weighted[k], 0)
              .toFixed(15)
          ),
        };
      }),
    [data]
  );

  const semiconductorsChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.semiconductors ?? {};
        const weighted: Record<string, number> = {};

        semiconductorsKeys.forEach((k) => {
          weighted[k] = Number(
            ((raw[k] ?? 0) * defaultSemiconductorsSubsectorWeights[k]).toFixed(
              15
            )
          );
        });

        return {
          country: d.country,
          ...weighted,
          total: Number(
            semiconductorsKeys
              .reduce((sum, k) => sum + weighted[k], 0)
              .toFixed(15)
          ),
        };
      }),
    [data]
  );

  const biotechChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.biotech ?? {};
        const weighted: Record<string, number> = {};

        biotechKeys.forEach((k) => {
          weighted[k] = Number(
            ((raw[k] ?? 0) * defaultBiotechSubsectorWeights[k]).toFixed(15)
          );
        });

        return {
          country: d.country,
          ...weighted,
          total: Number(
            biotechKeys
              .reduce((sum, k) => sum + weighted[k], 0)
              .toFixed(15)
          ),
        };
      }),
    [data]
  );

  const spaceChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.space ?? {};
        const weighted: Record<string, number> = {};

        spaceKeys.forEach((k) => {
          weighted[k] = Number(
            ((raw[k] ?? 0) * defaultSpaceSubsectorWeights[k]).toFixed(15)
          );
        });

        return {
          country: d.country,
          ...weighted,
          total: Number(
            spaceKeys
              .reduce((sum, k) => sum + weighted[k], 0)
              .toFixed(15)
          ),
        };
      }),
    [data]
  );

  // 3) For the "Overview" view, flatten each country's 5 sector totals * top-level weight
  const mainChartData = useMemo(
    () =>
      data.map((d) => {
        const aiTotal =
          aiChartData.find((c) => c.country === d.country)?.total ?? 0;
        const qtTotal =
          quantumChartData.find((c) => c.country === d.country)?.total ??
          0;
        const scTotal =
          semiconductorsChartData.find((c) => c.country === d.country)
            ?.total ?? 0;
        const btTotal =
          biotechChartData.find((c) => c.country === d.country)?.total ?? 0;
        const spTotal =
          spaceChartData.find((c) => c.country === d.country)?.total ?? 0;

        const weighted: Record<string, number> = {
          ai: Number((aiTotal * (sectorWeights.ai ?? 0)).toFixed(15)),
          quantum: Number((qtTotal * (sectorWeights.quantum ?? 0)).toFixed(15)),
          semiconductors: Number(
            (scTotal * (sectorWeights.semiconductors ?? 0)).toFixed(15)
          ),
          biotech: Number((btTotal * (sectorWeights.biotech ?? 0)).toFixed(15)),
          space: Number((spTotal * (sectorWeights.space ?? 0)).toFixed(15)),
        };

        return {
          country: d.country,
          ...weighted,
          total: Number(
            Object.values(weighted)
              .reduce((sum, v) => sum + v, 0)
              .toFixed(15)
          ),
        };
      }),
    [
      data,
      aiChartData,
      quantumChartData,
      semiconductorsChartData,
      biotechChartData,
      spaceChartData,
      sectorWeights,
    ]
  );

  useEffect(() => {
    if (
      !svgRef.current ||
      !containerRef.current ||
      data.length === 0
    )
      return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 100, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 4) Pick the right precomputed data & keys
    const chartData =
      viewState.type === 'sector'
        ? viewState.sector === 'ai'
          ? aiChartData
          : viewState.sector === 'quantum'
          ? quantumChartData
          : viewState.sector === 'semiconductors'
          ? semiconductorsChartData
          : viewState.sector === 'biotech'
          ? biotechChartData
          : spaceChartData
        : mainChartData;

    const keys =
      viewState.type === 'sector'
        ? viewState.sector === 'ai'
          ? aiKeys
          : viewState.sector === 'quantum'
          ? quantumKeys
          : viewState.sector === 'semiconductors'
          ? semiconductorsKeys
          : viewState.sector === 'biotech'
          ? biotechKeys
          : spaceKeys
        : ['ai', 'quantum', 'semiconductors', 'biotech', 'space'];

    // 5) Sort by each object's `total` field
    const sortedData = [...chartData].sort(
      (a, b) => (b.total || 0) - (a.total || 0)
    );

    const svg = d3.select(svgRef.current);
    if (svg.select('g').empty()) {
      svg.selectAll('*').remove();
      svg.append('g').attr(
        'transform',
        `translate(${margin.left},${margin.top})`
      );
    }
    const g = svg.select('g');

    // 6) Scales & axes
    const x = d3
      .scaleBand<string>()
      .domain(sortedData.map((d) => d.country))
      .range([0, innerWidth])
      .padding(0.2);

    const stackGen = d3.stack<Record<string, any>>().keys(keys);
    const layers = stackGen(sortedData);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(layers[layers.length - 1], (d) => d[1]) ?? 0,
      ])
      .range([innerHeight, 0]);

    // X axis
    const xAxis = g.select('.x-axis');
    if (xAxis.empty()) {
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-0.8em')
        .attr('dy', '0.15em');
    } else {
      xAxis
        .transition()
        .duration(750)
        .call(d3.axisBottom(x).tickSizeOuter(0));
    }

    // Y axis
    const yAxis = g.select('.y-axis');
    if (yAxis.empty()) {
      g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y).ticks(8));
    } else {
      yAxis.transition().duration(750).call(d3.axisLeft(y).ticks(8));
    }

    svg
      .selectAll('.domain, .tick line')
      .style('stroke', '#cbd5e0')
      .style('stroke-width', '1px');

    // 7) Draw the stacks
    const layerGroups = g.selectAll('g.layer').data(layers);
    layerGroups.exit().remove();

    const layerGroupsEnter = layerGroups
      .enter()
      .append('g')
      .attr('class', 'layer');

    const layerMerge = layerGroups
      .merge(layerGroupsEnter)
      .style('fill', (_d, i) => {
        const key = keys[i];
        if (viewState.type === 'sector') {
          switch (viewState.sector) {
            case 'ai':
              return aiSubsectorColors[key as keyof typeof aiSubsectorColors];
            case 'quantum':
              return quantumSubsectorColors[
                key as keyof typeof quantumSubsectorColors
              ];
            case 'semiconductors':
              return semiconductorsSubsectorColors[
                key as keyof typeof semiconductorsSubsectorColors
              ];
            case 'biotech':
              return biotechSubsectorColors[
                key as keyof typeof biotechSubsectorColors
              ];
            case 'space':
              return spaceSubsectorColors[
                key as keyof typeof spaceSubsectorColors
              ];
          }
        }
        return sectorColors[key as keyof typeof sectorColors];
      });

    const normalW = x.bandwidth();
    const selectedW = normalW * 1.1;

    // bind & update rects
    const rects = layerMerge.selectAll('rect').data((d) => d);
    rects.exit().remove();

    const rectsEnter = rects
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.data.country) ?? 0)
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('width', normalW);

    rects
      .merge(rectsEnter)
      .transition()
      .duration(750)
      .attr('x', (d: any) => {
        const base = x(d.data.country) ?? 0;
        return selectedCountries.includes(d.data.country)
          ? base - (selectedW - normalW) / 2
          : base;
      })
      .attr('y', (d: any) => y(d[1]))
      .attr('height', (d: any) => y(d[0]) - y(d[1]))
      .attr('width', (d: any) =>
        selectedCountries.includes(d.data.country) ? selectedW : normalW
      )
      .style('opacity', (d: any, i, nodes) => {
        const key = keys[d3.select(nodes[i].parentNode).datum().index];
        if (selectedCountries.length && !selectedCountries.includes(d.data.country))
          return 0.3;
        if (selectedSector && key !== selectedSector) return 0.3;
        return 1;
      });

    // 8) Tooltip interactivity
    const tooltip = d3
      .select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'white')
      .style('padding', '8px')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('font-size', '13px');

    layerMerge
      .selectAll('rect')
      .on('mouseover', (event, d: any) => {
        const layerKey = keys[
          d3.select(event.currentTarget.parentNode).datum().index
        ];
        const val = d.data[layerKey];
        const color =
          viewState.type === 'sector'
            ? viewState.sector === 'ai'
              ? aiSubsectorColors[layerKey as keyof typeof aiSubsectorColors]
              : viewState.sector === 'quantum'
              ? quantumSubsectorColors[
                  layerKey as keyof typeof quantumSubsectorColors
                ]
              : viewState.sector === 'semiconductors'
              ? semiconductorsSubsectorColors[
                  layerKey as keyof typeof semiconductorsSubsectorColors
                ]
              : viewState.sector === 'biotech'
              ? biotechSubsectorColors[
                  layerKey as keyof typeof biotechSubsectorColors
                ]
              : spaceSubsectorColors[
                  layerKey as keyof typeof spaceSubsectorColors
                ]
            : sectorColors[layerKey as keyof typeof sectorColors];

        const label =
          viewState.type === 'sector'
            ? subsectorDefinitions[viewState.sector!][
                layerKey as keyof typeof subsectorDefinitions['ai']
              ]
            : layerKey.toUpperCase();

        tooltip
          .html(
            `<strong>${d.data.country}</strong><br/>
             <span style="color:${color}">■</span> ${label}: ${val.toFixed(
              3
            )}<br/>
             <em>Total: ${d.data.total.toFixed(3)}</em>`
          )
          .style('visibility', 'visible');
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current);
        tooltip.style('top', `${my + 8}px`).style('left', `${mx + 8}px`);
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'))
      .on('click', (_e, d: any) => {
        const c = d.data.country;
        onCountrySelect(
          selectedCountries.includes(c)
            ? selectedCountries.filter((x) => x !== c)
            : [...selectedCountries, c]
        );
      });
  }, [
    data,
    viewState,
    selectedCountries,
    selectedSector,
    onCountrySelect,
    sectorWeights,
    aiChartData,
    quantumChartData,
    semiconductorsChartData,
    biotechChartData,
    spaceChartData,
    mainChartData,
  ]);

  return (
    <div ref={containerRef} className="relative">
      <svg ref={svgRef} width="100%" height="400" />
      <div ref={tooltipRef} className="absolute pointer-events-none" />
    </div>
  );
};

export default BarChart;