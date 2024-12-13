import { getIzeUrl } from "@/utils/getUrl";
import { fullUUIDToShort } from "@/utils/uuid";

export const createRequestUrl = ({ requestId }: { requestId: string }) => {
  const baseIzeUrl = getIzeUrl();

  return `${baseIzeUrl}/requests/${fullUUIDToShort(requestId)}`;
};
