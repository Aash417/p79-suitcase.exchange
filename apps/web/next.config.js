/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
   enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
   reactStrictMode: true
   // Optional: add any Next.js config here
};

export default withAnalyzer(nextConfig);
