import type * as THREE from "three";

export const SPACING = 6;
export const DEFAULT_GRID_SIZE = 10; // Default for backward compatibility

/**
 * Calculate optimal number of columns based on total items.
 * Tries to create a roughly square or balanced grid.
 */
export const calculateOptimalColumns = (totalItems: number): number => {
  if (totalItems <= 0) return DEFAULT_GRID_SIZE;

  // For very small numbers, use a small grid
  if (totalItems <= 4) return 2;
  if (totalItems <= 9) return 3;
  if (totalItems <= 16) return 4;
  if (totalItems <= 25) return 5;
  if (totalItems <= 36) return 6;
  if (totalItems <= 49) return 7;
  if (totalItems <= 64) return 8;
  if (totalItems <= 81) return 9;
  if (totalItems <= 100) return 10;

  // For larger numbers, calculate based on square root
  const sqrt = Math.sqrt(totalItems);
  const columns = Math.ceil(sqrt);

  // Round to nearest "nice" number (5, 6, 7, 8, 9, 10, 12, etc.)
  if (columns <= 10) return columns;
  if (columns <= 12) return 12;
  if (columns <= 15) return 15;
  if (columns <= 20) return 20;

  // Cap at reasonable maximum
  return Math.min(columns, 20);
};

// Calculate grid position for each item with dynamic columns
export const getGridPosition = (
  index: number,
  totalItems?: number
): THREE.Vector3Tuple => {
  // Use dynamic columns if totalItems is provided, otherwise use default
  const columns = totalItems
    ? calculateOptimalColumns(totalItems)
    : DEFAULT_GRID_SIZE;

  const row = Math.floor(index / columns);
  const col = index % columns;

  const offsetX = ((columns - 1) * SPACING) / 2;
  const offsetY = ((columns - 1) * SPACING) / 2;

  const isEvenInRow = col % 2 === 1;
  const yOffset = isEvenInRow ? -1.5 : 0;

  return [col * SPACING - offsetX, row * SPACING - offsetY + yOffset, 0];
};

// Variant grid position (e.g. 6 columns) while keeping the same vertical centering
// reference as the 10-column grid for smoother layout morphs.
export const getGridPositionForColumns = (
  index: number,
  columns: number
): THREE.Vector3Tuple => {
  const row = Math.floor(index / columns);
  const col = index % columns;

  const offsetX = ((columns - 1) * SPACING) / 2;
  // Keep vertical centering based on the original DEFAULT_GRID_SIZE so the grid doesn't "jump"
  // when switching column counts.
  const offsetY = ((DEFAULT_GRID_SIZE - 1) * SPACING) / 2;

  const isEvenInRow = col % 2 === 1;
  const yOffset = isEvenInRow ? -1.5 : 0;

  return [col * SPACING - offsetX, row * SPACING - offsetY + yOffset, 0];
};
