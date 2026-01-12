import { Cormorant_Garamond } from "next/font/google";
import styles from "./CurrentCollectionDisplay.module.css";
import { useArtworkStore } from "@/stores";
import { MotionDiv } from "../MotionElements";
import { AnimatePresence } from "framer-motion";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const CurrentCollectionDisplay = () => {
  const currentCollection = useArtworkStore((state) => state.currentCollection);

  if (!currentCollection) {
    return null;
  }

  // Extract just the collection name without the count
  const collectionName = currentCollection.split("(")[0].trim();

  return (
    <AnimatePresence>
      <MotionDiv
        className={`${styles.collectionDisplay} ${cormorantGaramond.className}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span>{collectionName}</span>
      </MotionDiv>
    </AnimatePresence>
  );
};
