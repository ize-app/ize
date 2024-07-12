import { retryActions } from "./core/action/retryActions";
import { handleExpiredResults } from "./core/request/handleExpiredRequests";
import { retryNewResults } from "./core/result/newResults/retryNewResults";

const cron = async () => {
  await handleExpiredResults();
  await retryNewResults();
  await retryActions();
};

cron();
