import dynamic from "next/dynamic";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSeoForPath, type SeoEntry } from "@/lib/seo";
import { normalizeBlogDetailItem } from "@/lib/blogs";

const App = dynamic(() => import("@/App"), { ssr: false });

type CatchAllPageProps = {
  initialSeo: SeoEntry;
};

const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_SITE === "STAGING"
    ? "https://scc.appristine.in"
    : "https://www.sweepscoins.cash");

const getCanonicalUrl = (pathname: string) => {
  const siteUrl = getSiteUrl();
  return `${siteUrl}${pathname === "/" ? "/home" : pathname}`;
};

const ensureAbsoluteUrl = (value?: string) => {
  if (!value) {
    return `${getSiteUrl()}/sweepcoinscash-01.png`;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${getSiteUrl()}${value.startsWith("/") ? value : `/${value}`}`;
};

const getPathnameFromSlug = (slug?: string[]) => {
  if (!slug || slug.length === 0) {
    return "/";
  }

  return `/${slug.join("/")}`;
};

const getBlogSeo = async (documentId: string): Promise<SeoEntry | null> => {
  const strapiUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(/\/$/, "");
  const token = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";

  if (!strapiUrl || !documentId) {
    return null;
  }

  try {
    const response = await fetch(`${strapiUrl}/api/blogs/${documentId}?populate=*`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    const blog = normalizeBlogDetailItem(result?.data);

    if (!blog) {
      return null;
    }

    return {
      title: `${blog.title} | Sweeps Coins`,
      description:
        blog.excerpt ||
        "Read the latest Sweeps Coins blog article, insights, and featured updates.",
      image: ensureAbsoluteUrl(blog.image),
    };
  } catch (_error) {
    return null;
  }
};

export const getServerSideProps: GetServerSideProps<CatchAllPageProps> = async (context) => {
  const slug = Array.isArray(context.params?.slug) ? context.params?.slug : [];
  const pathname = getPathnameFromSlug(slug);
  let initialSeo: SeoEntry = getSeoForPath(pathname);

  if (slug[0] === "blogs" && slug[1]) {
    const blogSeo = await getBlogSeo(slug[1]);

    if (blogSeo) {
      initialSeo = blogSeo;
    }
  }

  return {
    props: {
      initialSeo,
    },
  };
};

export default function CatchAllPage({ initialSeo }: CatchAllPageProps) {
  const router = useRouter();
  const pathname = router.asPath ? router.asPath.split("?")[0] : "/";
  const seo = initialSeo || getSeoForPath(pathname);
  const canonicalUrl = getCanonicalUrl(pathname);
  const ogImage = ensureAbsoluteUrl(seo.image);
  const ogType = pathname.startsWith("/blogs/") ? "article" : "website";

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:type" content={ogType} />
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
