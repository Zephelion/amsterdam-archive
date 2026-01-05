import { ArchiveItem } from "@/types/data-types";
import { generateRandomSeed } from "@/utils/generateRandomSeed";

const BASE_URL = `https://webservices.memorix.nl/mediabank/media?apiKey=${process.env.NEXT_PUBLIC_STADSARCHIEF_API_KEY}`;

export interface ArchiveSearchOptions {
  year?: string;
  collection?: string;
  query?: string;
  page?: number;
  rows: number;
  lang?: "en" | "nl";
  sort?: "asc" | "desc";
}

interface ArchiveResponse {
  media: ArchiveItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

const buildUrl = (options: ArchiveSearchOptions): string => {
  const params = new URLSearchParams();

  // Add all options except 'sort' and optional fields
  for (const [key, value] of Object.entries(options)) {
    // Skip sort, year, and collection (we handle those separately)
    if (
      value !== undefined &&
      value !== null &&
      key !== "sort" &&
      key !== "year" &&
      key !== "collection"
    ) {
      params.append(key, value.toString());
    }
  }

  // Only add year filter if year is provided
  if (options.year !== undefined && options.year !== null) {
    params.append(
      "fq[]",
      `search_i_sk_date:[${options.year} TO ${options.year}]`
    );
  }

  // Only add collection filter if collection is provided
  if (options.collection !== undefined && options.collection !== null) {
    const escapedCollection = options.collection.replace(/:/g, "\\:");
    params.append("fq[]", `search_s_dc_provenance:"${escapedCollection}"`);
  }

  const randomSeed = generateRandomSeed();
  const sortDirection = options.sort || "asc";
  params.append("sort", `random{${randomSeed}} ${sortDirection}`);

  const paramString = params.toString().replace(/\+/g, "%20");

  return paramString ? `${BASE_URL}&${paramString}` : BASE_URL;
};

export async function fetchArchiveData(
  options: ArchiveSearchOptions
): Promise<ArchiveResponse> {
  const url = buildUrl(options);
  const response = await fetch(url);

  console.log(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(
      `Failed to fetch archive data: ${response.status} - ${errorText}`
    );
  }

  return response.json();
}
