import { useFrame, useThree } from "@react-three/fiber";
import { useArtworkStore } from "@/stores";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const SCROLL_SPEED = 0.05; // Adjust this to control scroll sensitivity
const LERP_FACTOR = 0.1; // Smooth camera movement

export const useCanvasScroll = () => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());

  const hasCompletedHistorySection = useArtworkStore(
    (state) => state.hasCompletedHistorySection
  );
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const isSphereTransitioning = useArtworkStore(
    (state) => state.isSphereTransitioning
  );

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

      // Vertical scrolling (deltaY)
      // Positive deltaY = scroll down = camera moves down (negative Y)
      // Negative deltaY = scroll up = camera moves up (positive Y)
      targetPosition.current.y -= event.deltaY * SCROLL_SPEED;

      // Horizontal scrolling (deltaX) for trackpad users
      // Positive deltaX = scroll right = camera moves left (negative X)
      // Negative deltaX = scroll left = camera moves right (positive X)
      targetPosition.current.x += event.deltaX * SCROLL_SPEED;
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
