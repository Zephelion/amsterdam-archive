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
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontFamily: cormorantGaramond.style.fontFamily,
          fontWeight: "200",
        }}
      >
        <span style={{ fontSize: "1rem", fontWeight: "200" }}>
          Data visualization of Amsterdam's history
        </span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Uncover the layers</span>
          <span>Curated stories of Amsterdam's history</span>
        </div>
      </h1>
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
