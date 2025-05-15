import React, { useMemo } from 'react';
import type { SectorWeights as SectorWeightsType, ViewState } from '../types';
import { sectorNames, subsectorDefinitions, defaultAISubsectorWeights, defaultQuantumSubsectorWeights, defaultBiotechSubsectorWeights, defaultSpaceSubsectorWeights, viewBaseColors } from '../utils/constants';

interface Props {
  weights: SectorWeightsType;
  onChange: (sector: string, value: number) => void;
  viewState: ViewState;
}

const SectorWeights: React.FC<Props> = ({ weights, onChange, viewState }) => {
  const totalWeight = useMemo(() => {
    if (!weights) return 0;
    return Object.values(weights).reduce((sum, weight) => sum + (weight ?? 0), 0);
  }, [weights]);

  const totalPercentage = +(totalWeight * 100).toFixed(1);
  
  const getTotalStatusInfo = () => {
    if (Math.abs(totalPercentage - 100) < 0.01) {
      return {
        message: "Perfect allocation: 100%",
        color: "text-green-600",
        bgColor: "bg-green-50",
        textColor: "text-green-600",
        barColor: "bg-green-500"
      };
    } else if (totalPercentage < 100) {
      const remaining = +(100 - totalPercentage).toFixed(1);
      return {
        message: `${remaining}% left to allocate`,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
        barColor: "bg-amber-500"
      };
    } else {
      const excess = +(totalPercentage - 100).toFixed(1);
      return {
        message: `You are ${excess}% over the limit`,
        color: "text-red-600",
        bgColor: "bg-red-50",
        textColor: "text-red-600",
        barColor: "bg-red-500"
      };
    }
  };

  const statusInfo = getTotalStatusInfo();

  const getWeightItems = () => {
    if (viewState.type === 'sector' && viewState.sector) {
      if (viewState.sector === 'ai') {
        return Object.entries(subsectorDefinitions[viewState.sector]).map(([key, name]) => ({
          key,
          name,
          weight: weights[key] ?? defaultAISubsectorWeights[key as keyof typeof defaultAISubsectorWeights] ?? 0
        }));
      } else if (viewState.sector === 'quantum') {
        return Object.entries(subsectorDefinitions[viewState.sector]).map(([key, name]) => ({
          key,
          name,
          weight: weights[key] ?? defaultQuantumSubsectorWeights[key as keyof typeof defaultQuantumSubsectorWeights] ?? 0
        }));
      } else if (viewState.sector === 'biotech') {
        return Object.entries(subsectorDefinitions[viewState.sector]).map(([key, name]) => ({
          key,
          name,
          weight: weights[key] ?? defaultBiotechSubsectorWeights[key as keyof typeof defaultBiotechSubsectorWeights] ?? 0
        }));
      } else if (viewState.sector === 'space') {
        return Object.entries(subsectorDefinitions[viewState.sector]).map(([key, name]) => ({
          key,
          name,
          weight: weights[key] ?? defaultSpaceSubsectorWeights[key as keyof typeof defaultSpaceSubsectorWeights] ?? 0
        }));
      } else if (viewState.sector === 'semiconductors') {
        return Object.entries(subsectorDefinitions[viewState.sector]).map(([key, name]) => ({
          key,
          name,
          weight: weights[key] ?? 0
        }));
      }
    }
    return Object.entries(sectorNames).map(([key, name]) => ({
      key,
      name,
      weight: weights[key] ?? 0
    }));
  };

  const weightItems = getWeightItems();

  const getAccentColor = () => {
    if (viewState.type === 'sector' && viewState.sector) {
      return viewBaseColors[viewState.sector];
    }
    return viewBaseColors.main;
  };

  const accentColor = getAccentColor();

  const handleWeightChange = (key: string, value: number) => {
    // Round to nearest 2.5%
    const roundedValue = Math.round(value * 40) / 40;
    const decimalValue = +(roundedValue).toFixed(3);
    onChange(key, decimalValue);
  };

  return (
    <div className="space-y-4">
      <div className={`p-3 rounded-md ${statusInfo.bgColor}`}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Current total:</span>
          <span className={`text-sm font-semibold ${statusInfo.textColor}`}>
            {totalPercentage}%
          </span>
        </div>
        <div className={`text-xs mt-1 ${statusInfo.textColor}`}>
          {statusInfo.message}
        
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300`}
            style={{ 
              width: `${Math.min(totalPercentage, 100)}%`,
              backgroundColor: accentColor
            }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {weightItems.map(({ key, name, weight }) => (
          <div key={key} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">
                {name}
              </label>
              <span className="text-sm text-gray-900 tabular-nums">
                {(weight * 100).toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="2.5"
              value={(weight * 100)}
              onChange={(e) => handleWeightChange(key, parseFloat(e.target.value) / 100)}
              className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: accentColor,
                background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${(weight * 100)}%, rgb(229 231 235) ${(weight * 100)}%, rgb(229 231 235) 100%)`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorWeights;