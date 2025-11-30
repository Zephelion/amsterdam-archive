import * as THREE from "three";

export const CAMERA_BASE_POSITION = [0, 0, 50] as const;
export const CAMERA_GRID_POSITION = [0, 0, 12.5] as const;
export const CAMERA_OPTIONS = {
  lerpSpeed: 0.02,
  zoomDistance: 3.5,
  offset: [0, 0, 0] as THREE.Vector3Tuple,
};
