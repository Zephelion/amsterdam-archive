import { useTexture } from "@react-three/drei";
import { useArtworkInteractions, useScale, useMouseHover } from "@/hooks";
import { ArchiveItem } from "@/types/data-types";
import { useArtworkStore } from "@/stores";
import { useRef } from "react";
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
  // Settings for interactions

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

  //use mouse hover if there is no active artwork
  const { handlePointerEnter, handlePointerLeave } = useMouseHover(
    meshRef,
    position,
    HOVER_OPTIONS
  );

  // use artwork interactions (use base position, not the hover-modified position)
  const { handleClick } = useArtworkInteractions(artwork, position);

  // Get the active artwork from the store
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);

  // Determine if this artwork is the active one
  const isActive = activeArtwork?.id === artwork.id;
  const hasActiveArtwork = activeArtwork !== null;

  //when clicked on a item set it to active and scale the other items down
  useScale(meshRef, isActive, hasActiveArtwork, SCALE_OPTIONS);

  return (
    <mesh
      ref={meshRef}
      position={position}
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
