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

const normalizePathname = (pathname: string) => {
  if (!pathname) {
    return "/";
  }

  const cleanedPath = pathname.split("?")[0].split("#")[0] || "/";
  return cleanedPath === "" ? "/" : cleanedPath;
};

const ROUTE_PREFIX_MAP: Array<[string, string]> = [
  ["/reset-password", "/reset-password"],
  ["/free-credit", "/free-credit"],
  ["/checkout-package-tierlock", "/checkout-package-tierlock"],
  ["/checkout-package", "/checkout-package"],
  ["/locate-check", "/locate-check"],
  ["/user-data-deletion", "/user-data-deletion"],
  ["/privacy-policy", "/privacy-policy"],
  ["/responsible-game-play", "/responsible-game-play"],
  ["/terms-and-conditions", "/terms-and-conditions"],
  ["/promotional-rules", "/promotional-rules"],
  ["/contact", "/contact"],
  ["/my-account", "/my-account"],
  ["/packages", "/packages"],
  ["/home", "/home"],
  ["/", "/"],
];

export const getSeoForPath = (pathname: string): SeoEntry => {
  const normalizedPathname = normalizePathname(pathname);

  const matchedRoute = ROUTE_PREFIX_MAP.find(([routePrefix]) =>
    routePrefix === "/"
      ? normalizedPathname === "/"
      : normalizedPathname === routePrefix || normalizedPathname.startsWith(`${routePrefix}/`),
  );

  if (matchedRoute) {
    const [, seoKey] = matchedRoute;
    return SEO_MAP[seoKey] || DEFAULT_SEO;
  }

  return SEO_MAP[normalizedPathname] || DEFAULT_SEO;
};
