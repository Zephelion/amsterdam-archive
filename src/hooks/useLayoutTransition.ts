import { useFrame } from "@react-three/fiber";
import { useArtworkStore } from "@/stores";

const LAYOUT_TRANSITION_DURATION = 1.0; // seconds

export const useLayoutTransition = () => {
  const setLayoutTransitionProgress = useArtworkStore(
    (state) => state.setLayoutTransitionProgress
  );
  const finishLayoutTransition = useArtworkStore(
    (state) => state.finishLayoutTransition
  );

  useFrame((_, delta) => {
    // Read latest values from the store each frame to avoid stale closure values.
    const { isLayoutTransitioning, layoutTransitionProgress } =
      useArtworkStore.getState();
    if (!isLayoutTransitioning) return;

    const next = Math.min(
      1,
      layoutTransitionProgress + delta / LAYOUT_TRANSITION_DURATION
    );
    setLayoutTransitionProgress(next);

    if (next >= 1) {
      finishLayoutTransition();
    }
  });
};
