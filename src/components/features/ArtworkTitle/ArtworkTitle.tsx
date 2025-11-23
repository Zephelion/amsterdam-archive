import { useArtworkStore, useShouldShowUI } from "@/stores";
import { MotionDiv } from "../MotionElements";
import { useSpring } from "framer-motion";
import { useEffect } from "react";

export const ArtworkTitle = () => {
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const shouldShowUI = useShouldShowUI();

  const opacity = useSpring(0, { stiffness: 50, damping: 25 });

  useEffect(() => {
    opacity.set(shouldShowUI ? 1 : 0);
  }, [shouldShowUI, opacity]);

  if (!shouldShowUI) return null;

  return (
    <MotionDiv
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        fontSize: "24px",
        fontWeight: "bold",
        color: "beige",
        opacity,
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "2px",
        fontFamily: "sans-serif",
        mixBlendMode: "difference",
      }}
    >
      {activeArtwork?.title === "-"
        ? "Illustration unknown"
        : activeArtwork?.title}
    </MotionDiv>
  );
};
