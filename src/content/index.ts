import siteContent from "./siteContent.json";
import imageManifest from "./imageManifest.json";

export const content = siteContent;
export const images = imageManifest;
export const getPageTitle = (pathname: string) =>
  siteContent.shared.titles[pathname as keyof typeof siteContent.shared.titles] || null;
