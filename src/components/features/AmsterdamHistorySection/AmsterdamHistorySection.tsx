import { Cormorant_Garamond } from "next/font/google";
import { StoryParagraph } from "@/components/features";
import { useRef } from "react";
import { useScroll } from "framer-motion";
import { HistoryParagraph } from "@/constants/amsterdamHistoryContent";
import { YearDisplay } from "@/components/features";

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

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "3000vh",
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
