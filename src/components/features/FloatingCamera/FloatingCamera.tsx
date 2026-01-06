import { useFrame, useThree } from "@react-three/fiber";
import { useArtworkStore } from "@/stores";
import * as THREE from "three";
import { CAMERA_BASE_POSITION, CAMERA_GRID_POSITION } from "@/constants/camera";

export const FloatingCamera = () => {
  const { camera } = useThree();
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const hasCompletedHistorySection = useArtworkStore(
    (state) => state.hasCompletedHistorySection
  );
  const isSphereTransitioning = useArtworkStore(
    (state) => state.isSphereTransitioning
  );

  useFrame((state) => {
    // Don't float during artwork zoom, sphere transition, or in grid view
    if (activeArtwork || isSphereTransitioning || hasCompletedHistorySection)
      return;

    // Only float in the initial view (before grid)
    const targetBasePosition = CAMERA_BASE_POSITION;

    const time = state.clock.elapsedTime;

    const floatX = Math.sin(time * 0.3) * 0.5;
    const floatY = Math.cos(time * 0.4) * 0.25;

    // Use lerp for smoother transitions instead of directly setting position
    const targetPosition = new THREE.Vector3(
      targetBasePosition[0] + floatX,
      targetBasePosition[1] + floatY,
      targetBasePosition[2]
    );

    camera.position.lerp(targetPosition, 0.1);
  });
  return null;
};
