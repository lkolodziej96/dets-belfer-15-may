import { getSectorColor } from '@/sectors/colors';
import type { Sector } from '@/sectors/sectorDef';
import { theme } from '@/theme';

export function calculateColorIntensity(
  value: number,
  max: number,
  selectedSector: Sector | null,
): string {
  // Get the base color for the current view
  const baseColor = selectedSector ? getSectorColor(selectedSector) : theme.colors.main;

  // Increase color intensity by using a power function
  const intensity = Math.pow(value / max, 0.5);

  // Convert hex to RGB
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);

  // Calculate the lighter version by mixing with white
  const mixWithWhite = (color: number, intensity: number) => {
    const minIntensity = 0.2;
    const adjustedIntensity = minIntensity + intensity * (1 - minIntensity);
    return Math.round(color * adjustedIntensity + 255 * (1 - adjustedIntensity));
  };

  const finalR = mixWithWhite(r, intensity);
  const finalG = mixWithWhite(g, intensity);
  const finalB = mixWithWhite(b, intensity);

  return `rgb(${finalR}, ${finalG}, ${finalB})`;
}
