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

  // Pre-compute chart data for each sector
  const aiKeys = Object.keys(defaultAISubsectorWeights) as Array<keyof typeof defaultAISubsectorWeights>;
  const quantumKeys = Object.keys(defaultQuantumSubsectorWeights) as Array<keyof typeof defaultQuantumSubsectorWeights>;
  const semiconductorsKeys = Object.keys(defaultSemiconductorsSubsectorWeights) as Array<keyof typeof defaultSemiconductorsSubsectorWeights>;
  const biotechKeys = Object.keys(defaultBiotechSubsectorWeights) as Array<keyof typeof defaultBiotechSubsectorWeights>;
  const spaceKeys = Object.keys(defaultSpaceSubsectorWeights) as Array<keyof typeof defaultSpaceSubsectorWeights>;

  const aiChartData = useMemo(() => 
    data.map(d => {
      const raw = d.sectorDetails?.ai || {};
      const weighted: Record<string, number> = {};

      aiKeys.forEach(k => {
        weighted[k] = Number(((raw[k] ?? 0) * defaultAISubsectorWeights[k]).toFixed(15));
      });

      return {
        country: d.country,
        ...weighted,
        ai_total: Number(aiKeys.reduce((sum, k) => sum + weighted[k], 0).toFixed(15))
      };
    }), [data]);

  const quantumChartData = useMemo(() =>
    data.map(d => {
      const raw = d.sectorDetails?.quantum || {};
      const weighted: Record<string, number> = {};

      quantumKeys.forEach(k => {
        weighted[k] = Number(((raw[k] ?? 0) * defaultQuantumSubsectorWeights[k]).toFixed(15));
      });

      return {
        country: d.country,
        ...weighted,
        quantum_total: Number(quantumKeys.reduce((sum, k) => sum + weighted[k], 0).toFixed(15))
      };
    }), [data]);

  const semiconductorsChartData = useMemo(() =>
    data.map(d => {
      const raw = d.sectorDetails?.semiconductors || {};
      const weighted: Record<string, number> = {};

      semiconductorsKeys.forEach(k => {
        weighted[k] = Number(((raw[k] ?? 0) * defaultSemiconductorsSubsectorWeights[k]).toFixed(15));
      });

      return {
        country: d.country,
        ...weighted,
        semiconductors_total: Number(semiconductorsKeys.reduce((sum, k) => sum + weighted[k], 0).toFixed(15))
      };
    }), [data]);

  const biotechChartData = useMemo(() =>
    data.map(d => {
      const raw = d.sectorDetails?.biotech || {};
      const weighted: Record<string, number> = {};

      biotechKeys.forEach(k => {
        weighted[k] = Number(((raw[k] ?? 0) * defaultBiotechSubsectorWeights[k]).toFixed(15));
      });

      return {
        country: d.country,
        ...weighted,
        biotech_total: Number(biotechKeys.reduce((sum, k) => sum + weighted[k], 0).toFixed(15))
      };
    }), [data]);

  const spaceChartData = useMemo(() =>
    data.map(d => {
      const raw = d.sectorDetails?.space || {};
      const weighted: Record<string, number> = {};

      spaceKeys.forEach(k => {
        weighted[k] = Number(((raw[k] ?? 0) * defaultSpaceSubsectorWeights[k]).toFixed(15));
      });

      return {
        country: d.country,
        ...weighted,
        space_total: Number(spaceKeys.reduce((sum, k) => sum + weighted[k], 0).toFixed(15))
      };
    }), [data]);

  // Main view data combines all sector totals
  const mainChartData = useMemo(() =>
    data.map(d => {
      const sectorTotals = {
        ai: aiChartData.find(c => c.country === d.country)?.ai_total ?? 0,
        quantum: quantumChartData.find(c => c.country === d.country)?.quantum_total ?? 0,
        semiconductors: semiconductorsChartData.find(c => c.country === d.country)?.semiconductors_total ?? 0,
        biotech: biotechChartData.find(c => c.country === d.country)?.biotech_total ?? 0,
        space: spaceChartData.find(c => c.country === d.country)?.space_total ?? 0,
      };

      return {
        country: d.country,
        ...Object.entries(sectorTotals).reduce((acc, [sector, total]) => ({
          ...acc,
          [sector]: Number((total * (sectorWeights[sector] ?? 0)).toFixed(15))
        }), {}),
        total: Number(
          Object.entries(sectorTotals)
            .reduce((sum, [sector, total]) => 
              sum + total * (sectorWeights[sector] ?? 0), 0)
            .toFixed(15)
        )
      };
    }), [data, aiChartData, quantumChartData, semiconductorsChartData, biotechChartData, spaceChartData, sectorWeights]);

  useEffect(() => {
    if (!svgRef.current || !data.length || !containerRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 100, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Select chart data and keys based on view state
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

    // Sort data by total score
    const sortedData = [...chartData].sort((a, b) => {
      const aTotal = viewState.type === 'sector'
        ? Object.keys(a).reduce((sum, key) => key !== 'country' ? sum + (a[key] as number) : sum, 0)
        : a.total;
      const bTotal = viewState.type === 'sector'
        ? Object.keys(b).reduce((sum, key) => key !== 'country' ? sum + (b[key] as number) : sum, 0)
        : b.total;
      return bTotal - aTotal;
    });

    const svg = d3.select(svgRef.current);
    
    // Clear if no previous elements exist
    if (svg.select('g').empty()) {
      svg.selectAll('*').remove();
      svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    }

    const g = svg.select('g');

    // Create scales
    const x = d3
      .scaleBand()
      .domain(sortedData.map(d => d.country))
      .range([0, innerWidth])
      .padding(0.2);

    const stackGen = d3.stack<Record<string, any>>().keys(keys);
    const layers = stackGen(sortedData);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(layers[layers.length - 1], d => d[1]) || 0])
      .range([innerHeight, 0]);

    // Update axes
    const xAxis = g.select('.x-axis');
    if (xAxis.empty()) {
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-0.8em')
        .attr('dy', '0.15em')
        .style('font-family', "'Inter', 'Helvetica', 'Arial', sans-serif")
        .style('font-size', '11px')
        .style('font-weight', '500');
    } else {
      xAxis
        .transition()
        .duration(750)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-0.8em')
        .attr('dy', '0.15em')
        .style('font-family', "'Inter', 'Helvetica', 'Arial', sans-serif")
        .style('font-size', '11px')
        .style('font-weight', '500');
    }

    const yAxis = g.select('.y-axis');
    if (yAxis.empty()) {
      g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y).ticks(8))
        .selectAll('text')
        .style('font-family', "'Inter', 'Helvetica', 'Arial', sans-serif")
        .style('font-size', '11px')
        .style('font-weight', '500');
    } else {
      yAxis
        .transition()
        .duration(750)
        .call(d3.axisLeft(y).ticks(8))
        .selectAll('text')
        .style('font-family', "'Inter', 'Helvetica', 'Arial', sans-serif")
        .style('font-size', '11px')
        .style('font-weight', '500');
    }

    // Style axis lines and ticks
    svg.selectAll('.domain, .tick line')
      .style('stroke', '#cbd5e0')
      .style('stroke-width', '1px');

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('padding', '12px')
      .style('border', '1px solid #ddd')
      .style('border-radius', '6px')
      .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.15)')
      .style('pointer-events', 'none')
      .style('font-family', "'Inter', 'Helvetica', 'Arial', sans-serif")
      .style('font-size', '14px')
      .style('z-index', '1000')
      .style('min-width', '220px');

    // Update stacked bars
    const layerGroups = g.selectAll('g.layer').data(layers);
    layerGroups.exit().remove();

    const layerGroupsEnter = layerGroups.enter()
      .append('g')
      .attr('class', 'layer');

    const layerGroupsMerge = layerGroups.merge(layerGroupsEnter)
      .style('fill', (d, i) => {
        if (viewState.type === 'sector') {
          if (viewState.sector === 'ai') return aiSubsectorColors[keys[i]];
          if (viewState.sector === 'quantum') return quantumSubsectorColors[keys[i]];
          if (viewState.sector === 'semiconductors') return semiconductorsSubsectorColors[keys[i]];
          if (viewState.sector === 'biotech') return biotechSubsectorColors[keys[i]];
          if (viewState.sector === 'space') return spaceSubsectorColors[keys[i]];
        }
        return sectorColors[keys[i]];
      });

    // Update rectangles
    const rects = layerGroupsMerge.selectAll('rect')
      .data(d => d);

    rects.exit().remove();

    const rectsEnter = rects.enter()
      .append('rect')
      .attr('x', d => x(d.data.country) || 0)
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('width', x.bandwidth());

    const normalWidth = x.bandwidth();
    const selectedWidth = normalWidth * 1.1;

    rects.merge(rectsEnter)
      .transition()
      .duration(750)
      .attr('x', d => {
        const xPos = x(d.data.country) || 0;
        return selectedCountries.includes(d.data.country)
          ? xPos - (selectedWidth - normalWidth) / 2
          : xPos;
      })
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', d => selectedCountries.includes(d.data.country) ? selectedWidth : normalWidth)
      .style('opacity', (d, i, nodes) => {
        const key = keys[d3.select(nodes[i].parentNode).datum().index];
        if (selectedCountries.length && !selectedCountries.includes(d.data.country)) return 0.3;
        if (selectedSector && key !== selectedSector) return 0.3;
        return 1;
      });

    // Add interactivity
    layerGroupsMerge.selectAll('rect')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        const country = d.data.country;
        onCountrySelect(
          selectedCountries.includes(country)
            ? selectedCountries.filter(c => c !== country)
            : [...selectedCountries, country]
        );
      })
      .on('mouseover', (event, d) => {
        const tooltipContent = generateTooltipContent(d, viewState, keys);
        tooltip.html(tooltipContent).style('visibility', 'visible');

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('x', x(d.data.country)! - (selectedWidth - normalWidth) / 2)
          .attr('width', selectedWidth)
          .style('opacity', 1)
          .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');
      })
      .on('mousemove', (event) => {
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        tooltip
          .style('left', `${mouseX + 16}px`)
          .style('top', `${mouseY}px`);
      })
      .on('mouseout', (event, d) => {
        tooltip.style('visibility', 'hidden');

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('x', x(d.data.country))
          .attr('width', normalWidth)
          .style('opacity', (d, i, nodes) => {
            const key = keys[d3.select(nodes[i].parentNode).datum().index];
            if (selectedCountries.length && !selectedCountries.includes(d.data.country)) return 0.3;
            if (selectedSector && key !== selectedSector) return 0.3;
            return 1;
          })
          .style('filter', 'none');
      });
  }, [
    data,
    selectedSector,
    selectedCountries,
    onCountrySelect,
    viewState,
    sectorWeights,
    aiChartData,
    quantumChartData,
    semiconductorsChartData,
    biotechChartData,
    spaceChartData,
    mainChartData
  ]);

  const generateTooltipContent = (d: any, viewState: ViewState, keys: string[]) => {
    const data = d.data;
    
    let content = `
      <div style="font-weight: 700; margin-bottom: 8px; color: #1A202C; font-size: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
        ${data.country}
      </div>
      <div style="margin-bottom: 8px;">
    `;

    keys.forEach(key => {
      const value = data[key];
      const color = viewState.type === 'sector'
        ? viewState.sector === 'ai'
          ? aiSubsectorColors[key]
          : viewState.sector === 'quantum'
            ? quantumSubsectorColors[key]
            : viewState.sector === 'semiconductors'
              ? semiconductorsSubsectorColors[key]
              : viewState.sector === 'biotech'
                ? biotechSubsectorColors[key]
                : spaceSubsectorColors[key]
        : sectorColors[key];

      const label = viewState.type === 'sector'
        ? subsectorDefinitions[viewState.sector!][key]
        : key.toUpperCase();

      content += `
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
            ${value.toFixed(3)}
          </div>
        </div>
      `;
    });

    const total = Object.entries(data)
      .reduce((sum, [key, value]) => 
        key !== 'country' && typeof value === 'number' ? sum + value : sum, 0);

    content += `
      </div>
      <div style="font-weight: 600; color: #2D3748; border-top: 1px solid #E2E8F0; padding-top: 6px;">
        Total Score: ${total.toFixed(3)}
      </div>
    `;

    return content;
  };

  return (
    <div ref={containerRef} className="relative">
      <svg ref={svgRef} width="100%" height="400" className="bg-white" />
      <div ref={tooltipRef} className="absolute" />
    </div>
  );
};

export default BarChart;