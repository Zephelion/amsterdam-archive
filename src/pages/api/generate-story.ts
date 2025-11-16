import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { ArchiveItem } from "@/types/data-types";
import { extractMetadataValues } from "@/utils/extractMetadataValues";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RequestBody {
  artwork: ArchiveItem;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { artwork }: RequestBody = req.body;

    if (!artwork) {
      return res.status(400).json({ error: "Artwork is required" });
    }

    const { title, description, year, metadata } = artwork;

    const metaDataValues = extractMetadataValues(metadata);
    const metadataContext = metaDataValues.join("\n");

    const prompt = `
    You are a storyteller. You are given a piece of art and you need to create a story about it.
    The story should be a short story about the art and the artist.
    The story should be 100 words long.
    The story should be in the language of the artwork.
    The historical artwork from the stadsarchief Amsterdam should be used as the context for the story.: Title: ${title}${
      description ? `Description: ${description}` : ""
    }${year ? `Year: ${year}` : ""}${
      metadataContext ? `Additional context: ${metadataContext}` : ""
    }Write in an engaging, narrative style that helps viewers understand the historical and cultural significance of this piece. Focus on what makes it interesting and relevant.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a knowledgeable art historian and archivist specializing in Amsterdam's cultural heritage. Write engaging, informative descriptions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const story = completion.choices[0].message.content;

    return res.status(200).json({ story });
  } catch (error) {
    console.error("Error generating story:", error);
    return res.status(500).json({ error: "Failed to generate story" });
  }
}
