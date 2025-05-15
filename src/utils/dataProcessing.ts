import type { CountryData, SectorWeights } from '../types';
import { validateAndProcessData, standardizeCountryNames } from './dataValidation';
import { subsectorDefinitions, viewBaseColors } from './constants';

export function processExcelData(rawData: any[], weights: SectorWeights): CountryData[] {
  try {
    // First validate and process the raw data
    const { data: validatedData, validation } = validateAndProcessData(rawData);

    if (!validation.isValid) {
      if (validation.errors.length > 0) {
        console.log('Data validation failed:', validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.log('Validation warnings:', validation.warnings);
      }
      return [];
    }

    // Standardize country names
    const standardizedData = standardizeCountryNames(validatedData);

    // Apply weights and calculate scores
    return standardizedData.map(country => {
      const sectorScores = {
        ai: parseFloat(country.ai) * weights.ai,
        quantum: parseFloat(country.quantum) * weights.quantum,
        semiconductors: parseFloat(country.semiconductors) * weights.semiconductors,
        biotech: parseFloat(country.biotech) * weights.biotech,
        space: parseFloat(country.space) * weights.space
      };

      // Process subsector data
      const sectorDetails: { [key: string]: { [subsector: string]: number } } = {};
      
      // For each sector that has subsectors defined
      Object.entries(subsectorDefinitions).forEach(([sector, subsectors]) => {
        sectorDetails[sector] = {};
        Object.keys(subsectors).forEach(subsector => {
          const columnName = `${sector}_${subsector}`;
          sectorDetails[sector][subsector] = country[columnName] || 0;
        });
      });

      const totalScore = Object.values(sectorScores).reduce((sum, score) => sum + score, 0);

      return {
        ...country,
        totalScore,
        sectorScores,
        sectorDetails
      };
    });
  } catch (error) {
    console.log('Error processing data:', error);
    return [];
  }
}

export function calculateColorIntensity(value: number, max: number, viewType: 'main' | 'sector' = 'main', sector?: string): string {
  // Get the base color for the current view
  let baseColor;
  if (viewType === 'sector' && sector) {
    // For sector views, use the specific sector color
    baseColor = viewBaseColors[sector];
  } else {
    baseColor = viewBaseColors.main;
  }
  
  // Increase color intensity by using a power function
  const intensity = Math.pow(value / max, 0.5);
  
  // Convert hex to RGB
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  // Calculate the lighter version by mixing with white
  const mixWithWhite = (color: number, intensity: number) => {
    const minIntensity = 0.2;
    const adjustedIntensity = minIntensity + (intensity * (1 - minIntensity));
    return Math.round(color * adjustedIntensity + 255 * (1 - adjustedIntensity));
  };
  
  const finalR = mixWithWhite(r, intensity);
  const finalG = mixWithWhite(g, intensity);
  const finalB = mixWithWhite(b, intensity);
  
  return `rgb(${finalR}, ${finalG}, ${finalB})`;
}