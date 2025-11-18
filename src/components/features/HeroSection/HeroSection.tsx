import { MotionButton } from "../MotionElements";
import { useArtworkStore } from "@/stores";
import { Cormorant_Garamond } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const HeroSection = () => {
  const hasStarted = useArtworkStore((state) => state.hasStarted);
  const setHasStarted = useArtworkStore((state) => state.setHasStarted);

  //   const opacity = useSpring(1, { stiffness: 50, damping: 25 });
  //   const y = useSpring(0, { stiffness: 50, damping: 25 });

  //   useEffect(() => {
  //     if (hasStarted) {
  //       opacity.set(0);
  //       y.set(-20);
  //     }
  //   }, [hasStarted, opacity, y]);

  const handleStart = () => {
    setHasStarted(true);
  };

  //   if (!hasStarted) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <MotionButton
        style={{
          backgroundColor: "white",
          color: "black",
          border: "0.5px solid black",
          padding: "10px 20px",
          pointerEvents: "auto",
          cursor: "pointer",
          fontFamily: cormorantGaramond.style.fontFamily,
          fontSize: "1.5rem",
        }}
        animate={{ opacity: hasStarted ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleStart}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Start
      </MotionButton>
    </div>
  );
};
