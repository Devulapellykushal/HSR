/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  
  // Image optimization configuration
  images: {
    // Helper to safely get API hostname
    ...(function() {
      let apiHostname = 'localhost';
      try {
        if (process.env.NEXT_PUBLIC_API_BASE_URL) {
          apiHostname = new URL(process.env.NEXT_PUBLIC_API_BASE_URL).hostname;
        }
      } catch (e) {
        // Invalid URL, use localhost fallback
      }
      
      let apiRemotePatterns = [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'localhost',
          port: '8000',
          pathname: '/**',
        },
      ];
      
      try {
        if (process.env.NEXT_PUBLIC_API_BASE_URL) {
          const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
          apiRemotePatterns = [{
            protocol: apiUrl.protocol.slice(0, -1),
            hostname: apiUrl.hostname,
            port: apiUrl.port || '',
            pathname: '/**',
          }];
        }
      } catch (e) {
        // Invalid URL, use localhost fallback
      }
      
      return {
        // Use domains array for simpler configuration (allows any path on these domains)
        domains: [
          'images.unsplash.com',
          'readdy.ai',
          'example.com',
          apiHostname,
        ],
        // Also use remotePatterns for more control (protocol, port, pathname)
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'readdy.ai',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'example.com',
            port: '',
            pathname: '/**',
          },
          ...apiRemotePatterns,
        ],
      };
    })(),
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },

  // Output configuration for static export (if needed)
  // output: 'standalone', // Uncomment if using standalone build
};

export default nextConfig;

