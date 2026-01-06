import { useArtworkStore } from "@/stores";
import { Cormorant_Garamond } from "next/font/google";
import { MotionButton } from "../MotionElements";
import { useState } from "react";
import { useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});

interface SkipHistoryButtonProps {
  historySectionRef: React.RefObject<HTMLDivElement | null>;
}

export const SkipHistoryButton = ({
  historySectionRef,
}: SkipHistoryButtonProps) => {
  const hasCompletedHistorySection = useArtworkStore(
    (state) => state.hasCompletedHistorySection
  );
  const hasStarted = useArtworkStore((state) => state.hasStarted);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: historySectionRef,
    offset: ["start start", "end end"],
  });

  // Show button when scroll progress is between 0.1 and 0.99 (not at start, not completed)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsVisible(latest > 0.1 && latest < 0.99);
  });

  const handleSkip = () => {
    if (!historySectionRef.current) return;

    // Scroll to the end of the history section
    const section = historySectionRef.current;
    const scrollTarget =
      section.offsetTop + section.offsetHeight - window.innerHeight;

    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  };

  const shouldShow = !hasCompletedHistorySection && hasStarted && isVisible;

  return (
    <AnimatePresence>
      {shouldShow && (
        <MotionButton
          onClick={handleSkip}
          className={cormorantGaramond.className}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 32px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "black",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
            zIndex: 1000,
            backdropFilter: "blur(10px)",
            fontFamily: cormorantGaramond.style.fontFamily,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
        >
          Skip
        </MotionButton>
      )}
    </AnimatePresence>
  );
};
