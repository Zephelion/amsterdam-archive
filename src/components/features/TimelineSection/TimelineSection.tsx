import { useRelatedArtworks } from "@/hooks";
import { useArtworkStore } from "@/stores";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { MotionDiv } from "../MotionElements";

export const TimelineSection = () => {
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const searchQuery = activeArtwork?.title;
  if (!searchQuery) return null;
  const { relatedArtworks } = useRelatedArtworks(searchQuery);

  console.log(relatedArtworks);

  const [barsCount, setBarsCount] = useState(0);
  const OFFSET_COUNT = 5;
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Create a smoother gradient with a transition zone
  const gradientBackground = useTransform(scrollYProgress, (progress) => {
    const percentage = progress * 100;
    const fadeWidth = 20; // Width of fade zone

    return `linear-gradient(to right, 
      transparent 0%, 
      transparent ${Math.max(0, percentage - fadeWidth)}%, 
      rgba(255, 255, 255, 0.3) ${Math.max(0, percentage - fadeWidth * 0.5)}%, 
      rgba(255, 255, 255, 0.7) ${Math.max(0, percentage - fadeWidth * 0.2)}%, 
      rgba(255, 255, 255, 1) ${percentage}%, 
      rgba(255, 255, 255, 1) 100%
    )`;
  });

  useEffect(() => {
    const calculateBarsCount = () => {
      const barWidth = 5;
      const gap = 5;

      const totalWidth = window.innerWidth;

      const count = Math.floor((totalWidth - gap) / (barWidth + gap));

      setBarsCount(count);
    };

    calculateBarsCount();
    window.addEventListener("resize", calculateBarsCount);
    return () => window.removeEventListener("resize", calculateBarsCount);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        height: "400vh",
        background: "white",
        // justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "5px",
          position: "sticky",
          top: 0,
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Array.from({ length: barsCount + OFFSET_COUNT }).map((_, index) => {
          // Every 5th item (index 4, 9, 14, 19, etc.) should be taller
          const isEveryFifth = (index + 1) % 5 === 0;
          const height = isEveryFifth ? "40px" : "20px";
          //   const translateY = isEveryFifth ? "-10px" : "0px";

          return (
            <div
              key={index}
              style={{
                backgroundColor: "#000",
                width: "5px",
                height: height,
                borderRadius: "10px",
                // transform: `translateY(${translateY})`,
              }}
            />
          );
        })}
        <MotionDiv
          style={{
            background: gradientBackground,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  );
};
