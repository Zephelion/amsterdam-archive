import { useEffect, useState, useRef } from "react";
import { Cormorant_Garamond } from "next/font/google";
import styles from "./YearCounter.module.css";
import { useArtworkStore } from "@/stores";
import { MotionDiv } from "../MotionElements";
import { AnimatePresence } from "framer-motion";
import { getCurrentYear } from "@/utils/getCurrentYear";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ANIMATION_DURATION = 8000; // 8 seconds for counting animation

export const YearCounter = () => {
  const timelineYear = useArtworkStore((state) => state.timelineYear);
  const currentYear = getCurrentYear();
  const [displayYear, setDisplayYear] = useState<number>(currentYear);
  const [hasFinishedCounting, setHasFinishedCounting] = useState(false);
  const previousYearRef = useRef<number>(currentYear); // Track the previous selected year

  useEffect(() => {
    if (timelineYear === null) {
      // Reset when timeline year is cleared
      setDisplayYear(currentYear);
      setHasFinishedCounting(false);
      previousYearRef.current = currentYear;
      return;
    }

    // Start counting animation
    setHasFinishedCounting(false);

    const startYear = previousYearRef.current; // Use the previous year as start
    const targetYear = timelineYear;
    const yearDifference = targetYear - startYear; // Can be positive or negative

    // Use easing function for smooth deceleration
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const startTime = Date.now();

    const animateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easedProgress = easeOutQuart(progress);

      // Calculate current year - works for both counting up and down
      const animatedYear = Math.round(
        startYear + yearDifference * easedProgress
      );
      setDisplayYear(animatedYear);

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        // Animation complete
        setDisplayYear(targetYear);
        setHasFinishedCounting(true);
        previousYearRef.current = targetYear; // Store the target year for next animation
      }
    };

    requestAnimationFrame(animateCounter);
  }, [timelineYear, currentYear]);

  if (timelineYear === null) {
    return null;
  }

  return (
    <AnimatePresence>
      <MotionDiv
        className={`${styles.yearCounter} ${cormorantGaramond.className} ${
          hasFinishedCounting ? styles.positioned : ""
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: hasFinishedCounting ? 0 : 0,
          y: hasFinishedCounting ? 0 : 0,
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          duration: hasFinishedCounting ? 0.6 : 0.3,
          ease: "easeInOut",
        }}
      >
        {displayYear}
      </MotionDiv>
    </AnimatePresence>
  );
};
