import { useFrame, useThree } from "@react-three/fiber";
import { useArtworkStore } from "@/stores";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { calculateOptimalColumns, SPACING } from "@/utils/getGridPosition";
import { CAMERA_GRID_POSITION } from "@/constants/camera";

const SCROLL_SPEED = 0.04; // Lenis-like scroll sensitivity (smoother)
const LERP_FACTOR = 0.08; // Slower camera movement for gradual effect
const BOUNDS_PADDING = 5; // Extra space beyond grid edges
const SPRING_STRENGTH = 0.15; // Stronger spring pull-back (more force)
const SPRING_DAMPING = 0.92; // High damping for minimal bounce (smooth like Lenis)
const OVERSCROLL_RESISTANCE = 0.5; // Moderate resistance at boundaries

export const useCanvasScroll = () => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector2(0, 0)); // Spring velocity

  const hasCompletedHistorySection = useArtworkStore(
    (state) => state.hasCompletedHistorySection
  );
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const isSphereTransitioning = useArtworkStore(
    (state) => state.isSphereTransitioning
  );
  const archiveData = useArtworkStore((state) => state.archiveData);

  // Initialize target position to current camera position
  useEffect(() => {
    if (
      hasCompletedHistorySection &&
      !activeArtwork &&
      !isSphereTransitioning
    ) {
      targetPosition.current.copy(camera.position);
    }
  }, [
    hasCompletedHistorySection,
    activeArtwork,
    isSphereTransitioning,
    camera,
  ]);

  useEffect(() => {
    // Only enable scroll when conditions are met
    if (!hasCompletedHistorySection || activeArtwork || isSphereTransitioning) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      // Calculate grid bounds
      const totalItems = archiveData.length;
      const columns = calculateOptimalColumns(totalItems);
      const rows = Math.ceil(totalItems / columns);

      // Calculate grid dimensions
      const gridWidth = (columns - 1) * SPACING;
      const gridHeight = (rows - 1) * SPACING;

      // Calculate bounds (centered around CAMERA_GRID_POSITION with padding)
      const minX = CAMERA_GRID_POSITION[0] - gridWidth / 2 - BOUNDS_PADDING;
      const maxX = CAMERA_GRID_POSITION[0] + gridWidth / 2 + BOUNDS_PADDING;
      const minY = CAMERA_GRID_POSITION[1] - gridHeight / 2 - BOUNDS_PADDING;
      const maxY = CAMERA_GRID_POSITION[1] + gridHeight / 2 + BOUNDS_PADDING;

      // Calculate scroll deltas
      let deltaX = event.deltaX * SCROLL_SPEED;
      let deltaY = event.deltaY * SCROLL_SPEED;

      // Apply resistance when beyond bounds (rubber band effect)
      const currentX = targetPosition.current.x;
      const currentY = targetPosition.current.y;

      // Check if we're beyond bounds and apply resistance
      if (currentX < minX && deltaX < 0) {
        // Beyond left edge, trying to go further left
        deltaX *= OVERSCROLL_RESISTANCE;
      } else if (currentX > maxX && deltaX > 0) {
        // Beyond right edge, trying to go further right
        deltaX *= OVERSCROLL_RESISTANCE;
      }

      if (currentY < minY && deltaY > 0) {
        // Beyond bottom edge, trying to go further down
        deltaY *= OVERSCROLL_RESISTANCE;
      } else if (currentY > maxY && deltaY < 0) {
        // Beyond top edge, trying to go further up
        deltaY *= OVERSCROLL_RESISTANCE;
      }

      // Vertical scrolling (deltaY)
      targetPosition.current.y -= deltaY;

      // Horizontal scrolling (deltaX) for trackpad users
      targetPosition.current.x += deltaX;
    };

    // Add wheel listener to the canvas element
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
      }
    };
  }, [hasCompletedHistorySection, activeArtwork, isSphereTransitioning]);

  useFrame(() => {
    if (activeArtwork || isSphereTransitioning || !hasCompletedHistorySection) {
      return;
    }

    // Calculate grid bounds for spring physics
    const totalItems = archiveData.length;
    const columns = calculateOptimalColumns(totalItems);
    const rows = Math.ceil(totalItems / columns);
    const gridWidth = (columns - 1) * SPACING;
    const gridHeight = (rows - 1) * SPACING;

    const minX = CAMERA_GRID_POSITION[0] - gridWidth / 2 - BOUNDS_PADDING;
    const maxX = CAMERA_GRID_POSITION[0] + gridWidth / 2 + BOUNDS_PADDING;
    const minY = CAMERA_GRID_POSITION[1] - gridHeight / 2 - BOUNDS_PADDING;
    const maxY = CAMERA_GRID_POSITION[1] + gridHeight / 2 + BOUNDS_PADDING;

    // Apply spring force when beyond bounds
    let springForceX = 0;
    let springForceY = 0;

    if (targetPosition.current.x < minX) {
      springForceX = (minX - targetPosition.current.x) * SPRING_STRENGTH;
    } else if (targetPosition.current.x > maxX) {
      springForceX = (maxX - targetPosition.current.x) * SPRING_STRENGTH;
    }

    if (targetPosition.current.y < minY) {
      springForceY = (minY - targetPosition.current.y) * SPRING_STRENGTH;
    } else if (targetPosition.current.y > maxY) {
      springForceY = (maxY - targetPosition.current.y) * SPRING_STRENGTH;
    }

    // Apply spring force to velocity
    velocity.current.x += springForceX;
    velocity.current.y += springForceY;

    // Apply damping to velocity
    velocity.current.x *= SPRING_DAMPING;
    velocity.current.y *= SPRING_DAMPING;

    // Apply velocity to target position
    targetPosition.current.x += velocity.current.x;
    targetPosition.current.y += velocity.current.y;

    // Smoothly lerp camera to target position
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetPosition.current.x,
      LERP_FACTOR
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetPosition.current.y,
      LERP_FACTOR
    );

    // Lock rotation
    camera.rotation.set(0, 0, 0);
  });
};
