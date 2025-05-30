import data from './data.xlsx?embed';

type CountryData = {
  country: string;
  sectorDetails: {
    [key: string]: {
      [subsector: string]: number;
    };
  };
};

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
