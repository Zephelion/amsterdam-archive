import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useArtworkStore } from "@/stores";

export interface UseMouseHoverOptions {
  intensity?: number;
  lerpSpeed?: number;
  showPointer?: boolean;
}

export const useMouseHover = (
  meshRef: React.RefObject<THREE.Mesh>,
  basePosition: [number, number, number],
  options?: UseMouseHoverOptions
) => {
  const { mouse } = useThree();
  const { intensity = 1.5, lerpSpeed = 0.02 } = options || {};
  const setHoveredArtwork = useArtworkStore((state) => state.setHoveredArtwork);

  const handlePointerEnter = () => {
    document.body.style.cursor = "pointer";
    setHoveredArtwork(true);
  };

  const handlePointerLeave = () => {
    document.body.style.cursor = "default";
    setHoveredArtwork(false);
  };

  useFrame(() => {
    if (!meshRef.current) return;
    const targetX = basePosition[0] - mouse.x * intensity;
    const targetY = basePosition[1] - mouse.y * intensity;

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      lerpSpeed
    );

    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      lerpSpeed
    );
    return;
  });
  return {
    mesh: meshRef,
    handlePointerEnter,
    handlePointerLeave,
  };
};
