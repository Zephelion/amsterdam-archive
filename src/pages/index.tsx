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
} from "@/components/features";
import { Canvas } from "@react-three/fiber";
import { getYearFromMetaData } from "@/utils/getYearFromMetaData";
import { useArtworkStore, useShouldShowUI } from "@/stores";
import { useGeneratedStory } from "@/hooks";
import * as THREE from "three";
import { amsterdamHistoryContent } from "@/constants/amsterdamHistoryContent";
// import styles from "@/styles/Home.module.css";

interface PageProps {
  archiveData: ArchiveItem[];
}

const CAMERA_OPTIONS = {
  lerpSpeed: 0.02,
  zoomDistance: 3.5,
  offset: [0, 0, 0] as THREE.Vector3Tuple,
};

const Page: NextPage<PageProps> = ({ archiveData }) => {
  const clearActiveArtwork = useArtworkStore(
    (state) => state.clearActiveArtwork
  );
  const activeArtwork = useArtworkStore((state) => state.activeArtwork);
  const shouldShowUI = useShouldShowUI();
  const { generatedStory } = useGeneratedStory(activeArtwork as ArchiveItem);
  const hasStarted = useArtworkStore((state) => state.hasStarted);

  // Grid configuration
  const GRID_SIZE = 10;
  const SPACING = 6;

  // Calculate grid position for each item
  const getGridPosition = (index: number): [number, number, number] => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    // Center the grid around origin (0,0,0)
    const offsetX = ((GRID_SIZE - 1) * SPACING) / 2;
    const offsetY = ((GRID_SIZE - 1) * SPACING) / 2;

    const isEvenInRow = col % 2 === 1;
    const yOffset = isEvenInRow ? -1.5 : 0;

    return [
      col * SPACING - offsetX, // x position
      row * SPACING - offsetY + yOffset, // y position
      0, // z position
    ];
  };

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        {!hasStarted && <HeroSection />}
        {hasStarted && (
          <AmsterdamHistorySection content={amsterdamHistoryContent} />
        )}
        {/* <HoverTooltip />
        <ArtworkTitle />
        <ScrollCTA />
        <Canvas
          camera={{ position: [0, 0, 12.5] }}
          onPointerMissed={() => clearActiveArtwork()}
        >
          <FloatingCamera />
          <CameraController
            lerpSpeed={CAMERA_OPTIONS.lerpSpeed}
            zoomDistance={CAMERA_OPTIONS.zoomDistance}
            offset={CAMERA_OPTIONS.offset}
          />
          {archiveData.map((item, index) => (
            <ImagePlane
              key={item.id}
              title={item.title}
              position={getGridPosition(index)}
              textureUrl={item.asset[0].thumb.large}
              width={item.asset[0].width}
              height={item.asset[0].height}
              artwork={item}
            />
          ))}

          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 0, 5]} color="red" />
        </Canvas> */}
      </div>

      {/* {shouldShowUI && activeArtwork && generatedStory && (
        <>
          <StorySection content={generatedStory} />
          <TimelineSection />
        </>
      )} */}
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
          keywords: "Amsterdam, archive, history",
          openGraph: {
            type: "website",
            locale: "en_IE",
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
