import { ArchiveItem } from "@/types/data-types";
import { useEffect, useState } from "react";
import { fetchArchiveData } from "@/lib/stadsarchief";
import { getYearFromMetaData } from "@/utils/getYearFromMetaData";

export const useRelatedArtworks = (searchQuery: string | null) => {
  const [relatedArtworks, setRelatedArtworks] = useState<ArchiveItem[]>([]);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchRelatedArtworks = async () => {
      const data = await fetchArchiveData({
        query: searchQuery,
        page: 1,
        rows: 25,
        lang: "nl",
        sort: "asc",
      });

      const processedData = data.media.map((item) => {
        const dateMetadata =
          item.metadata?.find((meta) => meta.field === "dc_date")?.value || "";
        return {
          ...item,
          year: getYearFromMetaData(dateMetadata as string | string[]),
        };
      });

      const filteredData = processedData.filter((item) => {
        if (!item.asset || item.asset.length === 0) return false;
        if (!item.asset[0].thumb) return false;
        if (!item.asset[0].thumb.large) return false;

        // Filter out items with "Unknown" year
        const year = parseInt(item.year?.toString() || "0");
        return !isNaN(year) && year > 0;
      });

      const sortedData = filteredData.sort((a, b) => {
        const yearA = parseInt(a.year?.toString() || "0");
        const yearB = parseInt(b.year?.toString() || "0");
        return yearA - yearB;
      });

      setRelatedArtworks(sortedData.slice(0, 10));
    };

    fetchRelatedArtworks();
  }, [searchQuery]);
  return { relatedArtworks };
};
