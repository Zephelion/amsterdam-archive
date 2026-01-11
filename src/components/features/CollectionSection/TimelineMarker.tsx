import { MotionValue, useTransform } from "framer-motion";
import styles from "./CollectionSection.module.css";
import { MotionDiv } from "../MotionElements";

interface TimelineMarkerProps {
  id: string;
  position: number;
  index: number;
  scrollYProgress: MotionValue<number>;
}

export const TimelineMarker = ({
  id,
  position,
  index,
  scrollYProgress,
}: TimelineMarkerProps) => {
  const markerOpacity = useTransform(
    scrollYProgress,
    [0.1 + index * 0.02, 0.15 + index * 0.02],
    [0, 1]
  );

  return (
    <MotionDiv
      key={id}
      className={styles.timelineMarker}
      style={{
        left: `${5 + position * 85}vw`,
        opacity: markerOpacity,
      }}
    />
  );
};
