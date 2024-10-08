import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";

const usePageTracking = () => {
  const location = useLocation();
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID as string;
  const path = location.pathname + location.search;

  useEffect(() => {
    if (trackingId && import.meta.env.MODE === "production") {
      // This is janky as hell but react-helmet-async doesn't change at same time as page change
      // so I'm creating a slight delay here to ensure the title is correct
      // TODO: make this not embarassing
      window.setTimeout(() => {
        ReactGA.send({ hitType: "pageview", page: path, title: document.title });
      }, 20);
    }

    ReactGA.send({ hitType: "pageview", page: path }); // TODO: add title
  }, [path, trackingId]);
};

export default usePageTracking;
