import { Cormorant_Garamond } from "next/font/google";
import { StoryParagraph } from "@/components/features";
import { useRef } from "react";
import { useScroll } from "framer-motion";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

interface AmsterdamHistorySectionProps {
  content: string[];
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
        // paragraphLength={200}
        // startVisible={true}
      />
    </section>
  );
};
