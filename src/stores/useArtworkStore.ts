import { create } from "zustand";
import type { ArchiveItem } from "@/types/data-types";
import type * as THREE from "three";
import type { LayoutId } from "@/utils/layouts";

interface ArtworkState {
  isHovered: boolean;
  activeArtwork: ArchiveItem | null;
  activeArtworkPosition: THREE.Vector3Tuple | null;
  isAnimating: boolean;
  hasCompletedCameraTransitionToArtwork: boolean;
  generatedStory: string | null;
  hasStarted: boolean;
  hasCompletedHistorySection: boolean;
  // Sphere transition state (used for both timeline and collection)
  isSphereTransitioning: boolean;
  sphereTransitionProgress: number; // 0 = sphere, 1 = grid
  timelineYear: number | null;
  // Archive data
  archiveData: ArchiveItem[];
  // Layout system (future-proof: grid-10, grid-6, sphere, etc.)
  layoutId: LayoutId;
  layoutTargetId: LayoutId | null;
  isLayoutTransitioning: boolean;
  layoutTransitionProgress: number; // 0 -> 1
  // State to keep track of the current collection
  currentCollection: string | null;
  setCurrentCollection: (collection: string | null) => void;
  clearCurrentCollection: () => void;

  startLayoutTransition: (target: LayoutId) => void;
  setLayoutTransitionProgress: (progress: number) => void;
  finishLayoutTransition: () => void;
  setSphereTransitioning: (isTransitioning: boolean) => void;
  setSphereTransitionProgress: (progress: number) => void;
  setTimelineYear: (year: number | null) => void;
  setArchiveData: (data: ArchiveItem[]) => void;
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
  isSphereTransitioning: false,
  sphereTransitionProgress: 1, // Start at grid (1)
  timelineYear: null,
  archiveData: [],
  currentCollection: null,
  setCurrentCollection: (collection) => set({ currentCollection: collection }),
  clearCurrentCollection: () => set({ currentCollection: null }),
  layoutId: "grid-10",
  layoutTargetId: null,
  isLayoutTransitioning: false,
  layoutTransitionProgress: 0,
  startLayoutTransition: (target) =>
    set((state) => {
      if (state.layoutId === target) return state;
      return {
        layoutTargetId: target,
        isLayoutTransitioning: true,
        layoutTransitionProgress: 0,
      };
    }),
  setLayoutTransitionProgress: (progress) =>
    set({ layoutTransitionProgress: progress }),
  finishLayoutTransition: () =>
    set((state) => {
      if (!state.layoutTargetId) return state;
      return {
        layoutId: state.layoutTargetId,
        layoutTargetId: null,
        isLayoutTransitioning: false,
        layoutTransitionProgress: 0,
      };
    }),
  setSphereTransitioning: (isTransitioning) =>
    set({ isSphereTransitioning: isTransitioning }),
  setSphereTransitionProgress: (progress) =>
    set({ sphereTransitionProgress: progress }),
  setTimelineYear: (year) => set({ timelineYear: year }),
  setArchiveData: (data) => set({ archiveData: data }),
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
