/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['@repo/shared'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'production'
            ? 'http://api:3001/api/:path*'
            : 'http://localhost:3001/api/:path*',
      },
      {
        source: '/images/:path*',
        destination:
          process.env.NODE_ENV === 'production'
            ? 'http://api:3001/images/:path*'
            : 'http://localhost:3001/images/:path*',
      },
    ];
  },
};
