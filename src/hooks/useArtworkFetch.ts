import { useEffect, useRef } from "react";
import { useArtworkStore } from "@/stores";
import type { ArchiveItem } from "@/types/data-types";

export const useArtworkFetch = () => {
  const isSphereTransitioning = useArtworkStore(
    (state) => state.isSphereTransitioning
  );
  const timelineYear = useArtworkStore((state) => state.timelineYear);
  const currentCollection = useArtworkStore((state) => state.currentCollection);
  const setArchiveData = useArtworkStore((state) => state.setArchiveData);
  const setTotalTexturesToLoad = useArtworkStore(
    (state) => state.setTotalTexturesToLoad
  );

  // Ref to track if we've already fetched for the current transition
  const hasFetchedForTransition = useRef(false);
  const lastTimelineYear = useRef<number | null>(null);
  const lastCollection = useRef<string | null>(null);

  useEffect(() => {
    if (
      (isSphereTransitioning &&
        timelineYear &&
        timelineYear !== lastTimelineYear.current &&
        !hasFetchedForTransition.current) ||
      (isSphereTransitioning &&
        currentCollection &&
        currentCollection !== lastCollection.current &&
        !hasFetchedForTransition.current)
    ) {
      hasFetchedForTransition.current = true;
      if (timelineYear) lastTimelineYear.current = timelineYear;
      if (currentCollection) lastCollection.current = currentCollection;

      // Fetch during transition to sphere
      const fetchArtworks = async () => {
        try {
          const response = await fetch("/api/fetch-artworks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              year: timelineYear,
              collection: currentCollection,
            }),
          });
          const data = await response.json();

          const filteredData = data.filter((item: ArchiveItem) => {
            if (!item.asset || item.asset.length === 0) return false;
            if (!item.asset[0].thumb) return false;
            if (!item.asset[0].thumb.large) return false;
            return true;
          });

          // Replace artworks when fetched (update Zustand store)
          setTimeout(() => {
            setArchiveData(filteredData);
            setTotalTexturesToLoad(filteredData.length);
          }, 2000);
        } catch (error) {
          console.error("Error fetching artworks:", error);
        }
      };

      fetchArtworks();
    }

    // Reset fetch flag when transition ends
    if (!isSphereTransitioning) {
      hasFetchedForTransition.current = false;
    }
  }, [
    isSphereTransitioning,
    timelineYear,
    setArchiveData,
    currentCollection,
    setTotalTexturesToLoad,
  ]);
};
