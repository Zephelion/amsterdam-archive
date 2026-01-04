import type * as THREE from "three";

export const GRID_SIZE = 10;
export const SPACING = 6;

// Calculate grid position for each item
export const getGridPosition = (index: number): THREE.Vector3Tuple => {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;

  const offsetX = ((GRID_SIZE - 1) * SPACING) / 2;
  const offsetY = ((GRID_SIZE - 1) * SPACING) / 2;

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
  // Keep vertical centering based on the original GRID_SIZE so the grid doesn't "jump"
  // when switching column counts.
  const offsetY = ((GRID_SIZE - 1) * SPACING) / 2;

  const isEvenInRow = col % 2 === 1;
  const yOffset = isEvenInRow ? -1.5 : 0;

  return [col * SPACING - offsetX, row * SPACING - offsetY + yOffset, 0];
};
