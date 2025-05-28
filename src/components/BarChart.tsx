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

  // Debug log for initial data
  console.log('Initial data for US:', data.find(d => d.country === 'United States'));
  console.log('Sector weights:', sectorWeights);

  const calculateSubsectorScore = (value: number = 0, weight: number = 0): number => {
    const score = Number((value * weight).toFixed(15));
    return score;
  };

  const calculateSectorScore = (
    sectorDetails: Record<string, number> = {},
    weights: Record<string, number>,
  ): number => {
    const score = Number(
      Object.entries(sectorDetails)
        .reduce((total, [key, value]) => {
          return total + calculateSubsectorScore(value, weights[key] ?? 0);
        }, 0)
        .toFixed(15),
    );
    return score;
  };

  const aiChartData = useMemo(() => {
    const data_us = data.find(d => d.country === 'United States');
    if (data_us) {
      console.log('US AI raw data:', data_us.sectorDetails?.ai);
      console.log('AI weights:', defaultAISubsectorWeights);
    }

    return data.map((d) => {
      const subsectorData = d.sectorDetails?.ai ?? {};
      const weighted: Record<string, number> = {};

      Object.entries(defaultAISubsectorWeights).forEach(([key, weight]) => {
        weighted[key] = calculateSubsectorScore(subsectorData[key], weight);
      });

      const total = calculateSectorScore(subsectorData, defaultAISubsectorWeights);

      if (d.country === 'United States') {
        console.log('US AI weighted data:', weighted);
        console.log('US AI total:', total);
      }

      return {
        country: d.country,
        ...weighted,
        total,
      };
    });
  }, [data]);

  // Similar debug logs for other sectors...
  const quantumChartData = useMemo(() => {
    const data_us = data.find(d => d.country === 'United States');
    if (data_us) {
      console.log('US Quantum raw data:', data_us.sectorDetails?.quantum);
      console.log('Quantum weights:', defaultQuantumSubsectorWeights);
    }

    return data.map((d) => {
      const subsectorData = d.sectorDetails?.quantum ?? {};
      const weighted: Record<string, number> = {};

      Object.entries(defaultQuantumSubsectorWeights).forEach(([key, weight]) => {
        weighted[key] = calculateSubsectorScore(subsectorData[key], weight);
      });

      const total = calculateSectorScore(subsectorData, defaultQuantumSubsectorWeights);

      if (d.country === 'United States') {
        console.log('US Quantum weighted data:', weighted);
        console.log('US Quantum total:', total);
      }

      return {
        country: d.country,
        ...weighted,
        total,
      };
    });
  }, [data]);

  const semiconductorsChartData = useMemo(() => {
    const data_us = data.find(d => d.country === 'United States');
    if (data_us) {
      console.log('US Semiconductors raw data:', data_us.sectorDetails?.semiconductors);
      console.log('Semiconductors weights:', defaultSemiconductorsSubsectorWeights);
    }

    return data.map((d) => {
      const subsectorData = d.sectorDetails?.semiconductors ?? {};
      const weighted: Record<string, number> = {};

      Object.entries(defaultSemiconductorsSubsectorWeights).forEach(([key, weight]) => {
        weighted[key] = calculateSubsectorScore(subsectorData[key], weight);
      });

      const total = calculateSectorScore(subsectorData, defaultSemiconductorsSubsectorWeights);

      if (d.country === 'United States') {
        console.log('US Semiconductors weighted data:', weighted);
        console.log('US Semiconductors total:', total);
      }

      return {
        country: d.country,
        ...weighted,
        total,
      };
    });
  }, [data]);

  const biotechChartData = useMemo(() => {
    const data_us = data.find(d => d.country === 'United States');
    if (data_us) {
      console.log('US Biotech raw data:', data_us.sectorDetails?.biotech);
      console.log('Biotech weights:', defaultBiotechSubsectorWeights);
    }

    return data.map((d) => {
      const subsectorData = d.sectorDetails?.biotech ?? {};
      const weighted: Record<string, number> = {};

      Object.entries(defaultBiotechSubsectorWeights).forEach(([key, weight]) => {
        weighted[key] = calculateSubsectorScore(subsectorData[key], weight);
      });

      const total = calculateSectorScore(subsectorData, defaultBiotechSubsectorWeights);

      if (d.country === 'United States') {
        console.log('US Biotech weighted data:', weighted);
        console.log('US Biotech total:', total);
      }

      return {
        country: d.country,
        ...weighted,
        total,
      };
    });
  }, [data]);

  const spaceChartData = useMemo(() => {
    const data_us = data.find(d => d.country === 'United States');
    if (data_us) {
      console.log('US Space raw data:', data_us.sectorDetails?.space);
      console.log('Space weights:', defaultSpaceSubsectorWeights);
    }

    return data.map((d) => {
      const subsectorData = d.sectorDetails?.space ?? {};
      const weighted: Record<string, number> = {};

      Object.entries(defaultSpaceSubsectorWeights).forEach(([key, weight]) => {
        weighted[key] = calculateSubsectorScore(subsectorData[key], weight);
      });

      const total = calculateSectorScore(subsectorData, defaultSpaceSubsectorWeights);

      if (d.country === 'United States') {
        console.log('US Space weighted data:', weighted);
        console.log('US Space total:', total);
      }

      return {
        country: d.country,
        ...weighted,
        total,
      };
    });
  }, [data]);

  const mainChartData = useMemo(() => {
    const us_data = data.find(d => d.country === 'United States');
    if (us_data) {
      console.log('US data for main chart calculation:', {
        ai: aiChartData.find(c => c.country === 'United States')?.total,
        quantum: quantumChartData.find(c => c.country === 'United States')?.total,
        semiconductors: semiconductorsChartData.find(c => c.country === 'United States')?.total,
        biotech: biotechChartData.find(c => c.country === 'United States')?.total,
        space: spaceChartData.find(c => c.country === 'United States')?.total,
      });
    }

    return data.map((d) => {
      const sectorTotals = {
        ai: aiChartData.find((c) => c.country === d.country)?.total ?? 0,
        quantum: quantumChartData.find((c) => c.country === d.country)?.total ?? 0,
        semiconductors: semiconductorsChartData.find((c) => c.country === d.country)?.total ?? 0,
        biotech: biotechChartData.find((c) => c.country === d.country)?.total ?? 0,
        space: spaceChartData.find((c) => c.country === d.country)?.total ?? 0,
      };

      const weighted = {
        ai: calculateSubsectorScore(sectorTotals.ai, sectorWeights.ai ?? 0),
        quantum: calculateSubsectorScore(sectorTotals.quantum, sectorWeights.quantum ?? 0),
        semiconductors: calculateSubsectorScore(
          sectorTotals.semiconductors,
          sectorWeights.semiconductors ?? 0,
        ),
        biotech: calculateSubsectorScore(sectorTotals.biotech, sectorWeights.biotech ?? 0),
        space: calculateSubsectorScore(sectorTotals.space, sectorWeights.space ?? 0),
      };

      const total = Number(
        Object.values(weighted)
          .reduce((sum, score) => sum + score, 0)
          .toFixed(15),
      );

      if (d.country === 'United States') {
        console.log('US final weighted data:', weighted);
        console.log('US final total:', total);
      }

      return {
        country: d.country,
        ...weighted,
        total,
      };
    });
  }, [
    data,
    aiChartData,
    quantumChartData,
    semiconductorsChartData,
    biotechChartData,
    spaceChartData,
    sectorWeights,
  ]);

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
        ? Object.keys(
            viewState.sector === 'ai'
              ? defaultAISubsectorWeights
              : viewState.sector === 'quantum'
              ? defaultQuantumSubsectorWeights
              : viewState.sector === 'semiconductors'
              ? defaultSemiconductorsSubsectorWeights
              : viewState.sector === 'biotech'
              ? defaultBiotechSubsectorWeights
              : defaultSpaceSubsectorWeights,
          )
        : ['ai', 'quantum', 'semiconductors', 'biotech', 'space'];

    console.log('Chart data for rendering:', chartData);
    console.log('Keys for stacking:', keys);

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

    console.log('Stacked data:', layers);

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

    const layerGroups = g.selectAll('g.layer').data(layers);
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
            return aiSubsectorColors[key];
          case 'quantum':
            return quantumSubsectorColors[key];
          case 'semiconductors':
            return semiconductorsSubsectorColors[key];
          case 'biotech':
            return biotechSubsectorColors[key];
          case 'space':
            return spaceSubsectorColors[key];
          default:
            return '#e2e8f0';
        }
      }
      return sectorColors[key];
    });

    const normalW = x.bandwidth();
    const selectedW = normalW * 1.1;

    const rects = layerMerge.selectAll('rect').data((d) => d);
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
        const key = keys[d3.select(nodes[i].parentNode).datum().index];
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
        const layerKey = keys[d3.select(event.currentTarget.parentNode).datum().index];
        const val = d.data[layerKey];
        const color =
          viewState.type === 'sector'
            ? viewState.sector === 'ai'
              ? aiSubsectorColors[layerKey]
              : viewState.sector === 'quantum'
              ? quantumSubsectorColors[layerKey]
              : viewState.sector === 'semiconductors'
              ? semiconductorsSubsectorColors[layerKey]
              : viewState.sector === 'biotech'
              ? biotechSubsectorColors[layerKey]
              : spaceSubsectorColors[layerKey]
            : sectorColors[layerKey];

        const label =
          viewState.type === 'sector'
            ? subsectorDefinitions[viewState.sector!][layerKey]
            : layerKey.toUpperCase();

        tooltip
          .html(
            `<strong>${d.data.country}</strong><br/>
             <span style="color:${color}">■</span> ${label}: ${val.toFixed(3)}<br/>
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
  ]);

  return (
    <div ref={containerRef} className="relative">
      <svg ref={svgRef} width="100%" height="400" />
      <div ref={tooltipRef} className="absolute pointer-events-none" />
    </div>
  );
};

export default BarChart;