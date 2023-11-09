import { Request } from "frontend/src/graphql/generated/graphql";

const callWebhook = async ({
  uri,
  payload,
}: {
  uri: string;
  payload: Request;
}) => {
  const response = await fetch(uri, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export default callWebhook;
