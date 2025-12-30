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
  const setIsShowingCollection = useArtworkStore(
    (state) => state.setIsShowingCollection
  );

  const isShowingCollection = useArtworkStore(
    (state) => state.isShowingCollection
  );

  const handleClick = () => {
    if (isShowingCollection) {
      setIsShowingCollection(false);
    } else {
      setIsShowingCollection(true);
    }
  };

  return (
    <MotionButton
      onClick={handleClick}
      className={`${styles.button} ${cormorantGaramond.className}`}
    >
      Browse by Collection
    </MotionButton>
  );
};
