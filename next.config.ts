import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.github.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-tabs',
      '@radix-ui/react-slot',
    ],
  },

  // Webpack configuration for Solana dependencies
  webpack: (config: any, { webpack }: { isServer: boolean; webpack: any }) => {
    // Handle Node.js modules in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: 'assert',
      os: false,
      path: false,
      buffer: 'buffer',
      events: 'events',
    };

    // Handle rpc-websockets module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'rpc-websockets/dist/lib/client':
        'rpc-websockets/dist/lib/client/websocket.browser.cjs',
      'rpc-websockets/dist/lib/client/websocket':
        'rpc-websockets/dist/lib/client/websocket.browser.cjs',
    };

    // Provide plugins for polyfills
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    );

    // Bundle analyzer (conditionally enabled)
    if (process.env.ANALYZE === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const BundleAnalyzerPlugin = require('@next/bundle-analyzer')({
        enabled: true,
      });
      config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
  },
};

export default nextConfig;
