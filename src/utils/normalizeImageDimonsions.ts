/**
 * Normalizes image dimensions to fit within a maximum size while maintaining aspect ratio
 * @param width - Original width in pixels
 * @param height - Original height in pixels
 * @param maxSize - Maximum size for the largest dimension (default: 4)
 * @param minSize - Minimum size for the smallest dimension (default: 1.5)
 * @returns Normalized width and height
 */
export const normalizeImageDimensions = (
  width: number,
  height: number,
  maxSize = 4,
  minSize = 1.5
): { width: number; height: number } => {
  if (!width || !height || width <= 0 || height <= 0) {
    return { width: maxSize, height: maxSize };
  }

  // Find the larger dimension
  const maxDimension = Math.max(width, height);

  // Calculate scale factor to fit the largest dimension within maxSize
  const scaleFactor = maxSize / maxDimension;

  // Apply scale to both dimensions (preserves aspect ratio)
  let normalizedWidth = width * scaleFactor;
  let normalizedHeight = height * scaleFactor;

  // Ensure minimum size constraint
  const minDimension = Math.min(normalizedWidth, normalizedHeight);
  if (minDimension < minSize) {
    // Scale up to meet minimum size requirement
    const minScaleFactor = minSize / minDimension;
    normalizedWidth *= minScaleFactor;
    normalizedHeight *= minScaleFactor;

    // If scaling up exceeds maxSize, clamp to maxSize
    const newMaxDimension = Math.max(normalizedWidth, normalizedHeight);
    if (newMaxDimension > maxSize) {
      const clampScale = maxSize / newMaxDimension;
      normalizedWidth *= clampScale;
      normalizedHeight *= clampScale;
    }
  }

  return { width: normalizedWidth, height: normalizedHeight };
};
