const baseDelay = 8000;
// const maxDelay = 60000; // 1 minute

export const calculateBackoffMs = (retryAttempts: number): number => {
  //   const delay = Math.min(baseDelay * Math.pow(2, retryAttempts), maxDelay);
  const delay = baseDelay * Math.pow(2, retryAttempts);
  const jitter = Math.random() * 500; // Add jitter between 0 and 500 ms so that not all requests are sent at the same time
  return delay + jitter;
};
