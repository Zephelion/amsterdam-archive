import { MotionButton, MotionDiv } from "../MotionElements";
import { useArtworkStore } from "@/stores";
import { Cormorant_Garamond } from "next/font/google";
import { HERO_CONTENT } from "@/constants/heroContent";
import styles from "./HeroSection.module.css";

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
        gap: "0.5rem",
        // backgroundColor: "#EBE7DD",
      }}
    >
      {/* Subtitle */}
      <p
        style={{
          fontFamily: cormorantGaramond.style.fontFamily,
          fontSize: "0.875rem",
          fontWeight: "400",
          letterSpacing: "0.2em",
          color: "#8B8B8B",
          margin: 0,
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        {HERO_CONTENT.subtitle}
      </p>

      {/* Main Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
        }}
      >
        <h1
          style={{
            fontFamily: cormorantGaramond.style.fontFamily,
            fontSize: "6rem",
            fontWeight: "100",
            color: "#000000",
            margin: 0,
            lineHeight: "1",
          }}
        >
          {HERO_CONTENT.titleLine1}
        </h1>
        <h1
          style={{
            fontFamily: cormorantGaramond.style.fontFamily,
            fontSize: "6rem",
            fontWeight: "400",
            color: "#C4A57B",
            margin: 0,
            lineHeight: "1",
            fontStyle: "italic",
          }}
        >
          layers
        </h1>
      </div>

      {/* Sub Title */}
      <p
        style={{
          fontFamily: cormorantGaramond.style.fontFamily,
          fontSize: "1.25rem",
          fontWeight: "400",
          color: "#6B6B6B",
          margin: 0,
          marginTop: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {HERO_CONTENT.titleLine2}
      </p>

      {/* Button */}
      <MotionButton
        className={`${styles.startButton} ${cormorantGaramond.className}`}
        style={{
          pointerEvents: "auto",
        }}
        animate={{ opacity: hasStarted ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleStart}
        whileTap={{ scale: 0.95 }}
      >
        <span className={styles.buttonText}>{HERO_CONTENT.buttonText}</span>
      </MotionButton>
    </MotionDiv>
  );
};
