import { MotionButton } from "../MotionElements";
import { Cormorant_Garamond } from "next/font/google";
import styles from "./BrowseByCollectionButton.module.css";
import { useArtworkStore } from "@/stores";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});

export const BrowseByCollectionButton = () => {
  const layoutId = useArtworkStore((state) => state.layoutId);
  const layoutTargetId = useArtworkStore((state) => state.layoutTargetId);
  const isLayoutTransitioning = useArtworkStore(
    (state) => state.isLayoutTransitioning
  );
  const startLayoutTransition = useArtworkStore(
    (state) => state.startLayoutTransition
  );

  const handleClick = () => {
    // Always go to the 6-column grid layout
    const effectiveLayout = layoutTargetId ?? layoutId;
    if (effectiveLayout === "grid-6" || isLayoutTransitioning) return;
    startLayoutTransition("grid-6");
  };

  return (
    <MotionButton
      onClick={handleClick}
      className={`${styles.button} ${cormorantGaramond.className}`}
    >
      {isLayoutTransitioning ? "Switching…" : "Browse by Collection"}
    </MotionButton>
  );
};
