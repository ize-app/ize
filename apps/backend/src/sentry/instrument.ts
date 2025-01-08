import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { GraphQLError } from "graphql";

import config from "@/config";
import { CustomErrorCodes } from "@/graphql/errors";

Sentry.init({
  dsn: "https://1da48481b9f7b55c948c8c3eea612a96@o4507419891204096.ingest.us.sentry.io/4507420178448384",
  environment: config.MODE,
  enabled: config.MODE === "production",
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Check if the error is a GraphQL error
    const error = hint?.originalException;
    if (error instanceof GraphQLError) {
      // const extensions = (error as any).extensions;
      if (error.extensions?.code === CustomErrorCodes.Unauthenticated) {
        return null; // Drop this event
      }
    }

    // Let other events be sent
    return event;
  },
});
