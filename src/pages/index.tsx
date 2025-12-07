import type { GetServerSideProps } from "next";
import { fetchArchiveData } from "@/lib/stadsarchief";
import type { NextPage } from "next";
import type { ArchiveItem } from "@/types/data-types";
import {
  ImagePlane,
  FloatingCamera,
  HoverTooltip,
  CameraController,
  ArtworkTitle,
  ScrollCTA,
  StorySection,
  TimelineSection,
  HeroSection,
  AmsterdamHistorySection,
  YearDisplay,
  InteractiveTimeline,
  TimelineTransitionController,
} from "@/components/features";
import { Canvas } from "@react-three/fiber";
import { getYearFromMetaData } from "@/utils/getYearFromMetaData";
import { useArtworkStore, useShouldShowUI } from "@/stores";
import { useGeneratedStory } from "@/hooks";
import * as THREE from "three";
import { amsterdamHistoryContent } from "@/constants/amsterdamHistoryContent";
import { useRef, useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import {
  CAMERA_BASE_POSITION,
  CAMERA_GRID_POSITION,
  CAMERA_OPTIONS,
} from "@/constants/camera";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "@/components/features/MotionElements";
import { MapControls } from "@react-three/drei";
import { getGridPosition } from "@/utils/getGridPosition";
import { getSpherePosition } from "@/utils/getSpherePosition";

interface PageProps {
  archiveData: ArchiveItem[];
}

const Page: NextPage<PageProps> = ({ archiveData: initialArchiveData }) => {
  // Store state
  const clearActiveArtwork = useArtworkStore(
    (state) => state.clearActiveArtwork
  );
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const shouldShowUI = useShouldShowUI();
  const { generatedStory } = useGeneratedStory(activeArtwork);
  const hasStarted = useArtworkStore((state) => state.hasStarted);
  const hasCompletedHistorySection = useArtworkStore(
    (state) => state.hasCompletedHistorySection
  );

  const isTimelineTransitioning = useArtworkStore(
    (state) => state.isTimelineTransitioning
  );
  const timelineTransitionProgress = useArtworkStore(
    (state) => state.timelineTransitionProgress
  );
  const timelineYear = useArtworkStore((state) => state.timelineYear);

  // State for artworks (can be replaced during timeline transition)
  const [archiveData, setArchiveData] = useState(initialArchiveData);

  // Ref to track if we've already fetched for the current transition
  const hasFetchedForTransition = useRef(false);
  const lastTimelineYear = useRef<number | null>(null);

  // Track scroll progress from AmsterdamHistorySection
  const historySectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: historySectionRef,
    offset: ["start start", "end end"],
  });

  // Subscribe to scroll progress changes
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      setScrollProgress(progress);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Fetch artworks when timeline transition starts
  useEffect(() => {
    // Only fetch when transition starts (isTimelineTransitioning becomes true)
    // and we haven't fetched for this year yet
    if (
      isTimelineTransitioning &&
      timelineYear &&
      timelineYear !== lastTimelineYear.current &&
      !hasFetchedForTransition.current
    ) {
      hasFetchedForTransition.current = true;
      lastTimelineYear.current = timelineYear;

      // Fetch during transition to sphere
      const fetchArtworks = async () => {
        try {
          const response = await fetch("/api/fetch-by-year", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ year: timelineYear }),
          });
          const data = await response.json();

          const filteredData = data.filter((item: ArchiveItem) => {
            if (!item.asset || item.asset.length === 0) return false;
            if (!item.asset[0].thumb) return false;
            if (!item.asset[0].thumb.large) return false;
            return true;
          });

          // Replace artworks when fetched
          setTimeout(() => {
            setArchiveData(filteredData);
          }, 5000);
        } catch (error) {
          console.error("Error fetching artworks:", error);
        }
      };

      fetchArtworks();
    }

    // Reset fetch flag when transition ends
    if (!isTimelineTransitioning) {
      hasFetchedForTransition.current = false;
    }
  }, [isTimelineTransitioning, timelineYear]);

  // Interpolate between sphere and grid based on transition progress
  const getInterpolatedPosition = (index: number): THREE.Vector3Tuple => {
    const spherePos = getSpherePosition(index, archiveData.length);
    const gridPos = getGridPosition(index);

    // Use timeline transition progress if transitioning, otherwise use scroll progress
    let t: number;
    if (isTimelineTransitioning) {
      t = timelineTransitionProgress;
    } else {
      t = hasCompletedHistorySection ? 1 : scrollProgress;
    }

    return [
      THREE.MathUtils.lerp(spherePos[0], gridPos[0], t),
      THREE.MathUtils.lerp(spherePos[1], gridPos[1], t),
      THREE.MathUtils.lerp(spherePos[2], gridPos[2], t),
    ];
  };

  return (
    <>
      {/* Canvas - fixed when no artwork active, scrollable when artwork is active */}
      <div
        style={{
          position: activeArtwork ? "relative" : "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: activeArtwork ? 1 : 2,
        }}
      >
        {/* Horizontal line in the middle of the screen */}
        <AnimatePresence>
          {hasCompletedHistorySection && !activeArtwork && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InteractiveTimeline />
            </MotionDiv>
          )}
        </AnimatePresence>
        <HoverTooltip />
        <ArtworkTitle />
        <ScrollCTA />
        <Canvas
          camera={{
            position: hasCompletedHistorySection
              ? CAMERA_GRID_POSITION
              : CAMERA_BASE_POSITION,
          }}
          onPointerMissed={() => clearActiveArtwork()}
        >
          <FloatingCamera />
          <CameraController
            lerpSpeed={CAMERA_OPTIONS.lerpSpeed}
            zoomDistance={CAMERA_OPTIONS.zoomDistance}
            offset={CAMERA_OPTIONS.offset}
          />
          <TimelineTransitionController />
          {archiveData.map((item, index) => (
            <ImagePlane
              key={item.id}
              title={item.title}
              position={getInterpolatedPosition(index)}
              textureUrl={item.asset[0].thumb.large}
              width={item.asset[0].width}
              height={item.asset[0].height}
              artwork={item}
            />
          ))}

          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 0, 5]} color="red" />
          {
            hasCompletedHistorySection &&
              !activeArtwork &&
              !isTimelineTransitioning &&
              null
            // <MapControls enablePan={true} enableRotate={false} />
          }
        </Canvas>
      </div>

      {/* Content overlay - scrollable */}
      <AnimatePresence>
        {!hasCompletedHistorySection && (
          <MotionDiv
            ref={historySectionRef}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "relative",
              zIndex: 2,
              pointerEvents: "auto",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            {!hasStarted && <HeroSection />}
            {hasStarted && (
              <AmsterdamHistorySection content={amsterdamHistoryContent} />
            )}
          </MotionDiv>
        )}
      </AnimatePresence>
      {hasStarted && !hasCompletedHistorySection && (
        <YearDisplay
          content={amsterdamHistoryContent}
          scrollYProgress={scrollYProgress}
        />
      )}
      {shouldShowUI && activeArtwork && generatedStory && (
        <>
          <StorySection content={generatedStory} />
          {/* <TimelineSection /> */}
        </>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch data
    const data = await fetchArchiveData({
      page: 1,
      rows: 100,
      lang: "nl",
      sort: "asc",
    });

    const processedData = data.media.map((item) => {
      // Find metadata item with dc_date key
      const dateMetadata =
        item.metadata?.find((meta) => meta.field === "dc_date")?.value || "";
      return {
        ...item,
        // Additional processing can be done here
        year: getYearFromMetaData(dateMetadata as string | string[]),
      };
    });

    // Filter out items without valid thumbnails and assets
    const archiveData = processedData.filter((item) => {
      if (!item.asset || item.asset.length === 0) return false;

      if (!item.asset[0].thumb) return false;

      if (!item.asset[0].thumb.large) return false;

      return true;
    });

    return {
      props: {
        archiveData,
        seo: {
          title: "RE:telling of the city of Amsterdam",
          description:
            "An archive project about the city of Amsterdam. Trying to push history to a broader audience.",
          keywords:
            "Amsterdam archive, Amsterdam history, Stadsarchief Amsterdam, historical Amsterdam, Amsterdam heritage, Amsterdam photography, Amsterdam archives, Dutch history, Amsterdam city archive, historical documents Amsterdam, Amsterdam cultural heritage, Amsterdam visual archive, Amsterdam historical images, Amsterdam memory, Amsterdam storytelling",
          openGraph: {
            type: "website",
            locale: "nl_NL",
            site_name: "RE:telling of the city of Amsterdam",
          },
        },
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default Page;
