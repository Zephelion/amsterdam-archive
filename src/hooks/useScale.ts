import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface useScaleOptionsProps {
  lerpSpeed?: number;
  inactiveScale?: number;
  activeScale?: number;
}

export const useScale = (
  meshRef: React.RefObject<THREE.Mesh>,
  isActive: boolean,
  hasActiveItem: boolean,
  options?: useScaleOptionsProps
) => {
  const { lerpSpeed = 0.02, inactiveScale = 0 } = options || {};

  let targetScale = hasActiveItem && !isActive ? inactiveScale : 1.0;

  useFrame(() => {
    if (!meshRef.current) return;

    const currentScale = meshRef.current.scale;
    currentScale.x = THREE.MathUtils.lerp(
      currentScale.x,
      targetScale,
      lerpSpeed
    );
    currentScale.y = THREE.MathUtils.lerp(
      currentScale.y,
      targetScale,
      lerpSpeed
    );
    currentScale.z = THREE.MathUtils.lerp(
      currentScale.z,
      targetScale,
      lerpSpeed
    );
  });

  return meshRef.current?.scale;
};
