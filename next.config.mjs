/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Routes live under app/[lang], so unmatched URLs need a layout-free 404.
    globalNotFound: true,
  },
};

export default nextConfig;
