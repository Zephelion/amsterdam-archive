import { useFrame, useThree } from "@react-three/fiber";
import { useArtworkStore } from "@/stores";
import * as THREE from "three";
import { CAMERA_BASE_POSITION } from "@/constants/camera";

export const FloatingCamera = () => {
  const { camera } = useThree();
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const basePosition = CAMERA_BASE_POSITION;

  useFrame((state) => {
    if (activeArtwork) return;

    const time = state.clock.elapsedTime;

    const floatX = Math.sin(time * 0.3) * 0.5;
    const floatY = Math.cos(time * 0.4) * 0.25;

    // Use lerp for smoother transitions instead of directly setting position
    const targetPosition = new THREE.Vector3(
      basePosition[0] + floatX,
      basePosition[1] + floatY,
      basePosition[2]
    );

    camera.position.lerp(targetPosition, 0.1);
  });
  return null;
};
