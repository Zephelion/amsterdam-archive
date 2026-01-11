import { MotionValue, useTransform } from "framer-motion";
import { ArchiveItem } from "@/types/data-types";
import styles from "./CollectionSection.module.css";
import { MotionDiv } from "../MotionElements";

interface ArtworkCardProps {
  artwork: ArchiveItem;
  index: number;
  scrollYProgress: MotionValue<number>;
}

export const ArtworkCard = ({
  artwork,
  index,
  scrollYProgress,
}: ArtworkCardProps) => {
  // Calculate transform ranges for this card
  const startProgress = 0.1 + index * 0.02;
  const endProgress = 0.15 + index * 0.02;

  const cardY = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [100, 0]
  );
  const cardOpacity = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [0, 1]
  );
  const cardRotate = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [5, 0]
  );

  return (
    <MotionDiv
      className={styles.artworkCard}
      style={{
        y: cardY,
        opacity: cardOpacity,
        rotateZ: cardRotate,
      }}
    >
      <img
        src={artwork.asset[0].thumb.large}
        alt={artwork.title}
        className={styles.artworkImage}
      />
      <div className={styles.artworkInfo}>
        <h3 className={styles.artworkTitle}>{artwork.title}</h3>
        <p className={styles.artworkYear}>{artwork.year}</p>
      </div>
    </MotionDiv>
  );
};
