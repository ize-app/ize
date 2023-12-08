import { Request } from "frontend/src/graphql/generated/graphql";

const callWebhook = async ({ uri, payload }: { uri: string; payload: Request }) => {
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return true;
  } catch (e) {
    console.log("Call webhook action error: ", e);
    return false;
  }
};

export default callWebhook;
