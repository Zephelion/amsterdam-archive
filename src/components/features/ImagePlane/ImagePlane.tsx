import { useTexture } from "@react-three/drei";
import { useArtworkInteractions, useScale, useMouseHover } from "@/hooks";
import { ArchiveItem } from "@/types/data-types";
import { useArtworkStore } from "@/stores";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { normalizeImageDimensions } from "@/utils/normalizeImageDimonsions";
import { useFrame } from "@react-three/fiber";

interface ImagePlaneProps {
  title: string;
  textureUrl?: string;
  position: [number, number, number];
  width: number;
  height: number;
  artwork: ArchiveItem;
}

export const ImagePlane = ({
  title,
  textureUrl,
  position,
  width,
  height,
  artwork,
}: ImagePlaneProps) => {
  const HOVER_OPTIONS = {
    intensity: 1.5,
    lerpSpeed: 0.02,
  };

  const SCALE_OPTIONS = {
    lerpSpeed: 0.045,
    inactiveScale: 0,
    activeScale: 1.5,
  };

  const texture = useTexture(textureUrl || "");
  const meshRef = useRef<THREE.Mesh>(null!);

  const { width: normalizedWidth, height: normalizedHeight } =
    normalizeImageDimensions(width, height);

  const { handlePointerEnter, handlePointerLeave } = useMouseHover(
    meshRef,
    position,
    HOVER_OPTIONS
  );

  const { handleClick } = useArtworkInteractions(artwork, position);

  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const isActive = activeArtwork?.id === artwork.id;
  const hasActiveArtwork = activeArtwork !== null;

  // Calculate depth-based opacity and scale multiplier
  // Z ranges from -20 to +20 in sphere mode, 0 in grid mode
  const depthFactor = useMemo(() => {
    const z = position[2];
    // In grid mode (z = 0), all items should be fully visible
    // In sphere mode, normalize Z from [-20, 20] to [0, 1]
    if (z === 0) {
      return 1; // Grid mode - fully visible
    }
    // Sphere mode: normalize Z from [-20, 20] to [0, 1]
    // Items with higher Z (closer to camera) get higher values
    const normalized = Math.max(0, Math.min(1, (z + 20) / 40));
    return normalized;
  }, [position]);

  const depthOpacity = useMemo(() => {
    // Map depth factor to opacity: 0.1 (far) to 1.0 (close)
    return THREE.MathUtils.lerp(0.1, 1.0, depthFactor);
  }, [depthFactor]);

  const depthScale = useMemo(() => {
    // Map depth factor to scale: 0.25 (far) to 1.0 (close)
    return THREE.MathUtils.lerp(0.25, 1.0, depthFactor);
  }, [depthFactor]);

  useScale(meshRef, isActive, hasActiveArtwork, SCALE_OPTIONS);

  const sphereTransitionProgress = useArtworkStore(
    (state) => state.sphereTransitionProgress
  );

  const isSphereTransitioning = useArtworkStore(
    (state) => state.isSphereTransitioning
  );

  // Calculate transition-based opacity
  const transitionOpacity = useMemo(() => {
    if (!isSphereTransitioning) {
      return 1; // Fully visible when not transitioning
    }

    // During transition:
    // - Fade out as we go to sphere (1 → 0): opacity goes 1 → 0
    // - Stay invisible during waiting (at 0)
    // - Fade in as we go back to grid (0 → 1): opacity goes 0 → 1
    // Use progress directly: 0 = invisible, 1 = visible
    return sphereTransitionProgress;
  }, [isSphereTransitioning, sphereTransitionProgress]);

  // Combine depth opacity with transition opacity
  const finalOpacity = useMemo(() => {
    return depthOpacity * transitionOpacity;
  }, [depthOpacity, transitionOpacity]);

  // Apply depth-based opacity and scale
  useFrame(() => {
    if (!meshRef.current || hasActiveArtwork) return;

    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    if (material) {
      // Use transition opacity combined with depth opacity
      const targetOpacity = finalOpacity;
      if (Math.abs(material.opacity - targetOpacity) > 0.01) {
        material.opacity = THREE.MathUtils.lerp(
          material.opacity,
          targetOpacity,
          0.1 // Faster lerp speed to reach target quicker
        );
      } else {
        // Once close enough, set directly to avoid never reaching 1.0
        material.opacity = targetOpacity;
      }
    }

    // Apply depth scale as multiplier to existing scale
    const currentScale = meshRef.current.scale.x;
    const baseScale = currentScale / (depthScale || 1);
    meshRef.current.scale.setScalar(baseScale * depthScale);
  });

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[normalizedWidth, normalizedHeight]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        opacity={finalOpacity}
        transparent={true}
      />
    </mesh>
  );
};
