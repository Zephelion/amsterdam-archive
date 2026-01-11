import { MotionValue, useTransform } from "framer-motion";
import { MotionDiv } from "../MotionElements";
import styles from "./CollectionSection.module.css";

interface YearLabelProps {
  id: string;
  year: string | number;
  position: number;
  index: number;
  scrollYProgress: MotionValue<number>;
}

export const YearLabel = ({
  id,
  year,
  position,
  index,
  scrollYProgress,
}: YearLabelProps) => {
  const labelOpacity = useTransform(
    scrollYProgress,
    [0.1 + index * 0.02, 0.15 + index * 0.02],
    [0, 1]
  );

  return (
    <MotionDiv
      key={`year-${id}`}
      className={styles.yearLabel}
      style={{
        left: `${5 + position * 85}vw`,
        opacity: labelOpacity,
      }}
    >
      {year}
    </MotionDiv>
  );
};
