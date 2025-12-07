import { useEffect } from "react";
import { useSpring } from "framer-motion";
import { MotionDiv } from "../MotionElements";
import { useArtworkStore } from "@/stores";

export const HoverTooltip = () => {
  // Framer Motion spring animation for cursor position
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const scale = useSpring(0, { stiffness: 300, damping: 30 });
  const OFFSET = 20;

  const { isHovered } = useArtworkStore();
  const isTimelineTransitioning = useArtworkStore(
    (state) => state.isTimelineTransitioning
  );

  useEffect(() => {
    scale.set(isHovered && !isTimelineTransitioning ? 1 : 0);
  }, [isHovered, isTimelineTransitioning, scale]);

  // Update cursor position on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX + OFFSET);
      y.set(e.clientY + OFFSET);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [x, y]);

  return (
    <MotionDiv
      style={{
        backgroundColor: "black",
        position: "absolute",
        color: "white",
        padding: "4px 8px",
        fontSize: "12px",
        scale,
        left: x,
        top: y,
        zIndex: 10,
        transformOrigin: "center",
      }}
    >
      View
    </MotionDiv>
  );
};
