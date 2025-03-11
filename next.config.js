/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/github-landing-page',
  assetPrefix: '/github-landing-page',
}

module.exports = nextConfig 