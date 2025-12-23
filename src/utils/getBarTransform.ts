interface BarTransformParams {
  barPositionPercent: number;
  isHovered: boolean;
  relativeMouseX: number | null;
  timelineWidth: number;
  bulgeRadius?: number;
  maxScale?: number;
  maxLift?: number;
}

interface BarTransform {
  scale: number;
  translateY: number;
}

export const getBarTransform = ({
  barPositionPercent,
  isHovered,
  relativeMouseX,
  timelineWidth,
  bulgeRadius = 150,
  maxScale = 2.5,
  maxLift = -15,
}: BarTransformParams): BarTransform => {
  if (!isHovered || relativeMouseX === null) {
    return {
      scale: 1,
      translateY: 0,
    };
  }

  const barX = (barPositionPercent / 100) * timelineWidth; // Bar position in pixels

  // Distance from mouse to bar (in pixels)
  const distance = Math.abs(relativeMouseX - barX);

  // Calculate influence (0 to 1) using smooth falloff
  const influence = Math.max(0, 1 - distance / bulgeRadius);

  // Scale effect - bars closer to mouse get larger
  const scale = 1 + (maxScale - 1) * influence;

  // Lift effect - bars closer to mouse move up
  const translateY = maxLift * influence;

  return {
    scale,
    translateY,
  };
};
