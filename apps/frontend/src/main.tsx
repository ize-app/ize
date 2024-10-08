import * as Sentry from "@sentry/react";
import * as React from "react";
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga4";

import App from "./App.tsx";

const trackingId = import.meta.env.VITE_GA_TRACKING_ID as string;

Sentry.init({
  dsn: "https://0dac8443b72a1921992ef6e00fffba0b@o4507419891204096.ingest.us.sentry.io/4507419911127040",
  environment: import.meta.env.MODE,
  // turning off in dev to reduce sentry bill
  enabled: import.meta.env.MODE === "production",
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/ize\.space/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

if (import.meta.env.MODE === "production" && trackingId) {
  ReactGA.initialize(trackingId);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
