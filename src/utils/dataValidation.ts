// Map of country names to their official names in the world map data
const COUNTRY_NAME_MAPPINGS: { [key: string]: string } = {
  'USA': 'United States',
  'US': 'United States',
  'United States of America': 'United States',
  'U.S.A.': 'United States',
  'UK': 'United Kingdom',
  'PRC': 'China',
  'People\'s Republic of China': 'China',
  'Korea': 'South Korea',
  'Republic of Korea': 'South Korea',
  'Korea, Republic of': 'South Korea',
  'Korea, Dem. Rep.': 'North Korea',
  'Democratic People\'s Republic of Korea': 'North Korea',
  'DPRK': 'North Korea',
  'Russian Federation': 'Russia',
  'Czech Republic': 'Czechia',
  'UAE': 'United Arab Emirates',
  'U.A.E.': 'United Arab Emirates',
  'United Arab Emirates': 'U.A.E.'  // Add reverse mapping
};

export function validateAndProcessData(rawData: any[]): ProcessedData {
  const validation: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check if data is empty
  if (!rawData || rawData.length === 0) {
    validation.isValid = false;
    validation.errors.push('No data provided');
    return { data: [], validation };
  }

  // Log the first row to see the actual column names
  if (rawData[0]) {
    console.log('First row:', rawData[0]);
  }

  // Check required columns
  const columns = Object.keys(rawData[0] || {});
  const missingColumns = REQUIRED_COLUMNS.filter(col => !columns.includes(col));
  
  if (missingColumns.length > 0) {
    validation.isValid = false;
    validation.errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
    console.log('Available columns:', columns);
    console.log('Missing columns:', missingColumns);
    return { data: [], validation };
  }

  // Process and validate each row
  const processedData: CountryData[] = [];
  const countrySet = new Set<string>();

  rawData.forEach((row, index) => {
    // Skip empty rows
    if (!row || Object.keys(row).length === 0) {
      return;
    }

    // Map Excel column names to our internal names
    const mappedRow = Object.entries(COLUMN_MAPPINGS).reduce((acc, [excelCol, internalCol]) => {
      acc[internalCol] = row[excelCol];
      return acc;
    }, {} as any);

    // Validate country name
    if (!mappedRow.country || typeof mappedRow.country !== 'string') {
      validation.errors.push(`Invalid country name at row ${index + 1}`);
      return;
    }

    // Check for duplicate countries
    if (countrySet.has(mappedRow.country)) {
      validation.warnings.push(`Duplicate country found: ${mappedRow.country}`);
      return;
    }
    countrySet.add(mappedRow.country);

    // Validate and normalize sector values
    const sectorScores: { [key: string]: number } = {};
    let hasInvalidScore = false;

    Object.entries(SECTOR_WEIGHTS).forEach(([sector, weight]) => {
      const value = parseFloat(mappedRow[sector]);
      
      if (isNaN(value)) {
        validation.errors.push(`Invalid ${sector} value for ${mappedRow.country}`);
        hasInvalidScore = true;
        return;
      }

      if (value < 0) {
        validation.errors.push(`Negative ${sector} value for ${mappedRow.country}`);
        hasInvalidScore = true;
        return;
      }

      if (value > 1) {
        validation.warnings.push(`${sector} value > 1 for ${mappedRow.country}`);
      }

      sectorScores[sector] = value;
    });

    if (hasInvalidScore) {
      return;
    }

    // Calculate total score (unweighted at this stage)
    const totalScore = Object.values(sectorScores).reduce((sum, score) => sum + score, 0);

    // Create processed country data
    const countryData: CountryData = {
      country: mappedRow.country.trim(),
      totalScore,
      sectorScores: {
        ai: mappedRow.ai,
        quantum: mappedRow.quantum,
        semiconductors: mappedRow.semiconductors,
        biotech: mappedRow.biotech,
        space: mappedRow.space
      },
      sectorDetails: {}
    };

    processedData.push(countryData);
  });

  // Update validation status based on errors
  if (validation.errors.length > 0) {
    validation.isValid = false;
  }

  return {
    data: processedData,
    validation
  };
}

export function standardizeCountryNames(data: CountryData[]): CountryData[] {
  return data.map(item => ({
    ...item,
    country: COUNTRY_NAME_MAPPINGS[item.country] || item.country
  }));
}

export function validateSectorWeights(data: CountryData[]): boolean {
  const totalWeight = Object.values(SECTOR_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  return Math.abs(totalWeight - 1) < 0.0001; // Account for floating-point precision
}