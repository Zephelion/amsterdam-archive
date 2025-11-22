import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface UsePositionTransitionOptions {
  targetPosition: [number, number, number];
  lerpSpeed?: number;
}

export const usePositionTransition = (
  initialPosition: [number, number, number],
  options: UsePositionTransitionOptions
) => {
  const { targetPosition, lerpSpeed = 0.05 } = options;
  const meshRef = useRef<THREE.Mesh>(null!);
  const currentPositionRef = useRef<THREE.Vector3>(
    new THREE.Vector3(...initialPosition)
  );

  useFrame(() => {
    if (!meshRef.current) return;

    const target = new THREE.Vector3(...targetPosition);

    // Lerp towards target position
    currentPositionRef.current.lerp(target, lerpSpeed);

    // Update mesh position
    meshRef.current.position.copy(currentPositionRef.current);
  });

  return meshRef;
};
