const localProdBuildUrl = "http://localhost:3000";
const prodRenderUrl = process.env.PROD_RENDER_URL ?? "https://ize.onrender.com";
export const localUrl = process.env.LOCAL_URL ?? "http://localhost:5173";
export const prodUrl = process.env.PROD_URL ?? "https://ize.space";

export const validOrigins = [localProdBuildUrl, prodUrl, prodRenderUrl, localUrl];
