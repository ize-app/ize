import { useEffect } from "react";
import * as ReactGA from "react-ga";
import { useLocation } from "react-router-dom";

const usePageTracking = () => {
  const location = useLocation();
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;
  const path = location.pathname + location.search;

  useEffect(() => {
    if (trackingId && import.meta.env.MODE === "production") ReactGA.pageview(path);
  }, [path, trackingId]);
};

export default usePageTracking;
