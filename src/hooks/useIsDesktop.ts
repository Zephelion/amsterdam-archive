import { useEffect, useState } from "react";

const DESKTOP_MIN_WIDTH = 1024;

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);

    const update = () => setIsDesktop(query.matches);
    update();

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktop;
};
