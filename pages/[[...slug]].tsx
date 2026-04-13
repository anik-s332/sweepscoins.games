import dynamic from "next/dynamic";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSeoForPath, type SeoEntry } from "@/lib/seo";
import { getStrapiEndpoint, getStrapiHeaders, normalizeBlogDetailItem } from "@/lib/blogs";

const App = dynamic(() => import("@/App"), { ssr: false });

type CatchAllPageProps = {
  initialSeo: SeoEntry;
  initialPathname: string;
  initialSiteUrl: string;
};

type MetaDataPayload = {
  pageTitle: string;
  pageDescription: string;
  canonicalUrl: string;
  ogImage: string;
  ogType: "article" | "website";
};

const getDefaultSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_SITE === "STAGING" ? "https://scg.appristine.in" : "https://www.sweepscoins.cash");

const getCanonicalUrl = (siteUrl: string, pathname: string) => {
  return `${siteUrl}${pathname === "/" ? "/home" : pathname}`;
};

const ensureAbsoluteUrl = (siteUrl: string, value?: string) => {
  if (!value) {
    return `${siteUrl}/sweepcoinscash-01.png`;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

const getSocialImage = (siteUrl: string, value?: string) => {
  const absoluteImage = ensureAbsoluteUrl(siteUrl, value);
  const lowered = absoluteImage.toLowerCase();

  // Certain older crawlers might still struggle with SVG/AVIF, 
  // but modern platforms (Facebook, X, LinkedIn) support WebP.
  if (lowered.endsWith(".svg")) {
    return `${siteUrl}/sweepcoinscash-01.png`;
  }

  return absoluteImage;
};

const getPathnameFromSlug = (slug?: string[]) => {
  if (!slug || slug.length === 0) {
    return "/";
  }

  return `/${slug.join("/")}`;
};

const createMetaData = (siteUrl: string, pathname: string, seo: SeoEntry): MetaDataPayload => {
  return {
    pageTitle: seo.title,
    pageDescription: seo.description,
    canonicalUrl: getCanonicalUrl(siteUrl || getDefaultSiteUrl(), pathname),
    ogImage: getSocialImage(siteUrl || getDefaultSiteUrl(), seo.image),
    ogType: pathname.startsWith("/blogs/") ? "article" : "website",
  };
};

const resolveSiteUrlFromRequest = (context: Parameters<GetServerSideProps>[0]) => {
  const forwardedProto = context.req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string" ? forwardedProto : "https";
  const host = context.req.headers.host;

  if (host) {
    return `${protocol}://${host}`;
  }

  return getDefaultSiteUrl();
};

const getBlogSeo = async (siteUrl: string, documentId: string): Promise<SeoEntry | null> => {
  if (!documentId) {
    return null;
  }

  try {
    const response = await fetch(getStrapiEndpoint(`/api/articles/${documentId}`, { populate: "*" }), {
      headers: getStrapiHeaders(),
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
      image: getSocialImage(siteUrl, blog.image),
    };
  } catch (_error) {
    return null;
  }
};

export const getServerSideProps: GetServerSideProps<CatchAllPageProps> = async (context) => {
  const slug = Array.isArray(context.params?.slug) ? context.params?.slug : [];
  const pathname = getPathnameFromSlug(slug);
  const initialSiteUrl = resolveSiteUrlFromRequest(context);
  let initialSeo: SeoEntry = getSeoForPath(pathname);

  if (slug[0] === "blogs" && slug[1]) {
    const blogSeo = await getBlogSeo(initialSiteUrl, slug[1]);

    if (blogSeo) {
      initialSeo = blogSeo;
    }
  }

  return {
    props: {
      initialSeo,
      initialPathname: pathname,
      initialSiteUrl,
    },
  };
};

export default function CatchAllPage({ initialSeo, initialPathname, initialSiteUrl }: CatchAllPageProps) {
  const router = useRouter();
  const pathname = router.asPath ? router.asPath.split("?")[0] : initialPathname;
  const seo = initialSeo || getSeoForPath(pathname);
  const metadata = createMetaData(initialSiteUrl, pathname, seo);

  return (
    <>
      <Head>
        <title key="title">{metadata.pageTitle}</title>
        <meta key="description" name="description" content={metadata.pageDescription} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Sweeps Coins" />
        <meta key="og:type" property="og:type" content={metadata.ogType} />
        <meta key="og:title" property="og:title" content={metadata.pageTitle} />
        <meta key="og:description" property="og:description" content={metadata.pageDescription} />
        <meta key="og:url" property="og:url" content={metadata.canonicalUrl} />
        <meta key="og:image" property="og:image" content={metadata.ogImage} />
        <meta key="og:image:url" property="og:image:url" content={metadata.ogImage} />
        <meta key="og:image:secure_url" property="og:image:secure_url" content={metadata.ogImage} />
        <meta key="og:image:alt" property="og:image:alt" content={metadata.pageTitle} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content={metadata.pageTitle} />
        <meta key="twitter:description" name="twitter:description" content={metadata.pageDescription} />
        <meta key="twitter:image" name="twitter:image" content={metadata.ogImage} />
        <meta key="twitter:url" name="twitter:url" content={metadata.canonicalUrl} />
        <meta name="twitter:site" content="@sweepscoins" />
        <link key="canonical" rel="canonical" href={metadata.canonicalUrl} />
      </Head>
      <App />
    </>
  );
}
