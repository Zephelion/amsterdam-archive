import { MotionButton, MotionDiv } from "../MotionElements";
import { useArtworkStore } from "@/stores";
import { Cormorant_Garamond } from "next/font/google";
import { HERO_CONTENT } from "@/constants/heroContent";

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

  return (
    <MotionDiv
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
          {HERO_CONTENT.subtitle}
        </span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{HERO_CONTENT.titleLine1}</span>
          <span>{HERO_CONTENT.titleLine2}</span>
        </div>
      </h1>
      <MotionButton
        style={{
          backgroundColor: "transparent",
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
        {HERO_CONTENT.buttonText}
      </MotionButton>
    </MotionDiv>
  );
};
