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
  const setSphereTransitioning = useArtworkStore(
    (state) => state.setSphereTransitioning
  );
  const setCurrentCollection = useArtworkStore(
    (state) => state.setCurrentCollection
  );
  const setPendingCollectionForSphereTransition = useArtworkStore(
    (state) => state.setPendingCollectionForSphereTransition
  );

  useFrame((_, delta) => {
    // Read latest values from the store each frame to avoid stale closure values.
    const {
      isLayoutTransitioning,
      layoutTransitionProgress,
      layoutId,
      pendingCollectionForSphereTransition,
    } = useArtworkStore.getState();

    if (!isLayoutTransitioning) {
      // Check if we just finished transitioning to grid-10 and have a pending collection
      if (
        layoutId === "grid-10" &&
        pendingCollectionForSphereTransition !== null
      ) {
        // Set the collection and trigger sphere transition
        setCurrentCollection(pendingCollectionForSphereTransition);
        setPendingCollectionForSphereTransition(null);
        setSphereTransitioning(true);
      }
      return;
    }

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
