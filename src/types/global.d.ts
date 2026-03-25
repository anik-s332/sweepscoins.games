import type { AxiosInstance } from "axios";

declare global {
  interface Window {
    axios: AxiosInstance;
    myGlobalFunction?: (state?: string) => void;
    CallGooglePayment?: () => void;
    SaveTokenAPI?: (payload?: unknown) => void;
  }
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.wav" {
  const src: string;
  export default src;
}

declare module "*.woff" {
  const src: string;
  export default src;
}

declare module "*.woff2" {
  const src: string;
  export default src;
}

export {};
