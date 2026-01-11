import { useArtworkStore } from "@/stores";
import { CollectionSectionTitle } from "../CollectionSectionTitle";

export const CollectionSection = () => {
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);

  if (!activeArtwork) return null;

  // Extract collection from metadata
  const collectionValue = activeArtwork.metadata.find(
    (meta) => meta.field === "dc_provenance"
  )?.value;

  const collectionTitle =
    typeof collectionValue === "string"
      ? collectionValue
      : "Amsterdam Archive Collection";

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CollectionSectionTitle title={collectionTitle} />
    </section>
  );
};
