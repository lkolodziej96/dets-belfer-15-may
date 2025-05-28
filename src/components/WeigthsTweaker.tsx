import { getPercentage } from '@/utils/display';
import { cn } from '@/utils/styling';
import { useMemo } from 'react';

type AllocationType = 'perfect' | 'under' | 'over';

function getAllocationType(totalPercentage: number): AllocationType {
  if (Math.abs(totalPercentage - 100) < Number.EPSILON) {
    return 'perfect';
  } else if (totalPercentage < 100) {
    return 'under';
  } else {
    return 'over';
  }
}

const ALLOCATION_TYPE_BG_COLORS = {
  perfect: 'bg-green-50',
  under: 'bg-amber-50',
  over: 'bg-red-50',
} as const satisfies Record<AllocationType, string>;

const ALLOCATION_TYPE_TEXT_COLORS = {
  perfect: 'text-green-600',
  under: 'text-amber-600',
  over: 'text-red-600',
} as const satisfies Record<AllocationType, string>;

function getAllocationTypeMessage({
  allocationType,
  totalPercentage,
}: {
  allocationType: AllocationType;
  totalPercentage: number;
}) {
  if (allocationType === 'perfect') {
    return 'Perfect allocation: 100%';
  } else if (allocationType === 'under') {
    return `${100 - totalPercentage}% left to allocate`;
  } else {
    return `You are ${totalPercentage - 100}% over the limit`;
  }
}

export type WeightsTweakerProps = {
  weights: Record<string, number>;
  onChangeWeight: (weight: string, value: number) => void;
  accentColor: string;
  getLabel: (key: string) => string;
};

export function WeigthsTweaker({
  weights,
  onChangeWeight,
  accentColor,
  getLabel,
}: WeightsTweakerProps) {
  const entries = useMemo(
    () => Object.entries(weights).map(([key, value]) => ({ key, value })),
    [weights],
  );
  const weigthsSum = useMemo(() => entries.reduce((acc, curr) => acc + curr.value, 0), [entries]);
  const totalPercentage = getPercentage(weigthsSum);
  const allocationType = getAllocationType(totalPercentage);

  const bgColor = ALLOCATION_TYPE_BG_COLORS[allocationType];
  const textColor = ALLOCATION_TYPE_TEXT_COLORS[allocationType];
  const message = getAllocationTypeMessage({ allocationType, totalPercentage });

  return (
    <div className="space-y-4">
      <div className={cn('rounded-md p-3', bgColor)}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current total:</span>
          <span className={cn('text-sm font-semibold', textColor)}>{totalPercentage}%</span>
        </div>
        <div className={cn('mt-1 text-xs', textColor)}>{message}</div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
          <div
            className={`h-1.5 rounded-full transition-all duration-300`}
            style={{
              width: `${Math.min(totalPercentage, 100)}%`,
              backgroundColor: accentColor,
            }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map(({ key, value }) => (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600">{getLabel(key)}</label>
              <span className="text-sm tabular-nums text-gray-900">{getPercentage(value)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="2.5"
              value={getPercentage(value)}
              onChange={(e) => onChangeWeight(key, parseFloat(e.target.value) / 100)}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200"
              style={{
                accentColor: accentColor,
                background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${getPercentage(value)}%, rgb(229 231 235) ${getPercentage(value)}%, rgb(229 231 235) 100%)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
