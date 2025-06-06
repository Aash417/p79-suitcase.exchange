/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer';
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const withAnalyzer = withBundleAnalyzer({
   enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
   reactStrictMode: true,
   webpack: (config, { isServer }) => {
      if (isServer) {
         config.plugins = [...config.plugins, new PrismaPlugin()];
      }
      return config;
   }
};

export default withAnalyzer(nextConfig);
