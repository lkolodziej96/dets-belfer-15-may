import React, { useEffect, useRef } from 'react';
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
  defaultSemiconductorsSubsectorWeights
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
  sectorWeights = {}
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length || !containerRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 100, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Calculate sector scores based on subsector weights
    const calculateSectorScore = (subsectorData: Record<string, number> = {}, weights: Record<string, number>, sectorWeight: number = 1) => {
      return Object.entries(subsectorData).reduce((total, [key, value]) => {
        return total + ((value ?? 0) * (weights[key] ?? 0));
      }, 0) * sectorWeight;
    };

    // Sort data by total score or sector score
    const sortedData = [...data].sort((a, b) => {
      if (viewState.type === 'sector' && viewState.sector) {
        const aDetails = a.sectorDetails?.[viewState.sector] ?? {};
        const bDetails = b.sectorDetails?.[viewState.sector] ?? {};
        
        const weights = viewState.sector === 'space' 
          ? defaultSpaceSubsectorWeights
          : viewState.sector === 'biotech'
          ? defaultBiotechSubsectorWeights
          : viewState.sector === 'ai'
          ? defaultAISubsectorWeights
          : viewState.sector === 'quantum'
          ? defaultQuantumSubsectorWeights
          : defaultSemiconductorsSubsectorWeights;
        
        const aTotal = calculateSectorScore(aDetails, weights);
        const bTotal = calculateSectorScore(bDetails, weights);
        
        return bTotal - aTotal;
      }

      // For overview, calculate total weighted score
      const aTotal = Object.entries(a.sectorDetails ?? {}).reduce((sum, [sector, details]) => {
        const weights = sector === 'ai' ? defaultAISubsectorWeights :
                       sector === 'quantum' ? defaultQuantumSubsectorWeights :
                       sector === 'semiconductors' ? defaultSemiconductorsSubsectorWeights :
                       sector === 'biotech' ? defaultBiotechSubsectorWeights :
                       defaultSpaceSubsectorWeights;
        return sum + calculateSectorScore(details, weights, sectorWeights[sector] ?? 0);
      }, 0);

      const bTotal = Object.entries(b.sectorDetails ?? {}).reduce((sum, [sector, details]) => {
        const weights = sector === 'ai' ? defaultAISubsectorWeights :
                       sector === 'quantum' ? defaultQuantumSubsectorWeights :
                       sector === 'semiconductors' ? defaultSemiconductorsSubsectorWeights :
                       sector === 'biotech' ? defaultBiotechSubsectorWeights :
                       defaultSpaceSubsectorWeights;
        return sum + calculateSectorScore(details, weights, sectorWeights[sector] ?? 0);
      }, 0);

      return bTotal - aTotal;
    });

    // Get data keys based on view state
    const keys = viewState.type === 'sector' && viewState.sector && sortedData[0]?.sectorDetails?.[viewState.sector]
      ? Object.keys(sortedData[0].sectorDetails[viewState.sector])
      : ['ai', 'quantum', 'semiconductors', 'biotech', 'space'];

    // Prepare data for stacking
    const stackData = d3.stack<CountryData>()
      .keys(keys)
      .value((d, key) => {
        if (viewState.type === 'sector' && viewState.sector && d.sectorDetails) {
          const score = d.sectorDetails[viewState.sector]?.[key] ?? 0;
          const weights = viewState.sector === 'space' 
            ? defaultSpaceSubsectorWeights
            : viewState.sector === 'biotech'
            ? defaultBiotechSubsectorWeights
            : viewState.sector === 'ai'
            ? defaultAISubsectorWeights
            : viewState.sector === 'quantum'
            ? defaultQuantumSubsectorWeights
            : defaultSemiconductorsSubsectorWeights;
          return score * (weights[key as keyof typeof weights] ?? 0);
        }
        // For main view, calculate sector scores from subsector details with weights
        const subsectorData = d.sectorDetails?.[key] ?? {};
        const weights = key === 'space' 
          ? defaultSpaceSubsectorWeights
          : key === 'biotech'
          ? defaultBiotechSubsectorWeights
          : key === 'ai'
          ? defaultAISubsectorWeights
          : key === 'quantum'
          ? defaultQuantumSubsectorWeights
          : defaultSemiconductorsSubsectorWeights;
        return calculateSectorScore(subsectorData, weights, sectorWeights[key] ?? 0);
      })(sortedData);

    const svg = d3.select(svgRef.current);
    
    // Only clear if no previous elements exist
    if (svg.select("g").empty()) {
      svg.selectAll("*").remove();
      svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    const g = svg.select("g");

    // Create scales
    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.country))
      .range([0, innerWidth])
      .padding(0.2);

    // Ensure stackData is not empty before calculating max
    const yMax = stackData.length > 0 
      ? d3.max(stackData[stackData.length - 1], d => d[1]) || 0
      : 0;

    const y = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0]);

    // Update axes with transitions
    const xAxis = g.select(".x-axis");
    if (xAxis.empty()) {
      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .style("font-family", "'Inter', 'Helvetica', 'Arial', sans-serif")
        .style("font-size", "11px")
        .style("font-weight", "500");
    } else {
      xAxis.transition()
        .duration(750)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .style("font-family", "'Inter', 'Helvetica', 'Arial', sans-serif")
        .style("font-size", "11px")
        .style("font-weight", "500");
    }

    const yAxis = g.select(".y-axis");
    if (yAxis.empty()) {
      g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(8).tickFormat(d => d.toString()))
        .selectAll("text")
        .style("font-family", "'Inter', 'Helvetica', 'Arial', sans-serif")
        .style("font-size", "11px")
        .style("font-weight", "500");
    } else {
      yAxis.transition()
        .duration(750)
        .call(d3.axisLeft(y).ticks(8).tickFormat(d => d.toString()))
        .selectAll("text")
        .style("font-family", "'Inter', 'Helvetica', 'Arial', sans-serif")
        .style("font-size", "11px")
        .style("font-weight", "500");
    }

    // Style the axis lines and ticks
    svg.selectAll(".domain, .tick line")
      .style("stroke", "#cbd5e0")
      .style("stroke-width", "1px");

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("padding", "12px")
      .style("border", "1px solid #ddd")
      .style("border-radius", "6px")
      .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.15)")
      .style("pointer-events", "none")
      .style("font-family", "'Inter', 'Helvetica', 'Arial', sans-serif")
      .style("font-size", "14px")
      .style("z-index", "1000")
      .style("min-width", "220px");

    // Update stacked bars with transitions
    const layers = g.selectAll("g.layer")
      .data(stackData);

    layers.exit().remove();

    const layersEnter = layers.enter()
      .append("g")
      .attr("class", "layer");

    const layersMerge = layers.merge(layersEnter)
      .style("fill", (d, i) => {
        if (viewState.type === 'sector' && viewState.sector) {
          if (viewState.sector === 'space') {
            return spaceSubsectorColors[keys[i] as keyof typeof spaceSubsectorColors];
          } else if (viewState.sector === 'biotech') {
            return biotechSubsectorColors[keys[i] as keyof typeof biotechSubsectorColors];
          } else if (viewState.sector === 'ai') {
            return aiSubsectorColors[keys[i] as keyof typeof aiSubsectorColors];
          } else if (viewState.sector === 'quantum') {
            return quantumSubsectorColors[keys[i] as keyof typeof quantumSubsectorColors];
          } else if (viewState.sector === 'semiconductors') {
            return semiconductorsSubsectorColors[keys[i] as keyof typeof semiconductorsSubsectorColors];
          } else {
            const baseColor = sectorColors[viewState.sector];
            return d3.color(baseColor)!.brighter(i / keys.length).toString();
          }
        }
        return sectorColors[keys[i]];
      });

    const normalWidth = x.bandwidth();
    const selectedWidth = normalWidth * 1.1;
    const normalHeight = (d: any) => y(d[0]) - y(d[1]);
    const selectedHeight = (d: any) => normalHeight(d) * 1.1;

    const rects = layersMerge.selectAll("rect")
      .data(d => d);

    rects.exit().remove();

    const rectsEnter = rects.enter()
      .append("rect")
      .attr("x", d => x(d.data.country) || 0)
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("width", normalWidth);

    rects.merge(rectsEnter)
      .transition()
      .duration(750)
      .ease(d3.easeQuadOut)
      .attr("x", d => {
        const xPos = x(d.data.country) || 0;
        const isSelected = selectedCountries.includes(d.data.country);
        if (isSelected) {
          return xPos - (selectedWidth - normalWidth) / 2;
        }
        return xPos;
      })
      .attr("y", d => {
        const yPos = y(d[1]);
        const isSelected = selectedCountries.includes(d.data.country);
        if (isSelected) {
          return yPos - (selectedHeight(d) - normalHeight(d));
        }
        return yPos;
      })
      .attr("height", d => {
        const isSelected = selectedCountries.includes(d.data.country);
        return isSelected ? selectedHeight(d) : normalHeight(d);
      })
      .attr("width", d => selectedCountries.includes(d.data.country) ? selectedWidth : normalWidth)
      .style("opacity", (d, i, nodes) => {
        const currentKey = keys[d3.select(nodes[i].parentNode).datum().index];
        if (selectedCountries.length && !selectedCountries.includes(d.data.country)) return 0.3;
        if (selectedSector && currentKey !== selectedSector) return 0.3;
        return 1;
      })
      .style("stroke", (d) => selectedCountries.includes(d.data.country) ? "#1A202C" : "none")
      .style("stroke-width", (d) => selectedCountries.includes(d.data.country) ? "1px" : "0")
      .style("filter", (d) =>
        selectedCountries.includes(d.data.country)
          ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
          : "none"
      );

    // Add interactivity
    layersMerge.selectAll("rect")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        const country = d.data.country;
        if (selectedCountries.includes(country)) {
          onCountrySelect(selectedCountries.filter(c => c !== country));
        } else {
          onCountrySelect([...selectedCountries, country]);
        }
      })
      .on("mouseover", (event, d) => {
        const hoveredKey = keys[d3.select(event.currentTarget.parentNode).datum().index];
        
        let tooltipContent = `
          <div style="font-weight: 700; margin-bottom: 8px; color: #1A202C; font-size: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            ${d.data.country}
          </div>
          <div style="margin-bottom: 8px;">
        `;

        if (viewState.type === 'sector' && viewState.sector && d.data.sectorDetails) {
          // Show subsector scores
          const weights = viewState.sector === 'space' 
            ? defaultSpaceSubsectorWeights
            : viewState.sector === 'biotech'
            ? defaultBiotechSubsectorWeights
            : viewState.sector === 'ai'
            ? defaultAISubsectorWeights
            : viewState.sector === 'quantum'
            ? defaultQuantumSubsectorWeights
            : defaultSemiconductorsSubsectorWeights;

          Object.entries(d.data.sectorDetails[viewState.sector] ?? {}).forEach(([key, score]) => {
            const weightedScore = (score as number) * (weights[key as keyof typeof weights] ?? 0);
            
            const color = viewState.sector === 'space' 
              ? spaceSubsectorColors[key as keyof typeof spaceSubsectorColors]
              : viewState.sector === 'biotech'
              ? biotechSubsectorColors[key as keyof typeof biotechSubsectorColors]
              : viewState.sector === 'ai'
                ? aiSubsectorColors[key as keyof typeof aiSubsectorColors]
                : viewState.sector === 'quantum'
                  ? quantumSubsectorColors[key as keyof typeof quantumSubsectorColors]
                  : d3.color(sectorColors[viewState.sector])!.brighter(keys.indexOf(key) / keys.length);

            tooltipContent += `
              <div style="
                display: flex; 
                align-items: center; 
                margin-bottom: 6px;
                padding: 4px;
                background-color: ${key === hoveredKey ? '#f7fafc' : 'transparent'};
                border-radius: 4px;
                ${key === hoveredKey ? 'font-weight: 600;' : ''}
              ">
                <div style="
                  width: 12px; 
                  height: 12px; 
                  background-color: ${color}; 
                  margin-right: 8px; 
                  border-radius: 2px;
                "></div>
                <div style="flex-grow: 1; color: ${key === hoveredKey ? '#2D3748' : '#4A5568'};">
                  ${subsectorDefinitions[viewState.sector][key]}
                </div>
                <div style="color: ${key === hoveredKey ? '#2D3748' : '#718096'};">
                  ${weightedScore.toFixed(3)}
                </div>
              </div>
            `;
          });
        } else {
          // Show sector scores with weights applied
          Object.entries(d.data.sectorDetails ?? {}).forEach(([sector, subsectorData]) => {
            const weights = sector === 'space' 
              ? defaultSpaceSubsectorWeights
              : sector === 'biotech'
              ? defaultBiotechSubsectorWeights
              : sector === 'ai'
              ? defaultAISubsectorWeights
              : sector === 'quantum'
              ? defaultQuantumSubsectorWeights
              : defaultSemiconductorsSubsectorWeights;

            const score = calculateSectorScore(subsectorData, weights, sectorWeights[sector] ?? 0);

            tooltipContent += `
              <div style="
                display: flex; 
                align-items: center; 
                margin-bottom: 6px;
                padding: 4px;
                background-color: ${sector === hoveredKey ? '#f7fafc' : 'transparent'};
                border-radius: 4px;
                ${sector === hoveredKey ? 'font-weight: 600;' : ''}
              ">
                <div style="
                  width: 12px; 
                  height: 12px; 
                  background-color: ${sectorColors[sector]}; 
                  margin-right: 8px; 
                  border-radius: 2px;
                "></div>
                <div style="flex-grow: 1; color: ${sector === hoveredKey ? '#2D3748' : '#4A5568'};">
                  ${sector.toUpperCase()}
                </div>
                <div style="color: ${sector === hoveredKey ? '#2D3748' : '#718096'};">
                  ${score.toFixed(3)}
                </div>
              </div>
            `;
          });
        }

        // Calculate total score with weights
        const totalScore = viewState.type === 'sector' && viewState.sector
          ? calculateSectorScore(
              d.data.sectorDetails?.[viewState.sector] ?? {},
              viewState.sector === 'space' 
                ? defaultSpaceSubsectorWeights
                : viewState.sector === 'biotech'
                ? defaultBiotechSubsectorWeights
                : viewState.sector === 'ai'
                ? defaultAISubsectorWeights
                : viewState.sector === 'quantum'
                ? defaultQuantumSubsectorWeights
                : defaultSemiconductorsSubsectorWeights
            )
          : Object.entries(d.data.sectorDetails ?? {}).reduce((sum, [sector, details]) => {
              const weights = sector === 'space' 
                ? defaultSpaceSubsectorWeights
                : sector === 'biotech'
                ? defaultBiotechSubsectorWeights
                : sector === 'ai'
                ? defaultAISubsectorWeights
                : sector === 'quantum'
                ? defaultQuantumSubsectorWeights
                : defaultSemiconductorsSubsectorWeights;
              return sum + calculateSectorScore(details, weights, sectorWeights[sector] ?? 0);
            }, 0);

        tooltipContent += `
          </div>
          <div style="font-weight: 600; color: #2D3748; border-top: 1px solid #E2E8F0; padding-top: 6px;">
            Total Score: ${totalScore.toFixed(3)}
          </div>
        `;

        tooltip.html(tooltipContent);
        tooltip.style("visibility", "visible");

        const isSelected = selectedCountries.includes(d.data.country);
        const rect = d3.select(event.currentTarget);
        const currentWidth = isSelected ? selectedWidth : normalWidth;
        const currentHeight = isSelected ? selectedHeight(d) : normalHeight(d);

        rect.transition()
          .duration(200)
          .attr("x", x(d.data.country)! - (selectedWidth - normalWidth) / 2)
          .attr("width", selectedWidth)
          .attr("y", y(d[1]) - (selectedHeight(d) - normalHeight(d)))
          .attr("height", selectedHeight(d))
          .style("opacity", 1)
          .style("stroke", "#1A202C")
          .style("stroke-width", "1px")
          .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))");
      })
      .on("mousemove", (event) => {
        const containerRect = containerRef.current!.getBoundingClientRect();
        const svgRect = svgRef.current!.getBoundingClientRect();
        const tooltipNode = tooltipRef.current!;
        
        const xPos = event.clientX - svgRect.left;
        const yPos = event.clientY - svgRect.top;
        
        let left = xPos + margin.left + 16;
        let top = yPos;
        
        if (left + tooltipNode.offsetWidth > containerRect.width) {
          left = xPos - tooltipNode.offsetWidth - 16;
        }
        
        if (top + tooltipNode.offsetHeight > containerRect.height) {
          top = containerRect.height - tooltipNode.offsetHeight - 8;
        }
        if (top < 0) {
          top = 8;
        }
        
        tooltip
          .style("left", `${left}px`)
          .style("top", `${top}px`);
      })
      .on("mouseout", (event) => {
        tooltip.style("visibility", "hidden");

        const currentKey = keys[d3.select(event.currentTarget.parentNode).datum().index];
        const d = event.target.__data__;
        const isSelected = selectedCountries.includes(d.data.country);

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("x", x(d.data.country)!)
          .attr("width", isSelected ? selectedWidth : normalWidth)
          .attr("y", y(d[1]))
          .attr("height", isSelected ? selectedHeight(d) : normalHeight(d))
          .style("opacity", () => {
            if (selectedCountries.length && !selectedCountries.includes(d.data.country)) return 0.3;
            if (selectedSector && currentKey !== selectedSector) return 0.3;
            return 1;
          })
          .style("stroke", isSelected ? "#1A202C" : "none")
          .style("stroke-width", isSelected ? "1px" : "0")
          .style("filter", isSelected ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" : "none");
      });

  }, [data, selectedSector, selectedCountries, onCountrySelect, viewState, sectorWeights]);

  return (
    <div ref={containerRef} className="relative">
      <svg
        ref={svgRef}
        width="100%"
        height="400"
        className="bg-white"
      />
      <div ref={tooltipRef} className="absolute" />
    </div>
  );
};

export default BarChart;