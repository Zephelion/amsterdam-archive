import type { ArchiveItem } from "@/types/data-types";
import { useArtworkStore } from "@/stores";
import type * as THREE from "three";

export const useArtworkInteractions = (
  artwork: ArchiveItem,
  position: THREE.Vector3Tuple
) => {
  const setActiveArtwork = useArtworkStore((state) => state.setActiveArtwork);

  const handleClick = () => setActiveArtwork(artwork, position);
  const clearActiveArtwork = () => {
    setActiveArtwork(null);
  };

  return {
    handleClick,
    clearActiveArtwork,
  };
};
