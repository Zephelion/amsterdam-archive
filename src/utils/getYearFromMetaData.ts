export const getYearFromMetaData = (
  metadataValue: string | string[]
): string => {
  const unknownValue = "Unknown";

  try {
    const valueToParse = Array.isArray(metadataValue)
      ? metadataValue[0]
      : metadataValue;

    if (!valueToParse || valueToParse === "") {
      return unknownValue;
    }

    // Regular expression to check for a four-digit year between 1600 and 2029
    const pattern = /\b(1[6-9]\d{2}|20[0-2]\d)\b/;

    //clean string
    const cleanValue = valueToParse.trim();

    const yearMatch = cleanValue.match(pattern);

    if (yearMatch) {
      return yearMatch[0];
    }

    return unknownValue;
  } catch (error) {
    console.error("Error parsing year from metadata:", error, metadataValue);
    return unknownValue;
  }
};
