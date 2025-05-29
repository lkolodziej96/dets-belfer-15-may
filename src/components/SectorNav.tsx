import { getSectorColor } from '@/sectors/colors';
import { getSectorLabel } from '@/sectors/labels';
import { type Sector, getSectorList } from '@/sectors/sectorDef';
import { cn } from '@/utils/styling';

export type SectorNavProps = {
  currentSector: string | null;
  onSectorChange: (sector: Sector | null) => void;
};

export default function SectorNav({
  currentSector,
  onSectorChange: onSectorClick,
}: SectorNavProps) {
  return (
    <div className="border-b border-gray-200 bg-white py-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => onSectorClick(null)}
            className={cn(
              'rounded-xl bg-gray-100 px-8 py-3.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-200',
              !currentSector && 'bg-main text-white shadow-lg shadow-main/20 hover:shadow-main/30',
            )}
          >
            Overview
          </button>
          {getSectorList().map((sector) => (
            <button
              key={sector}
              onClick={() => onSectorClick(sector)}
              className="rounded-xl px-8 py-3.5 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor:
                  currentSector === sector ? getSectorColor(sector) : 'rgb(243 244 246)',
                color: currentSector === sector ? 'white' : 'rgb(75 85 99)',
                boxShadow:
                  currentSector === sector
                    ? `0 10px 15px -3px ${getSectorColor(sector)}20, 0 4px 6px -4px ${getSectorColor(sector)}30`
                    : 'none',
              }}
            >
              {getSectorLabel(sector)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
