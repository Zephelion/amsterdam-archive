import { Cormorant_Garamond } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
});

interface CollectionSectionTitleProps {
  title?: string;
}

export const CollectionSectionTitle = ({
  title,
}: CollectionSectionTitleProps) => {
  if (!title) return null;

  const [firstPart, secondPart] = title.split(":").map((part) => part.trim());

  return (
    <>
      {/* Top part */}
      {firstPart && (
        <h2
          style={{
            fontFamily: cormorantGaramond.style.fontFamily,
            fontSize: "3rem",
            fontWeight: "600",
            color: "black",
            textAlign: "center",
            top: "2rem",
            margin: 0,
            zIndex: 10,
          }}
        >
          {firstPart}
        </h2>
      )}

      {/* Bottom part */}
      {/* {secondPart && (
        <h2
          style={{
            fontFamily: cormorantGaramond.style.fontFamily,
            fontSize: "3rem",
            fontWeight: "600",
            color: "black",
            textAlign: "center",
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            margin: 0,
            zIndex: 10,
          }}
        >
          {secondPart}
        </h2>
      )} */}
    </>
  );
};
