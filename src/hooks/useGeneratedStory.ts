import { useArtworkStore } from "@/stores";
import type { ArchiveItem } from "@/types/data-types";
import { useEffect, useRef } from "react";

const storyCache = new Map<string, string>();

export const useGeneratedStory = (artwork: ArchiveItem | null) => {
  const generatedStory = useArtworkStore((state) => state.generatedStory);
  const setGeneratedStory = useArtworkStore((state) => state.setGeneratedStory);

  const isGenerating = useRef(false);
  const currentArtworkIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (artwork?.id !== currentArtworkIdRef.current) {
      currentArtworkIdRef.current = artwork?.id || null;
      isGenerating.current = false;
    }

    if (!artwork) {
      setGeneratedStory(null);
      return;
    }

    const cachedStory = storyCache.get(artwork?.id || "");
    if (cachedStory) {
      setGeneratedStory(cachedStory);
      return;
    }

    if (isGenerating.current) return;

    const generateStory = async () => {
      isGenerating.current = true;
      try {
        const response = await fetch("/api/generate-story", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ artwork }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate story");
        }

        const data = await response.json();

        if (data.story) {
          storyCache.set(artwork?.id || "", data.story);
          setGeneratedStory(data.story);
        }
      } catch (error) {
        console.error("Error generating story:", error);
      } finally {
        isGenerating.current = false;
      }
    };
    generateStory();
  }, [artwork?.id, setGeneratedStory]);

  return { generatedStory };
};
