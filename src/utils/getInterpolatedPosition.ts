import * as THREE from "three";
import { getSpherePosition } from "./getSpherePosition";
import { getGridPosition } from "./getGridPosition";
import { useArtworkStore } from "@/stores";

interface GetInterpolatedPositionParams {
  index: number;
  totalItems: number;
  scrollProgress: number;
}

export const getInterpolatedPosition = ({
  index,
  totalItems,
  scrollProgress,
}: GetInterpolatedPositionParams): THREE.Vector3Tuple => {
  // Get store values directly
  const isTimelineTransitioning =
    useArtworkStore.getState().isTimelineTransitioning;
  const timelineTransitionProgress =
    useArtworkStore.getState().timelineTransitionProgress;
  const hasCompletedHistorySection =
    useArtworkStore.getState().hasCompletedHistorySection;

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
