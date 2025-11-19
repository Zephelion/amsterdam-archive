import { MotionValue, useTransform } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { HistoryParagraph } from "@/constants/amsterdamHistoryContent";
import { Cormorant_Garamond } from "next/font/google";
import { MotionDiv, MotionSpan } from "../MotionElements";
import { useScrollDirection } from "@/hooks";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface YearDisplayProps {
  content: HistoryParagraph[];
  scrollYProgress: MotionValue<number>;
}

export const YearDisplay = ({ content, scrollYProgress }: YearDisplayProps) => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const scrollDirection = useScrollDirection(scrollYProgress);

  // Track the current year and scroll direction from scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const length = content.length;
      const index = Math.min(Math.floor(progress * length), length - 1);
      const year = content[index]?.year;
      if (year !== undefined && year !== currentYear) {
        setCurrentYear(year);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, content, currentYear]);

  // Calculate opacity based on scroll progress (fade in/out at edges)
  const opacity = useTransform(scrollYProgress, (progress) => {
    if (progress < 0.05) {
      return progress / 0.05;
    }
    if (progress > 0.95) {
      return (1 - progress) / 0.05;
    }
    return 1;
  });

  const getAnimationProps = () => {
    if (scrollDirection === "down") {
      // Scrolling down: new year comes from below, old year exits above
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };
    } else {
      // Scrolling up: new year comes from above, old year exits below
      return {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
      };
    }
  };

  return (
    <MotionDiv
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        fontSize: "5rem",
        fontWeight: 200,
        color: "black",
        fontFamily: cormorantGaramond.style.fontFamily,
        zIndex: 1000,
        opacity,
        pointerEvents: "none",
        overflow: "hidden",
        paddingBottom: "1rem",
      }}
    >
      <AnimatePresence mode="wait">
        {currentYear !== null && (
          <MotionSpan
            key={currentYear}
            {...getAnimationProps()}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            style={{ display: "inline-block" }}
          >
            {currentYear}
          </MotionSpan>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
};
