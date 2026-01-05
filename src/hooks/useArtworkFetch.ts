import { useEffect, useRef } from "react";
import { useArtworkStore } from "@/stores";
import type { ArchiveItem } from "@/types/data-types";

export const useArtworkFetch = () => {
  const isTimelineTransitioning = useArtworkStore(
    (state) => state.isTimelineTransitioning
  );
  const timelineYear = useArtworkStore((state) => state.timelineYear);
  const currentCollection = useArtworkStore((state) => state.currentCollection);
  const setArchiveData = useArtworkStore((state) => state.setArchiveData);

  // Ref to track if we've already fetched for the current transition
  const hasFetchedForTransition = useRef(false);
  const lastTimelineYear = useRef<number | null>(null);

  useEffect(() => {
    if (
      (isTimelineTransitioning &&
        timelineYear &&
        timelineYear !== lastTimelineYear.current &&
        !hasFetchedForTransition.current) ||
      currentCollection
    ) {
      hasFetchedForTransition.current = true;
      lastTimelineYear.current = timelineYear;

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

          console.log(data);
          console.log(currentCollection, timelineYear);

          const filteredData = data.filter((item: ArchiveItem) => {
            if (!item.asset || item.asset.length === 0) return false;
            if (!item.asset[0].thumb) return false;
            if (!item.asset[0].thumb.large) return false;
            return true;
          });

          // Replace artworks when fetched (update Zustand store)
          setTimeout(() => {
            setArchiveData(filteredData);
          }, 2000);
        } catch (error) {
          console.error("Error fetching artworks:", error);
        }
      };

      fetchArtworks();
    }

    // Reset fetch flag when transition ends
    if (!isTimelineTransitioning) {
      hasFetchedForTransition.current = false;
    }
  }, [
    isTimelineTransitioning,
    timelineYear,
    setArchiveData,
    currentCollection,
  ]);
};
