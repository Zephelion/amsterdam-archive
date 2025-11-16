import { breakContentIntoParagraphs } from "@/utils/breakContentIntoParagraphs";
import { MotionValue, useTransform, motion } from "framer-motion";
import { MotionParagraph } from "../MotionElements";

interface StoryParagraphProps {
  content: string;
  scrollYProgress: MotionValue<number>;
}

export const StoryParagraph = ({
  content,
  scrollYProgress,
}: StoryParagraphProps) => {
  const paragraphs = breakContentIntoParagraphs({ content, maxLength: 150 });

  return (
    <div
      style={{
        position: "sticky",
        top: "0",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {paragraphs.map((paragraph, index) => {
        const totalParagraphs = paragraphs.length;

        // Calculate each paragraph's scroll segment
        const segmentStart = index / totalParagraphs;
        const segmentEnd = (index + 1) / totalParagraphs;

        // Fade in during first 10% of segment, fade out during last 10%
        const fadeInEnd = segmentStart + 0.1;
        const fadeOutStart = segmentEnd - 0.1;

        // Create opacity transform for this specific paragraph
        const opacity = useTransform(scrollYProgress, (progress) => {
          if (progress < segmentStart) return 0;
          if (progress >= segmentStart && progress < fadeInEnd) {
            // Fade in
            return (progress - segmentStart) / 0.1;
          }
          if (progress >= fadeInEnd && progress < fadeOutStart) {
            // Fully visible
            return 1;
          }
          if (progress >= fadeOutStart && progress <= segmentEnd) {
            // Fade out
            return 1 - (progress - fadeOutStart) / 0.1;
          }
          return 0;
        });

        return (
          <MotionParagraph
            key={index}
            style={{
              opacity,
              position: "absolute", // Stack paragraphs on top of each other
              fontSize: "2rem",
              lineHeight: "1.6",
              textAlign: "center",
              maxWidth: "600px",
              padding: "0 20px",
            }}
          >
            {paragraph}
          </MotionParagraph>
        );
      })}
    </div>
  );
};
