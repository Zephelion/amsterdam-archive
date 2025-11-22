import { Cormorant_Garamond } from "next/font/google";
import { StoryParagraph } from "@/components/features";
import { useRef, useEffect } from "react";
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

export const AmsterdamHistorySection = ({
  content,
}: AmsterdamHistorySectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const setHasCompletedHistorySection = useArtworkStore(
    (state) => state.setHasCompletedHistorySection
  );

  const hasCompletedHistorySection = useArtworkStore(
    (state) => state.hasCompletedHistorySection
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

  console.log(hasCompletedHistorySection);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "2500vh",
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
};
