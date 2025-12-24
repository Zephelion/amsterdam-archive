import * as THREE from "three";
import { getSpherePosition } from "./getSpherePosition";
import { getGridPosition } from "./getGridPosition";

interface GetInterpolatedPositionParams {
  index: number;
  totalItems: number;
  isTimelineTransitioning: boolean;
  timelineTransitionProgress: number;
  hasCompletedHistorySection: boolean;
  scrollProgress: number;
}

export const getInterpolatedPosition = ({
  index,
  totalItems,
  isTimelineTransitioning,
  timelineTransitionProgress,
  hasCompletedHistorySection,
  scrollProgress,
}: GetInterpolatedPositionParams): THREE.Vector3Tuple => {
  const spherePos = getSpherePosition(index, totalItems);
  const gridPos = getGridPosition(index);

  // Use timeline transition progress if transitioning, otherwise use scroll progress
  let t: number;
  if (isTimelineTransitioning) {
    t = timelineTransitionProgress;
  } else {
    t = hasCompletedHistorySection ? 1 : scrollProgress;
  }

  return [
    THREE.MathUtils.lerp(spherePos[0], gridPos[0], t),
    THREE.MathUtils.lerp(spherePos[1], gridPos[1], t),
    THREE.MathUtils.lerp(spherePos[2], gridPos[2], t),
  ];
};
