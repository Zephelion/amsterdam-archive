import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { BaseLayout } from "@/layouts/BaseLayout";
import ReactLenis from "lenis/react";
import { generateDefaultSeo } from "next-seo/pages";
import Head from "next/head";
import { ScrollController, DesktopOnlyOverlay } from "@/components/features";

export default function App({ Component: Page, pageProps }: AppProps) {
  return (
    <>
      <ScrollController />
      <ReactLenis root autoRaf>
        <Head>{generateDefaultSeo(pageProps.seo ?? {})}</Head>
        <BaseLayout>
          <Page {...pageProps} />
        </BaseLayout>
      </ReactLenis>
      <DesktopOnlyOverlay />
    </>
  );
}
