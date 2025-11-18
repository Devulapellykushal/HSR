/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use domains array for simpler configuration (allows any path on these domains)
    domains: [
      'images.unsplash.com',
      'readdy.ai',
      'example.com',
      'localhost', // For local development - Django backend
      // Add more domains as needed when you encounter them
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
    ],
  },
};

export default nextConfig;

