import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    url:process.env.mainurl,
    producturl:`${process.env.mainurl}/api/product-types`,
    locationurl:`${process.env.mainurl}/api/locations`,
    vendorurl:`${process.env.mainurl}/api/vendors`,
    statusurl:`${process.env.mainurl}/api/status`,
  },
};

export default nextConfig;
