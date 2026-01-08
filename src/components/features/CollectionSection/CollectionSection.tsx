import { useRelatedArtworks } from "@/hooks";
import { useArtworkStore } from "@/stores";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { MotionDiv } from "../MotionElements";
import { CollectionSectionTitle } from "@/components/features";

export const CollectionSection = () => {
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const searchQuery = activeArtwork?.title;
  if (!searchQuery) return null;
  const { relatedArtworks } = useRelatedArtworks(searchQuery);

  const metadataValue = activeArtwork?.metadata.find(
    (meta) => meta.field === "dc_provenance"
  )?.value;
  const collectionTitle =
    typeof metadataValue === "string" ? metadataValue : undefined;

  const sectionRef = useRef<HTMLDivElement>(null);

  const TIMELINE_SETTINGS = {
    barWidth: 2.5,
    gap: 5,
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        background: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CollectionSectionTitle title={collectionTitle} />
      {/* Related Artworks */}
      {relatedArtworks.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: "90vw",
          }}
        >
          {relatedArtworks.map((artwork) => (
            <img
              key={artwork.id}
              src={
                artwork.asset[0]?.thumb?.small ||
                artwork.asset[0]?.thumb?.medium
              }
              alt={artwork.title}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};
