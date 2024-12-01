import config from "@/config";
import { fullUUIDToShort } from "@/utils/uuid";

export const createRequestUrl = ({ requestId }: { requestId: string }) => {
  const baseIzeUrl = config.isDev ? config.LOCAL_URL : config.PROD_URL;

  return `${baseIzeUrl}/requests/${fullUUIDToShort(requestId)}`;
};
