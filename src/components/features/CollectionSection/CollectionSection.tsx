import { useArtworkStore } from "@/stores";
import { useRelatedArtworks } from "@/hooks/useRelatedArtworks";
import { useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";
import { Cormorant_Garamond } from "next/font/google";
import styles from "./CollectionSection.module.css";
import { ArtworkCard } from "./ArtworkCard";
import { TimelineMarker } from "./TimelineMarker";
import { YearLabel } from "./YearLabel";
import { MotionDiv } from "../MotionElements";
import { CollectionSectionTitle } from "../CollectionSectionTitle";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const CollectionSection = () => {
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  if (!activeArtwork) return null;

  // Extract collection from metadata
  const collectionValue = activeArtwork.metadata.find(
    (meta) => meta.field === "dc_provenance"
  )?.value;

  const collectionTitle =
    typeof collectionValue === "string"
      ? collectionValue
      : "Amsterdam Archive Collection";

  const { relatedArtworks } = useRelatedArtworks(collectionTitle);

  // Split title at colon for display
  const titleParts = collectionTitle.split(":");
  const mainTitle = titleParts[0].trim();
  const subtitle = titleParts.length > 1 ? titleParts[1].trim() : null;

  // Calculate scroll-based transformations
  // Background transition: white to cream
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["#ffffff", "#f8f6f1"]
  );

  // Hero section: fade out from 0-0.15
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  // Horizontal scroll: map vertical scroll to horizontal translate
  // Start moving after hero fades (0.1), continue until near end (0.9)
  const totalWidth = relatedArtworks.length * 600; // approximate card width + gap
  const horizontalX = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    [0, -totalWidth]
  );

  // Calculate timeline positions
  const timelineData = useMemo(() => {
    if (relatedArtworks.length === 0) return [];

    const years = relatedArtworks.map((art) =>
      parseInt(art.year?.toString() || "0")
    );
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    return relatedArtworks.map((art, index) => {
      const year = parseInt(art.year?.toString() || "0");
      const normalizedPosition = (year - minYear) / (maxYear - minYear || 1);
      return {
        ...art,
        position: normalizedPosition,
        index,
      };
    });
  }, [relatedArtworks]);

  // Calculate section height based on content
  const sectionHeight = `${400 + relatedArtworks.length * 50}vh`;

  return (
    <MotionDiv
      ref={sectionRef}
      className={`${styles.container} ${cormorantGaramond.className}`}
      style={{
        height: sectionHeight,
        backgroundColor: backgroundColor,
      }}
    >
      {/* Sticky container for parallax effects */}
      <div className={styles.stickyContainer}>
        {/* Hero section - fades out */}
        <MotionDiv
          className={styles.heroSection}
          style={{
            opacity: heroOpacity,
            scale: heroScale,
          }}
        >
          <CollectionSectionTitle title={mainTitle} />
          {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
          <p className={styles.heroSubtitle}>
            {relatedArtworks.length} items in collection
          </p>
        </MotionDiv>

        {/* Horizontal scrolling gallery */}
        {relatedArtworks.length > 0 && (
          <>
            <MotionDiv
              className={styles.horizontalScroll}
              style={{
                x: horizontalX,
              }}
            >
              {relatedArtworks.map((artwork, index) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  index={index}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </MotionDiv>

            {/* Timeline visualization */}
            <div className={styles.timelineLine} />
            {timelineData.map((item) => (
              <TimelineMarker
                key={item.id}
                id={item.id}
                position={item.position}
                index={item.index}
                scrollYProgress={scrollYProgress}
              />
            ))}

            {/* Year labels */}
            {timelineData
              .filter((_, i) => i % Math.ceil(timelineData.length / 8) === 0)
              .map((item) => (
                <YearLabel
                  key={`year-${item.id}`}
                  id={item.id}
                  year={item.year || ""}
                  position={item.position}
                  index={item.index}
                  scrollYProgress={scrollYProgress}
                />
              ))}
          </>
        )}
      </div>
    </MotionDiv>
  );
};
