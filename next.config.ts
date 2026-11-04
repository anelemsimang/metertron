import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["postgres", "exceljs"],
  async redirects() {
    return [
      {
        source: "/blog/offline-field-capture-south-africa",
        destination: "/blog/offline-data-capture-low-signal",
        permanent: true,
      },
      {
        source: "/blog/paper-vs-digital-meter-cards",
        destination: "/blog/paper-job-cards-vs-digital-capture-cost",
        permanent: true,
      },
      {
        source: "/features",
        destination: "/product",
        permanent: true,
      },
      {
        source: "/solutions",
        destination: "/solutions/meter-installation-contractors",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
