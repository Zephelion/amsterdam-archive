import { useArtworkStore } from "@/stores";
import { useEffect } from "react";

export const ScrollController = () => {
  const generatedStory = useArtworkStore((state) => state.generatedStory);

  useEffect(() => {
    if (!generatedStory) {
      // Disable scrolling
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    }
    return () => {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, [generatedStory]);

  return null;
};
