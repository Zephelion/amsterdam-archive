import { Cormorant_Garamond } from "next/font/google";
import { useState } from "react";
import { useArtworkStore } from "@/stores";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const InteractiveTimeline = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const setTimelineTransitioning = useArtworkStore(
    (state) => state.setTimelineTransitioning
  );
  const setTimelineYear = useArtworkStore((state) => state.setTimelineYear);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleClick = async () => {
    const year = 1653;

    // Start timeline transition
    setTimelineYear(year);
    setTimelineTransitioning(true);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          position: "absolute",
          bottom: "50px",
          left: "50%",
          width: "40%",
          height: "1.5px",
          backgroundColor: "#000",
          transform: "translate(-50%, 0%)",
          zIndex: 10,
          pointerEvents: "auto",
          cursor: "pointer",
        }}
      />
      {isHovered && (
        <div
          style={{
            position: "fixed",
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y - 60}px`,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 11,
            fontSize: "2rem",
            fontFamily: cormorantGaramond.style.fontFamily,
            color: "#000",
            padding: "4px 8px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "4px",
            whiteSpace: "nowrap",
          }}
        >
          1653
        </div>
      )}
    </>
  );
};
