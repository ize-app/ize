const localProdBuildUrl = "http://127.0.0.1:3000";
const prodRenderUrl = process.env.PROD_RENDER_URL ?? "https://ize.onrender.com";
export const localUrl = process.env.LOCAL_URL ?? "http://127.0.0.1";
export const prodUrl = process.env.PROD_URL ?? "https://ize.space";

export const validOrigins = [localProdBuildUrl, prodUrl, prodRenderUrl, localUrl];
