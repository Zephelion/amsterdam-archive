interface BreakContentIntoParagraphsProps {
  content: string;
  maxLength: number;
}

export const breakContentIntoParagraphs = ({
  content,
  maxLength,
}: BreakContentIntoParagraphsProps): string[] => {
  const paragraphs: string[] = [];
  let currentParagraph = "";

  // Split by newlines first
  const lines = content.split("\n").filter((line) => line.trim().length > 0);

  for (const line of lines) {
    // If line itself exceeds maxLength, split it by words
    if (line.length > maxLength) {
      // Save current paragraph if it exists
      if (currentParagraph.trim().length > 0) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = "";
      }

      // Split long line by words
      const words = line.split(" ");
      let currentLine = "";

      for (const word of words) {
        const wouldExceed = currentLine.length + word.length + 1 > maxLength;

        if (wouldExceed && currentLine.length > 0) {
          paragraphs.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine += (currentLine ? " " : "") + word;
        }
      }

      // Add remaining line if any
      if (currentLine.trim().length > 0) {
        paragraphs.push(currentLine.trim());
      }
    } else {
      // Line fits within maxLength
      const wouldExceed = currentParagraph.length + line.length + 1 > maxLength;

      if (wouldExceed && currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = line;
      } else {
        currentParagraph += (currentParagraph ? "\n" : "") + line;
      }
    }
  }

  // Don't forget the last paragraph
  if (currentParagraph.trim().length > 0) {
    paragraphs.push(currentParagraph.trim());
  }

  return paragraphs;
};
