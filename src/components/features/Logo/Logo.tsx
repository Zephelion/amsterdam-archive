import { Cormorant_Garamond } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "2rem",
        left: "2rem",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: cormorantGaramond.style.fontFamily,
          fontSize: "1.25rem",
          fontWeight: "600",
          color: "#000000",
          margin: 0,
          letterSpacing: "0.05em",
        }}
      >
        Stadsarchief Amsterdam
      </span>
    </div>
  );
};
