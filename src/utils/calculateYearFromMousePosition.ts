import { getCurrentYear } from "@/utils/getCurrentYear";
import { clamp } from "@/utils/clamp";
import { RefObject } from "react";

export const MIN_YEAR = 1600;
export const MAX_YEAR = getCurrentYear();

export const calculateYearFromMousePosition = (
  clientX: number,
  timelineRef: RefObject<HTMLDivElement | null>
) => {
  if (!timelineRef.current) return MIN_YEAR;

  const rect = timelineRef.current.getBoundingClientRect();

  // A percentage on how far along the timeline the mouse is
  const relativePosition = (clientX - rect.left) / rect.width;
  const distance = MAX_YEAR - MIN_YEAR;

  // Calculate the year based on the relative position
  const year = clamp(
    MIN_YEAR + Math.round(relativePosition * distance),
    MIN_YEAR,
    MAX_YEAR
  );

  return year;
};
