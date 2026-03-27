import dynamic from "next/dynamic";
import Head from "next/head";
import { getSeoForPath, type SeoEntry } from "@/lib/seo";

const App = dynamic(() => import("@/App"), { ssr: false });

type CatchAllPageProps = {
  pathname: string;
  seo: SeoEntry;
  canonicalUrl: string;
};

type PackageApiItem = {
  id?: number | string;
  name?: string;
  description?: string;
  price?: number | string;
  tierlock_fee?: number | string;
  package_image_path?: string | null;
  sweep_coins?: number | string;
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

const toAbsoluteUrl = (value?: string | null) => {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${getSiteUrl()}${value.startsWith("/") ? value : `/${value}`}`;
};

const formatCurrency = (value?: number | string) => {
  const amount = Number(value || 0);

  if (!Number.isFinite(amount)) {
    return "$0";
  }

  return `$${amount.toLocaleString()}`;
};

const buildCheckoutPackageSeo = (product: PackageApiItem): SeoEntry => {
  const priceText = formatCurrency(product?.price);
  const feeAmount = Number(product?.tierlock_fee || 0);
  const totalAmount = Number(product?.price || 0) + feeAmount;
  const creditsText = product?.sweep_coins
    ? ` Includes ${Number(product.sweep_coins).toLocaleString()} credits.`
    : "";
  const fallbackDescription =
    "Complete your Sweeps Coins package checkout with secure payment options, billing details, and order confirmation tools.";

  return {
    title: `${product?.name || "Package"} Checkout | ${priceText} | Sweeps Coins`,
    description:
      product?.description?.trim() ||
      `Buy ${product?.name || "your selected package"} for ${priceText}. Total checkout amount is ${formatCurrency(totalAmount)}.${creditsText} Secure payment and fast order confirmation on Sweeps Coins.`,
    image: toAbsoluteUrl(product?.package_image_path) || `${getSiteUrl()}/sweepcoinscash-01.png`,
  };
};

const getCheckoutPackageSeo = async (pathname: string): Promise<SeoEntry | null> => {
  const match = pathname.match(/^\/checkout-package\/([^/?#]+)/);

  if (!match?.[1]) {
    return null;
  }

  const productId = match[1];
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!apiBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${apiBaseUrl}product/list/5000/1`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const products = Array.isArray(data?.data) ? data.data : [];
    const product = products.find((item: PackageApiItem) => String(item?.id) === String(productId));

    if (!product) {
      return null;
    }

    return buildCheckoutPackageSeo(product);
  } catch (error) {
    return null;
  }
};

export async function getServerSideProps(context: { resolvedUrl?: string }) {
  const pathname = context?.resolvedUrl?.split("?")[0] || "/";
  const fallbackSeo = getSeoForPath(pathname);
  const dynamicSeo = pathname.startsWith("/checkout-package")
    ? await getCheckoutPackageSeo(pathname)
    : null;

  return {
    props: {
      pathname,
      canonicalUrl: getCanonicalUrl(pathname),
      seo: dynamicSeo || fallbackSeo,
    },
  };
}

export default function CatchAllPage({ seo, canonicalUrl }: CatchAllPageProps) {
  const ogImage = seo.image || `${getSiteUrl()}/sweepcoinscash-01.png`;

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
        <meta property="og:image:alt" content={seo.title} />
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
