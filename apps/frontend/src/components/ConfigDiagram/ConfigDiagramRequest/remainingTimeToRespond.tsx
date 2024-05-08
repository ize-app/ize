// returns number of milliseconds left to respond to a request
export const remainingTimeToRespond = ({ expirationDate }: { expirationDate: Date }): number => {
  const now = new Date();
  const timeLeft = expirationDate.getTime() - now.getTime();
  return timeLeft;
};
