import { ArchiveItem } from "@/types/data-types";
import { generateRandomSeed } from "@/utils/generateRandomSeed";

const BASE_URL = `https://webservices.memorix.nl/mediabank/media?apiKey=${process.env.NEXT_PUBLIC_STADSARCHIEF_API_KEY}`;

interface ArchiveSearchOptions {
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

  // Add all options except 'sort' to avoid duplicates
  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && key !== "sort") {
      params.append(key, value.toString());
    }
  }

  const randomSeed = generateRandomSeed();
  // Append sort=random:<seed> to ensure random order on each request
  const sortDirection = options.sort || "asc";
  params.append("sort", `random{${randomSeed}} ${sortDirection}`);

  // Convert + to %20 for proper space encoding
  const paramString = params.toString().replace(/\+/g, "%20");

  return paramString ? `${BASE_URL}&${paramString}` : BASE_URL;
};

export async function fetchArchiveData(
  options: ArchiveSearchOptions
): Promise<ArchiveResponse> {
  const url = buildUrl(options);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(
      `Failed to fetch archive data: ${response.status} - ${errorText}`
    );
  }

  return response.json();
}
