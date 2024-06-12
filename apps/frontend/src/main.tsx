import * as React from "react";
import { createRoot } from "react-dom/client";
import * as ReactGA from "react-ga";

import App from "./App.tsx";

const trackingId = import.meta.env.VITE_GA_TRACKING_ID;

if (import.meta.env.MODE === "production" && trackingId) {
  ReactGA.initialize(trackingId);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
