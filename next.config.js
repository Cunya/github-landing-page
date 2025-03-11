/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/GitHubLandingPage',
  assetPrefix: '/GitHubLandingPage',
}

module.exports = nextConfig 