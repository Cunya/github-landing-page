/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/github-landing-page' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/github-landing-page' : '',
}

module.exports = nextConfig 