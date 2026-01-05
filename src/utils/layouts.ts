import type * as THREE from "three";
import { getGridPosition } from "./getGridPosition";
import { getSpherePosition } from "./getSpherePosition";
import { getGrid10To6WrappedPosition } from "./getGrid10To6WrappedPosition";

export type LayoutId = "grid-10" | "grid-6" | "sphere";

export const getLayoutPosition = (
  layout: LayoutId,
  index: number,
  totalItems: number
): THREE.Vector3Tuple => {
  switch (layout) {
    case "grid-10":
      // Pass totalItems to getGridPosition for dynamic column calculation
      return getGridPosition(index, totalItems);
    case "grid-6":
      // "Wrap" layout: keep columns 0..5 fixed; move cols 6..9 down into extra rows.
      return getGrid10To6WrappedPosition(index, totalItems);
    case "sphere":
      return getSpherePosition(index, totalItems);
    default: {
      // Exhaustiveness guard
      const _exhaustive: never = layout;
      return _exhaustive;
    }
  }
};
