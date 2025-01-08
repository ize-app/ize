import * as Sentry from "@sentry/node";
import { GraphQLError } from "graphql";
import { ExclusiveEventHintOrCaptureContext } from "@sentry/core/build/types/utils/prepareEvent";

export const logResolverError = ({
  error,
  sentryOptions,
}: {
  error: unknown;
  sentryOptions?: ExclusiveEventHintOrCaptureContext;
}): never => {
  if (error instanceof Error) {
    // Log unexpected errors to Sentry
    Sentry.captureException(error, sentryOptions);
  }

  if (error instanceof GraphQLError) {
    // Rethrow the original GraphQLError
    throw error;
  } else {
    // Transform unexpected errors into a client-safe GraphQLError
    throw new GraphQLError("An unexpected error occurred. Please try again later.", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
