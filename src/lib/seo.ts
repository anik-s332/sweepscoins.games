import siteContent from "@/content/siteContent.json";

export type SeoEntry = {
  title: string;
  description: string;
};

const DEFAULT_SEO: SeoEntry = {
  title: "Sweeps Coins | Sweepstakes Games, Credits, and Secure Checkout",
  description:
    "Explore Sweeps Coins sweepstakes gameplay, package offers, player tools, and secure checkout flows in one streamlined experience.",
};

const SEO_MAP = siteContent.shared.seo as Record<string, SeoEntry>;

export const getSeoForPath = (pathname: string): SeoEntry => {
  if (pathname.startsWith("/reset-password")) {
    return SEO_MAP["/reset-password"] || DEFAULT_SEO;
  }

  if (pathname.startsWith("/free-credit")) {
    return SEO_MAP["/free-credit"] || DEFAULT_SEO;
  }

  if (pathname.startsWith("/checkout-package-tierlock")) {
    return SEO_MAP["/checkout-package-tierlock"] || DEFAULT_SEO;
  }

  if (pathname.startsWith("/checkout-package")) {
    return SEO_MAP["/checkout-package"] || DEFAULT_SEO;
  }

  return SEO_MAP[pathname] || DEFAULT_SEO;
};
