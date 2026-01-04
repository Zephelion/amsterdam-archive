import { useArtworkStore } from "@/stores";
import { Cormorant_Garamond } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { MotionDiv, MotionSpan } from "../MotionElements";
import { collections } from "@/constants/collections";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});

export const CollectionSidePanel = () => {
  const layoutId = useArtworkStore((state) => state.layoutId);
  const layoutTargetId = useArtworkStore((state) => state.layoutTargetId);
  const isLayoutTransitioning = useArtworkStore(
    (state) => state.isLayoutTransitioning
  );
  const startLayoutTransition = useArtworkStore(
    (state) => state.startLayoutTransition
  );
  const setCurrentCollection = useArtworkStore(
    (state) => state.setCurrentCollection
  );
  const clearCurrentCollection = useArtworkStore(
    (state) => state.clearCurrentCollection
  );

  // Open ONLY after planes finished arriving in grid-6 (layoutId is committed),
  // but close immediately when we start transitioning back to grid-10.
  const isClosingToGrid10 =
    isLayoutTransitioning &&
    layoutId === "grid-6" &&
    layoutTargetId === "grid-10";
  const isOpen = layoutId === "grid-6" && !isClosingToGrid10;

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.14, delayChildren: 0.1 },
    },
    exit: {
      transition: { staggerChildren: 0.14, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    hidden: { y: 18, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: {
      y: 18,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  // If we are not open and not in grid-6 at all, render nothing.
  // (During exit animation, AnimatePresence will keep things mounted.)
  if (!isOpen && layoutId !== "grid-6") return null;

  const handleClick = (collection: string) => {
    const sanitizedCollection = collection
      .split(":")[0] // Take only the part before the colon
      .replace(/\s*\(\d+\.\d+\)\s*/g, "") // Remove (number.number) pattern if present
      .trim(); // Remove any trailing whitespace

    setCurrentCollection(sanitizedCollection);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (click outside) */}
          <MotionDiv
            onClick={() => {
              clearCurrentCollection();
              startLayoutTransition("grid-10");
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0)",
              zIndex: 1999,
            }}
          />

          {/* Panel */}
          <MotionDiv
            // as="aside"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: "28vw",
              backgroundColor: "white",
              zIndex: 2000,
              padding: "24px",
              overflowY: "auto",
              fontFamily: cormorantGaramond.style.fontFamily,
            }}
          >
            <MotionDiv
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {collections.map((label) => (
                <MotionSpan
                  key={label}
                  onClick={() => handleClick(label)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  style={{
                    display: "block",
                    marginTop: "2rem",
                    color: "black",
                    fontSize: "1vw",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {label}
                </MotionSpan>
              ))}
            </MotionDiv>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};
