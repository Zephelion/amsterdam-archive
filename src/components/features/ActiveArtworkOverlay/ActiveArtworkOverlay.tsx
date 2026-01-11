import { useArtworkStore, useShouldShowUI } from "@/stores";
import { Cormorant_Garamond } from "next/font/google";
import styles from "./ActiveArtworkOverlay.module.css";
import { useSpring } from "framer-motion";
import { useEffect } from "react";
import { MotionDiv } from "../MotionElements";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const ActiveArtworkOverlay = () => {
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const clearActiveArtwork = useArtworkStore(
    (state) => state.clearActiveArtwork
  );
  const shouldShowUI = useShouldShowUI();

  const opacity = useSpring(0, { stiffness: 50, damping: 25 });

  useEffect(() => {
    opacity.set(shouldShowUI ? 1 : 0);
  }, [shouldShowUI, opacity]);

  if (!shouldShowUI || !activeArtwork) return null;

  // Extract metadata
  const creator =
    activeArtwork.metadata.find((meta) => meta.field === "dc_creator")?.value ||
    "Unknown";
  const year =
    activeArtwork.metadata.find((meta) => meta.field === "dc_date")?.value ||
    activeArtwork.year ||
    "N/A";
  const dimensions =
    activeArtwork.metadata.find((meta) => meta.field === "dc_format")?.value ||
    `${activeArtwork.asset[0]?.width} × ${activeArtwork.asset[0]?.height}px`;
  const collection =
    activeArtwork.metadata.find((meta) => meta.field === "dc_provenance")
      ?.value || "Amsterdam Archive";

  // Format article number
  const articleNumber = activeArtwork.id.slice(0, 6).toUpperCase();

  return (
    <MotionDiv
      className={`${styles.container} ${cormorantGaramond.className}`}
      style={{ fontFamily: cormorantGaramond.style.fontFamily, opacity }}
    >
      {/* Back Button */}
      <button className={styles.backButton} onClick={clearActiveArtwork}>
        <span>←</span>
        <span>BACK</span>
      </button>

      {/* Title Section */}
      <div className={styles.titleSection}>
        <h3 className={styles.title}>{activeArtwork.title}</h3>
      </div>

      {/* Description Section */}
      <div className={styles.descriptionSection}>
        <div className={styles.articleNumber}>
          <span>Article:</span>
          <strong>{articleNumber}</strong>
        </div>
      </div>

      {/* Metadata Section */}
      <div className={styles.metadataSection}>
        <div className={styles.metadataItem}>
          <p className={styles.metadataLabel}>CREATOR</p>
          <p className={styles.metadataValue}>
            {typeof creator === "string" ? creator : "Unknown"}
          </p>
        </div>

        <div className={styles.metadataItem}>
          <p className={styles.metadataLabel}>YEAR</p>
          <p className={styles.metadataValue}>
            {typeof year === "string" ? year : String(year)}
          </p>
        </div>

        <div className={styles.metadataItem}>
          <p className={styles.metadataLabel}>DIMENSIONS</p>
          <p className={styles.metadataValue}>
            {typeof dimensions === "string" ? dimensions : "N/A"}
          </p>
        </div>

        <div className={styles.metadataItem}>
          <p className={styles.metadataLabel}>COLLECTION</p>
          <p className={styles.metadataValue}>
            {typeof collection === "string" ? collection : "N/A"}
          </p>
        </div>
      </div>

      {/* Price Section (Using year as artistic display) */}
      <div className={styles.priceSection}>
        <p className={styles.price}>
          {typeof year === "string" ? year : String(year)}
        </p>
      </div>
    </MotionDiv>
  );
};
