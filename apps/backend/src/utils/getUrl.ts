import config from "@/config";

export const getIzeUrl = () => (config.isDev ? config.LOCAL_URL : config.PROD_URL);
