import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useArtworkStore } from "@/stores";

interface ArtworkScaleProps {
  scaleSpeed?: number;
  targetScale?: number;
  centerPosition?: [number, number, number];
  fadeDelay?: number;
}

export const useArtworkScale = (
  isActive: boolean,
  basePosition: [number, number, number],
  options?: ArtworkScaleProps
) => {
  const {
    scaleSpeed = 0.1,
    targetScale = 1.5,
    centerPosition = [0, 0, 0],
    fadeDelay = 0,
  } = options || {};
  const meshRef = useRef<THREE.Mesh>(null!);
  const { isAnimating, setIsAnimating } = useArtworkStore();

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, fadeDelay);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, fadeDelay, setIsAnimating]);

  useFrame(() => {
    if (!meshRef.current) return;

    //fade is done now scale and center

    if (isActive && !isAnimating) {
      const currentScale = meshRef.current.scale.x;
      const desiredScale = THREE.MathUtils.lerp(
        currentScale,
        targetScale,
        scaleSpeed
      );
      meshRef.current.scale.setScalar(desiredScale);

      // Move towards center position
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        centerPosition[0],
        scaleSpeed
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        centerPosition[1],
        scaleSpeed
      );
    } else {
      // Return to base scale and position
      const newScale = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        1,
        scaleSpeed
      );
      meshRef.current.scale.setScalar(newScale);

      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        basePosition[0],
        scaleSpeed
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        basePosition[1],
        scaleSpeed
      );
    }
  });

  return meshRef;
};
