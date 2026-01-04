import { useRef } from "react";
import { useArtworkStore } from "@/stores";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { CAMERA_BASE_POSITION, CAMERA_GRID_POSITION } from "@/constants/camera";
import * as THREE from "three";

const TRANSITION_DURATION = 2000; // 2 seconds for each phase
const WAIT_DURATION = 2000; // 2 seconds wait between transitions
const CAMERA_LERP_SPEED = 0.05;

export const useTimelineTransition = () => {
  const { camera } = useThree();
  const isTimelineTransitioning = useArtworkStore(
    (state) => state.isTimelineTransitioning
  );
  const setTimelineTransitionProgress = useArtworkStore(
    (state) => state.setTimelineTransitionProgress
  );
  const setTimelineTransitioning = useArtworkStore(
    (state) => state.setTimelineTransitioning
  );

  const transitionStartTime = useRef<number | null>(null);
  const phase = useRef<"toSphere" | "waiting" | "toGrid">("toSphere");

  useFrame((state) => {
    if (!isTimelineTransitioning) {
      transitionStartTime.current = null;
      return;
    }

    const currentTime = state.clock.elapsedTime * 1000;

    if (transitionStartTime.current === null) {
      transitionStartTime.current = currentTime;
    }

    const elapsed = currentTime - transitionStartTime.current;

    if (phase.current === "toSphere") {
      // Transition from grid (1) to sphere (0)
      const progress = Math.min(1, elapsed / TRANSITION_DURATION);
      const t = 1 - progress; // Reverse: 1 -> 0
      setTimelineTransitionProgress(t);

      // Transition camera to base position
      const targetPos = new THREE.Vector3(...CAMERA_BASE_POSITION);
      camera.position.lerp(targetPos, CAMERA_LERP_SPEED);

      if (progress >= 1) {
        phase.current = "waiting";
        transitionStartTime.current = currentTime;
      }
    } else if (phase.current === "waiting") {
      // Keeps the camera at the base position
      const targetPos = new THREE.Vector3(...CAMERA_BASE_POSITION);
      camera.position.lerp(targetPos, CAMERA_LERP_SPEED);

      // Wait 2 seconds
      if (elapsed >= WAIT_DURATION) {
        phase.current = "toGrid";
        transitionStartTime.current = currentTime;
      }
    } else if (phase.current === "toGrid") {
      // Transition from sphere (0) to grid (1)
      const progress = Math.min(1, elapsed / TRANSITION_DURATION);
      setTimelineTransitionProgress(progress);

      // Transition camera to grid position
      const targetPos = new THREE.Vector3(...CAMERA_GRID_POSITION);
      camera.position.lerp(targetPos, CAMERA_LERP_SPEED);

      if (progress >= 1) {
        // Transition complete
        setTimelineTransitioning(false);
        phase.current = "toSphere";
        transitionStartTime.current = null;
      }
    }
  });
};
