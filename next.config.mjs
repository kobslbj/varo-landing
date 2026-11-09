/** @type {import('next').NextConfig} */
const nextConfig = {
  // Web beta upload signs in from the browser. The publishable key is public
  // by design; this reuses the server's variables instead of a second pair.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  },
  experimental: {
    // Routes live under app/[lang], so unmatched URLs need a layout-free 404.
    globalNotFound: true,
  },
};

export default nextConfig;
