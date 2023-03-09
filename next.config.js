const dedicatedEndPoint = 'https://crypto-lens-nft-marketplace.infura-ipfs.io';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [dedicatedEndPoint, 'crypto-lens-nft-marketplace.infura-ipfs.io'],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, module: false, console: false, child_process: false, async_hooks: false, 'stream/web': false, 'util/types': false, perf_hooks: false, worker_threads: false };
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
    });

    return config;
  },
};

module.exports = nextConfig;
