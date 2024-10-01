import { localUrl, prodUrl } from "@/express/origins";

export const createRequestUrl = ({ requestId }: { requestId: string }) => {
  const isDev = process.env.MODE === "development";
  const baseIzeUrl = isDev ? localUrl : prodUrl;

  return `${baseIzeUrl}/requests/${requestId}`;
};
