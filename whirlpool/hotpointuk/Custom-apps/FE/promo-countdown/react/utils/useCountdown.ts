import {useState, useEffect} from "react";

const useCountdown = (date: any) => {

  const endDate = new Date(date).getTime();
  const now = convertSummerTimeshift(new Date());

  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (endDate - now <= 0) {
      setTimeLeft(0);
      return;
    }
    if (date) {
      setTimeLeft(endDate - now)
      const interval = setInterval(() => {
        setTimeLeft((timeLeft: number) => timeLeft - 1000)
      }, 1000);

      return () => clearInterval(interval);
    }
    return;
  }, [date])

  return formatCountdown(timeLeft);
}

const formatCountdown = (milliseconds: number) => {

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const daysLeft = Math.floor(milliseconds / day);
  const hoursLeft = Math.floor((milliseconds % day) / hour);
  const minutesLeft = Math.floor((milliseconds % hour) / minute);
  const secondsLeft = Math.floor((milliseconds % minute) / second);

  return ({
    daysLeft, hoursLeft, minutesLeft, secondsLeft
  })
}

export const convertSummerTimeshift = (date: any) => {
  const endOfSummerTime = new Date("2022-10-30T02:00:00.000Z").getTime()
  const nowTime = date.getTime();
  const isSummerTime = (endOfSummerTime - nowTime) > 0;
  const finalTime = isSummerTime ? nowTime + 1000 * 60 * 60 : nowTime;

  return finalTime;
}

export default useCountdown;
