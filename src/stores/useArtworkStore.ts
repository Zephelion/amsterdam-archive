import { create } from "zustand";
import type { ArchiveItem } from "@/types/data-types";
import type * as THREE from "three";

interface ArtworkState {
  isHovered: boolean;
  activeArtwork: ArchiveItem | null;
  activeArtworkPosition: THREE.Vector3Tuple | null;
  isAnimating: boolean;
  hasCompletedCameraTransitionToArtwork: boolean;
  generatedStory: string | null;
  hasStarted: boolean;
  hasCompletedHistorySection: boolean;
  setCameraTransitioning: (
    hasCompletedCameraTransitionToArtwork: boolean
  ) => void;
  setHoveredArtwork: (isHovered: boolean) => void;
  setActiveArtwork: (
    artwork: ArchiveItem | null,
    position?: THREE.Vector3Tuple
  ) => void;
  clearActiveArtwork: () => void;
  setIsAnimating: (isAnimating: boolean) => void;
  setGeneratedStory: (story: string | null) => void;
  setHasStarted: (hasStarted: boolean) => void;
  setHasCompletedHistorySection: (hasCompletedHistorySection: boolean) => void;
}

export const useArtworkStore = create<ArtworkState>((set) => ({
  isHovered: false,
  activeArtwork: null,
  activeArtworkPosition: null,
  isAnimating: false,
  hasCompletedCameraTransitionToArtwork: false,
  generatedStory: null,
  hasStarted: false,
  hasCompletedHistorySection: false,
  setCameraTransitioning: (hasCompletedCameraTransitionToArtwork) =>
    set({
      hasCompletedCameraTransitionToArtwork:
        hasCompletedCameraTransitionToArtwork,
    }),
  setHoveredArtwork: (isHovered) => set({ isHovered }),
  setActiveArtwork: (artwork, position) =>
    set({
      activeArtwork: artwork,
      activeArtworkPosition: position || null,
      isAnimating: true,
    }),
  clearActiveArtwork: () =>
    set({
      activeArtwork: null,
      activeArtworkPosition: null,
      isAnimating: false,
      hasCompletedCameraTransitionToArtwork: false,
      generatedStory: null,
    }),
  setIsAnimating: (isAnimating) => set({ isAnimating }),
  setGeneratedStory: (story) => set({ generatedStory: story }),
  setHasStarted: (hasStarted) => set({ hasStarted }),
  setHasCompletedHistorySection: (completed) =>
    set({ hasCompletedHistorySection: completed }),
}));

export const useShouldShowUI = () => {
  return useArtworkStore(
    (state) =>
      state.activeArtwork !== null &&
      state.hasCompletedCameraTransitionToArtwork
  );
};
