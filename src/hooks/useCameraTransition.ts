import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useArtworkStore } from "@/stores";

interface useCameraTransitionOptions {
  lerpSpeed?: number;
  zoomDistance?: number;
  offset?: THREE.Vector3Tuple;
}

export const useCameraTransition = (
  isActive: boolean,
  targetPosition: THREE.Vector3Tuple | null,
  options?: useCameraTransitionOptions
) => {
  const { camera } = useThree();
  const setCameraTransitioning = useArtworkStore(
    (state) => state.setCameraTransitioning
  );

  const {
    lerpSpeed = 0.05,
    zoomDistance = 3,
    offset = [0, 0, 0],
  } = options || {};

  //Store the base position
  const basePosition = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 12.5));
  const hasNotifiedCompletion = useRef(false);

  useFrame(() => {
    if (isActive && targetPosition) {
      // Calculate target camera position: artwork position + offset + zoom distance in Z
      const targetCameraPos = new THREE.Vector3(
        targetPosition[0] + offset[0],
        targetPosition[1] + offset[1],
        targetPosition[2] + offset[2] + zoomDistance
      );

      // Smoothly lerp camera position to target
      camera.position.lerp(targetCameraPos, lerpSpeed);

      const distanceToTarget = camera.position.distanceTo(targetCameraPos);

      if (distanceToTarget < 0.1 && !hasNotifiedCompletion.current) {
        hasNotifiedCompletion.current = true;
        setCameraTransitioning(true);
      }
    } else {
      if (hasNotifiedCompletion.current) {
        setCameraTransitioning(false);
        hasNotifiedCompletion.current = false;
      }
      // Return to base position and look at center
      const distanceToBase = camera.position.distanceTo(basePosition.current);

      if (distanceToBase > 0.05) {
        // Lerp back to base position
        camera.position.lerp(basePosition.current, lerpSpeed);
      }
    }
  });
};
