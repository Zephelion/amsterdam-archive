import { useTexture } from "@react-three/drei";
import { useArtworkInteractions, useScale, useMouseHover } from "@/hooks";
import { ArchiveItem } from "@/types/data-types";
import { useArtworkStore } from "@/stores";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { normalizeImageDimensions } from "@/utils/normalizeImageDimonsions";

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
  const targetPositionRef = useRef<THREE.Vector3>(
    new THREE.Vector3(...position)
  );

  // Smoothly animate to new position when it changes
  useFrame(() => {
    if (!meshRef.current) return;

    const target = new THREE.Vector3(...position);
    targetPositionRef.current.lerp(target, 0.05);
    meshRef.current.position.copy(targetPositionRef.current);
  });

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

  useScale(meshRef, isActive, hasActiveArtwork, SCALE_OPTIONS);

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
        opacity={1}
        transparent={true}
      />
    </mesh>
  );
};
