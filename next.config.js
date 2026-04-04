const webpack = require("webpack");

const getRemotePattern = (rawUrl) => {
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(rawUrl);

    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || "",
      pathname: `${url.pathname.replace(/\/$/, "") || ""}/**`,
    };
  } catch {
    return null;
  }
};

const imageRemotePatterns = [
  process.env.NEXT_PUBLIC_BASE_URL,
  process.env.NEXT_PUBLIC_STRAPI_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_CHECK_LOCATION_BASE_URL,
].map(getRemotePattern).filter(Boolean);

imageRemotePatterns.push({
  protocol: "https",
  hostname: "nwchat.s3.amazonaws.com",
  port: "",
  pathname: "/**",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["react-bootstrap"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: imageRemotePatterns,
  },
  async rewrites() {
    const locateBaseUrl =
      process.env.NEXT_PUBLIC_CHECK_LOCATION_BASE_URL?.trim().replace(/\/+$/, "");

    if (!locateBaseUrl) {
      return [];
    }

    return [
      {
        source: "/api/assure-locate",
        destination: `${locateBaseUrl}/assure-locate`,
      },
      {
        source: "/api/assure-locate/:path*",
        destination: `${locateBaseUrl}/assure-locate/:path*`,
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid flaky filesystem cache writes that have been corrupting `.next` in local dev.
      config.cache = false;
    }

    config.module.rules.push({
      test: /\.(wav|mp3|ogg)$/i,
      type: "asset/resource",
    });

    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      url: require.resolve("url"),
      events: require.resolve("events"),
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser"),
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    );

    return config;
  },
};

module.exports = nextConfig;
