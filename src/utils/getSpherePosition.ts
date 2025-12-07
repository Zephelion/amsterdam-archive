import type * as THREE from "three";

export const SPHERE_RADIUS = 20;

// Calculate sphere position for each item
export const getSpherePosition = (
  index: number,
  total: number
): THREE.Vector3Tuple => {
  // Use Fibonacci sphere distribution for even spacing
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians
  const y = 1 - (index / (total - 1)) * 2; // y goes from 1 to -1
  const radius = Math.sqrt(1 - y * y); // Radius at y
  const theta = goldenAngle * index; // Angle around the y-axis

  const x = Math.cos(theta) * radius;
  const z = Math.sin(theta) * radius;

  return [x * SPHERE_RADIUS, y * SPHERE_RADIUS, z * SPHERE_RADIUS];
};
