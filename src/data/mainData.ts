import type { CountryData } from '../types';
import data from './data.xlsx?embed';

function renameSheetName(sheetName: string) {
  if (/semicon/i.test(sheetName)) {
    return 'semiconductors';
  }

  return sheetName;
}

const flatListWithSector = data.flatMap(({ sheetName, data }) => {
  return data.map((dataEntry) => ({ sector: renameSheetName(sheetName), ...dataEntry }));
});

const groupedByCountry = Object.groupBy(
  flatListWithSector,
  (entry) => entry['Country' as keyof typeof entry],
);

const processedData = Object.entries(groupedByCountry).map(([country, data]) => {
  const rawSectorDetails = Object.groupBy(data ?? [], (entry) =>
    entry['sector' as keyof typeof entry].toLowerCase(),
  );

  return {
    country,
    sectorDetails: Object.fromEntries(
      Object.entries(rawSectorDetails).map(([sector, data]) => [
        sector,
        data?.map((sectorDetails) => {
          const sectorAttributes = Object.entries(sectorDetails).map(([key, value]) => ({
            attributeName: key,
            attributeValue: value,
          }));

          const snakeCasedKeys = sectorAttributes
            .map(({ attributeName, attributeValue }) => ({
              attributeName: attributeName.toLowerCase().replace(/ /g, '_'),
              attributeValue: attributeValue,
            }))
            // removes grouped attributes
            .filter(
              ({ attributeName }) =>
                !['country', 'sector', 'raw_index_score', 'raw_score'].includes(
                  attributeName.toLowerCase(),
                ),
            );

          return Object.fromEntries(
            snakeCasedKeys.map(({ attributeName, attributeValue }) => [
              attributeName,
              attributeValue,
            ]),
          );
        })[0],
      ]),
    ),
  };
});

export const mainData = processedData as unknown as CountryData[];

// TODO: Moved to `src/modules/sectors.ts`
export const overviewColumns = [
  { key: 'ai', name: 'AI' },
  { key: 'quantum', name: 'Quantum' },
  { key: 'semiconductors', name: 'Semiconductors' },
  { key: 'biotech', name: 'Biotechnology' },
  { key: 'space', name: 'Space' },
];

export const aiColumns = [
  { key: 'algorithms', name: 'Algorithms' },
  { key: 'computing_power', name: 'Computing Power' },
  { key: 'data', name: 'Data' },
  { key: 'economic_resources', name: 'Economic Resources' },
  { key: 'global_player', name: 'Global Player' },
  { key: 'human_capital', name: 'Human Capital' },
  { key: 'regulatory', name: 'Regulatory' },
  { key: 'accuracy_of_top_models', name: 'Accuracy of Top Models' },
];

export const quantumColumns = [
  { key: 'economic_resources', name: 'Economic Resources' },
  { key: 'security', name: 'Security' },
  { key: 'human_capital', name: 'Human Capital' },
  { key: 'global_player', name: 'Global Player' },
  { key: 'policy_environment', name: 'Policy Environment' },
  { key: 'quantum_sensing', name: 'Quantum Sensing' },
  { key: 'quantum_communications', name: 'Quantum Communications' },
  { key: 'quantum_computing', name: 'Quantum Computing' },
];

export const semiconductorsColumns = [
  { key: 'economic_resources', name: 'Economic Resources' },
  { key: 'human_capital', name: 'Human Capital' },
  { key: 'global_player', name: 'Global Player' },
  { key: 'regulatory', name: 'Regulatory' },
  { key: 'raw_materials_and_wafers', name: 'Specialized Material and Wafers' },
  { key: 'chip_design_and_tools', name: 'Chip Design and Tools' },
  { key: 'manufacturing', name: 'Manufacturing and Fabrication' },
  { key: 'equipment', name: 'Equipment' },
  { key: 'assembly_and_testing_(osat)', name: 'Assembly and Testing' },
];

export const biotechColumns = [
  { key: 'economic_resources', name: 'Economic Resources' },
  { key: 'security', name: 'Security' },
  { key: 'human_capital', name: 'Human Capital' },
  { key: 'global_player', name: 'Global Player' },
  { key: 'regulatory', name: 'Regulatory' },
  { key: 'agricultural_technology', name: 'Agricultural Technology' },
  { key: 'vaccine_research', name: 'Vaccine Research' },
  { key: 'pharmaceutical_production', name: 'Pharmaceutical Production' },
  { key: 'genetic_engineering', name: 'Genetic Engineering' },
];

export const spaceColumns = [
  { key: 'economic_resources', name: 'Economic Resources' },
  { key: 'human_capital', name: 'Human Capital' },
  { key: 'security', name: 'Security' },
  { key: 'global_player', name: 'Global Player' },
  { key: 'regulatory', name: 'Regulatory' },
  { key: 'domestic_launch_capability', name: 'Domestic Launch Capability' },
  { key: 'science_and_exploration', name: 'Science and Exploration' },
  { key: 'pnt', name: 'Position, Navigation, and Timing' },
  { key: 'telecommunications', name: 'Telecommunications' },
  { key: 'remote_sensing', name: 'Remote Sensing' },
];
