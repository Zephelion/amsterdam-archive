import { MotionDiv } from "../MotionElements";

export const BlurredOverlay = () => {
  return (
    <MotionDiv
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        zIndex: 3,
        pointerEvents: "none",
      }}
    />
  );
};
