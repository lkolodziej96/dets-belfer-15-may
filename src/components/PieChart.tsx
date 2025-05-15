import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { CountryData, ViewState } from '../types';
import { 
  sectorColors, 
  sectorNames, 
  subsectorDefinitions, 
  aiSubsectorColors, 
  quantumSubsectorColors, 
  semiconductorsSubsectorColors,
  spaceSubsectorColors,
  biotechSubsectorColors,
  defaultSpaceSubsectorWeights,
  defaultBiotechSubsectorWeights,
  defaultAISubsectorWeights,
  defaultQuantumSubsectorWeights,
  defaultSemiconductorsSubsectorWeights
} from '../utils/constants';

interface Props {
  data: CountryData[];
  selectedSector: string | null;
  selectedCountries: string[];
  onSectorSelect: (sector: string | null) => void;
  viewState: ViewState;
  sectorWeights?: Record<string, number>;
}

const PieChart: React.FC<Props> = ({ 
  data, 
  selectedSector,
  selectedCountries,
  onSectorSelect,
  viewState,
  sectorWeights = {}
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const width = containerWidth;
    const height = containerHeight;
    const radius = Math.min(width, height) / 2.5;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width)
       .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    const tooltip = d3.select(tooltipRef.current)
      .style("position", "fixed")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("padding", "16px")
      .style("border", "1px solid #E2E8F0")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)")
      .style("pointer-events", "none")
      .style("font-family", "'Inter', 'Helvetica', 'Arial', sans-serif")
      .style("font-size", "14px")
      .style("z-index", "9999")
      .style("min-width", "280px")
      .style("max-width", "320px");

    const filteredData = selectedCountries.length 
      ? data.filter(d => selectedCountries.includes(d.country))
      : data;

    const calculateSectorScore = (subsectorData: Record<string, number> = {}, weights: Record<string, number>, sectorWeight: number = 1) => {
      return Object.entries(subsectorData || {}).reduce((total, [key, value]) => {
        return total + ((value ?? 0) * (weights[key] ?? 0));
      }, 0) * sectorWeight;
    };

    let pieData;
    if (viewState.type === 'sector' && viewState.sector) {
      const subsectorScores = filteredData.reduce((acc, country) => {
        const subsectors = country.sectorDetails?.[viewState.sector] ?? {};
        Object.entries(subsectors || {}).forEach(([subsector, score]) => {
          const weights = viewState.sector === 'space' 
            ? defaultSpaceSubsectorWeights
            : viewState.sector === 'biotech'
            ? defaultBiotechSubsectorWeights
            : viewState.sector === 'ai'
            ? defaultAISubsectorWeights
            : viewState.sector === 'quantum'
            ? defaultQuantumSubsectorWeights
            : defaultSemiconductorsSubsectorWeights;
          acc[subsector] = (acc[subsector] ?? 0) + ((score ?? 0) * (weights[subsector] ?? 0));
        });
        return acc;
      }, {} as Record<string, number>);

      if (filteredData.length > 1) {
        Object.keys(subsectorScores).forEach(key => {
          subsectorScores[key] /= filteredData.length;
        });
      }

      const validSubsectorData = Object.entries(subsectorScores).filter(([_, value]) => value > 0);
      pieData = validSubsectorData.length > 0 ? d3.pie<[string, number]>().value(d => d[1])(validSubsectorData) : null;
    } else {
      const sectorScores = Object.keys(sectorNames).reduce((acc, sector) => {
        const avg = d3.mean(filteredData, d => {
          const sectorDetails = d.sectorDetails?.[sector] ?? {};
          const weights = sector === 'space' 
            ? defaultSpaceSubsectorWeights
            : sector === 'biotech'
            ? defaultBiotechSubsectorWeights
            : sector === 'ai'
            ? defaultAISubsectorWeights
            : sector === 'quantum'
            ? defaultQuantumSubsectorWeights
            : defaultSemiconductorsSubsectorWeights;
          
          return calculateSectorScore(sectorDetails, weights, sectorWeights[sector] ?? 0);
        }) || 0;
        return { ...acc, [sector]: avg };
      }, {} as Record<string, number>);

      const validSectorData = Object.entries(sectorScores).filter(([_, value]) => value > 0);
      pieData = validSectorData.length > 0 ? d3.pie<[string, number]>().value(d => d[1])(validSectorData) : null;
    }

    // If there's no data to display, show a message
    if (!pieData || pieData.length === 0) {
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("class", "text-gray-500 text-lg")
        .text("No data available");
      return;
    }

    const normalArc = d3.arc<d3.PieArcDatum<[string, number]>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const selectedArc = d3.arc<d3.PieArcDatum<[string, number]>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 1.1);

    const segments = g.selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", d => {
        // Ensure d is valid before calling normalArc
        if (!d || typeof d.startAngle === 'undefined' || typeof d.endAngle === 'undefined') {
          return "";
        }
        return normalArc(d) || "";
      })
      .attr("fill", d => {
        if (!d?.data?.[0]) return "#e2e8f0";

        if (viewState.type === 'sector' && viewState.sector) {
          if (viewState.sector === 'space') {
            return spaceSubsectorColors[d.data[0] as keyof typeof spaceSubsectorColors] || "#e2e8f0";
          } else if (viewState.sector === 'biotech') {
            return biotechSubsectorColors[d.data[0] as keyof typeof biotechSubsectorColors] || "#e2e8f0";
          } else if (viewState.sector === 'ai') {
            return aiSubsectorColors[d.data[0] as keyof typeof aiSubsectorColors] || "#e2e8f0";
          } else if (viewState.sector === 'quantum') {
            return quantumSubsectorColors[d.data[0] as keyof typeof quantumSubsectorColors] || "#e2e8f0";
          } else if (viewState.sector === 'semiconductors') {
            return semiconductorsSubsectorColors[d.data[0] as keyof typeof semiconductorsSubsectorColors] || "#e2e8f0";
          }
        }
        return sectorColors[d.data[0]] || "#e2e8f0";
      })
      .attr("stroke", d => {
        if (!d?.data?.[0]) return "white";
        return selectedSector === d.data[0] ? "#1A202C" : "white";
      })
      .style("stroke-width", d => {
        if (!d?.data?.[0]) return "1px";
        return selectedSector === d.data[0] ? "3px" : "2px";
      })
      .style("cursor", "pointer")
      .style("opacity", d => {
        if (!d?.data?.[0]) return 0.3;
        return selectedSector === d.data[0] ? 1 : selectedSector ? 0.3 : 1;
      })
      .style("filter", d => {
        if (!d?.data?.[0]) return "none";
        return selectedSector === d.data[0] ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" : "none";
      });

    segments
      .on("mouseover", (event, d) => {
        if (!d?.data?.[0] || !d.data[1]) return;

        const sector = d.data[0];
        const value = d.data[1];
        
        const name = viewState.type === 'sector' && viewState.sector && sector
          ? subsectorDefinitions[viewState.sector]?.[sector] || sector
          : sectorNames[sector] || sector;

        const getPercentage = (value: number) => {
          const total = pieData.reduce((sum, d) => sum + (d.data?.[1] || 0), 0);
          return ((value / total) * 100).toFixed(1);
        };

        const color = viewState.type === 'sector' && viewState.sector
          ? viewState.sector === 'space'
            ? spaceSubsectorColors[sector as keyof typeof spaceSubsectorColors]
            : viewState.sector === 'biotech'
            ? biotechSubsectorColors[sector as keyof typeof biotechSubsectorColors]
            : viewState.sector === 'ai'
            ? aiSubsectorColors[sector as keyof typeof aiSubsectorColors]
            : viewState.sector === 'quantum'
            ? quantumSubsectorColors[sector as keyof typeof quantumSubsectorColors]
            : semiconductorsSubsectorColors[sector as keyof typeof semiconductorsSubsectorColors]
          : sectorColors[sector];

        const tooltipContent = `
          <div style="border-left: 4px solid ${color || '#e2e8f0'}; padding-left: 12px;">
            <div style="font-weight: 600; font-size: 16px; color: #1A202C; margin-bottom: 8px;">
              ${name}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <span style="color: #4A5568; font-size: 14px;">Score</span>
              <span style="font-weight: 600; color: #2D3748; font-size: 15px;">
                ${value.toFixed(3)}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="color: #4A5568; font-size: 14px;">Share</span>
              <span style="font-weight: 600; color: #2D3748; font-size: 15px;">
                ${getPercentage(value)}%
              </span>
            </div>
          </div>
          ${selectedCountries.length > 0 ? `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #E2E8F0;">
              <div style="color: #718096; font-size: 13px;">
                Based on ${selectedCountries.length} selected ${selectedCountries.length === 1 ? 'country' : 'countries'}:
              </div>
              <div style="color: #4A5568; font-size: 13px; margin-top: 4px;">
                ${selectedCountries.join(', ')}
              </div>
            </div>
          ` : ''}
        `;

        tooltip.html(tooltipContent)
          .style("visibility", "visible");

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("d", d => {
            // Ensure d is valid before calling selectedArc
            if (!d || typeof d.startAngle === 'undefined' || typeof d.endAngle === 'undefined') {
              return "";
            }
            return selectedArc(d) || "";
          })
          .style("opacity", 1)
          .style("stroke", "#1A202C")
          .style("stroke-width", "3px")
          .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))");
      })
      .on("mousemove", (event) => {
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
        
        tooltip
          .style("left", `${left}px`)
          .style("top", `${top}px`);
      })
      .on("mouseout", (event, d) => {
        if (!d?.data?.[0]) return;

        tooltip.style("visibility", "hidden");
        
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("d", d => {
            // Ensure d is valid before calling normalArc
            if (!d || typeof d.startAngle === 'undefined' || typeof d.endAngle === 'undefined') {
              return "";
            }
            return normalArc(d) || "";
          })
          .style("opacity", selectedSector === d.data[0] ? 1 : selectedSector ? 0.3 : 1)
          .style("stroke", selectedSector === d.data[0] ? "#1A202C" : "white")
          .style("stroke-width", selectedSector === d.data[0] ? "3px" : "2px")
          .style("filter", selectedSector === d.data[0] ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" : "none");
      })
      .on("click", (event, d) => {
        if (!d?.data?.[0]) return;

        const sector = d.data[0];
        const isSelected = selectedSector === sector;
        
        onSectorSelect(isSelected ? null : sector);

        d3.selectAll("path")
          .transition()
          .duration(200)
          .attr("d", p => {
            // Ensure p is valid before calling arc functions
            if (!p || typeof p.startAngle === 'undefined' || typeof p.endAngle === 'undefined') {
              return "";
            }
            return (isSelected ? false : p.data[0] === sector) ? (selectedArc(p) || "") : (normalArc(p) || "");
          })
          .style("opacity", p => {
            if (!p?.data?.[0]) return 0.3;
            return (isSelected ? false : p.data[0] === sector) ? 1 : (isSelected ? 1 : 0.3);
          })
          .style("stroke", p => {
            if (!p?.data?.[0]) return "white";
            return (isSelected ? false : p.data[0] === sector) ? "#1A202C" : "white";
          })
          .style("stroke-width", p => {
            if (!p?.data?.[0]) return "1px";
            return (isSelected ? false : p.data[0] === sector) ? "3px" : "2px";
          })
          .style("filter", p => {
            if (!p?.data?.[0]) return "none";
            return (isSelected ? false : p.data[0] === sector) ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" : "none";
          });
      });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !svgRef.current || !pieData) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      const newRadius = Math.min(newWidth, newHeight) / 2.5;

      svg.attr("width", newWidth)
         .attr("height", newHeight);

      g.attr("transform", `translate(${newWidth/2},${newHeight/2})`);

      normalArc.innerRadius(newRadius * 0.6).outerRadius(newRadius);
      selectedArc.innerRadius(newRadius * 0.6).outerRadius(newRadius * 1.1);

      segments.attr("d", d => {
        // Ensure d is valid before calling normalArc
        if (!d || typeof d.startAngle === 'undefined' || typeof d.endAngle === 'undefined') {
          return "";
        }
        return normalArc(d) || "";
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, selectedSector, selectedCountries, onSectorSelect, viewState, sectorWeights]);

  return (
    <div ref={containerRef} className="relative" style={{ width: '100%', height: '400px' }}>
      <svg
        ref={svgRef}
        className="bg-white"
      />
      <div ref={tooltipRef} />
    </div>
  );
};

export default PieChart;