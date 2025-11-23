import { breakContentIntoParagraphs } from "@/utils/breakContentIntoParagraphs";
import { MotionValue, useTransform } from "framer-motion";
import { MotionParagraph } from "../MotionElements";
import { HistoryParagraph } from "@/constants/amsterdamHistoryContent";

interface StoryParagraphProps {
  content: string | string[] | HistoryParagraph[];
  scrollYProgress: MotionValue<number>;
  paragraphLength?: number;
  fadeTransitionPercentage?: number;
}

export const StoryParagraph = ({
  content,
  scrollYProgress,
  paragraphLength = 150,
  fadeTransitionPercentage = 0.25,
}: StoryParagraphProps) => {
  const paragraphs: { text: string }[] = Array.isArray(content)
    ? content.map((item) => (typeof item === "string" ? { text: item } : item))
    : breakContentIntoParagraphs({
        content,
        maxLength: paragraphLength,
      }).map((text) => ({ text }));

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
        const isLastParagraph = index === totalParagraphs - 1;
        const { text } = paragraph;

        // Calculate each paragraph's scroll segment
        const segmentStart = index / totalParagraphs;
        const segmentEnd = (index + 1) / totalParagraphs;
        const segmentSize = segmentEnd - segmentStart;

        // Fade in during first 10% of segment, fade out during last 10%
        // Use percentage of segment size, not total scroll
        const fadeInEnd = segmentStart + segmentSize * fadeTransitionPercentage;
        const fadeOutStart =
          segmentEnd - segmentSize * fadeTransitionPercentage;
        // For last paragraph, extend fade-out slightly to handle scroll progress beyond 1.0
        const fadeOutEnd = isLastParagraph
          ? segmentEnd + segmentSize * 0.05
          : segmentEnd;

        // Create opacity transform for this specific paragraph
        const opacity = useTransform(scrollYProgress, (progress) => {
          if (progress < segmentStart) return 0;
          if (progress >= segmentStart && progress < fadeInEnd) {
            // Fade in - use actual fade-in range
            const fadeInRange = fadeInEnd - segmentStart;
            return fadeInRange > 0
              ? (progress - segmentStart) / fadeInRange
              : 0;
          }
          if (progress >= fadeInEnd && progress < fadeOutStart) {
            // Fully visible
            return 1;
          }
          if (progress >= fadeOutStart && progress <= fadeOutEnd) {
            // Fade out - use actual fade-out range
            const fadeOutRange = fadeOutEnd - fadeOutStart;
            return fadeOutRange > 0
              ? 1 - (progress - fadeOutStart) / fadeOutRange
              : 0;
          }
          return 0;
        });

        return (
          <MotionParagraph
            key={index}
            style={{
              opacity,
              position: "absolute",
              fontSize: "2rem",
              lineHeight: "1.6",
              textAlign: "center",
              maxWidth: "600px",
              padding: "0 20px",
            }}
          >
            {text}
          </MotionParagraph>
        );
      })}
    </div>
  );
};
