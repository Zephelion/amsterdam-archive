import { NextApiRequest, NextApiResponse } from "next";
import { fetchArchiveData } from "@/lib/stadsarchief";
import { getYearFromMetaData } from "@/utils/getYearFromMetaData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { year } = req.body;
    if (!year) {
      return res.status(405).json({ error: "Year is required" });
    }

    const data = await fetchArchiveData({
      year: year.toString(),
      rows: 100,
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

    return res.status(200).json(processedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}
