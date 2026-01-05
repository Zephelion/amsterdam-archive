import type * as THREE from "three";
import { DEFAULT_GRID_SIZE, SPACING } from "./getGridPosition";

/**
 * "Wrap" a 10-column grid into a 6-column grid WITHOUT moving items that are already
 * in columns 0..5. Only items in columns 6..9 are moved into additional rows below.
 *
 * This keeps the left 6 columns visually anchored (no centering shift).
 */
export const getGrid10To6WrappedPosition = (
  index: number,
  totalItems: number
): THREE.Vector3Tuple => {
  const GRID6_X_SHIFT = -5;

  const originalRow = Math.floor(index / DEFAULT_GRID_SIZE);
  const originalCol = index % DEFAULT_GRID_SIZE;

  const offsetX10 = ((DEFAULT_GRID_SIZE - 1) * SPACING) / 2;
  const offsetY10 = ((DEFAULT_GRID_SIZE - 1) * SPACING) / 2;

  // If item is already in the first 6 columns, keep it exactly where it was in the 10-grid.
  if (originalCol < 6) {
    const isEvenInRow = originalCol % 2 === 1;
    const yOffset = isEvenInRow ? -1.5 : 0;
    return [
      originalCol * SPACING - offsetX10 + GRID6_X_SHIFT,
      originalRow * SPACING - offsetY10 + yOffset,
      0,
    ];
  }

  // Items from columns 6..9 get re-packed into 6 columns starting after the last 10-grid row.
  const originalRowCount = Math.ceil(totalItems / DEFAULT_GRID_SIZE);

  // Overflow items per full row = 4 (cols 6,7,8,9)
  const overflowIndex = originalRow * 4 + (originalCol - 6);

  const newCol = overflowIndex % 6;
  const newRow = originalRowCount + Math.floor(overflowIndex / 6);

  const isEvenInRow = newCol % 2 === 1;
  const yOffset = isEvenInRow ? -1.5 : 0;

  return [
    newCol * SPACING - offsetX10 + GRID6_X_SHIFT,
    newRow * SPACING - offsetY10 + yOffset,
    0,
  ];
};
