/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true,
      bodySizeLimit: '2mb'
    },
    turbo: {
      // Configure Turbopack here
      resolveAlias: {
        // Example: map module paths
        '@/utils': './src/utils',
      },
    },
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Reduce build output
  output: 'standalone',
  // Disable unnecessary logs
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.infrastructureLogging = {
        level: 'error',
      }
    }
    return config
  },
};

module.exports = nextConfig;
