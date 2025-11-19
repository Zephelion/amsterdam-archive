import { MotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";

type ScrollDirection = "up" | "down";
export const useScrollDirection = (
  scrollYProgress: MotionValue<number>,
  initialDirection: ScrollDirection = "down"
) => {
  const [scrollDirection, setScrollDirection] =
    useState<ScrollDirection>(initialDirection);
  const previousProgressRef = useRef<number>(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (progress > previousProgressRef.current) {
        setScrollDirection("down");
      } else if (progress < previousProgressRef.current) {
        setScrollDirection("up");
      }
      previousProgressRef.current = progress;
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return scrollDirection;
};
