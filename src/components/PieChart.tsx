import { useEffect, useRef, useMemo } from 'react';

import * as d3 from 'd3';
import { Info } from 'lucide-react';

import type { AggregatedCountryData } from '@/data/types';
import { getSectorColor } from '@/sectors/colors';
import { getSectorLabel } from '@/sectors/labels';
import type { Sector } from '@/sectors/sectorDef';
import { getSubsectorColor } from '@/subsectors/colors';
import { getSubsectorLabel } from '@/subsectors/labels';
import { getPercentage } from '@/utils/display';

export type PieChartProps = {
  selectedSector: Sector | null;
  selectedCountries: string[];
  selectedSubsector: string | null;
  onSubSectorSelect: (subsector: string | null) => void;
  aggregatedData: AggregatedCountryData[];
};

export default function PieChart({
  selectedSector,
  selectedCountries,
  selectedSubsector,
  onSubSectorSelect,
  aggregatedData,
}: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const subSectorScoresTotal = useMemo(
    () =>
      aggregatedData.reduce(
        (acc, { data, country }) => {
          if (selectedCountries.length > 0 && !selectedCountries.includes(country)) return acc;

          Object.entries(data).forEach(([subsector, score]) => {
            acc[subsector] = (acc[subsector] ?? 0) + score;
          });
          return acc;
        },
        {} as Record<string, number>,
      ),
    [aggregatedData, selectedCountries],
  );

  const totalAllSubSectors = Object.values(subSectorScoresTotal).reduce(
    (acc, value) => acc + value,
    0,
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const width = containerWidth;
    const height = containerHeight;
    const radius = Math.min(width, height) / 2.5;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

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

    const d3Data = Object.entries(subSectorScoresTotal);
    const pieData = d3.pie<[string, number]>().value((d) => d[1])(d3Data);

    // If there's no data to display, show a message
    if (!pieData || pieData.length === 0) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('class', 'text-gray-500 text-lg')
        .text('No data available');
      return;
    }

    const normalArc = d3
      .arc<d3.PieArcDatum<[string, number]>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const selectedArc = d3
      .arc<d3.PieArcDatum<[string, number]>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 1.1);

    const segments = g
      .selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', (d) => {
        // Ensure d is valid before calling normalArc
        if (!d || typeof d.startAngle === 'undefined' || typeof d.endAngle === 'undefined') {
          return '';
        }
        return normalArc(d) || '';
      })
      .attr('fill', (d) => {
        const subsector = d.data[0];
        if (!subsector) return '#e2e8f0';
        const color = selectedSector
          ? getSubsectorColor(selectedSector, subsector)
          : getSectorColor(subsector as Sector);

        return color;
      })
      .attr('stroke', (d) => {
        if (!d?.data?.[0]) return 'white';
        return selectedSubsector === d.data[0] ? '#1A202C' : 'white';
      })
      .style('stroke-width', (d) => {
        if (!d?.data?.[0]) return '1px';
        return selectedSubsector === d.data[0] ? '3px' : '2px';
      })
      .style('cursor', 'pointer')
      .style('opacity', (d) => {
        if (!d?.data?.[0]) return 0.3;
        return selectedSubsector === d.data[0] ? 1 : selectedSubsector ? 0.3 : 1;
      })
      .style('filter', (d) => {
        if (!d?.data?.[0]) return 'none';
        return selectedSubsector === d.data[0]
          ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          : 'none';
      });

    segments
      .on('mouseover', (event, d) => {
        if (!d?.data?.[0] || !d.data[1]) return;

        const subSector = d.data[0];
        const value = d.data[1];

        const name = selectedSector
          ? getSubsectorLabel(selectedSector, subSector)
          : getSectorLabel(subSector as Sector);

        const color = selectedSector
          ? getSubsectorColor(selectedSector, subSector)
          : getSectorColor(subSector as Sector);

        const tooltipContent = `
          <div style="border-left: 4px solid ${color || '#e2e8f0'}; padding-left: 12px;">
            <div style="font-weight: 600; font-size: 16px; color: #1A202C; margin-bottom: 8px;">
              ${name}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <span style="color: #4A5568; font-size: 14px;">Score</span>
              <span style="font-weight: 600; color: #2D3748; font-size: 15px;">
                ${getPercentage(value)}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="color: #4A5568; font-size: 14px;">Share</span>
              <span style="font-weight: 600; color: #2D3748; font-size: 15px;">
                ${getPercentage(value / totalAllSubSectors)}%
              </span>
            </div>
          </div>
          ${
            selectedCountries.length > 0
              ? `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #E2E8F0;">
              <div style="color: #718096; font-size: 13px;">
                Based on ${selectedCountries.length} selected ${selectedCountries.length === 1 ? 'country' : 'countries'}:
              </div>
              <div style="color: #4A5568; font-size: 13px; margin-top: 4px;">
                ${selectedCountries.join(', ')}
              </div>
            </div>
          `
              : ''
          }
        `;

        tooltip.html(tooltipContent).style('visibility', 'visible');

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('d', (d) => {
            // Ensure d is valid before calling selectedArc
            if (
              !d ||
              typeof (d as any).startAngle === 'undefined' ||
              typeof (d as any).endAngle === 'undefined'
            ) {
              return '';
            }
            return selectedArc(d as any) || '';
          })
          .style('opacity', 1)
          .style('stroke', '#1A202C')
          .style('stroke-width', '3px')
          .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');
      })
      .on('mousemove', (event) => {
        const tooltipNode = tooltipRef.current!;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = event.clientX + 16;
        let top = event.clientY;

        if (left + tooltipNode.offsetWidth > viewportWidth) {
          left = event.clientX - tooltipNode.offsetWidth - 16;
        }

        if (top + tooltipNode.offsetHeight > viewportHeight) {
          top = viewportHeight - tooltipNode.offsetHeight - 8;
        }
        if (top < 8) {
          top = 8;
        }

        tooltip.style('left', `${left}px`).style('top', `${top}px`);
      })
      .on('mouseout', (event, d) => {
        if (!d?.data?.[0]) return;

        tooltip.style('visibility', 'hidden');

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('d', (d) => {
            // Ensure d is valid before calling normalArc
            if (
              !d ||
              typeof (d as any).startAngle === 'undefined' ||
              typeof (d as any).endAngle === 'undefined'
            ) {
              return '';
            }
            return normalArc(d as any) || '';
          })
          .style('opacity', selectedSubsector === d.data[0] ? 1 : selectedSubsector ? 0.3 : 1)
          .style('stroke', selectedSubsector === d.data[0] ? '#1A202C' : 'white')
          .style('stroke-width', selectedSubsector === d.data[0] ? '3px' : '2px')
          .style(
            'filter',
            selectedSubsector === d.data[0] ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' : 'none',
          );
      })
      .on('click', (_, d) => {
        if (!d?.data?.[0]) return;

        const subSector = d.data[0];
        const isSelected = selectedSubsector === subSector;

        onSubSectorSelect(isSelected ? null : subSector);

        d3.selectAll('path')
          .transition()
          .duration(200)
          .attr('d', (p) => {
            // Ensure p is valid before calling arc functions
            if (
              !p ||
              typeof (p as any).startAngle === 'undefined' ||
              typeof (p as any).endAngle === 'undefined'
            ) {
              return '';
            }
            return (isSelected ? false : (p as any).data[0] === subSector)
              ? selectedArc(p as any) || ''
              : normalArc(p as any) || '';
          })
          .style('opacity', (p) => {
            if (!(p as any)?.data?.[0]) return 0.3;
            return (isSelected ? false : (p as any).data[0] === subSector)
              ? 1
              : isSelected
                ? 1
                : 0.3;
          })
          .style('stroke', (p) => {
            if (!(p as any)?.data?.[0]) return 'white';
            return (isSelected ? false : (p as any).data[0] === subSector) ? '#1A202C' : 'white';
          })
          .style('stroke-width', (p) => {
            if (!(p as any)?.data?.[0]) return '1px';
            return (isSelected ? false : (p as any).data[0] === subSector) ? '3px' : '2px';
          })
          .style('filter', (p) => {
            if (!(p as any)?.data?.[0]) return 'none';
            return (isSelected ? false : (p as any).data[0] === subSector)
              ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              : 'none';
          });
      });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !svgRef.current || !pieData) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      const newRadius = Math.min(newWidth, newHeight) / 2.5;

      svg.attr('width', newWidth).attr('height', newHeight);

      g.attr('transform', `translate(${newWidth / 2},${newHeight / 2})`);

      normalArc.innerRadius(newRadius * 0.6).outerRadius(newRadius);
      selectedArc.innerRadius(newRadius * 0.6).outerRadius(newRadius * 1.1);

      segments.attr('d', (d) => {
        // Ensure d is valid before calling normalArc
        if (!d || typeof d.startAngle === 'undefined' || typeof d.endAngle === 'undefined') {
          return '';
        }
        return normalArc(d) || '';
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [
    selectedSubsector,
    selectedCountries,
    onSubSectorSelect,
    totalAllSubSectors,
    selectedSector,
    subSectorScoresTotal,
  ]);

  return (
    <div ref={containerRef} className="relative" style={{ width: '100%', height: '400px' }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Sector Distribution</h2>
        <div className="group relative">
          <Info 
            className="h-5 w-5 cursor-help text-gray-400 transition-colors hover:text-gray-600" 
            aria-label="Information about sector distribution"
          />
          <div className="invisible absolute left-1/2 top-full z-10 mt-2 w-72 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
            <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900"></div>
            This chart shows the distribution of scores across different subsectors for the selected countries and sector.
          </div>
        </div>
      </div>
      <svg ref={svgRef} className="bg-white" />
      <div ref={tooltipRef} />
    </div>
  );
}