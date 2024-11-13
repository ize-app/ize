import config from "@/config";

export const validOrigins = [
  config.localProdBuildUrl,
  config.PROD_URL,
  config.PROD_RENDER_URL,
  config.LOCAL_URL,
];
