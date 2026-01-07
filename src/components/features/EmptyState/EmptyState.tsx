import { Cormorant_Garamond } from "next/font/google";
import { useArtworkStore } from "@/stores";
import { MotionDiv } from "../MotionElements";
import { AnimatePresence } from "framer-motion";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const EmptyState = () => {
  const archiveData = useArtworkStore((state) => state.archiveData);
  const hasCompletedHistorySection = useArtworkStore(
    (state) => state.hasCompletedHistorySection
  );
  const isSphereTransitioning = useArtworkStore(
    (state) => state.isSphereTransitioning
  );
  const currentCollection = useArtworkStore((state) => state.currentCollection);
  const timelineYear = useArtworkStore((state) => state.timelineYear);

  const shouldShow =
    hasCompletedHistorySection &&
    !isSphereTransitioning &&
    archiveData.length === 0 &&
    (currentCollection || timelineYear);

  if (!shouldShow) {
    return null;
  }

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: cormorantGaramond.style.fontFamily,
            fontSize: "2rem",
            fontWeight: "600",
            color: "black",
            textAlign: "center",
          }}
        >
          No artworks found
        </div>
        <div
          style={{
            fontFamily: cormorantGaramond.style.fontFamily,
            fontSize: "1.2rem",
            color: "black",
            opacity: 0.7,
            textAlign: "center",
          }}
        >
          {currentCollection
            ? "Try selecting a different collection"
            : timelineYear
            ? `No artworks from ${timelineYear}`
            : "Try a different filter"}
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};
