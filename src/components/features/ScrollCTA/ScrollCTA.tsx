import { useShouldShowUI, useArtworkStore } from "@/stores";
import { MotionDiv } from "../MotionElements";

export const ScrollCTA = () => {
  const shouldShowUI = useShouldShowUI();
  const generatedStory = useArtworkStore((state) => state.generatedStory);

  if (!shouldShowUI && !generatedStory) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: shouldShowUI && !!generatedStory ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      Scroll to discover
    </MotionDiv>
  );
};
