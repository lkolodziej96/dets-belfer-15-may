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

interface ChartDataItem {
  country: string;
  [key: string]: number | string;
  total: number;
}

interface StackDatum {
  [key: string]: number;
  data: ChartDataItem;
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

  const aiKeys = Object.keys(defaultAISubsectorWeights);
  const quantumKeys = Object.keys(defaultQuantumSubsectorWeights);
  const semiconductorsKeys = Object.keys(defaultSemiconductorsSubsectorWeights);
  const biotechKeys = Object.keys(defaultBiotechSubsectorWeights);
  const spaceKeys = Object.keys(defaultSpaceSubsectorWeights);

  // Calculate raw sector scores first (without top-level weights)
  const aiChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.ai ?? {};
        let sectorTotal = 0;

        aiKeys.forEach((k) => {
          sectorTotal += (raw[k] ?? 0) * defaultAISubsectorWeights[k];
        });

        return {
          country: d.country,
          ai: Number(sectorTotal.toFixed(15)),
          total: Number(sectorTotal.toFixed(15)),
        };
      }),
    [data, aiKeys],
  );

  const quantumChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.quantum ?? {};
        let sectorTotal = 0;

        quantumKeys.forEach((k) => {
          sectorTotal += (raw[k] ?? 0) * defaultQuantumSubsectorWeights[k];
        });

        return {
          country: d.country,
          quantum: Number(sectorTotal.toFixed(15)),
          total: Number(sectorTotal.toFixed(15)),
        };
      }),
    [data, quantumKeys],
  );

  const semiconductorsChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.semiconductors ?? {};
        let sectorTotal = 0;

        semiconductorsKeys.forEach((k) => {
          sectorTotal += (raw[k] ?? 0) * defaultSemiconductorsSubsectorWeights[k];
        });

        return {
          country: d.country,
          semiconductors: Number(sectorTotal.toFixed(15)),
          total: Number(sectorTotal.toFixed(15)),
        };
      }),
    [data, semiconductorsKeys],
  );

  const biotechChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.biotech ?? {};
        let sectorTotal = 0;

        biotechKeys.forEach((k) => {
          sectorTotal += (raw[k] ?? 0) * defaultBiotechSubsectorWeights[k];
        });

        return {
          country: d.country,
          biotech: Number(sectorTotal.toFixed(15)),
          total: Number(sectorTotal.toFixed(15)),
        };
      }),
    [data, biotechKeys],
  );

  const spaceChartData = useMemo(
    () =>
      data.map((d) => {
        const raw = d.sectorDetails?.space ?? {};
        let sectorTotal = 0;

        spaceKeys.forEach((k) => {
          sectorTotal += (raw[k] ?? 0) * defaultSpaceSubsectorWeights[k];
        });

        return {
          country: d.country,
          space: Number(sectorTotal.toFixed(15)),
          total: Number(sectorTotal.toFixed(15)),
        };
      }),
    [data, spaceKeys],
  );

  // Now apply top-level sector weights
  const mainChartData = useMemo(
    () =>
      data.map((d) => {
        const aiScore = aiChartData.find((c) => c.country === d.country)?.total ?? 0;
        const quantumScore = quantumChartData.find((c) => c.country === d.country)?.total ?? 0;
        const semiconductorsScore =
          semiconductorsChartData.find((c) => c.country === d.country)?.total ?? 0;
        const biotechScore = biotechChartData.find((c) => c.country === d.country)?.total ?? 0;
        const spaceScore = spaceChartData.find((c) => c.country === d.country)?.total ?? 0;

        const weighted = {
          ai: Number((aiScore * (sectorWeights.ai ?? 0)).toFixed(15)),
          quantum: Number((quantumScore * (sectorWeights.quantum ?? 0)).toFixed(15)),
          semiconductors: Number((semiconductorsScore * (sectorWeights.semiconductors ?? 0)).toFixed(15)),
          biotech: Number((biotechScore * (sectorWeights.biotech ?? 0)).toFixed(15)),
          space: Number((spaceScore * (sectorWeights.space ?? 0)).toFixed(15)),
        };

        const total = Number(
          Object.values(weighted).reduce((sum, score) => sum + score, 0).toFixed(15),
        );

        return {
          country: d.country,
          ...weighted,
          total,
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
    ],
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 100, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

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

    const sortedData = [...chartData].sort((a, b) => (b.total || 0) - (a.total || 0));

    const svg = d3.select(svgRef.current);
    if (svg.select('g').empty()) {
      svg.selectAll('*').remove();
      svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    }
    const g = svg.select('g');

    const x = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.country))
      .range([0, innerWidth])
      .padding(0.2);

    const stackGen = d3.stack<ChartDataItem>().keys(keys);
    const layers = stackGen(sortedData);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(layers[layers.length - 1], (d) => d[1]) ?? 0])
      .range([innerHeight, 0]);

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
      xAxis.transition().duration(750).call(d3.axisBottom(x).tickSizeOuter(0));
    }

    const yAxis = g.select('.y-axis');
    if (yAxis.empty()) {
      g.append('g').attr('class', 'y-axis').call(d3.axisLeft(y).ticks(8));
    } else {
      yAxis.transition().duration(750).call(d3.axisLeft(y).ticks(8));
    }

    svg
      .selectAll('.domain, .tick line')
      .style('stroke', '#cbd5e0')
      .style('stroke-width', '1px');

    const layerGroups = g.selectAll<SVGGElement, d3.Series<ChartDataItem, string>>('g.layer').data(layers);
    layerGroups.exit().remove();

    const layerGroupsEnter = layerGroups
      .enter()
      .append('g')
      .attr('class', 'layer');

    const layerMerge = layerGroups.merge(layerGroupsEnter).style('fill', (_d, i) => {
      const key = keys[i];
      if (viewState.type === 'sector') {
        switch (viewState.sector) {
          case 'ai':
            return aiSubsectorColors[key as keyof typeof aiSubsectorColors];
          case 'quantum':
            return quantumSubsectorColors[key as keyof typeof quantumSubsectorColors];
          case 'semiconductors':
            return semiconductorsSubsectorColors[key as keyof typeof semiconductorsSubsectorColors];
          case 'biotech':
            return biotechSubsectorColors[key as keyof typeof biotechSubsectorColors];
          case 'space':
            return spaceSubsectorColors[key as keyof typeof spaceSubsectorColors];
          default:
            return '#e2e8f0';
        }
      }
      return sectorColors[key as keyof typeof sectorColors];
    });

    const normalW = x.bandwidth();
    const selectedW = normalW * 1.1;

    const rects = layerMerge.selectAll<SVGRectElement, d3.SeriesPoint<ChartDataItem>>('rect').data((d) => d);
    rects.exit().remove();

    const rectsEnter = rects
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.data.country) ?? 0)
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('width', normalW);

    rects
      .merge(rectsEnter)
      .transition()
      .duration(750)
      .attr('x', (d) => {
        const base = x(d.data.country) ?? 0;
        return selectedCountries.includes(d.data.country)
          ? base - (selectedW - normalW) / 2
          : base;
      })
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(d[0]) - y(d[1]))
      .attr('width', (d) =>
        selectedCountries.includes(d.data.country) ? selectedW : normalW
      )
      .style('opacity', (d, i, nodes) => {
        const key = keys[d3.select(nodes[i].parentNode as SVGGElement).datum().index];
        if (selectedCountries.length && !selectedCountries.includes(d.data.country))
          return 0.3;
        if (selectedSector && key !== selectedSector) return 0.3;
        return 1;
      });

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
      .on('mouseover', (event, d) => {
        const layerKey = keys[
          d3.select(event.currentTarget.parentNode as SVGGElement).datum().index
        ];
        const val = d.data[layerKey];
        const color =
          viewState.type === 'sector'
            ? viewState.sector === 'ai'
              ? aiSubsectorColors[layerKey as keyof typeof aiSubsectorColors]
              : viewState.sector === 'quantum'
              ? quantumSubsectorColors[layerKey as keyof typeof quantumSubsectorColors]
              : viewState.sector === 'semiconductors'
              ? semiconductorsSubsectorColors[layerKey as keyof typeof semiconductorsSubsectorColors]
              : viewState.sector === 'biotech'
              ? biotechSubsectorColors[layerKey as keyof typeof biotechSubsectorColors]
              : spaceSubsectorColors[layerKey as keyof typeof spaceSubsectorColors]
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
             <span style="color:${color}">■</span> ${label}: ${(val as number).toFixed(3)}<br/>
             <em>Total: ${d.data.total.toFixed(3)}</em>`,
          )
          .style('visibility', 'visible');
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current);
        tooltip.style('top', `${my + 8}px`).style('left', `${mx + 8}px`);
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'))
      .on('click', (_e, d) => {
        const c = d.data.country;
        onCountrySelect(
          selectedCountries.includes(c)
            ? selectedCountries.filter((x) => x !== c)
            : [...selectedCountries, c],
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
    aiKeys,
    quantumKeys,
    semiconductorsKeys,
    biotechKeys,
    spaceKeys,
  ]);

  return (
    <div ref={containerRef} className="relative">
      <svg ref={svgRef} width="100%" height="400" />
      <div ref={tooltipRef} className="absolute pointer-events-none" />
    </div>
  );
};

export default BarChart;