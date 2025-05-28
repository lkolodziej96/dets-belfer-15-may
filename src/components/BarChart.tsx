import React, { useMemo } from 'react';
import { BarChart as ReBar, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  defaultAISubsectorWeights,
  aiSubsectorColors,
  /* … other weight/color imports … */
} from '../utils/constants';

type CountryDataFlat = {
  country: string;
  [sub: string]: number | string;
};

interface Props {
  data: CountryData[];           // your original shape
  viewState: ViewState;
}

export function SimpleStackedBars({ data, viewState }: Props) {
  // Pick the right weight set & color map
  const { weights, colors, keys } = useMemo(() => {
    switch (viewState.sector) {
      case 'ai':
        return {
          weights: defaultAISubsectorWeights,
          colors: aiSubsectorColors,
          keys: Object.keys(defaultAISubsectorWeights),
        };
      /* handle quantum, semis, biotech, space... */
      default:
        return { weights: {}, colors: {}, keys: [] };
    }
  }, [viewState.sector]);

  // Flatten & weight once
  const chartData: CountryDataFlat[] = useMemo(() => {
    return data.map((d) => {
      const raw = d.sectorDetails?.[viewState.sector!] || {};
      const entry: CountryDataFlat = { country: d.country };
      keys.forEach((k) => {
        entry[k] = +(raw[k] ?? 0) * weights[k];
      });
      return entry;
    });
  }, [data, viewState.sector, keys, weights]);

  if (viewState.type !== 'sector') return null; // only for sector views

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ReBar data={chartData} margin={{ top: 20, right: 20, bottom: 80, left: 60 }}>
        <XAxis
          dataKey="country"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={70}
        />
        <YAxis tickFormatter={(v) => v.toFixed(2)} />
        <Tooltip formatter={(value: number) => value.toFixed(3)} />
        <Legend />
        {keys.map((subkey) => (
          <Bar
            key={subkey}
            dataKey={subkey}
            stackId="stack"
            fill={colors[subkey]}
          />
        ))}
      </ReBar>
    </ResponsiveContainer>
  );
}
