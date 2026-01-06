import { Cormorant_Garamond } from "next/font/google";
import { StoryParagraph } from "@/components/features";
import { useRef, useEffect, forwardRef } from "react";
import { useScroll } from "framer-motion";
import { HistoryParagraph } from "@/constants/amsterdamHistoryContent";
import { useArtworkStore } from "@/stores/useArtworkStore";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

interface AmsterdamHistorySectionProps {
  content: HistoryParagraph[];
}

export const AmsterdamHistorySection = forwardRef<
  HTMLDivElement,
  AmsterdamHistorySectionProps
>(({ content }, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Merge refs: set both the forwarded ref and internal ref
  const setRefs = (element: HTMLDivElement | null) => {
    sectionRef.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const setHasCompletedHistorySection = useArtworkStore(
    (state) => state.setHasCompletedHistorySection
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (progress >= 1) {
        setHasCompletedHistorySection(true);
      } else {
        setHasCompletedHistorySection(false);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, setHasCompletedHistorySection]);

  return (
    <section
      ref={setRefs}
      style={{
        position: "relative",
        height: "5000vh",
        width: "100vw",
        fontFamily: cormorantGaramond.style.fontFamily,
      }}
    >
      <StoryParagraph
        content={content}
        scrollYProgress={scrollYProgress}
        fadeTransitionPercentage={0.4}
      />
    </section>
  );
});

AmsterdamHistorySection.displayName = "AmsterdamHistorySection";
