const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  webpack: (config) => {
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
