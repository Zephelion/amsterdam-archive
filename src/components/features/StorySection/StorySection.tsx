import { useArtworkStore, useShouldShowUI } from "@/stores";
import { Cormorant_Garamond } from "next/font/google";
import { StoryParagraph } from "@/components/features";
import { useRef } from "react";
import { useScroll } from "framer-motion";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

export const StorySection = ({ content }: { content: string }) => {
  const generatedStory = useArtworkStore((state) => state.generatedStory);
  const shouldShowUI = useShouldShowUI();
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  if (!shouldShowUI || !activeArtwork || !generatedStory) return null;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "400vh",
        width: "100vw",
        fontFamily: cormorantGaramond.style.fontFamily,
      }}
    >
      <StoryParagraph content={content} scrollYProgress={scrollYProgress} />
    </section>
  );
};
