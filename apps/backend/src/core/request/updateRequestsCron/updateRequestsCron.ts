import * as Sentry from "@sentry/node";

import { handleExpiredResults } from "./handleExpiredRequests";
import { retryActions } from "./retryActions";
import { retryNewResults } from "./retryNewResults";

const intervalTime = 2 * 60 * 1000; // 2 minutes
let isRunning: boolean = false;

const updateRequestsCron = async () => {
  await handleExpiredResults();
  await retryNewResults();
  await retryActions();
};

export const startUpdateRequestsCron = () => {
  console.log("Starting updateRequestsCron...");
  setInterval(() => {
    if (isRunning) {
      console.log("Previous cron task still running, skipping this interval.");
      return;
    }

    isRunning = true;

    try {
      console.log("Executing updateRequestsCron...");
      updateRequestsCron();
    } catch (error) {
      Sentry.captureException(error, {
        tags: { location: "cron-request" },
      });
    } finally {
      isRunning = false;
    }
  }, intervalTime);
};
