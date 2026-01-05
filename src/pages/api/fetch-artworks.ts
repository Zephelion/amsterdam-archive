import { NextApiRequest, NextApiResponse } from "next";
import { fetchArchiveData } from "@/lib/stadsarchief";
import { getYearFromMetaData } from "@/utils/getYearFromMetaData";
import type { ArchiveSearchOptions } from "@/lib/stadsarchief";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { year, collection } = req.body;
    if (!year && !collection) {
      return res
        .status(400)
        .json({ error: "Either year or collection is required" });
    }

    // Build options object, only including values that exist
    const options: ArchiveSearchOptions = {
      rows: 100,
      lang: "nl",
      sort: "asc",
    };

    // Only add year if it exists
    if (year) {
      options.year = year.toString();
    }

    // Only add collection if it exists
    if (collection) {
      options.collection = collection;
    }

    const data = await fetchArchiveData(options);

    const processedData = data.media.map((item) => {
      const dateMetadata =
        item.metadata?.find((meta) => meta.field === "dc_date")?.value || "";
      return {
        ...item,
        year: getYearFromMetaData(dateMetadata as string | string[]),
      };
    });

    return res.status(200).json(processedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}
