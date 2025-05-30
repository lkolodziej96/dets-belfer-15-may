import { useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';

import type { AggregatedCountryData } from '@/data/types';
import { getSectorColor } from '@/sectors/colors';
import { getSectorLabel } from '@/sectors/labels';
import type { Sector } from '@/sectors/sectorDef';
import { getSectorList } from '@/sectors/sectorDef';
import { getSubsectorColor } from '@/subsectors/colors';
import { getSubsectorLabel } from '@/subsectors/labels';
import { getSubsectorList } from '@/subsectors/subsectorsDef';
import { getPercentage } from '@/utils/display';

export type BarChartProps = {
  selectedSector: Sector | null;
  selectedCountries: string[];
  onCountrySelect: (countries: string[]) => void;
  aggregatedData: AggregatedCountryData[];
  selectedSubsector: string | null;
};

export default function BarChart({
  selectedSector,
  selectedCountries,
  onCountrySelect,
  aggregatedData,
  selectedSubsector,
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Each bar is per country and each bar contains the following items:
  const chartItemKeys = useMemo(
    () => (selectedSector ? getSubsectorList(selectedSector) : getSectorList()),
    [selectedSector],
  );

  const chartData = useMemo(
    () =>
      aggregatedData
        .toSorted((a, b) => b.total - a.total)
        .map(({ country, data, total }) => ({
          country,
          total: getPercentage(total),
          ...Object.entries(data).reduce(
            (acc, [key, value]) => {
              acc[key] = getPercentage(value);
              return acc;
            },
            {} as Record<string, number>,
          ),
        })),
    [aggregatedData],
  );

  const generateTooltipContent = useCallback(
    (d: any) => {
      const data = d.data;

      let content = `
    <div style="font-weight: 700; margin-bottom: 8px; color: #1A202C; font-size: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
      ${data.country}
    </div>
    <div style="margin-bottom: 8px;">
  `;

      chartItemKeys.forEach((key) => {
        const value = data[key];
        const color = selectedSector
          ? getSubsectorColor(selectedSector, key)
          : getSectorColor(key as Sector);

        const label = selectedSector
          ? getSubsectorLabel(selectedSector, key)
          : getSectorLabel(key as Sector);

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
            ${value}
          </div>
        </div>
      `;
      });

      content += `
    </div>
    <div style="font-weight: 600; color: #2D3748; border-top: 1px solid #E2E8F0; padding-top: 6px;">
      Total Score: ${data.total}
    </div>
  `;

      return content;
    },
    [chartItemKeys, selectedSector],
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 100, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

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
      .domain(chartData.map((d) => d.country))
      .range([0, innerWidth])
      .padding(0.2);

    const stackGen = d3.stack<Record<string, any>>().keys(chartItemKeys);
    const layers = stackGen(chartData);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(layers[layers.length - 1], (d) => d[1]) || 0])
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
    svg.selectAll('.domain, .tick line').style('stroke', '#cbd5e0').style('stroke-width', '1px');

    // Create tooltip
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

    // Update stacked bars
    const layerGroups = g.selectAll('g.layer').data(layers);
    layerGroups.exit().remove();

    const layerGroupsEnter = layerGroups.enter().append('g').attr('class', 'layer');

    const layerGroupsMerge = layerGroups.merge(layerGroupsEnter as any).style('fill', (_, i) => {
      const key = chartItemKeys[i];
      if (selectedSector) {
        return getSubsectorColor(selectedSector, key);
      }
      return getSectorColor(key as Sector);
    });

    // Update rectangles
    const rects = layerGroupsMerge.selectAll('rect').data((d) => d);

    rects.exit().remove();

    const rectsEnter = rects
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.data.country) || 0)
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('width', x.bandwidth());

    const normalWidth = x.bandwidth();
    const selectedWidth = normalWidth * 1.1;

    rects
      .merge(rectsEnter as any)
      .transition()
      .duration(750)
      .attr('x', (d) => {
        const xPos = x(d.data.country) || 0;
        return selectedCountries.includes(d.data.country)
          ? xPos - (selectedWidth - normalWidth) / 2
          : xPos;
      })
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(d[0]) - y(d[1]))
      .attr('width', (d) =>
        selectedCountries.includes(d.data.country) ? selectedWidth : normalWidth,
      )
      .style('opacity', (d, i, nodes) => {
        const key = chartItemKeys[(d3.select((nodes[i] as any).parentNode).datum() as any).index];
        if (selectedCountries.length && !selectedCountries.includes(d.data.country)) return 0.3;
        if (selectedSubsector && key !== selectedSubsector) return 0.3;
        return 1;
      });

    // Add interactivity
    layerGroupsMerge
      .selectAll('rect')
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        const country = (d as any).data.country;
        onCountrySelect(
          selectedCountries.includes(country)
            ? selectedCountries.filter((c) => c !== country)
            : [...selectedCountries, country],
        );
      })
      .on('mouseover', (event, d) => {
        const tooltipContent = generateTooltipContent(d);
        tooltip.html(tooltipContent).style('visibility', 'visible');

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('x', x((d as any).data.country)! - (selectedWidth - normalWidth) / 2)
          .attr('width', selectedWidth)
          .style('opacity', 1)
          .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');
      })
      .on('mousemove', (event) => {
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        const tooltipNode = tooltipRef.current!;
        const tooltipRect = tooltipNode.getBoundingClientRect();
        
        // Position tooltip next to the mouse cursor with a small offset
        let left = mouseX + 16;
        let top = mouseY - tooltipRect.height / 2;

        // Check if tooltip would go off the right edge of the screen
        if (left + tooltipRect.width > window.innerWidth) {
          // Position tooltip to the left of the cursor instead
          left = mouseX - tooltipRect.width - 16;
        }

        // Ensure tooltip stays within vertical bounds
        if (top < 0) {
          top = 0;
        } else if (top + tooltipRect.height > window.innerHeight) {
          top = window.innerHeight - tooltipRect.height;
        }

        tooltip
          .style('left', `${left}px`)
          .style('top', `${top}px`);
      })
      .on('mouseout', (event) => {
        tooltip.style('visibility', 'hidden');
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('x', (d) => x((d as any).data.country)!)
          .attr('width', normalWidth)
          .style('opacity', (d, i, nodes) => {
            const key =
              chartItemKeys[(d3.select((nodes[i] as any).parentNode).datum() as any).index];
            if (selectedCountries.length && !selectedCountries.includes((d as any).data.country))
              return 0.3;
            if (selectedSubsector && key !== selectedSubsector) return 0.3;
            return 1;
          })
          .style('filter', 'none');
      });
  }, [
    selectedSubsector,
    selectedCountries,
    onCountrySelect,
    chartData,
    generateTooltipContent,
    chartItemKeys,
    selectedSector,
  ]);

  return (
    <div ref={containerRef} className="relative">
      <svg ref={svgRef} width="100%" height="400" className="bg-white" />
      <div ref={tooltipRef} className="absolute" />
    </div>
  );
}