/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/automate' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/automate' : '',
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig 