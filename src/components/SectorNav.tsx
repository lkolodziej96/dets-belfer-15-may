import React from 'react';
import { sectorNames, viewBaseColors } from '../utils/constants';

interface Props {
  currentSector: string | null;
  onSectorClick: (sector: string | null) => void;
}

const SectorNav: React.FC<Props> = ({ currentSector, onSectorClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => onSectorClick(null)}
            className={`px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              !currentSector 
                ? 'bg-[#962437] text-white shadow-lg shadow-[#962437]/20 hover:shadow-[#962437]/30' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          {Object.entries(sectorNames).map(([key, name]) => {
            const color = viewBaseColors[key];
            return (
              <button
                key={key}
                onClick={() => onSectorClick(key)}
                className={`px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-200`}
                style={{
                  backgroundColor: currentSector === key ? color : 'rgb(243 244 246)',
                  color: currentSector === key ? 'white' : 'rgb(75 85 99)',
                  boxShadow: currentSector === key ? `0 10px 15px -3px ${color}20, 0 4px 6px -4px ${color}30` : 'none'
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SectorNav;