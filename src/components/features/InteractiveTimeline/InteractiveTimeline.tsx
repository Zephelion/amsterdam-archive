import { Cormorant_Garamond } from "next/font/google";
import { useRef, useState } from "react";
import { useArtworkStore } from "@/stores";
import {
  calculateYearFromMousePosition,
  MIN_YEAR,
} from "@/utils/calculateYearFromMousePosition";
import { getCurrentYear } from "@/utils/getCurrentYear";
import { getBarTransform } from "@/utils/getBarTransform";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const InteractiveTimeline = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [relativeMouseX, setRelativeMouseX] = useState<number | null>(null);
  const [year, setYear] = useState(MIN_YEAR);
  const timelineRef = useRef<HTMLDivElement>(null);

  const setTimelineTransitioning = useArtworkStore(
    (state) => state.setTimelineTransitioning
  );
  const setTimelineYear = useArtworkStore((state) => state.setTimelineYear);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRelativeMouseX(null); // Reset bulge effect
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });

    const year = calculateYearFromMousePosition(e.clientX, timelineRef);
    setYear(year);

    // Calculate relative mouse position within timeline
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left; // Position from left edge of timeline
      setRelativeMouseX(relativeX);
    }
  };

  const handleClick = () => {
    // Start timeline transition
    setTimelineYear(year);
    setTimelineTransitioning(true);
  };

  // Calculate dot positions - create dots for each 50 years
  const MAX_YEAR = getCurrentYear();
  const yearRange = MAX_YEAR - MIN_YEAR;
  const barInterval = 9; // Show a dot every 50 years
  const numberOfBars = Math.floor(yearRange / barInterval) + 1;

  const bars = Array.from({ length: numberOfBars }, (_, i) => {
    const barYear = MIN_YEAR + i * barInterval;
    return barYear;
  });

  return (
    <>
      <div
        ref={timelineRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          position: "absolute",
          bottom: "50px",
          left: "50%",
          width: "40%",
          height: "35px",
          transform: "translate(-50%, 0%)",
          zIndex: 10,
          pointerEvents: "auto",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
      >
        {(() => {
          const timelineWidth =
            timelineRef.current?.getBoundingClientRect().width || 0;

          return bars.map((barYear) => {
            const position = ((barYear - MIN_YEAR) / yearRange) * 100;

            // Calculate opacity based on position - fade on edges
            // Fade distance: 20% from each edge
            const fadeDistance = 20;
            let opacity = 1;

            if (position < fadeDistance) {
              // Fade in from left edge
              opacity = position / fadeDistance;
            } else if (position > 100 - fadeDistance) {
              // Fade out to right edge
              opacity = (100 - position) / fadeDistance;
            }

            // Get bulge transform
            const { scale, translateY } = getBarTransform({
              barPositionPercent: position,
              isHovered,
              relativeMouseX,
              timelineWidth,
              bulgeRadius: 25,
            });

            return (
              <div
                key={barYear}
                style={{
                  position: "absolute",
                  left: `${position}%`,
                  top: "50%",
                  transform: `translate(-50%, ${translateY}px) scaleY(${scale})`,
                  width: "1px",
                  height: "20px",
                  backgroundColor: "#000",
                  opacity: opacity,
                  cursor: "pointer",
                  transition: "transform 0.1s ease-out",
                  transformOrigin: "center bottom",
                }}
              />
            );
          });
        })()}
      </div>
      {isHovered && (
        <div
          style={{
            position: "fixed",
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y - 60}px`,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 1000,
            fontSize: "2rem",
            fontFamily: cormorantGaramond.style.fontFamily,
            color: "black",
            padding: "4px 8px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            mixBlendMode: "difference",
            backgroundColor: "white",
          }}
        >
          {year}
        </div>
      )}
    </>
  );
};
