import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import xlsx from 'xlsx';
import legacy from '@vitejs/plugin-legacy';

export function excelToJsonPlugin({ excludeSheets }: { excludeSheets?: string[] }): Plugin {
  return {
    name: 'excelToJson',
    enforce: 'pre',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.xlsx')) {
        server.ws.send({ type: 'full-reload', path: '*' });
      }
    },
    async load(id) {
      if (id.endsWith('.xlsx?embed')) {
        const workbook = xlsx.readFile(id.slice(0, -6), { type: 'buffer' });
        const sheetNames = workbook.SheetNames;
        const importData: ExcelData[] = sheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          return {
            sheetName,
            data: xlsx.utils.sheet_to_json(worksheet),
          };
        });

        const filterChoices = new Set(excludeSheets?.map((sheet) => sheet.toLowerCase()));
        const filteredData = excludeSheets
          ? importData.filter(({ sheetName }) => !filterChoices.has(sheetName.toLowerCase()))
          : importData;

        return `export default ${JSON.stringify(filteredData)}`;
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    excelToJsonPlugin({ excludeSheets: ['summary'] }),
    legacy({
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: ['es.object.group-by'],
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
