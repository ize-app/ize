import { handleExpiredResults } from "./handleExpiredRequests";
import { retryActions } from "./retryActions";
import { retryNewResults } from "./retryNewResults";

const cron = async () => {
  await handleExpiredResults();
  await retryNewResults();
  await retryActions();
};

cron();
