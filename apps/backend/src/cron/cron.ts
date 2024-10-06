import { prisma } from "@/prisma/client";

import { handleExpiredResults } from "./handleExpiredRequests";
import { retryActions } from "./retryActions";
import { retryNewResults } from "./retryNewResults";

const cron = async () => {
  await handleExpiredResults();
  await retryNewResults();
  await retryActions();
};

cron()
  .catch((e) => console.log("Error in cron: ", e))
  .finally(async () => {
    await prisma.$disconnect();
    // TODO: check if it makes sense to exit process in catch block
    process.exit(0);
  });
