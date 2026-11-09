/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/not-ortalamasi-hesaplama", destination: "/not-ortalamasi-gano-hesaplama", statusCode: 301 },
      { source: "/ders-ortalamasi-hesaplama", destination: "/not-ortalamasi-gano-hesaplama", statusCode: 301 },
      { source: "/maas-zam-hesaplama", destination: "/maas-zam-artis-hesaplama", statusCode: 301 },
      { source: "/maas-artis-hesaplama", destination: "/maas-zam-artis-hesaplama", statusCode: 301 }
    ];
  }
};

export default nextConfig;
