import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSeoForPath } from "@/lib/seo";

const App = dynamic(() => import("@/App"), { ssr: false });

const getCanonicalUrl = (pathname: string) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_SITE === "STAGING"
      ? "https://scc.appristine.in"
      : "https://www.sweepscoins.cash");

  return `${siteUrl}${pathname === "/" ? "/home" : pathname}`;
};

export default function CatchAllPage() {
  const router = useRouter();
  const pathname = router.asPath ? router.asPath.split("?")[0] : "/";
  const seo = getSeoForPath(pathname);
  const canonicalUrl = getCanonicalUrl(pathname);
  const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.sweepscoins.cash"}/sweepcoinscash-01.png`;

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <App />
    </>
  );
}
