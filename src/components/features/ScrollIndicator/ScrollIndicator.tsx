import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useArtworkStore } from "@/stores";
import { Cormorant_Garamond } from "next/font/google";
import { MotionDiv, MotionSvg } from "../MotionElements";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
});

export const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const hasStarted = useArtworkStore((state) => state.hasStarted);
  const hasCompletedHistorySection = useArtworkStore(
    (state) => state.hasCompletedHistorySection
  );

  useEffect(() => {
    if (hasStarted && !hasCompletedHistorySection) {
      let scrollListener: (() => void) | null = null;

      // Show indicator after a brief delay
      const showTimer = setTimeout(() => {
        setIsVisible(true);

        // Add scroll listener only after indicator is visible
        scrollListener = () => {
          setIsVisible(false);
        };
        window.addEventListener("scroll", scrollListener, { once: true });
      }, 500);

      return () => {
        clearTimeout(showTimer);
        if (scrollListener) {
          window.removeEventListener("scroll", scrollListener);
        }
      };
    } else {
      setIsVisible(false);
    }
  }, [hasStarted, hasCompletedHistorySection]);

  if (!hasStarted || hasCompletedHistorySection) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: cormorantGaramond.style.fontFamily,
                fontSize: "1.2rem",
                color: "black",
                opacity: 0.7,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Scroll down to explore the archive
            </span>

            {/* Animated arrow */}
            <MotionSvg
              width="24"
              height="40"
              viewBox="0 0 24 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                d="M12 2L12 30M12 30L6 24M12 30L18 24"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
            </MotionSvg>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};
