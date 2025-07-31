import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    url:`http://10.11.52.59:5000`,
    producturl:'http://10.11.52.59:5000/api/product-types',
    locationurl:'http://10.11.52.59:5000/api/locations',
    vendorurl:'http://10.11.52.59:5000/api/vendors',
    statusurl:'http://10.11.52.59:5000/api/status',
  },
};

export default nextConfig;
