import { AnimatePresence } from "framer-motion";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { MotionDiv } from "../MotionElements";
import styles from "./DesktopOnlyOverlay.module.css";

export const DesktopOnlyOverlay = () => {
  const isDesktop = useIsDesktop();
  const shouldShow = isDesktop === false;

  return (
    <AnimatePresence>
      {shouldShow && (
        <MotionDiv
          className={styles.container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className={styles.message}>
            This experience is best to be viewed on desktop
          </p>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};
