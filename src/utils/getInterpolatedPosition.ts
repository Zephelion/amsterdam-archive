import * as THREE from "three";
import { getSpherePosition } from "./getSpherePosition";
import { getLayoutPosition } from "./layouts";
import type { LayoutId } from "./layouts";

interface GetInterpolatedPositionParams {
  index: number;
  totalItems: number;
  isSphereTransitioning: boolean;
  sphereTransitionProgress: number;
  hasCompletedHistorySection: boolean;
  scrollProgress: number;
  layoutFrom: LayoutId;
  layoutTo: LayoutId;
  layoutT: number; // 0 -> 1
}

export const getInterpolatedPosition = ({
  index,
  totalItems,
  isSphereTransitioning,
  sphereTransitionProgress,
  hasCompletedHistorySection,
  scrollProgress,
  layoutFrom,
  layoutTo,
  layoutT,
}: GetInterpolatedPositionParams): THREE.Vector3Tuple => {
  const spherePos = getSpherePosition(index, totalItems);
  const fromPos = getLayoutPosition(layoutFrom, index, totalItems);
  const toPos = getLayoutPosition(layoutTo, index, totalItems);

  const gridPos: THREE.Vector3Tuple = [
    THREE.MathUtils.lerp(fromPos[0], toPos[0], layoutT),
    THREE.MathUtils.lerp(fromPos[1], toPos[1], layoutT),
    THREE.MathUtils.lerp(fromPos[2], toPos[2], layoutT),
  ];

  // Use sphere transition progress if transitioning, otherwise use scroll progress
  let t: number;
  if (isSphereTransitioning) {
    t = sphereTransitionProgress;
  } else {
    t = hasCompletedHistorySection ? 1 : scrollProgress;
  }

  return [
    THREE.MathUtils.lerp(spherePos[0], gridPos[0], t),
    THREE.MathUtils.lerp(spherePos[1], gridPos[1], t),
    THREE.MathUtils.lerp(spherePos[2], gridPos[2], t),
  ];
};
