import type { Metadaum } from "@/types/data-types";

export const extractMetadataValues = (metadata: Metadaum[]): string[] => {
  const metadataValues: string[] = [];

  for (const meta of metadata) {
    if (typeof meta.value === "string") {
      // If value is a string, add it to the metadataValues array
      metadataValues.push(`${meta.label || meta.field}: ${meta.value}`);
    } else if (Array.isArray(meta.value)) {
      // If value is an array, recursively extract the values
      const nestedValues = extractMetadataValues(meta.value);
      if (nestedValues.length > 0) {
        metadataValues.push(`${meta.label || meta.field}:`);
        // Indent the nested values for better readability
        metadataValues.push(...nestedValues.map((v) => `  ${v}`));
      }
    }
  }
  return metadataValues;
};
