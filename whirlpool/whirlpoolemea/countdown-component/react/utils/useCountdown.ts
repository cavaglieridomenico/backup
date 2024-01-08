import { useState, useEffect } from "react";

const useCountdown = (date: string) => {
  const endDate = new Date(date).getTime();

  const [timeLeft, setTimeLeft] = useState<number>(
    endDate - new Date().getTime() || 0
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (date) {
      const interval = setInterval(() => {
        isLoading && setIsLoading(false);
        const now = new Date().getTime();
        if (endDate - now <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
          return;
        }
        setTimeLeft(endDate - now);
      }, 1000);

      return () => clearInterval(interval);
    }
    return;
  }, [date]);

  useEffect(() => {
    if (timeLeft == 0) setIsFinished(true);
  }, [timeLeft]);

  return { ...formatCountdown(timeLeft), isLoading, isFinished };
};

const formatCountdown = (milliseconds: number) => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const daysLeft = Math.floor(milliseconds / day);
  const hoursLeft = Math.floor((milliseconds % day) / hour);
  const minutesLeft = Math.floor((milliseconds % hour) / minute);
  const secondsLeft = Math.floor((milliseconds % minute) / second);

  return {
    daysLeft,
    hoursLeft,
    minutesLeft,
    secondsLeft,
  };
};

export default useCountdown;
