// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// // module.exports = nextConfig
// module.exports = {
//   async redirects() {
//     return [
//       {
//         source: "/",
//         destination: "/home",
//         permanent: true,
//       },
//     ];
//   },
//   nextConfig,
// };
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
