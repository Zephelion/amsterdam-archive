import { useCameraTransition } from "@/hooks";
import { useArtworkStore } from "@/stores";

interface CameraControllerProps {
  lerpSpeed?: number;
  artWorkDimension?: number;
  zoomDistance?: number;
  offset?: [number, number, number];
}

export const CameraController = ({
  lerpSpeed = 0.05,
  zoomDistance = 3,
  offset = [0, 0, 0],
}: CameraControllerProps) => {
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const activeArtworkPosition = useArtworkStore(
    (state) => state.activeArtworkPosition
  );

  useCameraTransition(!!activeArtwork, activeArtworkPosition, {
    lerpSpeed,
    zoomDistance,
    offset,
  });

  return null;
};
